const state = {
  applyTabs: "1",
};
const mutations = {
  CHANGE_APPLY_TABS(state, tabsActive) {
    state.applyTabs = tabsActive;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
