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
        <template slot="code" slot-scope="{ rowData }">
          {{ rowData.code }}
          <i
            class="el-icon-document-copy copy-icon"
            @click="copyVisitNo(rowData)"
          ></i>
        </template>
        <template slot="applyOrgName" slot-scope="{ rowData }">
          <span
            style="color: #358aff; cursor: pointer"
            @click="handleCheck(rowData)"
          >
            {{ rowData.applyOrgName }}
          </span>
        </template>
        <template slot="applyPersonName" slot-scope="{ rowData }">
          <span
            style="color: #358aff; cursor: pointer"
            @click="handleCheckPerson(rowData)"
          >
            {{ rowData.applyPersonName }}
          </span>
        </template>
        <template v-if="!gettabsId" slot="operator">
          <hqit-button
            size="mini"
            btn-type="add"
            btn-text="新增"
            @click="add"
          ></hqit-button>
        </template>
        <template slot="validBeginTime" slot-scope="{ rowData }">
          {{ rowData.validBeginTime | splitTime }}至{{
            rowData.validEndTime | splitTime
          }}
        </template>
        <template slot="vehicleCode" slot-scope="{ rowData }">
          <span
            style="color: #358aff; cursor: pointer"
            @click="handleCheckPerson(rowData)"
          >
            {{ rowData.vehicleCode }}
          </span>
        </template>
        <template slot="opts" slot-scope="{ rowData }">
          <template v-if="!gettabsId">
            <el-button type="text" @click="handleDetails(rowData)">
              查看
            </el-button>
            <el-button type="text" @click="handleDel(rowData)">
              删除
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
      <el-dialog
        v-if="orgDetails"
        v-dialogDrag
        :title="orgTitle"
        :visible.sync="orgDetails"
      >
        <ordDetails :org-id="orgId" />
      </el-dialog>
      <el-dialog
        v-if="personDetails"
        v-dialogDrag
        :title="personDetailsTitle"
        :visible.sync="personDetails"
        width="500px"
      >
        <personDetails :person-id="personDetailsId" :is-base="true" />
      </el-dialog>
    </template>
  </hqit-content-page>
</template>

