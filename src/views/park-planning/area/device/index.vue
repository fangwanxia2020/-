<template>
  <hqit-content-page type="list" style="height: calc(100vh - 170px)">
    <template slot="content">
      <hqit-table
        ref="table"
        border
        :data-source="getList"
        :columns="columns"
        :prop-show-pager="true"
        :search-config="searchConfig"
        :use-expr="false"
        :show-select="false"
        :show-index="false"
        @search="handleSearch"
        @reset="handleReset"
      >
        <template slot="status" slot-scope="{ rowData }">
          <span v-if="rowData.status">
            <i class="el-icon-success" style="color: #1fbe6c"></i> 在线
          </span>
          <span v-if="!rowData.status">
            <i class="el-icon-error" style="color: #f26f6d"></i> 离线
          </span>
        </template>
        <template slot="operator">
          <hqit-button
            size="mini"
            :disabled="!areaId"
            btn-text="设备分配"
            @click="handleAllot"
          ></hqit-button>
        </template>
        <template slot="opts" slot-scope="{ rowData }">
          <el-button type="text" @click="handleDel(rowData)"> 删除 </el-button>
        </template>
      </hqit-table>

      <!-- 设备分配对话框 -->
      <FormDialog
        ref="model"
        title="设备分配"
        :width="1100"
        @submit="handleReset"
      >
        <template #default="scope">
          <SyncAllot v-bind="scope.data" />
        </template>
      </FormDialog>
    </template>
  </hqit-content-page>
</template>

