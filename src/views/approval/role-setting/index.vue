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
        :show-select="false"
        :use-expr="false"
        :show-index="false"
        @search="handleSearch"
        @reset="resetForm"
      >
        <template slot="operator">
          <hqit-button
            size="mini"
            btn-type="add"
            btn-text="新增"
            @click="addRole"
          ></hqit-button>
        </template>
        <template slot="status" slot-scope="{ rowData }">
          <el-switch
            v-model="rowData.status"
            :active-value="1"
            :inactive-value="0"
            :width="50"
            @change="switchStatus(rowData)"
          >
          </el-switch>
        </template>
        <template slot="opts" slot-scope="{ rowData }">
          <el-button type="text" @click="linkTo(rowData)"> 关联人员 </el-button>
          <el-button type="text" @click="delTemplate(rowData)">
            删除
          </el-button>
        </template>
      </hqit-table>
      <FormDialog ref="model" title="新增">
        <template slot="default">
          <addRole
            :data="formData"
            :list="approvalList"
            :success-bool.sync="successBool"
          />
        </template>
      </FormDialog>
    </template>
  </hqit-content-page>
</template>

<script>
import {
  getRoleSettingList,
  getTemplateList,
  updateStatus,
  DeleteRole,
} from "@/api/approval/role-setting.js";
import addRole from "@/components/FormBody/approval/add-role.vue";
export default {
  components: { addRole },
  data() {
    return {
      successBool: false, // 新增角色状态值
      approvalList: [], // 审批流程下拉列表
      formData: {
        sort: 100, // 默认100
        status: 1, // 默认
      },
      queryForm: {},
      columns: [
        {
          prop: "roleName",
          label: "审批流程角色",
        },
        {
          prop: "domainName",
          label: "审批流程",
        },
        {
          prop: "sort",
          label: "排序",
        },
        {
          prop: "status",
          label: "状态",
          slotname: "status",
        },
        {
          prop: "remark",
          label: "备注",
        },

        {
          prop: "createTime",
          label: "创建时间",
          formatter: (val) => {
            return this.awaySecond(val);
          },
        },
        {
          prop: "createName",
          label: "创建人",
        },
        {
          prop: "opts",
          label: "操作",
          align: "right",
          slotname: "opts",
          width: 200,
        },
      ],
      searchConfig: [
        {
          label: "审批流程角色",
          prop: "roleName",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "审批流程",
          prop: "domainId",
          type: "select",
          options: [],
        },
      ],
    };
  },
  computed: {},
  watch: {
    successBool(bool) {
      if (bool) this.$refs.table.getData({}, true);
      this.successBool = false;
    },
  },
  mounted() {
    getTemplateList().then((res) => {
      this.approvalList = res.data.records;
      this.searchConfig.find((v) => v.prop == "domainId").options =
        res.data.records.map((item) => {
          return { label: item.domainName, value: item.domainId };
        });
    });
  },
  methods: {
    async getList(params) {
      let data = {
        pageNum: params.pageNum,
        pageSize: params.pageSize,
      };
      if (this.queryForm.roleName && this.queryForm.roleName != "") {
        data["roleName"] = this.queryForm.roleName;
      }
      if (this.queryForm.domainId && this.queryForm.domainId != "") {
        data["domainId"] = this.queryForm.domainId;
      }
      let res = await getRoleSettingList(data);
      this.$refs.table.page.total = res.data.total;
      return Promise.resolve({
        data: res.data.records,
        // total: res.data.total,
      });
    },
    // 开关
    switchStatus(row) {
      let switchName;
      row.status ? (switchName = "启用") : (switchName = "停用");
      this.$confirm(`确定要 ${switchName}${row.roleName}角色吗？`, "警告")
        .then(() => {
          updateStatus({
            status: row.status,
            workflowRoleId: row.workflowRoleId,
          })
            .then(() => {
              // 修改成功
              this.$msgSuccess("修改成功");
              this.$refs.table.getData({}, true);
            })
            .catch(() => {
              row.status ? (row.status = 0) : (row.status = 1);
            });
        })
        .catch(() => {
          row.status ? (row.status = 0) : (row.status = 1);
        });
    },
    // 批量删除
    async delTemplate(row) {
      const valid = await this.errorBoundary(
        this.delPrompt(this, row.roleName),
      );
      if (valid) {
        DeleteRole([row.workflowRoleId]).then((res) => {
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
    addRole() {
      this.$refs.model.openModel();
    },
    // 跳转
    linkTo(row) {
      this.$router.push({
        path: "/gatedpark/approval/association-user",
        query: {
          workflowRoleId: row.workflowRoleId,
          domainId: row.domainId,
          changeTagName: row.roleName, // 修改面包屑title
        },
      });
    },
    // 查询
    handleSearch(params) {
      this.queryForm = {
        ...params,
      };
      this.$refs.table.getData({}, true);
    },
    resetForm() {
      this.queryForm = {};
      this.$refs.table.getData({}, true);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-switch__core::before {
  content: "停用";
  position: absolute;
  font-size: 12px;
  top: -1px;
  right: 5px;
  color: #fff;
}

.is-checked ::v-deep .el-switch__core::before {
  content: "启用";
  position: absolute;
  font-size: 12px;
  top: -1px;
  left: 5px;
  color: #fff;
}
</style>
