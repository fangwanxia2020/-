const state = {
  center: [], // 中心点
  screenshot: "", // 截图url base64
  circle: null, // 圆的数据
  polygon: null, // 多边形的数据
};

const mutations = {
  SET_CENTER: (state, center) => {
    state.center = center;
  },
  SET_SCREENSHOT: (state, screenshot) => {
    state.screenshot = screenshot;
  },
  SET_CIRCLE: (state, circle) => {
    state.circle = circle;
  },
  SET_POLYGON: (state, polygon) => {
    state.polygon = polygon;
  },
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
