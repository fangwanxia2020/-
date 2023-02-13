<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <div class="app-main-wrap">
        <!-- <div style="height: 10px"></div> -->
        <div class="app-main-ctn">
          <keep-alive :include="cachedViews">
            <router-view :key="key" />
          </keep-alive>
        </div>
      </div>
    </transition>
  </section>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "app-main",
  components: {},
  computed: {
    // 通过global获取user的信息
    ...mapState("global", {
      isInBaseSite: (state) => state.isInBaseSite,
      user: (state) => state.user,
    }),
    cachedViews() {
      if (this.isInBaseSite) {
        //修改基座的标签
        const { tagTitleObj } = this.$store.state.global.user || {};
        this.$store.dispatch("global/setGlobalState", {
          user: {
            ...this.$store.state.global.user,
            tagTitleObj: {
              ...tagTitleObj,
              [this.$route.path]: this.$route.meta.title,
            },
          },
        });
        if (this.user.loadedApp["/gatedpark"]) {
          const { childRoute } = this.user.loadedApp["/gatedpark"];
          const loadedRoutes = childRoute.map((item) =>
            this.$router.resolve(item),
          );
          const loadedRouteNames = loadedRoutes.map((item) => item.route.name);
          return loadedRouteNames || [];
        }
      } else {
        return this.$store.state.tagsView.cachedViews;
      }
    },
    key() {
      return this.$route.fullPath;
    },
  },
  created() {},
};
</script>
<style scoped lang="scss">
.app-main {
  /*50 = navbar  */
  height: calc(100vh - 70px);
  width: 100%;
  position: relative;
  overflow: hidden;

  .app-main-wrap {
    padding: 10px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    background: #dee2e8;

    .app-main-ctn {
      flex: 1;
      overflow: auto;
      position: relative;
    }
  }
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 +(20 让底部有一点空间)*/
    min-height: calc(100vh - 104px);
  }
}
</style>
<style lang="scss"></style>
