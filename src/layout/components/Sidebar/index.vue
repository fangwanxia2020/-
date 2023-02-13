<template>
  <div>
    <!-- {{permission_routes1}} -->
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <el-scrollbar style="height: 100%" wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        background-color="rgba(255,255,255,1)"
        text-color="#161616"
        :unique-opened="false"
        :active-text-color="primaryColor"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permission_routes1"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Logo from "../Logo";
import SidebarItem from "./SidebarItem";
import Hamburger from "@/layout/components/Hamburger";
export default {
  components: {
    SidebarItem,
    Logo,
    Hamburger,
  },
  computed: {
    ...mapGetters(["permission_routes", "sidebar"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    primaryColor() {
      return this.$store.state.theme.primaryColor;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
    permission_routes1() {
      console.log(this.permission_routes, "哈哈哈哈");
      return this.permission_routes;
    },
  },
  mounted() {},
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
  },
};
</script>
<style scoped lang="less">
.el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
