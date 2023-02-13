<template>
  <div class="nav-bar">
    <div class="nav-bar-left">
      <div class="nav-bar-left-back" @click="back">
        <i class="el-icon-back"></i>
        <span class="nav-bar-left-back-text">返回</span>
      </div>
      <div class="nav-bar-left-time">
        <span class="nav-bar-left-time-text">{{ nowDate }}</span>
      </div>
    </div>
    <div class="nav-bar-center">
      <span class="nav-bar-center-title"> 封闭式园区管理 </span>
    </div>
    <div class="nav-bar-right">
      <div class="nav-bar-right-setting">
        <i class="el-icon-setting"></i>
        <span class="nav-bar-left-back-text">配置</span>
      </div>
      <div
        :class="[{ 'nav-bar-right-full-active': isFull }, 'nav-bar-right-full']"
        @click="screenFull"
      >
        <i class="el-icon-full-screen"></i>
        <span class="nav-bar-left-back-text">全屏</span>
      </div>
    </div>
  </div>
</template>
<script>
import screenFull from "screenfull";
export default {
  name: "nav-bar",
  data() {
    return {
      timer: null,
      nowDate: null,
      isFull: false,
    };
  },
  mounted() {
    this.timer = setInterval(this.formatDate, 1000);
  },
  beforeDestroy() {
    // 清除定时器
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    //返回
    back() {
      this.$router.go(-1);
    },
    //全屏
    screenFull() {
      if (!screenFull.isEnabled) {
        this.$message.warning("不支持全屏");
      }
      screenFull.toggle();
      screenFull.on("change", () => {
        this.isFull = screenFull.isFullscreen;
      });
    },
    //时间处理
    formatDate() {
      let date = new Date();
      let year = date.getFullYear(); // 年
      let month = date.getMonth() + 1; // 月
      let day = date.getDate(); // 日
      let hour = date.getHours(); // 时
      hour = hour < 10 ? "0" + hour : hour; // 如果只有一位，则前面补零
      let minute = date.getMinutes(); // 分
      minute = minute < 10 ? "0" + minute : minute; // 如果只有一位，则前面补零
      let second = date.getSeconds(); // 秒
      second = second < 10 ? "0" + second : second; // 如果只有一位，则前面补零
      this.nowDate = `${year}/${month}/${day} ${hour}:${minute}:${second}`;
    },
  },
};
</script>
<style lang="scss" scoped>
.nav-bar {
  height: 60px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  background: $primaryColor-ie;
  background: $primaryColor;
  background: #001947;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &-left {
    height: 100%;
    display: flex;
    align-items: center;
    flex-basis: 30%;
    color: #fff;
    font-size: 14px;
    &-back {
      cursor: pointer;
      background-color: #052551;
      height: 100%;
      padding: 0px 10px;
      display: flex;
      align-items: center;
      &-text {
        margin-left: 5px;
      }
    }
    &-time {
      padding: 0px 30px;
      font-size: 16px;
    }
  }
  &-center {
    &-title {
      font-size: 22px;
      font-weight: bold;
      color: transparent;
      background: linear-gradient(to bottom, #00d5ff, #026dff);
      -webkit-background-clip: text;
      letter-spacing: 2px;
    }
  }
  &-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-basis: 30%;
    color: #fff;
    padding: 0px 30px;
    font-size: 14px;
    &-setting {
      margin-right: 20px;
      cursor: pointer;
    }
    &-full {
      cursor: pointer;
      &-active {
        color: #5c84ea;
      }
    }
  }
}
</style>
