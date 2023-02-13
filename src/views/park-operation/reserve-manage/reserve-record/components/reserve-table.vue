<template>
  <hqit-content-page type="list" style="height: calc(100vh - 180px)">
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
        <template slot="receivePersonId">
          <el-autocomplete
            v-model="personId"
            style="width: 100%"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入"
            clearable
          ></el-autocomplete>
        </template>
        <template slot="visitorNo" slot-scope="{ rowData }">
          {{ rowData.visitorNo }}
          <i
            class="el-icon-document-copy copy-icon"
            @click="copyVisitNo(rowData)"
          ></i>
        </template>
        <template slot="visitOrgName" slot-scope="{ rowData }">
          <span
            style="color: #358aff; cursor: pointer"
            @click="handleCheck(rowData)"
          >
            {{ rowData.visitOrgName }}
          </span>
        </template>
        <template slot="visitStartTime" slot-scope="{ rowData }">
          <el-tooltip placement="top">
            <div slot="content">
              {{ rowData.visitStartTime.split(" ")[0] }} 至{{
                rowData.visitEndTime.split(" ")[0]
              }}
            </div>
            <span> {{ rowData.visitStartTime.split(" ")[0] }}</span>
          </el-tooltip>
        </template>
        <template slot="opts" slot-scope="{ rowData }">
          <template v-if="!gettabsId">
            <el-button type="text" @click="linkDetails(rowData)">
              查看
            </el-button>
            <el-button
              v-show="
                rowData.approvalStatus == 1 || rowData.approvalStatus == 4
              "
              type="text"
              @click="handleEdit(rowData)"
            >
              修改
            </el-button>
            <el-button
              v-show="
                rowData.approvalStatus == 1 || rowData.approvalStatus == 4
              "
              type="text"
              @click="handleAudit(rowData)"
            >
              {{ rowData.approvalStatus == 1 ? "提交" : "重新发起" }}
            </el-button>
            <el-button
              v-show="rowData.approvalStatus == 2"
              type="text"
              @click="recall(rowData)"
            >
              撤回
            </el-button>
            <el-button
              v-show="
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
      <el-dialog v-if="orgDetails" :title="orgTitle" :visible.sync="orgDetails">
        <ordDetails :org-id="orgId" />
      </el-dialog>
    </template>
  </hqit-content-page>
</template>

