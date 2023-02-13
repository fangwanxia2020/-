<template>
  <CtTable
    ref="table"
    :request="getList"
    row-key="id"
    :tabs-list="tabsList"
    :tabs-active.sync="tabsActive"
    :page-sizes="[5, 10, 20, 30]"
    :default-page-size="5"
    :table-height="null"
    @selections="getSelections"
  >
    <template #search="scope">
      <template v-if="tabsActive == 0">
        <el-form-item label="设备名称: " prop="name">
          <el-input
            v-model="scope.params.name"
            style="width: 160px"
            placeholder="请输入设备名称"
            clearable
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="IP地址: " prop="ip">
          <el-input
            v-model="scope.params.ip"
            style="width: 160px"
            placeholder="请输入IP地址"
            clearable
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="设备名称: " prop="cameraName">
          <el-input
            v-model="scope.params.cameraName"
            style="width: 160px"
            placeholder="请输入设备名称"
            clearable
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="IP地址: " prop="ipV4">
          <el-input
            v-model="scope.params.ipV4"
            style="width: 160px"
            placeholder="请输入IP地址"
            clearable
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
      </template>
    </template>
    <template #table-columns>
      <el-table-column
        label="设备名称"
        show-overflow-tooltip
        :prop="tabsActive == 0 ? 'name' : 'cameraName'"
      ></el-table-column>
      <el-table-column
        label="IP地址"
        show-overflow-tooltip
        :prop="tabsActive == 0 ? 'ip' : 'ipV4'"
      ></el-table-column>
      <el-table-column
        label="运行状态"
        show-overflow-tooltip
        :prop="tabsActive == 0 ? 'status' : 'isOnline'"
        width="80"
      >
        <template slot-scope="scope">
          <span v-if="tabsActive == 0 ? scope.row.status : scope.row.isOnline">
            <i class="el-icon-success" style="color: #1fbe6c"></i>在线
          </span>
          <span
            v-if="tabsActive == 0 ? !scope.row.status : !scope.row.isOnline"
          >
            <i class="el-icon-error" style="color: #f26f6d"></i>离线
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="更新人"
        show-overflow-tooltip
        prop="updateName"
      ></el-table-column>
      <el-table-column
        label="更新时间"
        width="150"
        show-overflow-tooltip
        prop="updateTime"
      >
        <template slot-scope="scope">
          {{ awaySecond(scope.row.updateTime) }}
        </template>
      </el-table-column>
    </template>
  </CtTable>
</template>

<script>
import dataMixin from "@/mixin/data.js";
import { personLockList } from "@/api/infrastructure/access-control-equipment.js";
import { carLockList } from "@/api/infrastructure/access-control-equipment.js";
import { deepClone } from "@/utils/tool.js";
export default {
  mixins: [dataMixin],
  props: {
    checkboxlist: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      tabsList: [
        { code: "0", name: "人闸" },
        { code: "1", name: "车闸" },
      ],
      tabsActive: "0",
      selections: [], // 多选框所选中的数据
    };
  },
  watch: {
    tabsActive() {
      this.handleReset();
      this.$refs.table.$refs.batchTable.clearSelection();
    },
  },
  methods: {
    // 获取列表数据
    getList(params) {
      let resParams;
      let reqapi;
      // 人闸
      if (this.tabsActive == 0) {
        reqapi = personLockList;
        resParams = {
          order: "updateTime",
          sort: "DESC",
          pageNum: params.pageNum, // 页码
          pageSize: params.pageSize, // 显示数量
          expr: [],
          query: {},
        };
        params.name &&
          resParams.expr.push(
            this.handleExpression("LIKE", "name", params.name),
          ); // 设备名称
        params.ip &&
          resParams.expr.push(this.handleExpression("LIKE", "ip", params.ip)); // IP地址
      }
      // 车闸
      if (this.tabsActive == 1) {
        reqapi = carLockList;
        resParams = {
          order: "updateTime",
          sort: "DESC",
          pageNum: params.pageNum, // 页码
          pageSize: params.pageSize, // 显示数量
          query: [],
        };
        params.cameraName &&
          resParams.query.push(
            this.handleExpression("LIKE", "cameraName", params.cameraName),
          ); // 设备名称
        params.ipV4 &&
          resParams.query.push(
            this.handleExpression("LIKE", "ipV4", params.ipV4),
          ); // IP地址
      }
      return reqapi(resParams).then((res) => {
        if (this.checkboxlist.length) {
          this.checkboxlist.forEach((citem) => {
            res.data.list.forEach((ritem) => {
              if (citem.id === ritem.id) {
                this.$refs.table.$refs.batchTable.toggleRowSelection(
                  ritem,
                  true,
                );
              }
            });
          });
        }
        return {
          list: res.data.list,
          total: res.data.pagination.total,
        };
      });
    },
    // 模拟请求 一定要写
    request() {},
    // 重写表单验证并传递列表所选中的数据
    validate() {
      this.$emit("update:checkboxlist", deepClone(this.selections));
      this.$emit("update:tabact", this.tabsActive);
      return Promise.resolve();
    },
    getSelections(data) {
      this.selections = data;
    },
    // 搜索
    handleSearch() {
      this.$refs.table.reload(1);
    },
    // 重置
    handleReset() {
      this.$refs.table.reset();
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .search-form {
  flex-wrap: nowrap;
}
::v-deep .search-content-button {
  margin-left: 0;
}
.hq-crud {
  padding: 0 !important;
}
</style>
