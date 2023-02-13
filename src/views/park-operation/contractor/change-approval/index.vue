<template>
  <hqit-content-page type="list">
    <template slot="content">
      <hqit-table
        ref="table"
        border
        row-key="ctrChangeId"
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
        <template slot="orgName" slot-scope="{ rowData }">
          <el-tag
            v-for="tag in rowData.orgExVoList.filter((org) => org.orgName)"
            :key="tag.orgIs"
          >
            {{ tag.orgName }}&nbsp;&nbsp;
          </el-tag>
        </template>
        <template slot="opts" slot-scope="{ rowData }">
          <template v-if="!gettabsId">
            <el-button type="text" @click="handleDetails(rowData)">
              查看
            </el-button>
            <el-button
              v-if="
                rowData.approvalStatus == 3 ||
                rowData.approvalStatus == 4 ||
                rowData.approvalStatus == 2
              "
              type="text"
              @click="approvalRecord(rowData)"
            >
              审批记录
            </el-button>
          </template>
          <template v-else>
            <el-button
              v-if="getlistType == 1"
              type="text"
              @click="handleToOperate(rowData, 1)"
            >
              去审批
            </el-button>
            <el-button
              v-if="getlistType == 2"
              type="text"
              @click="handleToOperate(rowData, 2)"
            >
              查看结果
            </el-button>
            <el-button
              v-if="getlistType == 3"
              type="text"
              @click="handleToOperate(rowData, 3)"
            >
              查看详情
            </el-button>
          </template>
        </template>
      </hqit-table>
    </template>
  </hqit-content-page>
</template>

<script>
import { getPageChangeList } from "@/api/contractor";
import {
  hasNeedApproval,
  ApprovalTemplate,
  newApprovalTask,
  getTemplateId,
  withdrawTask,
} from "@/api/approval/approval-manege.js";
import needTodoMixin from "@/views/my-application/needTodo/needTodoMixin.js";
export default {
  name: "registration",
  mixins: [needTodoMixin],
  data() {
    return {
      queryForm: {},
      columns: [
        {
          prop: "name",
          label: "承包商名称",
          width: "150",
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
          prop: "orgName",
          label: "服务单位",
          slotname: "orgName",
        },
        {
          prop: "reason",
          label: "变更理由",
        },
        {
          prop: "approvalStatus",
          label: "审批状态",
          width: "150",
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
            columnKey: "approvalStatus",
          },
        },
        {
          prop: "applyName",
          label: "申请人",
        },
        {
          prop: "createTime",
          label: "申请时间",
          sortable: true,
          width: 160,
          formatter: (val) => {
            return this.awaySecond(val);
          },
        },
        {
          prop: "opts",
          label: "操作",
          align: "right",
          slotname: "opts",
          width: 180,
        },
      ],
      searchConfig: [
        {
          prop: "name",
          label: "承包商名称", // 单位下拉框直接用（类型使用tree）
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
        },
        {
          label: "申请时间",
          prop: "createTime",
          type: "daterange",
        },
      ],
    };
  },
  computed: {
    //申请状态
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
  methods: {
    //防爆卡列表
    async getList(params) {
      let ids = [];
      let resObj = {};
      if (this.gettabsId) {
        resObj = await this.handleIds(params);
        ids = resObj.externalBizId;
        if (!ids.length) {
          return Promise.resolve({
            list: [],
            total: 0,
          });
        }
      }
      let resParams = {
        pageNum: params.page,
        pageSize: params.size,
        query: {},
      };
      this.searchConfig.forEach((configItem) => {
        if (
          this.queryForm[configItem.prop] &&
          this.queryForm[configItem.prop] != ""
        ) {
          resParams.query[configItem.prop] = this.queryForm[configItem.prop];
        }
      });
      if (
        this.queryForm.approvalStatus &&
        this.queryForm.approvalStatus.length
      ) {
        resParams.query.statusList = this.queryForm.approvalStatus;
      }
      if (this.queryForm.createTime && this.queryForm.createTime.length) {
        resParams.query.createTimeStart =
          this.queryForm.createTime[0] + " 00:00:00";
        resParams.query.createTimeEnd =
          this.queryForm.createTime[1] + " 23:59:59";
        delete resParams.query.createTime;
      }
      if (this.gettabsId && ids.length) {
        resParams.query.ids = ids;
      }
      let res = await getPageChangeList(resParams);
      if (this.gettabsId && ids.length && res.data.list.length) {
        res.data.list.forEach((litem) => {
          resObj.infoVo.forEach((iitem) => {
            if (litem.ctrChangeId == iitem.externalBizId) {
              this.$set(litem, "instanceId", iitem.instanceId);
            }
          });
        });
      }
      this.$refs.table.page.total =
        res.data && res.data.pagination.total ? res.data.pagination.total : 0;
      return Promise.resolve({
        data: res.data && res.data.list.length ? res.data.list : [],
      });
    },
    //查看
    handleDetails(row) {
      this.$router.push({
        path: "/gatedpark/park-operation/contractor/change-approval/check",
        query: { id: row.ctrChangeId },
      });
    },
    // 提交
    subApproval(row) {
      let paramsData = {
        domainId: 8,
        externalBizId: row.ctrChangeId,
        extendInfo: JSON.stringify({ status: parseInt(row.approvalStatus) }),
      };
      hasNeedApproval(paramsData).then((res) => {
        if (!res.data) this.getApprovalTem(row.ctrChangeId);
      });
    },
    getApprovalTem(id) {
      ApprovalTemplate(8).then((res) => {
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
        this.$refs.table.getData({}, true);
      });
    },
    // 撤回审批
    recall(row) {
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
      getTemplateId({ domainId: 8, externalBizId: row.ctrChangeId }).then(
        (res) => {
          this.$router.push({
            path: "/gatedpark/approval/hasDo",
            query: {
              instanceId: res.data,
              domainId: 8,
              isTaskId: true,
              detail: true,
            },
          });
        },
      );
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
  .el-autocomplete {
    width: 100%;
  }
  .el-cascader {
    width: 100%;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
}
</style>
