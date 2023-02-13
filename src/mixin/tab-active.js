export default {
  data() {
    return {
      shouldRemove: 1, // 是否允许在卸载钩子函数中清除tabsActive(二级页面不允许清空)
    };
  },
  watch: {
    tabsActive(val) {
      this.setTabAct(val);
    },
  },
  beforeRouteEnter(to, from, next) {
    let toFullPath = to.fullPath
      .split("/")
      .filter((v, i) => i < 4)
      .join("");
    let fromFullPath = from.fullPath
      .split("/")
      .filter((v, i) => i < 4)
      .join("");
    next((vm) => {
      if (toFullPath !== fromFullPath) {
        vm.shouldRemove = 1;
        vm.setTabAct("");
      } else {
        vm.shouldRemove = 0;
      }
    });
  },
  mounted() {
    if (this.getTabAct()) this.tabsActive = this.getTabAct();
  },
  destroyed() {
    if (this.shouldRemove) this.removeTabAct();
  },
  methods: {
    setTabAct(val) {
      sessionStorage.tabsActive = val;
      this.shouldRemove = 0;
    },
    getTabAct() {
      return sessionStorage.tabsActive;
    },
    removeTabAct() {
      sessionStorage.tabsActive = "";
    },
  },
};