<script>
import SyncAllot from "./sync-allot.vue";
import { getDeviceList, delDeviceArea } from "@/api/park-planning/area.js";
import { bayonetList } from "@/api/infrastructure/access-control-equipment.js";
export default {
  components: { SyncAllot },
  props: {
    areaId: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      tabsList: [
        { code: "1", name: "车闸" },
        { code: "2", name: "人闸" },
      ],
      inoutList: [
        { code: "0", name: "出" },
        { code: "1", name: "进" },
      ],
      bayonetList: [], // 卡口列表
      tableData: [],
      reqNum: 0,
      columns: [
        {
          prop: "deviceName",
          label: "设备名称",
          width: "200",
        },
        {
          prop: "ip",
          label: "IP地址",
          width: "200",
          sortable: true,
        },
        // {
        //   prop: "deviceType",
        //   label: "设备类型",
        //   formatter: (val) => {
        //     return this.getNameByKey(this.tabsList, val);
        //   },
        // },
        {
          prop: "inOutFlag",
          label: "进出标识",
          width: "120",
          formatter: (val) => {
            return this.getNameByKey(this.inoutList, val);
          },
          attrs: {
            filters: [
              { text: "出", value: 0 },
              { text: "进", value: 1 },
            ],
            "filter-method": this.handleFilter,
          },
        },
        {
          prop: "gatewayId",
          label: "所属卡口",
          formatter: (val) => {
            return this.getNameByKey(this.bayonetList, val, "id");
          },
        },
        {
          prop: "status",
          label: "运行状态",
          width: "120",
          slotname: "status",
          attrs: {
            filters: [
              { text: "离线", value: 0 },
              { text: "在线", value: 1 },
            ],
            "filter-method": this.handleFilter,
          },
        },
        {
          prop: "updateTime",
          label: "更新时间",
          formatter: (val) => {
            return this.awaySecond(val);
          },
          width: "150",
          sortable: true,
        },
        {
          prop: "opts",
          label: "操作",
          align: "right",
          fixed: "right",
          slotname: "opts",
          width: "80",
        },
      ],
      searchConfig: [
        {
          label: "设备名称",
          prop: "deviceName",
          expression: "LIKE",
          attrs: {
            clearable: true,
            placeholder: "请输入",
          },
        },
        {
          label: "IP地址",
          prop: "ip",
          expression: "LIKE",
          attrs: {
            clearable: true,
            placeholder: "请输入",
          },
        },
        {
          label: "所属卡口",
          prop: "gatewayId",
          expression: "EQ",
          type: "select",
          options: [],
          attrs: {
            clearable: true,
          },
        },
      ],
      queryForm: {},
    };
  },
  watch: {
    areaId() {
      this.reqNum = 0;
      this.handleReset();
    },
  },
  mounted() {
    this.getBayonetList();
  },
  methods: {
    // 卡口下拉
    getBayonetList() {
      let params = {
        order: "updateTime",
        sort: "DESC",
        pageNum: 1,
        pageSize: 9999999,
        query: [],
      };
      bayonetList(params).then((res) => {
        this.bayonetList = res.data.list;
        this.searchConfig.find((v) => v.prop == "gatewayId").options =
          this.bayonetList.map((item) => {
            return { label: item.name, value: item.id };
          });
      });
    },
    async getList(params) {
      if (!this.areaId) {
        return Promise.resolve({
          data: {
            list: [],
            pagination: { total: 0 },
          },
        });
      }
      let resParams = {
        pageNum: 1,
        pageSize: 9999999,
        query: {
          areaId: this.areaId,
        },
      };
      if (!this.reqNum) {
        let res = await getDeviceList(resParams);
        ++this.reqNum;
        this.tableData = res.data.list;
        return Promise.resolve({
          data: {
            list: this.tableData.slice(
              (params.page - 1) * params.size,
              params.page * params.size,
            ),
            pagination: { total: this.tableData.length },
          },
        });
      } else {
        if (
          this.queryForm.deviceName ||
          this.queryForm.ip ||
          this.queryForm.gatewayId
        ) {
          let seaArr = [];
          if (this.queryForm.deviceName) {
            seaArr.push({ key: "deviceName", val: this.queryForm.deviceName });
          }
          if (this.queryForm.ip) {
            seaArr.push({ key: "ip", val: this.queryForm.ip });
          }
          if (this.queryForm.gatewayId) {
            seaArr.push({ key: "gatewayId", val: this.queryForm.gatewayId });
          }
          return Promise.resolve({
            data: {
              list: this.handlePreSea(seaArr),
              pagination: { total: this.handlePreSea(seaArr).length },
            },
          });
        } else {
          return Promise.resolve({
            data: {
              list: this.tableData.slice(
                (params.page - 1) * params.size,
                params.page * params.size,
              ),
              pagination: { total: this.tableData.length },
            },
          });
        }
      }
    },
    handlePreSea(seaArr) {
      let res = 0;
      let arr = [];
      seaArr.filter((sitem, index) => {
        arr = this.tableData.filter((titem) => {
          res = titem[sitem.key].indexOf(sitem.val) > -1;
          if (index > 0) {
            res += "&&" + titem[sitem.key].indexOf(sitem.val) > -1;
          }
          if (res) return titem;
        });
      });
      return arr;
    },
    // 设备分配
    handleAllot() {
      this.$refs.model.openModel({
        data: {
          data: {
            areaId: this.areaId,
          },
        },
      });
    },
    // 删除
    async handleDel(row) {
      const valid = await this.errorBoundary(
        this.delPrompt(this, row.deviceName),
      );
      if (valid) {
        delDeviceArea([row.id]).then((res) => {
          if (res.code != 200) return this.$message.error(res.msg);
          this.$message.success(res.msg);
          this.handleReset();
        });
      } else {
        this.$message({ message: "删除取消" });
      }
    },
    // 筛选
    handleFilter(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    // 搜索
    handleSearch(params) {
      this.queryForm = {
        ...params,
      };
      this.$refs.table.getData({}, true);
    },
    // 重置
    handleReset() {
      this.reqNum = 0;
      this.queryForm = {};
      this.$refs.table.$refs.table.clearFilter();
      this.$refs.table.getData({}, true);
    },
  },
};
</script>

<style lang="scss" scoped>
.list-page {
  padding: 0;
}
</style>
