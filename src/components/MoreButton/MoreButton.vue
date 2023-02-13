<template>
  <div class="more-button">
    <el-button
      class="button-group"
      type="primary"
      size="small"
      @click="switchBtn"
      >
      更多
      <i :class="[getIcon, 'el-icon--right'] "></i>
      </el-button>
    <div class="draw-down" v-if="isShowMore">
      <el-button
        v-for="v in btnOptions"
        :key="v.btnName"
        :size="v.buttonSize"
        type="primary"
        :icon="v.icon"
        @click="$emit('itemClick',v.btnName)">
        {{v.btnName}}
      </el-button>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "MoreButton",
  props: {
    // 操作按钮数组
    btnOptions: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 是否显示更多
    isShowMore: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    getIcon() {
      return this.isShowMore ? 'el-icon-arrow-up' :  'el-icon-arrow-down'
    }
  },
  methods: {
    switchBtn() {
      this.$emit('update:isShowMore', !this.isShowMore);
    }
  }

}
</script>

<style lang="scss" scoped>
  ::v-deep .el-button--small {
      min-width: 80px;
  }
.more-button {
  ::v-deep .el-button + .el-button {
    margin: 5px 0 0;
  }
  .button-group {
    background-color: #fff;
    color: #419EFF;
    font-size: 14px;
    font-weight: 400;
    border: 0;
  }
  margin-left: 10px;
  width: fit-content;
  position: relative;
  display: inline-block;
  .draw-down {
    padding: 15px;
    position: absolute;
    top: 39px;
    right: 0;
    z-index: 66;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: #fff;
    border-radius: 2px;
    border: 1px solid #dcdcdc;
  }
}
</style>
