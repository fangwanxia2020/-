<template>
  <div class="design-form-wrap">
    <!--页面内容-->
    <div class="design-form-wrap__ctnwrap el-ty">
      <el-tabs v-model="activeName">
        <el-tab-pane label="审批" name="first">
          <div v-if="!isCheck" class="tab-title">审批意见</div>
          <div v-if="editJson">
            <pc-form ref="newPeopleFrom" v-model="editData" :data="editJson">
              <template slot="infoSlot">
                <el-table :data="tableData" style="width: 100%">
                  <el-table-column label="序号" type="index" width="80px">
                  </el-table-column>
                  <el-table-column
                    label="发起人"
                    prop="originatorUserName"
                    show-overflow-tooltip
                  >
                  </el-table-column>
                  <el-table-column
                    label="审批人"
                    prop="userName"
                    show-overflow-tooltip
                  >
                  </el-table-column>
                  <el-table-column
                    label="审批结果"
                    prop="operationType"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">
                      {{ changeStatus(scope.row.operationType) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="审批意见"
                    prop="comment"
                    show-overflow-tooltip
                  >
                  </el-table-column>
                  <el-table-column
                    label="发起时间"
                    prop="startTime"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">
                      <span v-if="scope.row.startTime">
                        {{ awaySecond(scope.row.startTime) }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="完成时间"
                    prop="endTime"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">
                      <span v-if="scope.row.endTime">
                        {{ awaySecond(scope.row.endTime) }}
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
              <template v-if="procJsonDtoList" slot="apparovalSolt">
                <div style="margin: 20px 0">
                  <span class="approvalTitle">审批流</span>
                </div>
                <div style="margin-left: 20px">
                  <el-tag size="mini" type="info" effect="dark">待审批</el-tag>
                  <el-tag
                    size="mini"
                    type="warning"
                    effect="dark"
                    class="approval-span"
                  >
                    审批中
                  </el-tag>
                  <el-tag
                    size="mini"
                    type="success"
                    effect="dark"
                    class="approval-span"
                  >
                    通过
                  </el-tag>
                  <el-tag
                    size="mini"
                    type="danger"
                    effect="dark"
                    class="approval-span"
                  >
                    不通过
                  </el-tag>
                  <el-tag
                    size="mini"
                    effect="dark"
                    color=" #416ddd"
                    class="approval-span"
                  >
                    驳回
                  </el-tag>
                </div>
                <div style="padding: 40px 20px">
                  <div class="start-flow">
                    <span class="start-text">开始</span>
                    <div class="start-line"></div>
                  </div>
                  <div
                    v-for="(item, index) in procJsonDtoList"
                    :key="item.nodeId"
                    class="node-wrap"
                    style="margin-bottom: 43px"
                  >
                    <div class="node-wrap-box">
                      <div>
                        <div
                          class="title"
                          :style="titleStyleColor(item.status)"
                        >
                          <span v-if="item.nodeType == 'start'">发起人</span>
                          <span v-else class="editable-title">审批人</span>
                          <i
                            v-if="index != 0"
                            class="anticon anticon-close close"
                          ></i>
                        </div>
                        <el-tooltip
                          v-if="
                            item.actionerType == 'targetWorkFlowRole' || // eslint-disable-next-line prettier/prettier
                            item.actionerType == 'targetRole'
                          "
                          placement="top"
                        >
                          <div slot="content">{{ item.actionerUsersName }}</div>
                          <div class="content">
                            <div class="text">
                              {{ item.actionerUsers }}
                            </div>
                            <i class="anticon anticon-right arrow"></i>
                          </div>
                        </el-tooltip>
                        <div v-else class="content">
                          <div class="text" :title="item.actionerUsers">
                            {{ item.actionerUsers }}
                          </div>
                          <i class="anticon anticon-right arrow"></i>
                        </div>
                      </div>
                      <div class="add-node-btn-box">
                        <div class="add-node-btn"></div>
                      </div>
                      <div class="line"></div>
                    </div>
                  </div>
                  <div class="end-node">
                    <div class="end-node-text">流程结束</div>
                  </div>
                </div>
              </template>
            </pc-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="任务信息" name="second">
          <div class="tab-title">基础信息</div>
          <div v-if="editJson2">
            <pc-form ref="newFace" v-model="editData2" :data="editJson2">
              <template slot="imgHead">
                <span v-if="businessId" class="el-form-item">
                  <!-- 行人预约 -->
                  <visitor
                    v-if="
                      dataList.domainCode == 'reserveVisitorEx' ||
                      dataList.domainCode == 'reserveVehicleEx' ||
                      dataList.domainCode == 'reserveMachineEx'
                    "
                    :business-id="businessId"
                    :approval-type="checkApprovalType(dataList.domainCode)"
                  ></visitor>
                  <!--  中长期卡申请 -->
                  <card-apply
                    v-if="dataList.domainId == '9' || dataList.domainId == '12'"
                    :business-id="businessId"
                  ></card-apply>
                  <!--  中长期卡续期 -->
                  <card-renewal
                    v-if="
                      dataList.domainId == '10' || dataList.domainId == '13'
                    "
                    :business-id="businessId"
                  ></card-renewal>
                  <!-- 防爆卡详情 -->
                  <explosion-proof-card
                    v-if="dataList.domainId == '11'"
                    :business-id="businessId"
                  >
                  </explosion-proof-card>
                  <!-- 入驻审批详情 -->
                  <residence
                    v-if="dataList.domainId == '7'"
                    :business-id="businessId"
                  >
                  </residence>
                  <!-- 变更审批详情 -->
                  <change-approval
                    v-if="dataList.domainId == '8'"
                    :business-id="businessId"
                  >
                  </change-approval>
                </span>
              </template>
            </pc-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="design-form-wrap__btnwrap">
      <el-button v-if="!isCheck" type="primary" size="small" @click="checkNode">
        保存
      </el-button>
      <el-button size="small" @click="goBack">返回</el-button>
    </div>
    <select-approval-dialog
      ref="selectApprovalDialog"
      :next-task="nextTask"
      @addApproverSuccess="handleSubmit"
    />
  </div>
</template>
<script>
import selectApprovalDialog from "@/components/selectApprovalDialog";
// import { getProcessRoleList } from "@/api/approval/role-setting.js"; // 获取流程角色列表
import { newPeople, newFace } from "./jsonData.js";
import { getInstanceInfo, auditWorkflowTask } from "@/api/approval/apparoval";
// import { delete } from 'vue/types/umd';

const visitor = () => import("@/components/approvalBill/visitor/edit.vue");
const cardApply = () => import("@/components/approvalBill/card-apply/edit.vue");
const cardRenewal = () =>
  import("@/components/approvalBill/card-renewal/edit.vue");
const explosionProofCard = () =>
  import(
    "@/views/park-operation/location-card-manage/explosion-proof-card/edit.vue"
  );
const residence = () =>
  import("@/views/park-operation/contractor/registration/check.vue");
const changeApproval = () =>
  import("@/views/park-operation/contractor/change-approval/check.vue");
export default {
  components: {
    visitor, // 访客管理
    cardApply, // 中长期卡申请管理
    cardRenewal, // 中长期卡续期管理
    explosionProofCard, //防爆卡详情
    residence, //入驻审批详情
    changeApproval, //变更审批详情
    selectApprovalDialog, // 审批自由节点选择
  },
  props: {},
  data() {
    return {
      editData: {},
      titleStyleObj: {
        background: "#f90",
      },
      editJson: null,
      businessId: null,
      handleFlag: null,
      editData2: {},
      editJson2: null,
      activeName: "first",
      procJsonDtoList: [],
      isModify: false,
      isCheck: false,
      instanceId: null,
      check: false,
      isNoEdit: false,
      uploadVal: null,
      columns: [
        {
          prop: "originatorUserName",
          label: "发起人",
          width: 140,
        },

        {
          prop: "userName",
          label: "审批人",
          width: 100,
        },
        {
          prop: "operationType",
          label: "审批结果",
          formatter: (val) => {
            switch (val) {
              case 1:
                return "发起审批";
              case 2:
                return "撤回";
              case 3:
                return "审批通过";
              case 4:
                return "审批不通过";
              case 6:
                return "驳回";
              default:
                return "-";
            }
          },
        },
        {
          prop: "comment",
          label: "审批意见",
        },
        {
          prop: "startTime",
          label: "发起时间",
        },
        {
          prop: "endTime",
          label: "完成时间",
        },
      ],
      tableData: [], // 审批记录表格
      personTypeOptions: [],
      dataList: null,
      violationData: "", //隐患说明
      rectifyResult: "", //违规 整改说明
      rectifyResultFileIdArr: [], //违规 整改图片
      processExplain: "", //质量 整改说明
      rectificationPicArr: [], //质量 整改图片
      optionsList: [
        {
          value: 1,
          label: "通过",
        },
      ],
      nextTask: {}, // 自由节点
    };
  },
  computed: {
    titleStyleColor() {
      return (num) => {
        var statusStyle = {};
        switch (num) {
          case 1:
            statusStyle.background = "#909399";
            break;
          case 2:
            statusStyle.background = "#f90";
            break;
          case 3:
            statusStyle.background = "#67c23a";
            break;
          case 4:
            statusStyle.background = "#f56c6c";
            break;
          default:
            statusStyle.background = "#416ddd";
            break;
        }
        return statusStyle;
      };
    },
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
    checkApprovalType() {
      return (code) => {
        let approvalType = "";
        switch (code) {
          case "reserveVisitorEx":
            approvalType = "reserve";
            break;
          case "reserveVehicleEx":
            approvalType = "car";
            break;
          case "reserveMachineEx":
            approvalType = "equipment";
            break;
        }
        return approvalType;
      };
    },
  },
  watch: {},
  mounted() {},
  created() {
    // getProcessRoleList(this.$route.query.domainId).then((res) => {
    //   this.personTypeOptions = res.data;
    // });
    this.instanceId = this.$route.query.instanceId;
    this.isNoEdit = this.$route.query.isNoEdit;

    if (this.$route.query.instanceId) {
      this.getDetail();
    }
    if (this.$route.query.isModify) {
      this.isModify = true;
    }
    if (this.$route.query.detail) {
      // 是否查看结果 ，是则不发进行操作
      this.isCheck = true;
    }
    this.editJson2 = newFace(this.editData2);
  },
  methods: {
    // 获取详情信息
    async getDetail() {
      await getInstanceInfo(this.instanceId).then((res) => {
        const data = this.type.obj(res.data) ? res.data : {};
        this.dataList = data;
        this.procJsonDtoList = data.taskInfoList;
        this.tableData = data.taskHistoryList; // 审批记录表格
        this.businessId = data.externalBizId; // 审批对象ID
        // this.handleFlag = data.handleFlag;
        this.$forceUpdate();
        this.editData = {
          ...data,
        };
      });
      //
      if (this.editData.failFlag == 1) {
        this.optionsList.push({
          value: 2,
          label: "不通过",
        });
      }
      if (this.editData.rejectFlag == 1) {
        this.optionsList.push({
          value: 3,
          label: "驳回",
        });
      }
      this.editJson = newPeople(this.editData, this.isCheck, this.optionsList);
      // console.log(this.editJson, "this.editJson-");
    },
    // 返回上一层路由
    goBack() {
      this.$router.go(-1);
    },
    // 检测下一个节点是否为自定义节点
    checkNode() {
      this.$refs.newPeopleFrom.getData().then(() => {
        this.procJsonDtoList.forEach((item, idx) => {
          if (item.status == "2") {
            if (idx == this.procJsonDtoList.length - 1) {
              this.handleSubmit();
              return;
            }
            if (this.procJsonDtoList[idx + 1].approvalNodeType == "1") {
              this.nextTask = this.procJsonDtoList[idx + 1];
              this.$refs.selectApprovalDialog.dialogVisible = true;
            } else {
              this.handleSubmit();
            }
          }
        });
      });
    },
    // 提交
    handleSubmit() {
      this.$refs.newPeopleFrom
        .getData()
        .then((data) => {
          console.log(data);
          // return;
          let postData = {
            taskId: data.taskId,
            approvalFlag: true,
            comment: data.approvalOppion,
          };
          if (data.status == 1) {
            postData.approvalFlag = 3;
          } else if (data.status == 2) {
            postData.approvalFlag = 4;
          } else if (data.status == 3) {
            postData.approvalFlag = 6;
          }
          // console.log(postData, "提交的数据");
          // return;
          //  新增
          let fn = auditWorkflowTask;
          // return;
          fn(postData).then(() => {
            this.$message.success("保存成功");
            this.goBack();
          });
        })
        .catch(() => {
          // error
          this.$message.warning("审批意见不能为空");
        });
    },
  },
};
</script>
<!--声明语言，并且添加scoped-->
<style lang="scss" scoped>
// @import "~@/assets/styles/workflow.scss";

.node-wrap-box {
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  position: relative;
  width: 220px;
  min-height: 72px;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.node-wrap-box:after {
  pointer-events: none;
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  border-radius: 4px;
  border: 1px solid transparent;
  transition: all 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}

.node-wrap-box.active:after,
.node-wrap-box:active:after,
.node-wrap-box:hover:after {
  border: 1px solid #3296fa;
  box-shadow: 0 0 6px 0 rgba(50, 150, 250, 0.3);
}

.node-wrap-box.active .close,
.node-wrap-box:active .close,
.node-wrap-box:hover .close {
  display: block;
}

.node-wrap-box.error:after {
  border: 1px solid #f25643;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}

.node-wrap-box .title {
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 16px;
  padding-right: 30px;
  width: 100%;
  height: 37px;
  line-height: 37px;
  font-size: 12px;
  color: #fff;
  text-align: left;
  background: #576a95;
  border-radius: 4px 4px 0 0;
}

.node-wrap-box .title .iconfont {
  font-size: 12px;
  margin-right: 5px;
}

.node-wrap-box .placeholder {
  color: #bfbfbf;
}

.node-wrap-box .close {
  display: none;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  font-size: 14px;
  color: #fff;
  border-radius: 50%;
  text-align: center;
  line-height: 20px;
}

.node-wrap-box .content {
  position: relative;
  font-size: 14px;
  padding: 16px;
  padding-right: 30px;
  height: 42px;
}

.node-wrap-box .content .text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.node-wrap-box .content .arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 14px;
  font-size: 14px;
  color: #979797;
}

.start-node.node-wrap-box .content .text {
  display: block;
  white-space: nowrap;
}

.node-wrap-box:before {
  content: "";
  position: absolute;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  width: 0;
  height: 4px;
  border-style: solid;
  border-width: 8px 6px 4px;
  border-color: #cacaca transparent transparent;
  background: #f5f5f7;
}

.node-wrap-box.start-node:before {
  content: none;
}
.start-flow {
  width: 220px;
  height: 20px;
  position: relative;
  text-align: center;
  padding: 10px 0 50px;
  .start-text {
    position: absolute;
    font-size: 14px;
    top: -1px;
    left: 44%;
  }
  .start-line {
    display: inline-block;
    height: 30px;
    background: #ddd;
    width: 1px;
    position: absolute;
    bottom: 0px;
    left: 110px;
  }
  &::before {
    content: "";
    border-radius: 50%;
    background: #999;
    width: 10px;
    height: 10px;
    position: absolute;
    top: 20px;
    left: 111px;
    margin: 0 0 0 -6px;
  }
}
.end-node {
  width: 220px;
  text-align: center;
  position: relative;
  .end-node-text {
    position: absolute;
    top: 15px;
    left: 82px;
    font-size: 14px;
  }
  &::before {
    content: "";
    border-radius: 50%;
    background: #999;
    width: 10px;
    height: 10px;
    position: absolute;
    top: 1px;
    left: 111px;
    margin: 0 0 0 -6px;
  }
}

.action-btn {
  padding: 15px;
  // border-bottom: 10px solid #F6F6F6;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
}

.tab-title {
  font-size: 15px;
  border-left: 5px solid #416ddd;
  padding-left: 10px;
  margin: 20px 0;
}
::v-deep {
  .el-tabs {
    margin: 15px;
  }
  .el-tabs__nav-wrap::after {
    height: 1px;
  }
  .ty-radio {
    margin-top: -5px;
  }
  .formItem-head {
    font-size: 15px;
    border-left: 5px solid #416ddd;
    padding-left: 10px;
    margin: 20px 0;
  }
  .el-form-item .el-form-item {
    margin-bottom: 22px;
  }
}

.line {
  display: inline-block;
  height: 43px;
  background: #ddd;
  width: 1px;
  /* margin: auto; */
  position: absolute;
  bottom: -44px;
  left: 50%;
}
.approval-span {
  margin-left: 5px;
}
.design-form-wrap__btnwrap {
  border-top: 10px solid #dee2e8;
}
.approvalTitle {
  font-size: 15px;
  border-left: 5px solid #416ddd;
  padding-left: 10px;
  margin: 20px 0;
}
</style>
