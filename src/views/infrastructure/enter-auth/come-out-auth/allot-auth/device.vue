<template>
  <div class="allot-device">
    <CtTable
      ref="table"
      row-key="id"
      :has-btn="false"
      :tabs-list="getTabsList"
      :tabs-active.sync="tabsActive"
      :request="getList"
      :page-sizes="[5, 10, 20, 30]"
      :default-page-size="5"
      :table-height="null"
      @selections="getSelections"
    >
      <template #search="scope">
        <template v-if="tabsActive == 1">
          <el-form-item label="设备名称: " prop="cameraName">
            <el-input
              v-model="scope.params.cameraName"
              placeholder="请输入设备名称"
              clearable
              style="width: 160px"
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
          <el-form-item label="IP地址: " prop="ipV4">
            <el-input
              v-model="scope.params.ipV4"
              placeholder="请输入IP地址"
              clearable
              style="width: 160px"
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
        </template>
        <template v-if="tabsActive == 2">
          <el-form-item label="设备名称: " prop="name">
            <el-input
              v-model="scope.params.name"
              placeholder="请输入设备名称"
              clearable
              style="width: 160px"
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
          <el-form-item label="IP地址: " prop="ip">
            <el-input
              v-model="scope.params.ip"
              placeholder="请输入IP地址"
              clearable
              style="width: 160px"
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
        </template>
      </template>
      <template #table-columns>
        <el-table-column
          label="设备名称"
          :prop="tabsActive == 1 ? 'cameraName' : tabsActive == 2 ? 'name' : ''"
          sortable
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="IP地址"
          :prop="tabsActive == 1 ? 'ipV4' : tabsActive == 2 ? 'ip' : ''"
          sortable
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="运行状态">
          <template slot-scope="scope">
            <div v-if="tabsActive == 1">
              <span v-if="scope.row.isOnline">
                <i class="el-icon-success" style="color: #1fbe6c"></i> 在线
              </span>
              <span v-if="!scope.row.isOnline">
                <i class="el-icon-error" style="color: #f26f6d"></i> 离线
              </span>
            </div>
            <div v-if="tabsActive == 2">
              <span v-if="scope.row.status">
                <i class="el-icon-success" style="color: #1fbe6c"></i> 在线
              </span>
              <span v-if="!scope.row.status">
                <i class="el-icon-error" style="color: #f26f6d"></i> 离线
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="更新人"
          prop="updateName"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="更新时间"
          width="150"
          prop="updateTime"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ awaySecond(scope.row.updateTime) }}
          </template>
        </el-table-column>
      </template>
    </CtTable>
  </div>
</template>

<script>
import {
  personLockList,
  carLockList,
} from "@/api/infrastructure/access-control-equipment.js";
export default {
  props: {
    resourceType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      tabsList: [
        { code: "2", name: "人闸" },
        { code: "1", name: "车闸" },
      ],
      tabsActive: "2",
    };
  },
  computed: {
    getTabsList() {
      if (this.resourceType == "2") return this.tabsList;
      if (this.resourceType == "1" || this.resourceType == "4")
        return [{ code: "2", name: "人闸" }];
      if (this.resourceType == "3") return [{ code: "1", name: "车闸" }];
      return [];
    },
  },
  created() {
    if (this.resourceType == "2") this.tabsActive = "2";
    if (this.resourceType == "1") this.tabsActive = "2";
    if (this.resourceType == "3") this.tabsActive = "1";
    if (this.resourceType == "4") this.tabsActive = "2";
  },
  methods: {
    getList(params) {
      // 车闸
      if (this.tabsActive == 1) {
        let resParams = {
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
        return carLockList(resParams).then((res) => {
          return {
            list: res.data.list,
            total: res.data.pagination.total,
          };
        });
      }
      // 人闸
      if (this.tabsActive == 2) {
        let resParams = {
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
        return personLockList(resParams).then((res) => {
          return {
            list: res.data.list,
            total: res.data.pagination.total,
          };
        });
      }
    },
    getSelections(selections) {
      selections.map((item) => {
        this.$set(item, "deviceType", this.tabsActive);
      });
      this.$emit("selections", selections);
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
