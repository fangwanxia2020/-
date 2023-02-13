<template>
  <div @click.stop>
    <el-upload
      ref="fileupload"
      class="uploader"
      :headers="headers"
      :action="baseUrl + action"
      :auto-upload="true"
      :file-list="imgsList"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :limit="limit"
      :accept="accept"
      :class="isShow ? 'abc' : ''"
      multiple
      :before-upload="handleBefore"
      :on-exceed="handleExceed"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      :disabled="isCheck"
    >
      <i class="el-icon-plus"></i>
      <div v-if="tip" slot="tip" class="el-upload__tip">
        <p class="lh14">1.格式:png,bmp,jpeg,jpg;</p>
        <p class="lh14">2.大小:小于或等于2M;</p>
        <p class="lh14">3.数量:图片最多上传：{{ limit }}张；</p>
        <p v-if="threeTips" class="lh14">
          三证指：生产许可证、产品合格证、安全技术监督合格证；
        </p>
        <slot name=""></slot>
      </div>
    </el-upload>
    <ViewImage
      v-if="dialogVisible"
      style="width: 100%; height: 100%"
      :on-close="handleCloseViewer"
      :url-list="[dialogImageUrl]"
    >
    </ViewImage>
  </div>
</template>
<script>
import baseUrl from "../../../env.js";
import ViewImage from "@/components/viewImage/index.vue";
import { getToken } from "ty-pc/lib/utils/auth";
export default {
  components: { ViewImage },
  props: {
    tip: {
      type: Boolean,
      default: false,
    },
    isShow: {
      type: Boolean,
      default: false,
    },
    limit: {
      type: Number,
      default: 9,
    },
    accept: {
      type: String,
      default: ".JPEG, .JPG, .PNG, .BMP, .bmp",
    },
    imgsList: {
      type: Array,
      default: () => [],
    },
    threeTips: {
      type: Boolean,
      default: false,
    },
    isCheck: {
      type: Boolean,
      default: false,
    },
    action: {
      type: String,
      default: "/api/sysfile/file_info/upload",
    },
  },
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: "",
      headers: { Authorization: getToken() },
      baseUrl,
    };
  },
  methods: {
    handleBefore(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.warning("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    handleExceed() {
      this.$message.warning(`最多上传${this.limit}张图片`);
    },
    handleSuccess(res, file, fileList) {
      this.$emit("update:imgsList", fileList);
    },
    handleRemove(file, fileList) {
      this.$emit("update:imgsList", fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogVisible = true;
      this.dialogImageUrl = file.url;
    },
    // 人脸照片 - 关闭预览
    handleCloseViewer() {
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
/*去除upload组件过渡效果*/
.el-upload-list__item {
  transition: none !important;
}
.el-upload__tip {
  font-size: 14px !important;
  color: #909399 !important;
  line-height: 10px;
}
.uploader {
  /deep/ .el-upload--picture-card {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }
  /deep/ .el-upload-list--picture-card .el-upload-list__item {
    width: 100px;
    height: 100px;
  }
}
.abc {
  /deep/ .el-upload--picture-card {
    display: none !important;
  }
}
</style>
