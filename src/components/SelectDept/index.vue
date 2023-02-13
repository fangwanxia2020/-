<!--选人弹窗-->
<template>
  <div class="select-people">
    <!-- 为了让元素触发验证 -->
    <el-input v-show="false" v-model="updateVal" />
    <!-- 为了让元素触发验证 -->
    <template v-if="showValue">
      <el-tag
        v-for="tag in selectPeople"
        :key="tag[dialogId]"
        class="select-people-tag"
        closable
        @close="closeTagFun(tag)"
      >
        {{ tag.label }}
      </el-tag>
    </template>
    <el-button type="primary" :size="size" @click="openpeopleDialog">{{
      title
    }}</el-button>
    <!--选人面板-->
    <dept-dialog
      :show.sync="peopleDialogVisible"
      :data="selectPeople"
      :title="title"
      :multiple="multiple"
      :type="type"
      :contractor-id="contractorId"
      :check-dept-id="checkDeptId"
      :no-tree="noTree"
      @onOk="onOkFun"
    />
  </div>
</template>
<script>
import DeptDialog from "./DeptDialog";
export default {
  name: "select-dept",
  components: {
    DeptDialog,
  },
  props: {
    //安全责任制管理-考核管理-考核签约
    noTree: {
      type: Boolean,
      default: false,
    },
    //选中值
    value: {
      type: [String, Array],
    },
    //按钮文本和弹窗的标题
    title: {
      type: String,
      default: "选择人员",
    },
    //多选模式
    multiple: {
      type: Boolean,
      default: false,
    },
    //是否显示已选值
    showValue: {
      type: Boolean,
      default: true,
    },
    //是否显示tag
    showTag: {
      type: Boolean,
      default: true,
    },
    //类型
    type: {
      type: String,
      default: "dept",
    },
    //承包商id,当类型为contractor时生效
    contractorId: {
      type: [String, Number],
      default: "",
    },
    // 设置大小
    size: {
      type: String,
      default: "small",
    },
    // 在考核管理时使用,传入部门id筛选条件
    checkDeptId: {
      type: [String, Number],
      default: "",
    },
  },
  data() {
    let value = this.value || [];
    if (!this.multiple && value.length > 1) {
      value = [value[value.length - 1]];
    }
    if (!this.showValue) {
      value = [];
    }
    return {
      updateVal: new Date().getTime(),
      peopleDialogVisible: false, //选人弹窗
      selectPeople: value,
    };
  },
  computed: {
    dialogId() {
      let id = "id";
      switch (this.type) {
        case "dept":
          id = "id";
          break;
      }
      return id;
    },
  },
  watch: {
    value: {
      handler: function (val) {
        let value = val || [];
        if (!this.multiple && value.length > 1) {
          value = [value[value.length - 1]];
        }
        this.selectPeople = value;
      },
      deep: true,
    },
  },
  methods: {
    //打开选人
    openpeopleDialog() {
      this.peopleDialogVisible = true;
    },
    onOkFun(val) {
      if (this.showValue) {
        this.selectPeople = val;
      }
      this.updateVal = new Date().getTime();
      this.$emit("input", this.selectPeople);
      this.$emit("onOk", val);
    },
    //删掉tag
    closeTagFun(tag) {
      // console.log(this.selectPeople, this.dialogId, tag);
      this.selectPeople = this.selectPeople.filter(
        (item) => item[this.dialogId] != tag[this.dialogId],
      );
      this.$emit("input", this.selectPeople);
    },
  },
};
</script>

<style scoped lang="scss">
.select-people {
  ::v-deep .el-tag {
    margin: 0 10px 10px 0;
  }
}
</style>
