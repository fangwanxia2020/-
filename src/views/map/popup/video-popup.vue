<template>
  <div class="video-popup">
    <div class="video-popup-top">
      <div class="video-popup-top-title">
        <span>{{ info.title }}</span>
      </div>
    </div>
    <div class="video-popup-content">
      <video-player
        ref="videoPlayer"
        class="video-player-custom"
        :options="options"
        :playsinline="true"
        custom-event-name="customstatechangedeventname"
      >
      </video-player>
    </div>
  </div>
</template>

<script>
import { videoPlayer } from "vue-video-player";
export default {
  name: "video-popup",
  components: {
    videoPlayer,
  },
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  computed: {
    // 格式化拉流地址
    formaterVideoUrl() {
      const url =
        this.info.videoUrl &&
        this.info.videoUrl.slice(this.info.videoUrl.indexOf("http"));
      return url;
    },
    options() {
      const playerOptions = {
        // 是否静音
        muted: true,
        // 默认为英语，设置为中文
        language: "zh-CN",
        // 播放速度，指定后Video.js将显示一个控件(vjs-playback-rate类的控件)，允许用户选择播放速度
        playbackRates: [0.5, 1.0, 1.5, 2.0],
        // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值，表示长宽比例
        aspectRatio: "4:3", // 兼容顺序，默认值是['html5']，其他已注册的技术将按其注册的顺序在该技术之后添加。
        techOrder: ["html5"],
        // 等同于原生<video>标签中的一组<source>子标签，可实现优雅降级；type 属性规定媒体资源的 MIME 类型
        sources: [
          {
            type: "application/x-mpegURL",
            src: this.formaterVideoUrl,
          },
        ],
        // 视频封面
        // poster: require("./icon/cover.jpg"),
      };
      return playerOptions;
    },
  },
};
</script>
<style lang="scss" scoped>
.video-popup {
  &-top {
    &-title {
      padding: 5px 10px;
      font-weight: bold;
    }
  }
  &-content {
    width: 400px;
    height: 250px;
  }
}
.video-player-custom {
  width: 100%;
  height: 100%;
  // vidoeUI重写
  /deep/ .video-js {
    width: 100%;
    height: 100%;
    padding: 0;
    overflow: hidden;
    // 播放器
    .vjs-tech {
      object-fit: cover;
    }
    // 播放按钮
    .vjs-big-play-button {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 2em;
      height: 2em;
      margin-top: -1em;
      margin-left: -1em;
      font-size: 2em;
      line-height: 2em;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.45);
      outline: none;
    }
    // 封面
    .vjs-poster {
      width: 100%;
      height: 100%;
      background-size: cover;
    }
  }
}
</style>
