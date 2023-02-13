<template>
  <el-table ref="table" :data="dataSource">
    <el-table-column
      label="设备名称"
      prop="deviceName"
      show-overflow-tooltip
    ></el-table-column>
    <el-table-column
      label="IP地址"
      prop="ip"
      sortable
      show-overflow-tooltip
    ></el-table-column>
    <el-table-column
      label="设备状态"
      :filters="[
        { text: '离线', value: 0 },
        { text: '在线', value: 1 },
      ]"
      :filter-method="handleFilter"
      prop="status"
    >
      <template slot-scope="scope">
        <span v-if="scope.row.status">
          <i class="el-icon-success" style="color: #1fbe6c"></i> 在线
        </span>
        <span v-if="!scope.row.status">
          <i class="el-icon-error" style="color: #f26f6d"></i> 离线
        </span>
      </template>
    </el-table-column>
    <el-table-column
      label="下发状态"
      :filters="[
        { text: '未下发', value: 0 },
        { text: '失败', value: 1 },
        { text: '成功', value: 2 },
      ]"
      :filter-method="handleFilter"
      prop="permissionStatus"
    >
      <template slot-scope="scope">
        <span v-if="scope.row.permissionStatus == 0">
          <i class="cl-circle" style="background-color: #cccccc"></i> 未下发
        </span>
        <span v-if="scope.row.permissionStatus == 1">
          <i class="cl-circle" style="background-color: #f26f6d"></i> 失败
        </span>
        <span v-if="scope.row.permissionStatus == 2">
          <i class="cl-circle" style="background-color: #1fbe6c"></i> 成功
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import dataMixin from "@/mixin/data.js";
export default {
  mixins: [dataMixin],
  props: {
    title: String,
  },
  data() {
    return {
      dataSource: this.data.dataArr || [],
    };
  },
  methods: {
    // 模拟请求 一定要写
    request() {},
    // 重写表单验证
    validate() {
      return Promise.resolve();
    },
    // 筛选
    handleFilter(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form {
  .el-form-item {
    float: left;
    width: 50%;
    ::v-deep .el-form-item__label {
      color: #000;
    }
  }
}
.cl-circle {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
::v-deep {
  .el-table__column-filter-trigger .el-icon-arrow-down {
    font-family: iconfonttywhp !important;
    font-size: 14px;
    color: #999;
    transform: unset;
    margin-left: 5px;
  }
  .el-table__column-filter-trigger .el-icon-arrow-down:before {
    content: "\E6B6" !important;
  }
}
</style>
