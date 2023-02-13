<template>
  <el-dialog
    title="选择审核人"
    :visible.sync="dialogVisible"
    width="500px"
    :append-to-body="true"
    destroy-on-close
  >
    <div class="approver_content">
      <el-radio-group
        v-model="approverConfig.actionerType"
        class="clear"
        style="width: 100%"
        @change="changeType"
      >
        <el-radio label="targetUserId">指定成员</el-radio>
        <el-radio label="targetDept">指定部门</el-radio>
        <el-radio label="targetRole">指定角色</el-radio>
      </el-radio-group>
      <select-people
        v-if="approverConfig.actionerType == 'targetUserId'"
        v-model="approverConfig.nodeUserList"
        title="添加/修改审批人"
        multiple
        :show-value="true"
      />
      <select-dept
        v-if="approverConfig.actionerType == 'targetDept'"
        v-model="approverConfig.nodeDeptList"
        title="添加/修改部门"
        multiple
        :show-value="true"
      />
      <select-people
        v-if="approverConfig.actionerType == 'targetRole'"
        v-model="approverConfig.nodeRoleList"
        type="role"
        multiple
        title="添加/修改角色"
        :show-value="true"
      />
    </div>
    <div v-if="showMultipleApproval" class="approver_some">
      <p>多人审批时采用的审批方式</p>
      <el-radio-group v-model="approverConfig.activateType" class="clear">
        <el-radio
          v-if="approverConfig.actionerType == 'targetUserId'"
          label="ONE_BY_ONE"
        >
          依次审批
        </el-radio>
        <br />
        <el-radio label="AND">会签（所有人同意）</el-radio>
        <br />
        <el-radio label="OR">或签（一名审批人同意或拒绝即可）</el-radio>
      </el-radio-group>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button class="cancelButton" @click="dialogVisible = false">
        取消
      </el-button>
      <el-button
        class="confirmButton"
        type="primary"
        @click="saveApprovalSelect"
      >
        确定
      </el-button>
    </span>
  </el-dialog>
</template>
<script>
import SelectPeople from "@/components/SelectPeople";
import SelectDept from "@/components/SelectDept";
import { Message } from "element-ui";
import { updataTaslFree } from "@/api/approval/apparoval";
export default {
  components: {
    SelectPeople,
    SelectDept,
  },
  props: {
    nextTask: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      dialogVisible: false,
      approverConfig: {
        actionerType: "targetUserId",
        nodeUserList: [],
        nodeDeptList: [],
        nodeRoleList: [],
        activateType: "OR",
        taskId: "",
        instanceId: "",
      },
    };
  },
  computed: {
    showMultipleApproval() {
      const { actionerType, nodeUserList, nodeDeptList, nodeRoleList } =
        this.approverConfig;
      switch (actionerType) {
        case "targetUserId":
          return Boolean(nodeUserList && nodeUserList.length > 1);
        case "targetDept":
          return Boolean(nodeDeptList && nodeDeptList.length > 1);
        case "targetRole":
          return Boolean(nodeRoleList && nodeRoleList.length > 1);
        default:
          return false;
      }
    },
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.approverConfig = {
          actionerType: "targetUserId",
          nodeUserList: [],
          nodeDeptList: [],
          nodeRoleList: [],
          activateType: "OR",
          taskId: "",
          instanceId: "",
        };
      }
    },
  },
  methods: {
    changeType(val) {
      this.approverConfig.nodeUserList = [];
      this.approverConfig.nodeDeptList = [];
      this.approverConfig.nodeRoleList = [];
      this.approverConfig.activateType = val === "targetUserId" ? "OR" : "AND";
    },
    saveApprovalSelect() {
      const { nodeUserList, nodeDeptList, nodeRoleList, activateType } =
        this.approverConfig;
      const { taskId, instanceId } = this.nextTask;
      if (nodeUserList.length || nodeDeptList.length || nodeRoleList.length) {
        console.log(this.approverConfig);
        console.log(this.nextTask);
        // return;
        const postData = {
          instanceId,
          taskId,
          actionType: activateType,
          userList: nodeUserList,
          roleList: nodeRoleList,
          deptList: nodeDeptList,
        };
        // 如果选中的是系统用户，单独处理（后端不想把整个人员对象塞给他）
        if (nodeUserList.length) {
          console.log(nodeUserList, "nodeUserList");
          postData.userList = [];
          nodeUserList.forEach((item) => {
            postData.userList.push({
              personBaseId: item.personBaseId,
              name: item.name,
            });
          });
        }
        console.log(
          "🚀 ~ file: selectApprovalDialog.vue ~ line 139 ~ saveApprovalSelect ~ postData",
          postData,
        );
        // return;
        updataTaslFree(postData).then((res) => {
          if (res.code == 200) {
            this.$emit("addApproverSuccess");
            this.dialogVisible = false;
          }
        });
      } else {
        return Message.warning("请选择审核人");
      }
    },
  },
};
</script>
