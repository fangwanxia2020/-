<template>
  <div v-if="$route.query.isFrame == 'true'" class="iframe-app-wrap">
    <app-main />
  </div>
  <div v-else :class="classObj" class="app-wrapper">
    <div v-if="!isInBaseSite" :class="{ 'fixed-header': true }">
      <navbar />
    </div>
    <div class="app-wrapper-ctn">
      <template v-if="!isInBaseSite">
        <sidebar class="sidebar-container" />
        <div class="main-container" :class="{ hasTagsView: needTagsView }">
          <div class="">
            <tags-view v-show="needTagsView" />
          </div>
          <app-main />
        </div>
      </template>
      <template v-else>
        <app-main />
      </template>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { Navbar, Sidebar, AppMain, TagsView } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
export default {
  name: "layout",
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView,
  },
  mixins: [ResizeMixin],
  computed: {
    // 通过global获取user的信息
    ...mapState("global", {
      isInBaseSite: (state) => state.isInBaseSite,
    }),
    showSettings() {
      return this.$store.state.settings.showSettings;
    },
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    needTagsView() {
      return this.$store.state.settings.tagsView;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
        isInBaseSite: this.isInBaseSite,
      };
    },
  },
  watch: {},
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.sidebar-container ::v-deep {
  background-color: rgba(255, 255, 255, 1);

  .el-submenu__title,
  .el-menu-item {
    color: #161616;

    i {
      color: #161616;
    }
  }

  .scrollbar-wrapper .el-menu:first-child > .menu-wrapper {
    border-bottom: 1px solid rgba(255, 255, 255, 1);
  }

  .el-submenu__title,
  .el-menu-item {
    &:hover {
      background-color: rgba(255, 255, 255, 1) !important;
      color: $primaryColor-ie !important;
      color: $primaryColor !important;

      i {
        color: $primaryColor-ie !important;
        color: $primaryColor !important;
      }
    }

    &.is-active {
      i {
        color: $primaryColor-ie !important;
        color: $primaryColor !important;
      }

      background-color: rgba(255, 255, 255, 1) !important;
      color: $primaryColor-ie !important;
      color: $primaryColor !important;
    }
  }
}

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }

  .app-wrapper-ctn {
    position: relative;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: 100%;
  transition: width 0.28s;
}

.isInBaseSite {
  position: absolute !important;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  ::v-deep {
    .app-main {
      min-height: 10px;
    }

    .app-wrapper-ctn,
    .app-main,
    .app-main-wrap {
      position: static;
    }

    .app-main-wrap {
      padding: 0;
    }

    .app-breadcrumb {
      display: none;
    }

    .app-main-ctn {
      position: absolute !important;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      overflow: auto;
    }
  }
}

.iframe-app-wrap {
  background: #fff;
  height: 100%;

  ::v-deep {
    .app-main {
      min-height: 100vh;

      .app-main-wrap {
        padding: 0 0 0 10px;
      }
    }

    .el-breadcrumb {
      display: none;
    }

    .design-form-wrap__btnwrap {
      display: none;
    }
  }
}
</style>