<script>
import { getCardApplyList, removeCard } from "@/api/location-card-management";
import {
  hasNeedApproval,
  ApprovalTemplate,
  getTemplateId,
  withdrawTask,
  newApprovalTask,
} from "@/api/approval/approval-manege.js";
import personDetails from "@/components/FormBody/person-details/index.vue";
import ordDetails from "@/components/FormBody/org-details/index.vue";
import needTodoMixin from "@/views/my-application/needTodo/needTodoMixin.js";
export default {
  name: "explosion-proof-card",
  components: { ordDetails, personDetails },
  mixins: [needTodoMixin],
  data() {
    return {
      orgDetails: false, // 单位详情弹框
      personDetails: false, // 人员详情弹框
      personDetailsTitle: "",
      orgTitle: "",
      orgId: "", // 单位id
      personDetailsId: "",
      personId: "",
      carNoDetails: false,
      searchForm: {
        orgId: null,
        deptId: null,
        machinesNo: null,
        machinesName: null,
        machinesType: null,
        machinesKind: null,
        updateTime: null,
      },
      queryForm: {},
      personList: [], //人员列表
      approvalFilterStatus: [],
      approvalFilterValue: [],
      columns: [
        {
          prop: "code",
          label: "申请批次",
          width: "180",
          slotname: "code",
        },
        {
          prop: "applyOrgName",
          label: "单位",
          slotname: "applyOrgName",
        },
        {
          prop: "applyDeptName",
          label: "部门",
        },
        {
          prop: "applyPersonName",
          label: "申请人",
          slotname: "applyPersonName",
        },
        {
          prop: "validBeginTime",
          label: "有效期",
          slotname: "validBeginTime",
        },
        {
          prop: "createTime",
          label: "申请时间",
          sortable: true,
          formatter: (val) => {
            return this.awaySecond(val);
          },
        },
        {
          prop: "applyNum",
          label: "数量(张)",
          sortable: true,
        },
        {
          prop: "approvalStatus",
          label: "审批状态",

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
          slotname: "opts",
          width: "270",
        },
      ],
      searchConfig: [
        {
          label: "申请批次",
          prop: "code",
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          prop: "applyOrgId",
          label: "单位", // 单位下拉框直接用（类型使用tree）
          expression: "IN",
          type: "hqit-tree-select",
          attrs: {
            selectAttrs: { placeholder: "请选择单位" },
          },
        },
        {
          label: "部门",
          prop: "applyDeptId",
          expression: "IN",
          type: "hqit-tree-select",
          attrs: {
            idkey: "id",
            loadTreeData: () => {
              return this.getDeptTreeListByOrgId();
            },
            selectAttrs: { placeholder: "请选择部门" },
          },
        },
        {
          label: "申请人",
          prop: "applyPersonId",
          expression: "IN",
          type: "hqit-pro-select",
          attrs: {
            clearable: true,
            idKey: "personBaseId",
            singleSelect: true,
            selectAttrs: { placeholder: "请选择申请人" },
          },
        },
        {
          label: "有效期",
          prop: "updateTime",
          type: "daterange",
        },
        {
          label: "申请时间",
          prop: "createTime",
          type: "daterange",
        },
        {
          label: "数量(张)",
          prop: "applyNum",
          attrs: {
            clearable: true,
            placeholder: "请输入",
          },
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
  created() {
    this.getPersonListData();
  },
  methods: {
    //人员列表
    async getPersonListData() {
      const { data } = await this.getPersonList({
        pageNum: 1,
        pageSize: 10000,
        query: {},
      });
      this.personList = data.list;
    },
    //防爆卡列表
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
        order: "createTime",
        sort: "DESC",
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        query: {
          applyCardType: 1,
        },
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
      // //申请状态
      if (this.queryForm.approvalStatus) {
        resParams.expr.push({
          expression: "IN",
          key: "approvalStatus",
          value: this.queryForm.approvalStatus,
        });
      }
      if (this.gettabsId && ids.length) {
        resParams.expr.push({
          expression: "IN",
          key: "id",
          value: ids,
        });
      }
      //数量
      if (this.queryForm.applyNum) {
        resParams.query.applyNum = this.queryForm.applyNum;
      }
      // 有效时间
      if (this.queryForm.updateTime) {
        resParams.expr.push({
          key: "validBeginTime",
          expression: "GE",
          value: this.queryForm.updateTime[0],
        });
        resParams.expr.push({
          key: "validBeginTime",
          expression: "LE",
          value: this.queryForm.updateTime[1],
        });
      }
      // 创建时间
      if (this.queryForm.createTime) {
        resParams.expr.push({
          key: "createTime",
          expression: "GE",
          value: this.queryForm.createTime[0],
        });
        resParams.expr.push({
          key: "createTime",
          expression: "LE",
          value: this.queryForm.createTime[1],
        });
      }
      let res = await getCardApplyList(resParams);
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
    // 复制单号
    copyVisitNo(row) {
      var input = document.createElement("input"); // 创建input对象
      input.value = row.code; // 设置复制内容
      document.body.appendChild(input); // 添加临时实例
      input.select(); // 选择实例内容
      document.execCommand("Copy"); // 执行复制
      document.body.removeChild(input); // 删除临时实例
      this.$message.success("复制成功！");
    },
    // 删除
    async handleDel(row) {
      const valid = await this.errorBoundary(this.delPrompt(this, row.id));
      if (valid) {
        removeCard([row.id]).then((res) => {
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
    // 提交审核
    handleAudit(row) {
      let paramsData = {
        domainId: 11,
        externalBizId: row.id,
        extendInfo: JSON.stringify({ status: parseInt(row.approvalStatus) }),
      };
      hasNeedApproval(paramsData).then((res) => {
        if (!res.data) this.getApprovalTem(row.id);
      });
    },
    getApprovalTem(id) {
      ApprovalTemplate(11).then((res) => {
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
          getTemplateId({
            domainId: 11,
            externalBizId: row.id,
          }).then((res) => {
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
      getTemplateId({
        domainId: 11,
        externalBizId: row.id,
      }).then((res) => {
        this.$router.push({
          path: "/gatedpark/approval/hasDo",
          query: {
            instanceId: res.data,
            domainId: 11,
            isTaskId: true,
            detail: true,
          },
        });
      });
    },
    //查看
    handleDetails(row) {
      this.$router.push({
        path: "/gatedpark/park-operation/location-manage/explosion-proof-card/add",
        query: { id: row.id },
      });
    },
    //新增
    add() {
      this.$router.push(
        "/gatedpark/park-operation/location-manage/explosion-proof-card/add",
      );
    },
    //审批状态过滤
    handleFilterChange(e) {
      this.approvalFilterStatus = e.approvalStatus;
      this.approvalFilterValue = e.approvalStatus;
      this.$refs.table.reload();
    },
    // 查看单位详情信息
    handleCheck(row) {
      // orgDetails orgId
      this.orgId = row.applyOrgId;
      this.orgTitle = `单位信息— 查看— ${row.applyOrgName}`;
      this.orgDetails = true;
      this.title = `单位信息— 查看— ${row.applyOrgName}`;
    },
    // 查看人员详情信息
    handleCheckPerson(row) {
      this.personDetailsId = row.applyPersonId;
      this.personDetailsTitle = `申请人— 查看— ${row.applyPersonName}`;
      this.personDetails = true;
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
      this.personId = "";
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
.copy-icon {
  margin-left: 5px;
  color: #409eff;
  cursor: pointer;
}
/deep/ .el-autocomplete {
  width: 100%;
}
</style>
