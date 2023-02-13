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
            @click="add"
          ></hqit-button>
        </template>
        <template slot="orgId" slot-scope="{ rowData }">
          <el-tag
            v-for="tag in rowData.orgExVoList.filter((org) => org.orgName)"
            :key="tag.orgIs"
          >
            {{ tag.orgName }}&nbsp;&nbsp;
          </el-tag>
        </template>
        <template slot="opts" slot-scope="{ rowData }">
          <el-button
            v-if="!rowData.ctrChangeId"
            type="text"
            @click="handleDetails(rowData)"
          >
            查看
          </el-button>
          <el-button
            v-if="rowData.ctrChangeId"
            type="text"
            @click="handleChangeDetails(rowData)"
          >
            查看
          </el-button>
          <el-button
            v-if="rowData.status == 1 || rowData.status == 4"
            type="text"
            @click="edit(rowData)"
          >
            修改
          </el-button>
          <el-button
            v-if="rowData.status == 1 && !rowData.ctrChangeId"
            type="text"
            @click="deleteItem(rowData)"
          >
            删除
          </el-button>
          <el-button
            v-if="rowData.status == 1 && !rowData.ctrChangeId"
            type="text"
            @click="subApproval(rowData)"
          >
            提交
          </el-button>
          <el-button
            v-if="rowData.status == 4 && !rowData.ctrChangeId"
            type="text"
            @click="subApproval(rowData)"
          >
            重新发起
          </el-button>
          <el-button
            v-if="rowData.status == 1 && rowData.ctrChangeId"
            type="text"
            @click="subChangeApproval(rowData)"
          >
            提交
          </el-button>
          <el-button
            v-if="rowData.status == 4 && rowData.ctrChangeId"
            type="text"
            @click="subChangeApproval(rowData)"
          >
            重新发起
          </el-button>
          <el-button
            v-if="rowData.status == 3"
            type="text"
            @click="change(rowData)"
          >
            变更
          </el-button>
          <el-button
            v-if="rowData.status == 2 && !rowData.ctrChangeId"
            type="text"
            @click="recall(rowData)"
          >
            撤回
          </el-button>
          <el-button
            v-if="rowData.status == 2 && rowData.ctrChangeId"
            type="text"
            @click="changeRecall(rowData)"
          >
            撤回
          </el-button>
          <el-button
            v-if="
              rowData.status == 3 || rowData.status == 4 || rowData.status == 2
            "
            type="text"
            @click="approvalRecord(rowData)"
          >
            审批记录
          </el-button>
        </template>
      </hqit-table>
    </template>
  </hqit-content-page>
</template>

