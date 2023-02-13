<template>
  <hqit-content-page type="list">
    <template slot="content">
      <el-tabs v-if="!theAct" v-model="tabsActive">
        <el-tab-pane label="申请" name="1"></el-tab-pane>
        <el-tab-pane label="续期" name="2"></el-tab-pane>
      </el-tabs>
      <template v-if="tabsActive == 1">
        <hqit-table
          :key="1"
          ref="table"
          border
          style="height: 83%"
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
          <template slot="dept">
            <el-cascader
              v-model="deptId"
              style="width: 100%"
              :options="deptOptions"
              placeholder="请选择部门"
              :props="{ checkStrictly: true, label: 'name', value: 'id' }"
              :show-all-levels="false"
              clearable
              filterable
            >
            </el-cascader>
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
          <template slot="validEndTime" slot-scope="{ rowData }">
            <span>
              {{ fillterTime(rowData.validBeginTime, 10) }}至{{
                fillterTime(rowData.validEndTime, 10)
              }}
            </span>
            <!-- <el-tooltip placement="top">
              <div slot="content">
                <span>
                  {{ fillterTime(rowData.validBeginTime, 16) }}至{{
                    fillterTime(rowData.validEndTime, 16)
                  }}
                </span>
              </div>
            </el-tooltip> -->
          </template>
          <template v-if="!gettabsId" slot="operator">
            <hqit-button
              size="mini"
              btn-type="add"
              btn-text="新增"
              @click="add"
            ></hqit-button>
          </template>
          <template slot="code" slot-scope="{ rowData }">
            {{ rowData.code }}
            <i
              class="el-icon-document-copy copy-icon"
              @click="copyVisitNo(rowData)"
            ></i>
          </template>
          <template slot="opts" slot-scope="{ rowData }">
            <template v-if="!gettabsId">
              <el-button type="text" @click="handleDetails(rowData)">
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
                v-show="rowData.approvalStatus == 1"
                type="text"
                @click="handleDel(rowData)"
              >
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
      </template>
      <template v-if="tabsActive == 2">
        <hqit-table
          ref="table"
          :key="2"
          border
          style="height: 83%"
          :data-source="getList"
          :columns="columns1"
          :prop-show-pager="true"
          :search-config="searchConfig1"
          :use-expr="false"
          :show-select="false"
          :show-index="false"
          @search="handleSearch"
          @reset="resetForm"
          @filter-change="tableFilterChange"
        >
          <template slot="dept">
            <el-cascader
              v-model="deptId"
              style="width: 100%"
              :options="deptOptions"
              placeholder="请选择部门"
              :props="{ checkStrictly: true, label: 'name', value: 'id' }"
              :show-all-levels="false"
              clearable
              filterable
            >
            </el-cascader>
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
          <template slot="validEndTime" slot-scope="{ rowData }">
            <span>
              {{ fillterTime(rowData.validBeginTime, 10) }}至{{
                fillterTime(rowData.validEndTime, 10)
              }}
            </span>
            <!-- <el-tooltip placement="top">
              <div slot="content">
                <span>
                  {{ fillterTime(rowData.validBeginTime, 16) }}至{{
                    fillterTime(rowData.validEndTime, 16)
                  }}
                </span>
              </div>
              
            </el-tooltip> -->
          </template>
          <template v-if="!gettabsId" slot="operator">
            <hqit-button
              size="mini"
              btn-type="add"
              btn-text="新增"
              @click="add"
            ></hqit-button>
          </template>
          <template slot="code" slot-scope="{ rowData }">
            {{ rowData.code }}
            <i
              class="el-icon-document-copy copy-icon"
              @click="copyVisitNo(rowData)"
            ></i>
          </template>
          <template slot="opts" slot-scope="{ rowData }">
            <template v-if="!gettabsId">
              <el-button type="text" @click="handleDetails(rowData)">
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
                v-show="rowData.approvalStatus == 1"
                type="text"
                @click="handleDel(rowData)"
              >
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
      </template>
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
import personDetails from "@/components/FormBody/person-details/index.vue";
import ordDetails from "@/components/FormBody/org-details/index.vue";
import {
  getCardApplyList,
  removeCard,
} from "@/api/location-card-management/index.js";
import {
  hasNeedApproval,
  ApprovalTemplate,
  getTemplateId,
  withdrawTask,
  newApprovalTask,
} from "@/api/approval/approval-manege.js";
import needTodoMixin from "@/views/my-application/needTodo/needTodoMixin.js";
import { mapState, mapMutations } from "vuex";
export default {
  components: { ordDetails, personDetails },
  mixins: [needTodoMixin],
  props: {
    theAct: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      orgDetails: false, // 单位详情弹框
      personDetails: false, // 人员详情弹框
      personDetailsTitle: "",
      orgTitle: "",
      orgId: "", // 单位id
      personDetailsId: "",
      deptId: [],
      personBaseId: "",
      orgOptions: [], //单位树
      deptOptions: [], //部门树
      personList: [], //人员列表
      tabsActive: "1",
      queryForm: {},
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
          width: "100",
          slotname: "applyOrgName",
        },
        {
          prop: "applyDeptName",
          label: "部门",
        },
        {
          prop: "applyNum",
          label: "数量(张)",
          width: "100",
          sortable: true,
        },
        {
          prop: "bindNum",
          width: "100",
          label: "已绑定(张)",
        },
        {
          prop: "approvalStatus",
          label: "审批状态",
          width: "150",
          slotname: "approvalStatus",
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
          prop: "applyPersonName",
          label: "申请人",
          slotname: "applyPersonName",
        },
        {
          prop: "validEndTime",
          label: "有效期",
          slotname: "validEndTime",
          width: "190",
        },
        {
          prop: "createTime",
          sortable: true,
          label: "申请时间",
          width: "120",
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
          width: "240",
        },
      ],
      columns1: [
        {
          prop: "applyOrgName",
          label: "单位",
          slotname: "applyOrgName",
        },
        {
          prop: "applyDeptName",
          label: "部门",
          width: "100",
        },
        {
          prop: "applyNum",
          label: "数量(张)",
          width: "100",
          sortable: true,
        },
        {
          prop: "approvalStatus",
          label: "审批状态",
          width: "150",
          slotname: "approvalStatus",
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
          prop: "applyPersonName",
          label: "申请人",
          width: "120",
          slotname: "applyPersonName",
        },
        {
          prop: "validEndTime",
          label: "有效期",
          width: "190",
          slotname: "validEndTime",
        },
        {
          prop: "createTime",
          sortable: true,
          label: "申请时间",
          width: "120",
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
          width: "240",
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
          prop: "sealedOrgId",
          label: "单位", // 单位下拉框直接用（类型使用tree）
          expression: "IN",
          type: "hqit-tree-select",
          attrs: {
            selectAttrs: { placeholder: "请选择单位" },
          },
        },
        {
          prop: "dept",
          label: "部门", // 单位下拉框直接用（类型使用tree）
          expression: "IN",
          slotName: "dept",
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
      ],
      searchConfig1: [
        {
          prop: "sealedOrgId",
          label: "单位", // 单位下拉框直接用（类型使用tree）
          expression: "IN",
          type: "hqit-tree-select",
          attrs: {
            selectAttrs: { placeholder: "请选择单位" },
          },
        },
        {
          prop: "dept",
          label: "部门", // 单位下拉框直接用（类型使用tree）
          expression: "IN",
          slotName: "dept",
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
      ],
    };
  },
  computed: {
    ...mapState({
      applyTabs: (status) => status.tabList.applyTabs,
    }),
    changeStatus() {
      let name = "";
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
    fillterTime() {
      return (time, num) => {
        return time.substr(0, num);
      };
    },
  },
  watch: {
    theAct: {
      handler: function (val) {
        if (val) this.tabsActive = val;
      },
      immediate: true,
    },
    tabsActive(val) {
      this.CHANGE_APPLY_TABS(val);
      this.$refs.table.getData({}, true);
    },
  },
  created() {
    this.tabsActive = this.applyTabs;
    this.getOrgListData();
    this.getDeptTreeListData();
    this.getPersonListData();
  },
  methods: {
    ...mapMutations("tabList", {
      CHANGE_APPLY_TABS: "CHANGE_APPLY_TABS",
    }),
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
          applyType: this.tabsActive,
          applyCardType: 0,
          orgType: 1,
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
      if (
        this.queryForm.approvalStatus &&
        this.queryForm.approvalStatus.length
      ) {
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
      //单位
      if (this.queryForm.sealedOrgId) {
        resParams.expr.push({
          expression: "IN",
          key: "applyOrgId",
          value: this.queryForm.sealedOrgId,
        });
      }
      //部门
      if (this.deptId.length) {
        resParams.query.applyDeptId = this.deptId[this.deptId.length - 1];
      }
      this.queryForm.code &&
        resParams.expr.push({
          expression: "LIKE",
          key: "code",
          value: this.queryForm.code,
        }); // 申请批次
      // 有效时间
      if (this.queryForm.updateTime && this.queryForm.updateTime.length) {
        resParams.expr.push({
          key: "validBeginTime",
          expression: "GE",
          value: this.queryForm.updateTime[0] + " 00:00:00",
        });
        resParams.expr.push({
          key: "validEndTime",
          expression: "LE",
          value: this.queryForm.updateTime[1] + " 23:59:59",
        });
      }
      if (this.queryForm.createTime && this.queryForm.createTime.length) {
        resParams.expr.push({
          key: "createTime",
          expression: "GE",
          value: this.queryForm.createTime[0] + " 00:00:00",
        });
        resParams.expr.push({
          key: "createTime",
          expression: "LE",
          value: this.queryForm.createTime[1] + " 23:59:59",
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
      this.$refs.table.page.total =
        res.data && res.data.pagination.total ? res.data.pagination.total : 0;
      return Promise.resolve({
        data: res.data && res.data.list.length ? res.data.list : [],
      });
    },
    //单位列表
    async getOrgListData() {
      const { data } = await this.getOrgList();
      this.orgOptions = data;
    },
    //部门树列表
    async getDeptTreeListData() {
      const { data } = await this.getDeptTreeListByOrgId();
      this.deptOptions = data;
    },
    //人员列表
    async getPersonListData() {
      const { data } = await this.getPersonList({
        pageNum: 1,
        pageSize: 10000,
        query: {},
      });
      this.personList = data.list;
    },
    // 提交审核
    handleAudit(row) {
      let paramsData = {
        domainId: this.tabsActive == "1" ? 9 : 10,
        externalBizId: row.id,
        extendInfo: JSON.stringify({ status: parseInt(row.approvalStatus) }),
      };
      hasNeedApproval(paramsData).then((res) => {
        if (!res.data) this.getApprovalTem(row.id);
      });
    },
    getApprovalTem(id) {
      ApprovalTemplate(this.tabsActive == "1" ? 9 : 10).then((res) => {
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
            domainId: this.tabsActive == "1" ? 9 : 10,
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
        domainId: this.tabsActive == "1" ? 9 : 10,
        externalBizId: row.id,
      }).then((res) => {
        this.$router.push({
          path: "/gatedpark/approval/hasDo",
          query: {
            instanceId: res.data,
            domainId: this.tabsActive == "1" ? 9 : 10,
            isTaskId: true,
            detail: true,
          },
        });
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
      const valid = await this.errorBoundary(
        this.delPrompt(this, this.tabsActive == "1" ? row.code : "该数据"),
      );
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
    filterTag(row) {
      if (row.approvalStatus) {
        this.changeApprovalStatus = row.approvalStatus;
      }
      this.$refs.table.getData({}, true);
    },
    // 查看
    handleDetails(row) {
      this.$router.push({
        path: "/gatedpark/park-operation/location-manage/edit",
        query: {
          id: row.id,
          tabsActive: this.tabsActive,
          isCheck: true,
          code: row.code,
        },
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
        path: "/gatedpark/park-operation/location-manage/edit",
        query: {
          id: row.id,
          tabsActive: this.tabsActive,
          isCheck: false,
          code: row.code,
        },
      });
    },
    //新增
    add() {
      this.$router.push("/gatedpark/park-operation/location-manage/add");
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
      this.personDetailsTitle = `接待人— 查看— ${row.receivePersonName}`;
      this.personDetails = true;
    },
    // 搜索
    handleSearch(params) {
      this.queryForm = {
        ...this.queryForm,
        ...params,
      };
      this.$refs.table.getData({}, true);
    },
    //重置搜索
    resetForm() {
      this.deptId = [];
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
      console.log(this.queryForm);
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
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
/deep/ .el-autocomplete {
  width: 100%;
}
/deep/ .el-cascader {
  width: 100% !important;
}
</style>
