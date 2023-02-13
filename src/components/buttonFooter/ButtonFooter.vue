<template>
  <div class="button-container design-form-wrap__btnwrap">
    <el-button
      v-if="showBackup"
      :class="['primary']"
      :disabled="disabledBackup"
      @click="$emit('backup')"
    >{{ backupText }}</el-button>
    <el-button
      v-if="showConfirm"
      :class="[showBackup ? 'default' : 'primary']"
      :loading="confirmLoading"
      :disabled="disabledConfirm"
      @click="$emit('confirm')"
      >{{ confirmText }}</el-button>
    <el-button
      v-if="showCancel"
      :class="[!showConfirm && !showBackup ? 'primary' : 'default']"
      @click="$emit('cancel')"
    >{{ cancelText }}</el-button>
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "button-footer",
  props: {
    //是否显示保存按钮
    showConfirm: {
      type: Boolean,
      default: true
    },
    //是否显示取消按钮
    showCancel: {
      type: Boolean,
      default: true
    },
    //保存按钮文案
    confirmText: {
      type: String,
      default: '保存'
    },
    //取消按钮文案
    cancelText: {
      type: String,
      default: '返回'
    },
    //保存按钮是否loading
    confirmLoading: {
      type: Boolean,
      default: false
    },
    //是否显示备用按钮
    showBackup: {
      type: Boolean,
      default: false
    },
    //备用按钮按钮文案
    backupText: {
      type: String,
      default: '备用按钮'
    },
    //是否禁用保存按钮
    disabledConfirm: {
      type: Boolean,
      default: false
    },
    //是否禁用备用按钮
    disabledBackup: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="scss">
@import "~@/assets/styles/public.scss";

.button-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 86px;
  background-color: $white;
  z-index: 1;
  &.design-form-wrap__btnwrap {
    border-top: 0;
    border-bottom: 10px solid #f6f6f6;
  }
  .el-button {
    box-sizing: border-box;
    &.default {
      width: 100px;
      height: 36px;
      border-radius: 4px;
      border: 1px solid $color-dominant;
      padding: 0;
      color: $color-dominant;
      &:active::before {
        opacity: 0;
      }
    }
    &.primary {
      color: $white;
      width: 100px;
      height: 36px;
      background: $color-dominant;
      border-radius: 4px;
      padding: 0;
      border: 0;
    }
  }
}
</style>