<script>
import ordDetails from "@/components/FormBody/org-details/index.vue";
import { getVisitorList } from "@/api/reserve-manage/index.js";
import {
  hasNeedApproval,
  ApprovalTemplate,
  getTemplateId,
  withdrawTask,
  newApprovalTask,
} from "@/api/approval/approval-manege.js";
import needTodoMixin from "@/views/my-application/needTodo/needTodoMixin.js";
import { getPersonList } from "@/api/access-control-permission/organization-control.js";
export default {
  components: { ordDetails },
  mixins: [needTodoMixin],
  props: {
    treeList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      orgDetails: false, // 单位详情弹框
      orgTitle: "",
      personId: "",
      orgId: "", // 单位id
      queryForm: {},
      columns: [
        {
          prop: "visitorNo",
          label: "预约单号",
          slotname: "visitorNo",
          width: "180",
        },
        {
          prop: "name",
          label: "姓名",
        },
        {
          prop: "sex",
          label: "性别",
          width: "70",
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
          prop: "identityCard",
          label: "身份证号",
        },
        {
          prop: "phone",
          label: "手机号",
        },
        {
          prop: "visitOrgName",
          label: "拜访单位",
          slotname: "visitOrgName",
        },

        {
          prop: "receivePersonName",
          label: "接待人",
        },
        {
          prop: "visitStartTime",
          label: "拜访日期",
          slotname: "visitStartTime",
          width: "100",
        },
        {
          prop: "approvalStatus",
          label: "审批状态",
          width: "110",
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
          prop: "opts",
          label: "操作",
          align: "right",
          fixed: "right",
          slotname: "opts",
          width: 250,
        },
      ],
      searchConfig: [
        {
          label: "姓名",
          prop: "name",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "身份证号",
          prop: "identityCard",
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
          prop: "visitOrgId",
          label: "拜访单位", // 单位下拉框直接用（类型使用tree）
          expression: "IN",
          type: "hqit-tree-select",
          attrs: {
            selectAttrs: { placeholder: "请选择单位" },
          },
        },
        {
          label: "接待人",
          prop: "receivePersonId",
          slotName: "receivePersonId",
        },
        {
          label: "拜访日期",
          prop: "visitStartTime",
          type: "daterange",
        },
      ],
    };
  },
  computed: {
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
            name = "撤回";
            break;
          case 6:
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
  watch: {},
  methods: {
    async getList(params) {
      let ids = [];
      let resObj = {};
      if (this.gettabsId) {
        resObj = await this.handleIds(params);
        ids = resObj.externalBizId;
        if (!ids.length) {
          return Promise.resolve({
            data: {
              list: [],
              pagination: { total: 0 },
            },
          });
        }
      }
      let resParams = {
        sort: "DESC",
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
      // console.log(this.queryForm);
      if (this.queryForm.sex && this.queryForm.sex.length) {
        resParams.query.sex = Number(this.queryForm.sex.join(","));
      }
      if (
        this.queryForm.approvalStatus &&
        this.queryForm.approvalStatus.length
      ) {
        resParams.query.approvalStatus = this.queryForm.approvalStatus;
      }
      if (
        this.queryForm.visitStartTime &&
        this.queryForm.visitStartTime.length
      ) {
        resParams.query.visitStartTime =
          this.queryForm.visitStartTime[0] + " 00:00:00";
        resParams.query.visitEndTime =
          this.queryForm.visitStartTime[1] + " 23:59:59";
      }
      if (this.gettabsId && ids.length) {
        resParams.query.ids = ids;
      }
      let res = await getVisitorList(resParams);
      if (this.gettabsId && ids.length && res.data.list.length) {
        res.data.list.forEach((litem) => {
          resObj.infoVo.forEach((iitem) => {
            if (litem.id == iitem.externalBizId) {
              this.$set(litem, "instanceId", iitem.instanceId);
            }
          });
        });
      }
      return Promise.resolve({
        data: {
          list: res.data && res.data.list.length ? res.data.list : [],
          pagination: { ...res.data.pagination },
        },
      });
    },
    // 查看
    linkDetails(row) {
      this.$router.push({
        path: "/gatedpark/park-operation/reserve-manage/details",
        query: { id: row.id, type: "reserve", name: row.name },
      });
    },
    // 修改
    handleEdit(row) {
      if (row.approvalStatus == 2 || row.approvalStatus == 3) {
        this.$msgSuccess(
          row.approvalStatus == 2 ? "审批中" : "审批通过" + ",不允许修改",
        );
        return;
      }
      this.$router.push({
        path: "/gatedpark/park-operation/reserve-manage/reserve-application",
        query: { id: row.id, type: "reserve" },
      });
    },
    // 提交审核
    handleAudit(row) {
      let paramsData = {
        domainId: 1,
        externalBizId: row.id,
        extendInfo: JSON.stringify({ status: parseInt(row.approvalStatus) }),
      };
      hasNeedApproval(paramsData).then((res) => {
        if (!res.data) this.getApprovalTem(row.id);
      });
    },
    getApprovalTem(id) {
      ApprovalTemplate(1).then((res) => {
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
    // 撤回审批
    recall(row) {
      this.$confirm(`是否撤回当前审批`, "提示")
        .then(() => {
          getTemplateId({ domainId: 1, externalBizId: row.id }).then((res) => {
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
    // 审批记录
    approvalRecord(row) {
      getTemplateId({ domainId: 1, externalBizId: row.id }).then((res) => {
        this.$router.push({
          path: "/gatedpark/approval/hasDo",
          query: {
            instanceId: res.data,
            domainId: 1,
            isTaskId: true,
            detail: true,
          },
        });
      });
    },
    // 接待人搜索查询
    querySearchAsync(queryString, cb) {
      if (queryString) {
        let params = {
          pageNum: 1,
          pageSize: 99999,
          query: {
            hasOrg: true,
            name: queryString,
          },
        };
        getPersonList(params).then((res) => {
          var results = res.data.list.map((person) => {
            return {
              value: `${person.name}-${person.personId}`,
              ...person,
            };
          });
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            cb(results);
          }, 3000 * Math.random());
        });
      }
    },
    // 复制单号
    copyVisitNo(row) {
      var input = document.createElement("input"); // 创建input对象
      input.value = row.visitorNo; // 设置复制内容
      document.body.appendChild(input); // 添加临时实例
      input.select(); // 选择实例内容
      document.execCommand("Copy"); // 执行复制
      document.body.removeChild(input); // 删除临时实例
      this.$message.success("复制成功！");
    },
    // 查看单位详情信息
    handleCheck(row) {
      this.orgId = row.visitOrgId;
      this.orgTitle = `拜访单位— 查看— ${row.visitOrgName}`;
      this.orgDetails = true;
      this.title = `单位信息— 查看— ${row.visitOrgName}`;
    },
    // 查询
    handleSearch(params) {
      if (this.personId != "") {
        this.queryForm = {
          receivePersonId: this.personId.split("-")[1],
        };
      }
      this.queryForm = {
        ...this.queryForm,
        ...params,
      };
      this.$refs.table.getData({}, true);
    },
    resetForm() {
      this.personId = "";
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

<style>
.copy-icon {
  margin-left: 5px;
  color: #409eff;
  cursor: pointer;
}
</style>
