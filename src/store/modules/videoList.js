const state = {
  videoList: [
    { label: "", url: "", id: "", panoramic: 0, permissions: 0 },
    { label: "", url: "", id: "", panoramic: 0, permissions: 0 },
    { label: "", url: "", id: "", panoramic: 0, permissions: 0 },
    { label: "", url: "", id: "", panoramic: 0, permissions: 0 },
    { label: "", url: "", id: "", panoramic: 0, permissions: 0 },
    { label: "", url: "", id: "", panoramic: 0, permissions: 0 },
    { label: "", url: "", id: "", panoramic: 0, permissions: 0 },
    { label: "", url: "", id: "", panoramic: 0, permissions: 0 },
    { label: "", url: "", id: "", panoramic: 0, permissions: 0 },
    { label: "", url: "", id: "", panoramic: 0, permissions: 0 },
    { label: "", url: "", id: "", panoramic: 0, permissions: 0 },
    { label: "", url: "", id: "", panoramic: 0, permissions: 0 },
    { label: "", url: "", id: "", panoramic: 0, permissions: 0 },
    { label: "", url: "", id: "", panoramic: 0, permissions: 0 },
    { label: "", url: "", id: "", panoramic: 0, permissions: 0 },
    { label: "", url: "", id: "", panoramic: 0, permissions: 0 },
    { label: "", url: "", id: "", panoramic: 0, permissions: 0 },
    { label: "", url: "", id: "", panoramic: 0, permissions: 0 },
    { label: "", url: "", id: "", panoramic: 0, permissions: 0 },
    { label: "", url: "", id: "", panoramic: 0, permissions: 0 },
    { label: "", url: "", id: "", panoramic: 0, permissions: 0 },
    { label: "", url: "", id: "", panoramic: 0, permissions: 0 },
    { label: "", url: "", id: "", panoramic: 0, permissions: 0 },
    { label: "", url: "", id: "", panoramic: 0, permissions: 0 },
    { label: "", url: "", id: "", panoramic: 0, permissions: 0 },
  ],
  focusIndex: null,
  curTab: 0,
  videoManageId: null,
  videoPresetId: null,
  videoId: null,
  hasClick: false,
  isFullScreen: false,
};
const mutations = {
  SET_FULL_SCREEN: (state, data) => {
    state.isFullScreen = data;
  },
  SET_VIDEO_LIST: (state, data) => {
    state.videoList = data;
  },
  SET_FOCUS_INDEX: (state, data) => {
    state.focusIndex = data;
  },
  SET_CUR_TAB: (state, data) => {
    state.curTab = data;
  },
  SET_HAS_CLICK: (state, data) => {
    state.hasClick = data;
  },
  SET_VIDEO_MANAGE_ID: (state, data) => {
    state.videoManageId = data;
  },
  SET_VIDEO_PRESET_ID: (state, data) => {
    state.videoPresetId = data;
  },
  SET_VIDEO_ID: (state, data) => {
    state.videoId = data;
  },
};
const actions = {
  updateVideoIdInfo({ commit }, videoManageId) {
    commit("SET_VIDEO_ID", videoManageId);
  },
  updateFullScreen({ commit }, isFullScreen) {
    commit("SET_FULL_SCREEN", isFullScreen);
  },
  updateVideoManageId({ commit }, videoManageId) {
    commit("SET_VIDEO_MANAGE_ID", videoManageId);
  },
  updateVideoPresetId({ commit }, videoPresetId) {
    commit("SET_VIDEO_PRESET_ID", videoPresetId);
  },
  updateVideoList({ commit }, videoList) {
    commit("SET_VIDEO_LIST", videoList);
  },
  updateFocusIndex({ commit }, fIndex) {
    commit("SET_FOCUS_INDEX", fIndex);
  },
  updateCurTab({ commit }, curTab) {
    commit("SET_CUR_TAB", curTab);
  },
  updateHasClick({ commit }, hasClick) {
    commit("SET_HAS_CLICK", hasClick);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
