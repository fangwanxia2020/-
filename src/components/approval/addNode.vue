<template>
  <div class="add-node-btn-box">
    <div class="add-node-btn">
      <slot></slot>
      <el-popover v-model="visible" placement="right-start">
        <div class="add-node-popover-body">
          <a class="add-node-popover-item approver" @click="addType(1)">
            <div class="item-wrapper">
              <span class="iconfont"></span>
            </div>
            <p>审批人</p>
          </a>
          <a class="add-node-popover-item condition" @click="addType(4)">
            <div class="item-wrapper">
              <span class="iconfont"></span>
            </div>
            <p>条件分支</p>
          </a>
        </div>
        <button slot="reference" class="btn" type="button">
          <span class="iconfont"></span>
        </button>
      </el-popover>
    </div>
  </div>
</template>
<script>
export default {
  props: ["childNodeP", "prevObject"],
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    //0:start、1:approver、3:condition、4:route（路由节点）、2:notifier（抄送节点）、end
    addType(type) {
      this.visible = false;
      const nodeId = new Date().getTime().toString(); //生成一个唯一的id
      const prevId = (this.prevObject || {}).nodeId;
      if (type != 4) {
        var data;
        if (type == 1) {
          data = {
            nodeId,
            prevId,
            name: "审核人",
            error: true,
            type: "approver",
            selectMode: 0,
            selectRange: 0,
            directorLevel: 1,
            replaceByUp: 0,
            examineEndDirectorLevel: 0,
            childNode: this.childNodeP,
            properties: {
              activateType: "OR",
              actionerType: "targetUserId",
              agreeAll: true,
              nodeUserList: [],
              nodeDeptList: [],
              nodeRoleList: [],
              workFlowRoleList: [],
              noneActionerAction: "admin",
            },
          };
        } else if (type == 2) {
          data = {
            nodeId,
            prevId,
            name: "抄送人",
            type: "notifier",
            ccSelfSelectFlag: 1,
            childNode: this.childNodeP,
            properties: {
              actionerType: "targetUserId",
              nodeUserList: [],
            },
          };
        }
        this.$emit("update:childNodeP", data);
      } else {
        this.$emit("update:childNodeP", {
          nodeId,
          prevId,
          name: "路由",
          type: "route",
          childNode: null,
          conditionNodes: [
            {
              nodeId: nodeId + "_1",
              prevId,
              name: "条件1",
              error: true,
              type: "condition",
              priorityLevel: 1,
              childNode: this.childNodeP,
              properties: {
                nodeUserList: [],
                conditions: [],
              },
            },
            {
              nodeId: nodeId + "_1",
              prevId,
              name: "条件2",
              type: "condition",
              priorityLevel: 2,
              childNode: null,
              properties: {
                nodeUserList: [],
                conditions: [],
              },
            },
          ],
          properties: {},
        });
      }
    },
  },
};
</script>
