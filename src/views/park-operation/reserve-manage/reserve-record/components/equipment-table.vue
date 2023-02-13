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
        <template slot="receivePersonName" slot-scope="{ rowData }">
          <span
            style="color: #358aff; cursor: pointer"
            @click="handleCheckPerson(rowData)"
          >
            {{ rowData.receivePersonName }}
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
      <el-dialog
        v-if="personDetails"
        v-dialogDrag
        :title="personDetailsTitle"
        :visible.sync="personDetails"
        width="500px"
      >
        <personDetails :person-id="personId" />
      </el-dialog>
      <el-dialog v-if="orgDetails" :title="orgTitle" :visible.sync="orgDetails">
        <ordDetails :org-id="orgId" />
      </el-dialog>
    </template>
  </hqit-content-page>
</template>

<script>
import personDetails from "@/components/FormBody/person-details/index.vue";
import ordDetails from "@/components/FormBody/org-details/index.vue";
import { getMachineList } from "@/api/reserve-manage/index.js";
import { getListByParentId } from "@/api/system/custom-code.js";
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
  components: { personDetails, ordDetails },
  mixins: [needTodoMixin],
  props: {
    treeList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      personDetails: false,
      orgDetails: false, // 单位详情弹框
      orgTitle: "",
      orgId: "", // 单位id
      personId: "", //查看负责人详情ID
      personDetailsTitle: "查看- 责任人", // 查看负责人title
      equipmentTypeList: [], //机具种类
      equipmentKindList: [], // 机具种类列表
      allMachineKindList: [], //机具类型
      queryForm: {},
      columns: [
        {
          prop: "visitorNo",
          label: "预约单号",
          slotname: "visitorNo",
          width: "180",
        },
        {
          prop: "machinesName",
          label: "机具名称",
        },
        {
          prop: "visitOrgName",
          label: "拜访单位",
          slotname: "visitOrgName",
        },
        {
          prop: "receivePersonName",
          label: "接待人",
          slotname: "receivePersonName",
        },
        {
          prop: "dutyPersonName",
          label: "负责人",
        },
        {
          prop: "machinesType",
          label: "机具类型",
          formatter: (val) => {
            return this.checkEquipmentTypeCode(val);
          },
        },
        {
          prop: "machineKindCode",
          label: "机具种类",
          formatter: (val) => {
            return this.checkEquipmentKindCode(val);
          },
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
          slotname: "opts",
          fixed: "right",
          width: 250,
        },
      ],
      searchConfig: [
        {
          label: "机具名称",
          prop: "machinesName",
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
          prop: "receivePersonName",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "负责人",
          prop: "dutyPersonName",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "机具类型",
          prop: "machinesType",
          type: "select",
          options: [],
          attrs: {
            placeholder: "请选择机具类型",
          },
        },

        {
          label: "机具种类",
          prop: "machineKindCode",
          expression: "EQ",
          type: "select",
          options: [],
          attrs: {
            placeholder: "请选择机具种类",
          },
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
            name = "驳回";
            break;

          default:
            name = "";
            break;
        }
        return name;
      };
    },
    checkEquipmentTypeCode() {
      return (code) => {
        let equipmentTypeName;
        this.equipmentTypeList.forEach((item) => {
          if (item.code == code) equipmentTypeName = item.name;
        });
        return equipmentTypeName;
      };
    },
    checkEquipmentKindCode() {
      return (code) => {
        let equipmentKindName = "";
        this.allMachineKindList.forEach((item) => {
          if (item.code == code) equipmentKindName = item.name;
        });
        return equipmentKindName;
      };
    },
  },
  watch: {
    personId(val) {
      if (val == "") {
        this.queryForm.receivePersonId = "";
      }
    },
  },
  created() {
    this.$getTypeCode("gatedpark_machine_type").then((res) => {
      this.equipmentTypeList = res.data;
      this.searchConfig.find((v) => v.prop == "machinesType").options =
        res.data.map((item) => {
          return { label: item.name, value: item.code };
        });
    });
    // 全部机具种类
    this.$getTypeCode("gatedpark_machine_kind").then((res) => {
      this.allMachineKindList = res.data;
      this.searchConfig.find((v) => v.prop == "machineKindCode").options =
        res.data.map((item) => {
          return { label: item.name, value: item.code };
        });
    });
  },
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
        expr: [],
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
      if (this.queryForm.receivePersonName != "") {
        resParams.expr.push({
          expression: "LIKE",
          key: "receivePersonName",
          value: this.queryForm.receivePersonName,
        });
      }
      if (this.gettabsId && ids.length) {
        resParams.query.ids = ids;
      }
      let res = await getMachineList(resParams);
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
    getSecondCodeList(id) {
      getListByParentId(id, {}).then((res) => {
        this.equipmentKindList = res.data.list;
      });
    },
    // 查看
    linkDetails(row) {
      this.$router.push({
        path: "/gatedpark/park-operation/reserve-manage/details",
        query: { id: row.id, type: "equipment" },
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
        query: { id: row.id, type: "equipment" },
      });
    },
    // 提交
    handleAudit(row) {
      let paramsData = {
        domainId: 6,
        externalBizId: row.id,
        extendInfo: JSON.stringify({ status: parseInt(row.approvalStatus) }),
      };
      hasNeedApproval(paramsData).then((res) => {
        if (!res.data) this.getApprovalTem(row.id);
      });
    },
    getApprovalTem(id) {
      ApprovalTemplate(6).then((res) => {
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
          getTemplateId({ domainId: 6, externalBizId: row.id }).then((res) => {
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
      getTemplateId({ domainId: 6, externalBizId: row.id }).then((res) => {
        this.$router.push({
          path: "/gatedpark/approval/hasDo",
          query: {
            instanceId: res.data,
            domainId: 6,
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
              value: `${person.name}`,
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
    handlePersonSelect(item) {
      this.queryForm["receivePersonId"] = item.personId;
    },
    // 查看人员详情信息
    handleCheckPerson(row) {
      this.personId = row.receivePersonId;
      this.personDetailsTitle = `接待人— 查看— ${row.receivePersonName}`;
      this.personDetails = true;
    },
    // 查看单位详情信息
    handleCheck(row) {
      // orgDetails orgId
      this.orgId = row.visitOrgId;
      this.orgTitle = `拜访单位— 查看— ${row.visitOrgName}`;
      this.orgDetails = true;
      this.title = `单位信息— 查看— ${row.visitOrgName}`;
    },
    // 查询
    handleSearch(params) {
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

<style></style>
