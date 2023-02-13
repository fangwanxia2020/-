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
      <template v-if="file.length > 0">
        <ty-upload
          v-model="file"
          v-hideBtn="allowUpdate"
          :style="uploadFileStyle"
          :action="action"
          res-format="data"
          :multiple="multiple"
          :width="width"
          :height="height"
          :length="length"
          :disabled="!allowUpdate"
        ></ty-upload>
      </template>
      <div v-else style="padding-top: 12px; font-size: 14px">暂无</div>
    </div>
    <p class="limit-world" :style="{ marginLeft: labelStyle.width }">
      <span>{{ formErrorMsg ? formatError(formErrorMsg, "选择") : "" }}</span>
    </p>
  </div>
</template>

<script>
import validatorUtils from "@/assets/js/validator";
import secondCtlMixins from "@/assets/js/mixins/secondCtlMixins";
import { number } from "echarts";

export default {
  directives: {
    hideBtn: {
      update(el, binding) {
        if (el.firstChild && !binding.value) {
          document.getElementsByClassName("forbid")[0].style.display = "none";
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
    // 上传url地址
    action: {
      type: String,
      default: "/file/file/upload",
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    width: {
      type: Number,
      default: 100,
    },
    height: {
      type: Number,
      default: 100,
    },
    length: {
      type: Number,
      default: 1,
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
      const { value } = data.value;
      this.$emit("update:value", value);
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
