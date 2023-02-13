<template>
  <div>
    <el-button type="primary" size="mini" @click="handleClick">上传</el-button>
    <!-- 文件上传 隐藏作用域 -->
    <input
      v-show="false"
      ref="theFile"
      type="file"
      :accept="accept"
      @change="handleUpload"
    />
  </div>
</template>

<script>
import { fileUpload } from "@/api/system/file.js";
export default {
  props: {
    filesList: {
      type: Array,
      default: () => [],
    },
    accept: {
      type: String,
      default: "",
    },
    beforeUpload: {
      type: Function,
      default: () => {
        return true;
      },
    },
  },
  data() {
    return {
      cacheData: [],
    };
  },
  watch: {
    filesList: {
      handler(arr) {
        this.cacheData = arr;
      },
      immediate: true,
    },
  },
  methods: {
    // 上传
    handleClick() {
      this.$refs.theFile.click();
    },
    // 获取上传的文件内容
    handleUpload(event) {
      const beforStatus = this.beforeUpload(event.target.files[0]);
      if (!event.target.files.length) return;
      if (!beforStatus) return;
      let params = new FormData();
      params.append("file", event.target.files[0]);

      fileUpload(params).then((res) => {
        this.cacheData.push(res.data);
        this.$emit("update:filesList", this.cacheData);
      });
    },
  },
};
</script>
