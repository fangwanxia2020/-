<template>
  <el-popover v-model="visible" :placement="placement" :width="width">
    <div class="content">
      确定要删除<span class="highlight-text">“ {{ valText }} ”</span>的数据吗？
    </div>
    <div class="delbtn">
      <div class="del-popcancel" @click="visible = false">取消</div>
      <div class="del-popsubmit" @click="submitMethods">确定</div>
    </div>
    <el-button slot="reference" type="text" :size="size">删除</el-button>
  </el-popover>
</template>
<script>
export default {
  props: {
    popoverVisible: {
      type: Boolean,
      default: false,
    },
    // 传入每行的数据
    valText: {
      type: String,
      default: "当前",
    },
    // 宽度设置
    width: {
      type: String || Number,
      default: "400",
    },
    // 放置位置
    placement: {
      type: String,
      default: "top",
    },
    size: {
      type: String,
      default: "small",
    },
  },
  data() {
    return {
      visible: this.popoverVisible || false,
    };
  },
  methods: {
    // 删除事件
    submitMethods() {
      this.visible = false;
      this.$emit("submitFun");
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  color: #333333;
  font-size: 14px;
  padding: 20px 30px;
  text-align: center;
  .highlight-text {
    color: #026dff;
  }
}

.delbtn {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 40px;
  margin-bottom: 20px;
  .del-popcancel {
    width: 100px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 3px;
    background: #f2f3f5;
    color: #333333;
    font-size: 14px;
    cursor: pointer;
    margin-right: 10px;
  }
  .del-popsubmit {
    width: 100px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 3px;
    background: #eb4747;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
  }
}
</style>
