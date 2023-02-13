<template>
  <div>
    <div :class="['item-line', { 'flex-align-items': !allowUpdate }]">
      <div v-if="label" class="item-label" :style="labelStyle">
        <div>
          <em v-if="!allowNull">*</em>
          <span>{{ `${label}：` }}</span>
        </div>
        <slot name="label"></slot>
      </div>
      <template>
        <ty-upload-file
          v-model="file"
          v-hideBtn="allowUpdate"
          :style="uploadFileStyle"
          class="upload-file"
          width="none"
          :upload-file-text="uploadFileText"
          :action="action"
          res-format="data"
          @change="handleImport"
        >
          <span
            v-if="isShowPreview"
            slot="fileOperator"
            slot-scope="{ data }"
            class="fileOp"
            @click="previewFile(data.url)"
          >预览</span>
        </ty-upload-file>
      </template>
    </div>
    <p class="limit-world" :style="{ marginLeft: labelStyle.width }">
      <span>{{ formErrorMsg ? formatError(formErrorMsg, "选择") : "" }}</span>
    </p>
  </div>
</template>

<script>
import validatorUtils from "@/assets/js/validator";
import secondCtlMixins from "@/assets/js/mixins/secondCtlMixins";

export default {
  directives: {
    hideBtn: {
      update(el, binding) {
        if (el.firstChild && !binding.value) {
          el.firstChild.style.display = "none";
        }
      },
    },
  },
  mixins: [secondCtlMixins],
  props: {
    // 上传按钮样式
    uploadFileStyle: {
      type: Object,
      default: () => {},
    },
    // 上传按钮文本
    uploadFileText: {
      type: String,
      default: "上传文件",
    },
    // 上传url地址
    action: {
      type: String,
      default: "/file/file/upload",
    },
    //是否显示预览插槽
    isShowPreview: {
      type: Boolean,
      default: true,
    },
    //值
    value: [],
    //错误提示
    formErrorMsg: {
      type: [String, Boolean],
      default: "",
    },
    //校验方法
    validate: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      file: [],
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.file = val;
        if (Array.isArray(val) && val.length) {
          if (!this.$isEmptyObj(this.validate)) {
            validatorUtils
              .validateData({ key: this.value }, { key: this.validate })
              .then((err) => {
                this.$emit("update:formErrorMsg", err ? err[0].message : "");
              });
          }
        }
      },
    },
  },
  methods: {
    handleImport(data) {
      const value = data.value;
      this.$emit("input", value);
      this.$emit("change");
    },
    /**
     * 错误提示
     * @param data
     * @param words
     * @returns {*}
     */
    formatError(data, words = "上传") {
      if (!data) {
        return this.removeColon(`请${words}${this.label}`);
      } else {
        return this.removeColon(`${data}${this.label}`);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/controlList/controlList.scss";
::v-deep .ty-upload-file {
  height: fit-content;
  .el-upload {
    .el-button {
      width: 100px;
      height: 36px;
      background: #026dff;
      border-radius: 4px;
    }
  }
}
.item-line {
  position: relative;
  flex-wrap: wrap;
  display: flex;
  &.flex-align-items {
    align-items: flex-start;
  }
  .item-label {
    height: 36px;
    line-height: 42px;
    padding-right: 10px;
    text-align: right;
    font-size: 14px;
    color: #868a97;
    em {
      padding-left: 4px;
      color: #f56c6c;
      font-size: 14px;
    }
  }
}
.limit-world {
  height: 22px;
  line-height: 22px;
  width: 230px;
  text-align: right;
  color: #ccc;
  margin: 0px;
  font-size: 12px;
  // position: absolute;
  bottom: -17px;
  span {
    float: left;
    // margin-right: .16rem;
    color: #f00;
  }
}
</style>
