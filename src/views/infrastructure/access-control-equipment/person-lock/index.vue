<template>
  <hqit-content-page type="list" style="height: calc(100vh - 145px)">
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
        <template slot="locationImg" slot-scope="{ rowData }">
          <img
            v-if="rowData.imgSrc"
            :src="rowData.imgSrc"
            class="img-src"
            @click="handleOpenPreview(rowData.imgSrc)"
          />
        </template>
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
            btn-text="同步设备"
            @click="handleSync"
          ></hqit-button>
        </template>
        <template slot="opts" slot-scope="{ rowData }">
          <el-button type="text" @click="handleCheck(rowData)">查看</el-button>
          <el-button type="text" @click="handleEdit(rowData)">修改</el-button>
          <el-button type="text" @click="handleDel(rowData)">删除</el-button>
        </template>
      </hqit-table>

      <FormDialog
        ref="model"
        title="同步设备"
        :width="1100"
        @submit="handleReset"
      >
        <template #default="scope">
          <SyncDevice v-bind="scope.data" />
        </template>
      </FormDialog>

      <ViewImage
        v-if="dialogVisible"
        style="width: 100%; height: 100%"
        :on-close="handleClosePreview"
        :url-list="[dialogImageUrl]"
      >
      </ViewImage>
    </template>
  </hqit-content-page>
</template>

<script>
import {
  personLockList,
  delPersonLock,
} from "@/api/infrastructure/access-control-equipment.js";
import SyncDevice from "../sync-device.vue";
import getSelMixins from "../getSelMixins.js";
import MapImg from "@/mixin/map-img.js";
export default {
  components: { SyncDevice },
  mixins: [getSelMixins, MapImg],
  data() {
    return {
      columns: [
        {
          prop: "code",
          label: "设备编号",
          width: "150",
        },
        {
          prop: "name",
          label: "设备名称",
          width: "150",
        },
        {
          prop: "brand",
          label: "设备品牌",
          width: "150",
          formatter: (val) => {
            return this.getNameByKey(this.dictObj.base_camera_brand, val);
          },
        },
        {
          prop: "modelNumber",
          label: "设备型号",
          width: "150",
        },
        {
          prop: "edgePlatId",
          label: "所属平台",
          width: "150",
          formatter: (val) => {
            return this.getNameByKey(this.platformList, val, "id", "protocol");
          },
        },
        {
          prop: "gatewayId",
          label: "所属卡口",
          width: "150",
          formatter: (val) => {
            return this.getNameByKey(this.bayonetList, val, "id");
          },
        },
        {
          prop: "ip",
          label: "IP地址",
          width: "150",
        },
        {
          prop: "port",
          label: "端口",
          width: "150",
        },
        {
          prop: "updateName",
          label: "更新者",
          width: "150",
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
          label: "位置缩略图",
          width: "200",
          slotname: "locationImg",
          "show-overflow-tooltip": false,
        },
        {
          prop: "status",
          label: "运行状态",
          width: "100",
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
          prop: "opts",
          label: "操作",
          align: "right",
          fixed: "right",
          slotname: "opts",
          width: "150",
        },
      ],
      searchConfig: [
        {
          label: "设备名称",
          prop: "name",
          expression: "LIKE",
          attrs: {
            clearable: true,
            placeholder: "请输入",
          },
        },
        {
          label: "品牌",
          prop: "brand",
          expression: "EQ",
          attrs: {
            clearable: true,
          },
          type: "select",
          options: [],
        },
        {
          label: "所属卡口",
          prop: "gatewayId",
          expression: "EQ",
          attrs: {
            clearable: true,
          },
          type: "select",
          options: [],
        },
        {
          label: "所属平台",
          prop: "edgePlatId",
          expression: "EQ",
          attrs: {
            clearable: true,
          },
          type: "select",
          options: [],
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
          label: "更新时间",
          prop: "updateTime",
          type: "daterange",
          attrs: {
            "start-placeholder": "开始时间",
            "end-placeholder": "结束时间",
          },
        },
      ],
      queryForm: {},
    };
  },
  inject: ["tabsActive"],
  computed: {
    getTabsActive() {
      return this.tabsActive();
    },
  },
  watch: {
    "dictObj.base_camera_brand": function (val) {
      this.searchConfig.find((v) => v.prop == "brand").options = val.map(
        (item) => {
          return { label: item.name, value: item.code };
        },
      );
    },
  },
  methods: {
    // 获取列表数据 1-人闸 2-车闸
    async getList(params) {
      let resParams = {
        order: "updateTime",
        sort: "DESC",
        pageNum: params.page, // 页码
        pageSize: params.size, // 显示数量
        expr: [],
        query: {},
      };
      this.searchConfig.forEach((configItem) => {
        if (
          this.queryForm[configItem.prop] &&
          this.queryForm[configItem.prop] != "" &&
          configItem.expression
        ) {
          resParams.expr.push({
            key: configItem.prop,
            value: this.queryForm[configItem.prop],
            expression: configItem.expression,
          });
        }
      });
      if (this.queryForm.updateTime) {
        // 更新时间 大于等于
        resParams.expr.push({
          key: "updateTime",
          expression: "GE",
          value: this.queryForm.updateTime[0],
        });
        // 更新时间 小于等于
        resParams.expr.push({
          key: "updateTime",
          expression: "LE",
          value: this.queryForm.updateTime[1],
        });
      }
      let res = await personLockList(resParams);
      this.handleFileData(res.data.list);
      return res;
    },
    // 同步设备
    handleSync() {
      this.$refs.model.openModel({
        data: {
          data: {
            tabsActive: this.getTabsActive,
          },
        },
      });
    },
    // 查看
    handleCheck(row) {
      this.$router.push({
        path: "/gatedpark/infrastructure/access-control-equipment/person-lock-check",
        query: { id: row.id },
      });
    },
    // 修改
    handleEdit(row) {
      this.$router.push({
        path: "/gatedpark/infrastructure/access-control-equipment/person-lock-edit",
        query: { id: row.id },
      });
    },
    // 删除
    async handleDel(row) {
      const valid = await this.errorBoundary(this.delPrompt(this, row.name));
      if (valid) {
        delPersonLock([row.id]).then((res) => {
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
      this.queryForm = {};
      this.$refs.table.$refs.table.clearFilter();
      this.$refs.table.getData({}, true);
    },
  },
};
</script>

<style lang="scss" scoped>
.img-src {
  width: 100%;
  height: 50px;
  cursor: pointer;
  margin-top: 8px;
}
</style>
