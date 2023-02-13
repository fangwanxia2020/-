<template>
  <div class="navbar1">
    <logo v-if="showLogo" style="float: left" />
    <div class="right-menu">
      <div class="right-menu-item">{{ user && user.name }}</div>
      <!-- <div class="right-menu-item">
        <span v-if="!isIE" @click="openSkinDialog">
          <ty-icon type="skin"></ty-icon>
        </span>
      </div> -->

      <div class="right-menu-item">
        <a href="javascript:void(0)" @click="logout">
          <ty-icon type="logout"></ty-icon>
        </a>
      </div>
    </div>
    <ty-dialog
      :show.sync="skinDialogVisible"
      :append-to-body="true"
      :on-ok="updateThemeFun"
      title="修改主题"
    >
      <div style="margin-top: 20px">
        <el-radio-group v-model="themeColor">
          <el-radio label="blue" border>蓝色</el-radio>
          <el-radio label="red" border>红色</el-radio>
          <el-radio label="green" border>绿色</el-radio>
        </el-radio-group>
      </div>
    </ty-dialog>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import Logo from "./Logo";
export default {
  components: {
    Logo,
  },
  computed: {
    ...mapGetters(["avatar"]),
    // 通过global获取user的信息
    ...mapState("user", {
      user: (state) => state,
    }),
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    isIE() {
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        return true;
      } else {
        return false;
      }
    },
  },
  data() {
    return {
      activeMenu: "pc",
      themeColor: this.$store.state.theme.theme || "blue",
      skinDialogVisible: false,
    };
  },
  mounted() {
    console.log(this.$store.state, "---kkllll99999");
  },
  methods: {
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login`);
    },
    //修改皮肤
    updateThemeFun() {
      const loading = this.$loading({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      this.$store.dispatch("theme/setTheme", this.themeColor).then((res) => {
        this.skinDialogVisible = false;
        this.$router.go(0);
      });
    },
    openSkinDialog() {
      this.skinDialogVisible = true;
    },
    updateUserName() {
      const name = new Date().getTime();
      this.$globalState.setGlobalState("user", {
        ...this.user,
        name,
      });
      this.$store.dispatch("user/updateUserName", name);
    },
  },
};
</script>
<style lang="scss" scoped>
.navbar1 {
  height: 70px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  background: $primaryColor-ie;
  background: $primaryColor;
  background: #001947;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topMenu {
    float: left;

    &.el-menu {
      background: transparent;

      .el-menu-item {
        font-size: 18px;

        &:hover,
        &.is-active {
          background: transparent;
          border-bottom: 1px solid transparent !important;
        }
      }
    }
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 60px;
    color: #fff;

    > a {
      margin-left: 10px;
    }

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 20px;
      height: 100%;
      font-size: 18px;
      color: #fff;
      vertical-align: text-bottom;
      position: relative;

      &::after {
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -17px;
        content: "";
        width: 1px;
        height: 34px;
        background: #ffffff;
        opacity: 0.25;
      }

      &:last-child {
        &::after {
          display: none;
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
