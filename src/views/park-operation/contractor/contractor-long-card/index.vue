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
          <template slot="applyPerson">
            <el-autocomplete
              v-model="personBaseId"
              style="width: 100%"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入"
              clearable
              @select="handleSelect"
            ></el-autocomplete>
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
          <template slot="applyPerson">
            <el-autocomplete
              v-model="personBaseId"
              style="width: 100%"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入"
              clearable
              @select="handleSelect"
            ></el-autocomplete>
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
    </template>
  </hqit-content-page>
</template>

<script>
import ordDetails from "@/components/FormBody/org-details/index.vue";
import { ctrList } from "@/api/contractor/contractor-management.js";
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
import { listByExpr } from "@/api/contractor/contractor-management.js";
import needTodoMixin from "@/views/my-application/needTodo/needTodoMixin.js";
import { mapState, mapMutations } from "vuex";
export default {
  components: { ordDetails },
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
      orgTitle: "",
      orgId: "", // 单位id
      personBaseId: "",
      orgOptions: [], //单位树
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
        },
        {
          prop: "validEndTime",
          label: "有效期",
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
      columns1: [
        {
          prop: "applyOrgName",
          label: "承包商",
          width: "150",
          slotname: "applyOrgName",
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
        },
        {
          prop: "validEndTime",
          label: "有效期",
          width: "150",
          slotname: "validEndTime",
        },
        {
          prop: "createTime",
          sortable: true,
          label: "申请时间",
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
          prop: "applyOrgId",
          label: "承包商名称", // 单位下拉框直接用（类型使用tree）
          expression: "LIKE",
          type: "select",
          attrs: {
            placeholder: "请选择承包商",
          },
          options: [],
        },
        {
          label: "申请人",
          prop: "applyPerson",
          slotName: "applyPerson",
        },
        // {
        //   label: "申请人",
        //   prop: "applyPersonId",
        //   expression: "IN",
        //   type: "hqit-pro-select",
        //   attrs: {
        //     clearable: true,
        //     idKey: "personBaseId",
        //     singleSelect: true,
        //     config: {
        //       requestTable: ctrList,
        //     },
        //     propExtraParams: {
        //       order: "createTime",
        //       sort: "DESC",
        //       pageNum: 1, // 页码
        //       pageSize: 99999, // 显示数量
        //       query: {},
        //       expr: [],
        //     },
        //   },
        // },
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
          prop: "applyOrgId",
          label: "承包商名称", // 单位下拉框直接用（类型使用tree）
          expression: "LIKE",
          type: "select",
          attrs: {
            placeholder: "请选择承包商",
          },
          options: [],
        },
        {
          label: "申请人",
          prop: "applyPerson",
          slotName: "applyPerson",
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
    this.getCtrAllList();
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
          orgType: 2,
        },
        expr: [],
      };
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
      if (this.queryForm.applyOrgId) {
        resParams.expr.push({
          expression: "IN",
          key: "applyOrgId",
          value: this.queryForm.applyOrgId,
        });
      }
      //申请人
      if (this.personBaseId != "") {
        resParams.query.applyPersonId = this.personBaseId.split("-")[1];
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
    getListByExpr() {
      listByExpr().then((res) => {
        this.contaList = res.data;
      });
    },
    // 获取承包商列表
    getCtrAllList() {
      let params = [
        {
          expression: "EQ",
          key: "status",
          value: 3,
        },
      ];
      listByExpr(params).then((res) => {
        this.searchConfig.find((v) => v.prop == "applyOrgId").options =
          res.data.map((item) => {
            return { label: item.name, value: item.id };
          });
        this.searchConfig1.find((v) => v.prop == "applyOrgId").options =
          res.data.map((item) => {
            return { label: item.name, value: item.id };
          });
      });
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
    //申请人搜索
    querySearchAsync(queryString, cb) {
      var results = queryString
        ? this.personList
            .filter(this.createStateFilter(queryString))
            .map((person) => {
              return {
                value: `${person.name}-${person.personBaseId}`,
                name: person.name,
              };
            })
        : [];
      cb(results);
    },
    //申请人过滤
    createStateFilter(queryString) {
      return (person) => {
        return (
          person.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    // 提交审核
    handleAudit(row) {
      let paramsData = {
        domainId: this.tabsActive == "1" ? 12 : 13,
        externalBizId: row.id,
        extendInfo: JSON.stringify({ status: parseInt(row.approvalStatus) }),
      };
      hasNeedApproval(paramsData).then((res) => {
        if (!res.data) this.getApprovalTem(row.id);
      });
    },
    getApprovalTem(id) {
      ApprovalTemplate(this.tabsActive == "1" ? 12 : 13).then((res) => {
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
            domainId: this.tabsActive == "1" ? 12 : 13,
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
      console.log(row);
      getTemplateId({
        domainId: this.tabsActive == "1" ? 12 : 13,
        externalBizId: row.id,
      }).then((res) => {
        this.$router.push({
          path: "/gatedpark/approval/hasDo",
          query: {
            instanceId: res.data,
            domainId: this.tabsActive == "1" ? 12 : 13,
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
    // // 删除
    // handleDel(row) {
    //   this.$refs.table.deleteNotice(
    //     () => removeCard([row.id]),
    //     this.tabsActive == "1" ? row.code : "",
    //   );
    // },
    // 删除
    // handleDel(row) {
    //   console.log(row);
    //   let applyPersonName = "";
    //   (applyPersonName =
    //     this.tabsActive == "1" ? row.code : row.applyPersonName),
    //     this.$refs.table.deleteNotice(
    //       () => removeCard([row.id]),
    //       applyPersonName,
    //     );
    // },
    // 删除
    async handleDel(row) {
      const valid = await this.errorBoundary(
        this.delPrompt(
          this,
          this.tabsActive == "1" ? row.code : row.applyPersonName,
        ),
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
    // // 查看
    // handleDetails(row) {
    //   this.$router.push({
    //     path: "/gatedpark/park-operation/location-manage/edit",
    //     query: {
    //       id: row.id,
    //       tabsActive: this.tabsActive,
    //       isCheck: true,
    //       code: row.code,
    //     },
    //   });
    // },
    // 查看
    handleDetails(row) {
      this.$router.push({
        path: "/gatedpark/park-operation/contractor/edit",
        query: { id: row.id, tabsActive: this.tabsActive, isCheck: true },
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
        path: "/gatedpark/park-operation/contractor/edit",
        query: { id: row.id, tabsActive: this.tabsActive, isCheck: false },
      });
    },
    handleSelect(item) {},
    //新增
    add() {
      this.$router.push("/gatedpark/park-operation/contractor/add");
    },
    // 查看单位详情信息
    handleCheck(row) {
      // orgDetails orgId
      this.orgId = row.applyOrgId;
      this.orgTitle = `单位信息— 查看— ${row.applyOrgName}`;
      this.orgDetails = true;
      this.title = `单位信息— 查看— ${row.applyOrgName}`;
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
      this.personBaseId = "";
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
