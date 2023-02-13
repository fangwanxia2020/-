<template>
  <div class="uploader">
    <div v-show="videoArr.length > 0" style="display: flex; flex-wrap: wrap">
      <div
        v-for="(item, index) in videoArr"
        :key="index"
        class="uploader-video-item"
        :style="{ width: width, height: height }"
      >
        <div v-if="!disabled" class="del" @click="deleteVideo(item)">
          <div class="del-icon">x</div>
        </div>
        <video :src="item.url" controls="controls">
          您的浏览器不支持视频播放
        </video>
      </div>
    </div>
    <el-upload
      class="uploader-image"
      :action="baseUrl + action"
      :headers="getHeader"
      :name="name"
      :limit="imgLimit"
      :file-list="imgArr"
      :disabled="disabled"
      :multiple="multiple"
      accept=".JPG, .PNG, .JPEG,.jpg, .png, .jpeg"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-success="handlePictureSuccess"
      :on-remove="handlePictureRemove"
    >
      <i class="el-icon-plus"></i>
      <el-upload
        v-show="videoArr.length < videoLimit"
        slot="tip"
        class="uploader-video"
        :style="{ width: width, height: height }"
        :action="baseUrl + action"
        :headers="getHeader"
        :name="name"
        :disabled="disabled"
        :on-progress="uploadVideoProcess"
        :on-success="handleVideoSuccess"
        :before-upload="beforeUploadVideo"
        :show-file-list="false"
      >
        <el-button
          v-if="!videoFlag"
          :style="{ width: width, height: height }"
          class="uploader-video-button"
        >
          <i class="el-icon-video-camera uploader-video-button-icon"></i>
        </el-button>
        <el-progress
          v-if="videoFlag == true"
          type="circle"
          :percentage="videoUploadPercent"
          style="margin-top: 7px"
        ></el-progress>
      </el-upload>
    </el-upload>
    <el-dialog v-dialogDrag :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "ty-pc/lib/utils/auth";
export default {
  props: {
    action: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: "file",
    },
    imgFileList: {
      type: Array,
      default: () => [],
    },
    videoFileList: {
      type: Array,
      default: () => [],
    },
    imgLimit: {
      type: Number,
      default: 8,
    },
    videoLimit: {
      type: Number,
      default: 8,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    width: {
      type: String,
      default: "100px",
    },
    height: {
      type: String,
      default: "100px",
    },
  },
  data() {
    return {
      imgArr: [],
      videoArr: [],
      dialogImageUrl: "",
      dialogVisible: false,
      videoFlag: false,
      //是否显示进度条
      videoUploadPercent: 0,
      //进度条的进度，
      isShowUploadVideo: false,
      //显示上传按钮
      videoForm: {
        showVideoPath: "",
      },
    };
  },
  computed: {
    getHeader() {
      const token = getToken() || "";
      let itemId = window.name;
      return {
        Authorization: token,
        itemId,
      };
    },
  },
  watch: {
    // 监听文件列表的变化，重新整理内部数据
    imgFileList: {
      immediate: true,
      handler() {
        const { imgFileList = [] } = this;
        this.imgArr = imgFileList;
      },
    },
    videoFileList: {
      immediate: true,
      handler() {
        const { videoFileList = [] } = this;
        this.videoArr = videoFileList;
      },
    },
  },
  mounted() {
    console.log(this.baseUrl);
  },
  methods: {
    //图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //图片删除
    handlePictureRemove(file, fileList) {
      this.$emit("deleteImage", file);
    },
    handlePictureSuccess(res, file) {
      this.$emit("uploadSuccess", res);
    },
    deleteVideo(file) {
      this.$emit("deleteVideo", file);
    },
    //上传前回调
    beforeUploadVideo(file) {
      if (
        [
          "video/mp4",
          "video/ogg",
          "video/flv",
          "video/avi",
          "video/wmv",
          "video/rmvb",
          "video/mov",
        ].indexOf(file.type) == -1
      ) {
        this.$message.error("请上传正确的视频格式");
        return false;
      }
      this.isShowUploadVideo = false;
    },
    //进度条
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true;
      this.videoUploadPercent = file.percentage.toFixed(0) * 1;
    },
    //上传成功回调
    handleVideoSuccess(res, file) {
      this.isShowUploadVideo = true;
      this.videoFlag = false;
      this.videoUploadPercent = 0;

      if (res.code == 200) {
        this.videoForm.showVideoPath = res.data.url;
        this.$emit("uploadSuccess", res);
      } else {
        this.$message.error(res.msg);
      }
    },
  },
};
</script>

<style lang="scss">
.uploader {
  display: flex;
  flex-wrap: wrap;
  &-video-item {
    position: relative;
    margin: 0px 8px 8px 0px;
    video {
      width: 100%;
      height: 100%;
    }
    .del {
      position: absolute;
      top: 0;
      right: 0;
      width: 21px;
      height: 21px;
      background-color: rgba(0, 0, 0, 0.7);
      border-radius: 0 0 0 12px;
      cursor: pointer;
      z-index: 99;
      user-select: none;
      &-icon {
        position: absolute;
        top: -10px;
        right: 4px;
        color: #fff;
        font-size: 16px;
      }
    }
  }
  &-image {
    &-icon {
      border: 1px dashed #c0ccda;
      border-radius: 4px;
    }
    &-icon:hover {
      border-color: #416ddd;
    }
  }
  &-video {
    display: inline-block;
    margin-left: 10px;
    background-color: #fbfdff;
    border-radius: 6px;
    box-sizing: border-box;
    cursor: pointer;
    vertical-align: top;
    &-button {
      border: 1px dashed #c0ccda;
      &-icon {
        font-size: 28px;
        color: #8c939d;
      }
    }
    &-button:hover,
    &-button:focus {
      background-color: #fbfdff !important;
      border-color: #416ddd;
    }
  }
}
</style>