<script>
import { getCtrFilingList, removeCtr } from "@/api/contractor";
import {
  hasNeedApproval,
  ApprovalTemplate,
  newApprovalTask,
  getTemplateId,
  withdrawTask,
} from "@/api/approval/approval-manege.js";
export default {
  name: "registration",
  data() {
    return {
      filterStatusArr: [],
      orgOptions: [], //单位树
      deptOptions: [], //部门树
      personList: [], //人员列表
      approvalFilterStatus: [],
      approvalFilterValue: [],
      columns: [
        {
          prop: "name",
          label: "承包商名称",
          width: 120,
        },
        {
          prop: "contacts",
          label: "联系人",
        },
        {
          prop: "phone",
          label: "手机号码",
        },
        {
          prop: "orgId",
          label: "服务单位",
          slotname: "orgId",
          width: 250,
        },
        {
          prop: "fillingReason",
          label: "入驻理由",
        },
        {
          prop: "status",
          label: "审批状态",
          slotname: "status",
          width: 150,
          formatter: (val) => {
            return this.changeStatus(val);
          },
          attrs: {
            filters: [
              { text: "待审批", value: 1 },
              { text: "审批中", value: 2 },
              { text: "审批通过", value: 3 },
              { text: "审批不通过", value: 4 },
            ],
            columnKey: "status",
          },
        },
        {
          prop: "applyName",
          label: "申请人",
        },
        {
          prop: "createTime",
          label: "申请时间",
          width: 160,
          sortable: true,
          formatter: (val) => {
            return this.awaySecond(val);
          },
        },
        {
          prop: "opts",
          label: "操作",
          align: "right",
          fixed: "right",
          slotname: "opts",
          width: 230,
        },
      ],
      searchConfig: [
        {
          label: "承包商名称",
          prop: "name",
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "联系人",
          prop: "contacts",
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "手机号码",
          prop: "phone",
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          prop: "orgIdList",
          label: "服务单位", // 单位下拉框直接用（类型使用tree）
          expression: "IN",
          type: "hqit-tree-select",
          attrs: {
            selectAttrs: { placeholder: "请选择单位" },
          },
        },
        {
          label: "申请人",
          prop: "applyName",
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "申请时间",
          prop: "createTime",
          type: "daterange",
        },
      ],
      queryForm: {},
    };
  },
  computed: {
    //审批状态
    changeStatus() {
      let name;
      return (num) => {
        switch (num) {
          case 1:
            name = "待审批";
            break;
          case 2:
            name = "审批中";
            break;
          case 3:
            name = "审批通过";
            break;
          case 4:
            name = "审批不通过";
            break;
          case 5:
            name = "驳回";
            break;

          default:
            name = "";
            break;
        }
        return name;
      };
    },
  },
  created() {},
  methods: {
    //防爆卡列表
    async getList(params) {
      let resParams = {
        pageNum: params.page,
        pageSize: params.size,
        query: {},
      };

      //申请状态
      if (this.approvalFilterStatus.length > 0) {
        resParams.query.statusList = this.approvalFilterStatus;
      }
      this.searchConfig.forEach((configItem) => {
        if (
          this.queryForm[configItem.prop] &&
          this.queryForm[configItem.prop] != "" &&
          configItem.expression
        ) {
          resParams.query[configItem.prop] = this.queryForm[configItem.prop];
        }
      });

      if (this.queryForm.status && this.queryForm.status.length) {
        resParams.query.statusList = this.queryForm.status;
      }
      //
      if (this.queryForm.createTime && this.queryForm.createTime.length > 0) {
        resParams.query.createTimeStart =
          this.queryForm.createTime[0] + " 00:00:00";
        resParams.query.createTimeEnd =
          this.queryForm.createTime[1] + " 23:59:59";
      }
      console.log(this.queryForm, "this.queryForm");
      return getCtrFilingList(resParams);
    },
    // 提交
    subApproval(row) {
      let paramsData = {
        domainId: 7,
        externalBizId: row.id,
        extendInfo: JSON.stringify({ status: parseInt(row.status) }),
      };
      hasNeedApproval(paramsData).then((res) => {
        if (!res.data) this.getApprovalTem(row.id);
      });
    },
    getApprovalTem(id) {
      ApprovalTemplate(7).then((res) => {
        this.approvalTemList = res.data.records;
        this.externalBizId = id;
        this.newTask();
      });
    },
    // 审批任务提交到数据库
    newTask() {
      let params = {
        externalBizId: this.externalBizId,
        defineId: this.approvalTemList[0].defineId,
        instanceName: this.approvalTemList[0].procName,
        extendInfo: JSON.stringify({ status: 1 }),
      };
      newApprovalTask(params).then(() => {
        this.$msgSuccess("提交成功");
        this.$refs.table.getData({}, true);
      });
    },
    //查看
    handleDetails(row) {
      this.$router.push({
        path: "/gatedpark/park-operation/contractor/registration/check",
        query: { id: row.id },
      });
    },
    //变更查看
    handleChangeDetails(row) {
      this.$router.push({
        path: "/gatedpark/park-operation/contractor/change-approval/check",
        query: { id: row.ctrChangeId },
      });
    },
    //跳转审批
    linkApproval(row) {
      this.$router.push({
        path: "/gatedpark/park-operation/contractor/registration/check",
        query: { id: row.id, isApproval: true },
      });
    },
    //新增
    add() {
      this.$router.push(
        "/gatedpark/park-operation/contractor/registration/add",
      );
    },
    //修改
    edit(row) {
      this.$router.push({
        path: "/gatedpark/park-operation/contractor/registration/edit",
        query: { id: row.id },
      });
    },
    //变更
    change(row) {
      this.$router.push({
        path: "/gatedpark/park-operation/contractor/registration/change",
        query: { id: row.id, status: row.status },
      });
    },
    // 撤回审批
    recall(row) {
      this.$confirm(`是否撤回当前审批`, "提示")
        .then(() => {
          getTemplateId({ domainId: 7, externalBizId: row.id }).then((res) => {
            withdrawTask({
              instanceId: res.data,
            }).then(() => {
              this.$msgSuccess("撤回成功");
              this.$refs.table.getData({}, true);
            });
          });
        })
        .catch(() => {
          this.$message({
            message: "撤回取消",
          });
        });
    },
    // 变更的审批
    // 提交
    subChangeApproval(row) {
      let paramsData = {
        domainId: 8,
        externalBizId: row.ctrChangeId,
        extendInfo: JSON.stringify({ status: parseInt(row.approvalStatus) }),
      };
      hasNeedApproval(paramsData).then((res) => {
        if (!res.data) this.getChangeApprovalTem(row.ctrChangeId);
      });
    },
    getChangeApprovalTem(id) {
      ApprovalTemplate(8).then((res) => {
        this.approvalTemList = res.data.records;
        this.externalBizId = id;
        this.changeNewTask();
      });
    },
    // 审批任务提交到数据库
    changeNewTask() {
      let params = {
        externalBizId: this.externalBizId,
        defineId: this.approvalTemList[0].defineId,
        instanceName: this.approvalTemList[0].procName,
        extendInfo: JSON.stringify({ status: 1 }),
      };
      newApprovalTask(params).then(() => {
        this.$msgSuccess("提交成功");
        this.$refs.table.getData({}, true);
      });
    },
    // 撤回审批
    changeRecall(row) {
      this.$confirm(`是否撤回当前审批`, "提示")
        .then(() => {
          getTemplateId({ domainId: 8, externalBizId: row.ctrChangeId }).then(
            (res) => {
              withdrawTask({
                instanceId: res.data,
              }).then(() => {
                this.$msgSuccess("撤回成功");
                this.$refs.table.getData({}, true);
              });
            },
          );
        })
        .catch(() => {
          this.$message({
            message: "撤回取消",
          });
        });
    },
    // 审批记录
    approvalRecord(row) {
      const domainId = row.ctrChangeId ? 8 : 7;
      const externalBizId = row.ctrChangeId ? row.ctrChangeId : row.id;
      getTemplateId({ domainId, externalBizId }).then((res) => {
        this.$router.push({
          path: "/gatedpark/approval/hasDo",
          query: {
            instanceId: res.data,
            domainId,
            isTaskId: true,
            detail: true,
          },
        });
      });
    },
    //删除
    async deleteItem(row) {
      const valid = await this.errorBoundary(this.delPrompt(this, row.name));
      if (valid) {
        removeCtr(row.id).then((res) => {
          if (res.code != 200) return this.$message.error(res.msg);
          this.$message.success(res.msg);
          this.$refs.table.getData({}, true);
        });
      } else {
        this.$message({ message: "删除取消" });
      }
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
      this.$refs.table.$refs.table.clearSort();
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
::v-deep {
  .el-cascader {
    width: 100%;
  }
  .el-autocomplete {
    width: 100%;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
}
</style>
