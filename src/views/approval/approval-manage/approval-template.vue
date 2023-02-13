<template>
  <div>
    <div v-if="!isSaw" class="fd-nav">
      <div class="fd-nav-left">
        <div class="fd-nav-back" @click="toReturn">
          <i class="anticon anticon-left"></i>
        </div>
        <div class="fd-nav-title">流程配置</div>
      </div>
      <div class="fd-nav-right">
        <button type="button" class="ant-btn button-publish" @click="saveSet">
          保存
        </button>
      </div>
    </div>
    <div :class="{ 'fd-nav-content': true, isSaw }">
      <div v-if="!isSaw" class="dingflow-left">
        <h1 class="tit">模板信息</h1>
        <div class="dingflow-left-ctn">
          模板名称：<el-input v-model="procName" placeholder="请输入内容" />
          <ul>
            <li>
              是否启用：<el-switch
                v-model="deployFlag"
                :active-value="1"
                :inactive-value="0"
              >
              </el-switch>
            </li>
            <li>所在功能：{{ processConfig.domainName }}</li>
            <li v-if="processConfig.createTime">
              创建时间：{{ processConfig.createTime }}
            </li>
            <li v-if="processConfig.updateTime">
              修改时间：{{ processConfig.updateTime }}
            </li>
          </ul>
        </div>
      </div>
      <section class="dingflow-design">
        <div v-if="!isSaw" class="zoom">
          <div
            :class="{ 'zoom-out': true, disabled: nowVal == 50 }"
            @click="zoomSize(1)"
          ></div>
          <span>{{ nowVal }}%</span>
          <div
            :class="{ 'zoom-in': true, disabled: nowVal == 300 }"
            @click="zoomSize(2)"
          ></div>
        </div>
        <div
          id="box-scale"
          class="box-scale"
          :style="
            'transform: scale(' +
            nowVal / 100 +
            '); transform-origin: 50% 0px 0px;'
          "
        >
          <nodeWrap
            :is-saw="isSaw"
            :node-config.sync="nodeConfig"
            :flow-permission.sync="flowPermission"
            :is-tried.sync="isTried"
            :director-max-level="directorMaxLevel"
            :table-id="tableId"
            :node-num="0"
            :all-node="nodeConfig"
          ></nodeWrap>
          <div class="end-node">
            <div class="end-node-circle"></div>
            <div class="end-node-text">流程结束</div>
          </div>
        </div>
      </section>
    </div>
    <el-dialog title="提示" :visible.sync="tipVisible">
      <div class="ant-confirm-body">
        <i class="anticon anticon-close-circle" style="color: #f00"></i>
        <span class="ant-confirm-title">当前无法发布</span>
        <div class="ant-confirm-content">
          <div>
            <p class="error-modal-desc">以下内容不完善，需进行修改</p>
            <div class="error-modal-list">
              <div
                v-for="(item, index) in tipList"
                :key="index"
                class="error-modal-item"
              >
                <div class="error-modal-item-label">流程设计</div>
                <div class="error-modal-item-content">
                  {{ item.name }} 未选择{{ item.type }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tipVisible = false">我知道了</el-button>
        <el-button type="primary" @click="tipVisible = false">
          前往修改
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { defineFlowInfo, getFlowDefine } from "@/api/approval/template";
import { getDomainInfo } from "@/api/approval/field-manage";
import jsonData from "./data.json";
export default {
  components: {},
  props: {
    //是否查看模式
    isSaw: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isTried: false,
      tipList: [],
      tipVisible: false,
      nowVal: 100,
      processConfig: {},
      nodeConfig: {},
      procName: "",
      deployFlag: 0, //启用开关
      flowPermission: [],
      directorMaxLevel: 0,
      dialogVisible: true,
      tableId: "",
      hasApproval: false, //是否已经有审批节点
    };
  },
  watch: {
    // 监听发起人节点修改，解决nodeConfig修改，processConfig里的没进行修改问题
    nodeConfig: {
      handler(val) {
        this.processConfig.nodeConfig = val;
      },
      deep: true,
    },
  },
  created() {
    const { defineId, domainId } = this.$route.query;
    if (defineId) {
      //编辑
      getFlowDefine(defineId).then((res) => {
        this.initDataFun(res.data);
      });
    } else {
      //新增
      getDomainInfo(domainId).then((res) => {
        jsonData.data.domainName = res.data.domainName;
        const vv = JSON.parse(JSON.stringify(jsonData.data)); //为了解决新建的时候不会清空数据的问题
        this.initDataFun(vv);
      });
    }
  },
  methods: {
    initDataFun(data) {
      this.processConfig = data;
      this.nodeConfig = this.processConfig.nodeConfig;
      this.flowPermission = this.processConfig.flowPermission;
      this.directorMaxLevel = this.processConfig.directorMaxLevel;
      this.procName = this.processConfig.procName;
      this.deployFlag = this.processConfig.deployFlag || 0;
      this.tableId = this.processConfig.tableId;
    },
    toReturn() {
      this.$router.go(-1);
    },
    reErr(data) {
      if (data.childNode) {
        if (data.childNode.type == "approver") {
          //审批人
          this.hasApproval = true;
          if (data.childNode.error) {
            this.tipList.push({
              name: data.childNode.name,
              type: "审核人",
            });
          }
          this.reErr(data.childNode);
        } else if (data.childNode.type == "notifier") {
          if (data.childNode.error) {
            this.tipList.push({
              name: data.childNode.name,
              type: "抄送人",
            });
          }
          this.reErr(data.childNode);
        } else if (data.childNode.type == "condition") {
          this.reErr(data.childNode.childNode);
        } else if (data.childNode.type == "route") {
          this.reErr(data.childNode);
          for (var i = 0; i < data.childNode.conditionNodes.length; i++) {
            if (data.childNode.conditionNodes[i].error) {
              this.tipList.push({
                name: data.childNode.conditionNodes[i].name,
                type: "条件",
              });
            }
            this.reErr(data.childNode.conditionNodes[i]);
          }
        }
      } else {
        data.childNode = null;
      }
    },
    saveSet() {
      this.hasApproval = false;
      if (!this.procName) {
        this.$message.error("模板名称不能为空！");
        return;
      }
      this.isTried = true;
      this.tipList = [];
      this.reErr(this.nodeConfig);
      //如果只有发起人节点也不允许保存
      if (!this.hasApproval) {
        this.$message.error("请添加审批节点！");
        return;
      }
      if (this.tipList.length != 0) {
        this.tipVisible = true;
        return;
      }
      if (!this.processConfig.domainId) {
        this.processConfig.domainId = this.$route.query.domainId;
      }
      this.processConfig.flowPermission = this.flowPermission;
      this.processConfig.procName = this.procName;
      this.processConfig.deployFlag = this.deployFlag;
      // console.log(this.processConfig, "保存的数据");
      // return;
      defineFlowInfo(this.processConfig).then(() => {
        this.$message.success("设置成功");
        setTimeout(() => {
          this.$router.push({
            path: "/gatedpark/approval/approval-setting",
            query: {
              domainId: this.$route.query.domainId,
            },
          });
        }, 200);
      });
    },
    zoomSize(type) {
      if (type == 1) {
        if (this.nowVal == 50) {
          return;
        }
        this.nowVal -= 10;
      } else {
        if (this.nowVal == 300) {
          return;
        }
        this.nowVal += 10;
      }
    },
  },
};
</script>

<style lang="scss">
@import "~@/assets/styles/workflow.scss";

.error-modal-list {
  width: 455px;
}

/*查看模式下 */
.fd-nav-content.isSaw {
  position: static;

  .dingflow-design {
    position: static;
  }

  .add-node-btn-box {
    height: 30px;

    .add-node-btn {
      display: none;
    }
  }
}
</style>
