<template>
  <hqit-content-page type="list">
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
        @reset="resetForm"
        @filter-change="tableFilterChange"
      >
        <template slot="operator">
          <hqit-button
            size="mini"
            btn-type="add"
            btn-text="新增"
            @click="handleAdd"
          ></hqit-button>
        </template>
        <template slot="status" slot-scope="{ rowData }">
          <el-switch
            v-model="rowData.status"
            class="switch"
            :width="50"
            :inactive-value="2"
            :active-value="1"
            @change="handleChangeSt(rowData)"
          >
          </el-switch>
        </template>
        <template slot="opts" slot-scope="{ rowData }">
          <el-button type="text" @click="handleCheck(rowData)">
            查看
          </el-button>
          <el-button type="text" @click="handleEdit(rowData)"> 修改 </el-button>
          <el-button type="text" @click="handleDel(rowData)"> 删除 </el-button>
        </template>
      </hqit-table>
    </template>
  </hqit-content-page>
</template>

<script>
import {
  ctrList,
  listByExpr,
  deleteFilingPerson,
  editPersonStatus,
} from "@/api/contractor/contractor-management.js";
export default {
  components: {},
  data() {
    return {
      title: null,
      peopleList: [], //人员工种
      columns: [
        {
          prop: "name",
          label: "姓名",
        },
        {
          prop: "sex",
          label: "性别",
          width: 100,
          formatter: (val) => {
            return val == 1 ? "女" : "男";
          },
          attrs: {
            filters: [
              { text: "男", value: 0 },
              { text: "女", value: 1 },
            ],
            columnKey: "sex",
          },
        },
        {
          prop: "idCard",
          label: "身份证号",
        },
        {
          prop: "phone",
          label: "手机号",
        },
        {
          prop: "fillingName",
          label: "承包商名称",
        },
        {
          prop: "jobTypeId",
          label: "人员工种",
          formatter: (val) => {
            return this.getNameByKey(this.peopleList, val, "id");
          },
        },
        {
          prop: "status",
          label: "状态",
          slotname: "status",
          width: 100,
          attrs: {
            filters: [
              { text: "激活", value: 1 },
              { text: "冻结", value: 2 },
            ],
            columnKey: "status",
          },
        },
        {
          prop: "updateTime",
          label: "更新时间",
          sortable: true,
          formatter: (val) => {
            return this.awaySecond(val);
          },
        },
        {
          prop: "opts",
          label: "操作",
          align: "right",
          slotname: "opts",
          width: 150,
        },
      ],
      searchConfig: [
        {
          label: "姓名",
          prop: "name",
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "身份证号",
          prop: "idCard",
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "手机号",
          prop: "phone",
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },

        {
          label: "承包商名称",
          prop: "fillingId",
          expression: "LIKE",
          type: "select",
          attrs: {
            placeholder: "请选择承包商",
          },
          options: [],
        },

        {
          label: "人员工种",
          prop: "jobTypeId",
          expression: "LIKE",
          type: "select",
          attrs: {
            placeholder: "请选择人员工种",
          },
          options: [],
        },

        {
          label: "更新时间",
          prop: "updateTime",
          type: "daterange",
        },
      ],
      queryForm: {},
    };
  },
  created() {
    this.getListByExpr();
    this.$getTypeCode("sys_job_type").then((res) => {
      this.peopleList = res.data;
      this.searchConfig.find((v) => v.prop == "jobTypeId").options =
        res.data.map((item) => {
          return { label: item.name, value: item.id };
        });
    });
  },
  methods: {
    // 承包商列表
    getListByExpr() {
      let expr = [];
      expr.push(this.handleExpression("EQ", "status", 3));
      listByExpr(expr).then((res) => {
        this.searchConfig.find((v) => v.prop == "fillingId").options =
          res.data.map((item) => {
            return { label: item.name, value: item.id };
          });
      });
    },
    async getList(params) {
      let resParams = {
        order: "createTime",
        sort: "DESC",
        pageNum: params.page, // 页码
        pageSize: params.size, // 显示数量
        query: {},
        expr: [],
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
      // 更新时间
      this.queryForm.updateTime &&
        resParams.expr.push(
          this.handleExpression(
            "GE",
            "updateTime",
            this.queryForm.updateTime[0] + " 00:00:00",
          ),
        );
      this.queryForm.updateTime &&
        resParams.expr.push(
          this.handleExpression(
            "LE",
            "updateTime",
            this.queryForm.updateTime[1] + " 23:59:59",
          ),
        );
      if (this.queryForm.sex && this.queryForm.sex.length) {
        resParams.expr.push({
          key: "sex",
          value: this.queryForm.sex,
          expression: "IN",
        });
      }
      if (this.queryForm.status && this.queryForm.status.length) {
        resParams.expr.push({
          key: "status",
          value: this.queryForm.status,
          expression: "IN",
        });
      }
      return ctrList(resParams);
      // let res = await ctrList(resParams);
      // return Promise.resolve({
      //   data: res.data ? res.data.list : [],
      // });
    },
    // 新增
    handleAdd() {
      this.$router.push(
        "/gatedpark/park-operation/contractor/contractor-management/add",
      );
    },
    // 查看
    handleCheck(row) {
      this.$router.push({
        path: "/gatedpark/park-operation/contractor/contractor-management/check",
        query: {
          id: row.id,
        },
      });
    },
    // 修改
    handleEdit(row) {
      console.log(row, "哈哈哈");
      this.$router.push({
        path: "/gatedpark/park-operation/contractor/contractor-management/edit",
        query: {
          id: row.id,
        },
      });
    },
    // 删除
    async handleDel(row) {
      console.log(row, 123);
      const valid = await this.errorBoundary(this.delPrompt(this, row.name));
      if (valid) {
        deleteFilingPerson([row.id]).then((res) => {
          if (res.code != 200) return this.$message.error(res.msg);
          this.$message.success(res.msg);
          this.$refs.table.getData({}, true);
        });
      } else {
        this.$message({
          message: "删除取消",
        });
      }
    },
    // 修改状态
    handleChangeSt(row) {
      let params = {
        id: row.id,
        status: row.status,
      };
      editPersonStatus(params).then(() => {
        this.$message({
          type: "success",
          message: "状态修改成功",
        });
        this.handleSearch();
      });
    },
    // 查询
    handleSearch(params) {
      this.queryForm = {
        ...this.queryForm,
        ...params,
      };
      this.$refs.table.getData({}, true);
    },
    //重置搜索
    resetForm() {
      this.searchPersonId = "";
      this.queryForm = {};
      this.$refs.table.$refs.table.clearFilter();
      this.$refs.table.getData({}, true);
    },
    // 表格条件筛选
    tableFilterChange(val) {
      this.queryForm = {
        ...this.queryForm,
        ...val,
      };
      this.$refs.table.getData({}, true);
    },
  },
};
</script>
<style lang="scss" scoped>
/* switch按钮样式 */
::v-deep .el-switch__core::before {
  content: "冻结";
  position: absolute;
  font-size: 12px;
  top: -1px;
  right: 5px;
  color: #fff;
}

.is-checked ::v-deep .el-switch__core::before {
  content: "激活";
  position: absolute;
  font-size: 12px;
  top: -1px;
  left: 5px;
  color: #fff;
}
</style>
