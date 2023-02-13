import Vue from "vue";
import App from "./App.vue";
import commonStore from "./store/globalStore";
import store from "./store";
import mainroutes from "./router";

import "@/assets/js/common";
import "@/assets/js/uiElement";
import "@/assets/styles/index.scss"; // global css

// 视频播放器
import "video.js/dist/video-js.css";

//引入常用变量方法
import base from "@/assets/js/base";
Object.assign(Vue.prototype, base);

//全局工具方法
import "@/utils/mainUtils.js";
import {
  download,
  errorBoundary,
  delPrompt,
  sordImagesList,
} from "@/utils/tool.js";

// 引入文件
import "./public-path";

//引入ElementUI
import ElementUI from "element-ui";

Vue.use(ElementUI);

import "@arcgis/core/assets/esri/themes/light/main.css";

//高德地图
import VueAMap from "vue-amap";

Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: "d08a1a0765909536e768be9dbdac88f0",
  plugin: [
    "AMap.Geolocation", //定位空间，用来获取和展示用户主机所在的经纬度位置
    " AMap.Autocomplete ", //输入提示插件
    " AMap.PlaceSearch ", //POI搜索插件
    " AMap.Scale ", //右下角缩略图插件，比例尺
    " AMap.OverView ", //地图鹰眼插件
    " AMap.ToolBar ", //地图工具条
    " AMap.MapType ", //类别切换空间，实现默认图层与卫星图，实施交通层之间切换的控制
    " AMap.PolyEditor ", //编辑 折线多边形
    "AMap.Geocoder",
  ], //地图编码
});

//路由拦截
import "@/permission";

//引入echarts
import * as echarts from "echarts";
Vue.prototype.$echarts = echarts;
Vue.prototype.$download = download;
Vue.prototype.errorBoundary = errorBoundary;
Vue.prototype.delPrompt = delPrompt;
Vue.prototype.$sordImagesList = sordImagesList;

//引入样式
import "ty-pc/lib/index/style.css";
//按需引入
import { TyEditor } from "ty-pc";
Vue.use(TyEditor);

//引入全局变量
import plugins from "@/assets/js/plugins";
Vue.use(plugins);
//初始化组件变量
import baseUrl, { previewUrl } from "../env";
import { previewFile } from "ty-pc/lib/utils/common";
import { initApi, setToken } from "ty-pc/lib/utils/auth";
//一定要先设置baseUrl
Vue.prototype.baseUrl = baseUrl;
Vue.prototype.previewFile = (url) => previewFile(previewUrl, url);
//m1:原先接口定义 m2:东云接口定义
Vue.prototype.request = initApi(
  {
    router: mainroutes,
    tokenkey: "tyHseSubVue_token",
    outVue: Vue,
  },
  "m2",
);

Vue.config.productionTip = false;

//全局格式化时间过滤器
Vue.filter("splitTime", (val) => {
  const date = val ? val.split(" ")[0] : "-";
  return date;
});

let instance = null;
let router = null;

function render(props = {}) {
  const { container } = props;
  router = mainroutes;
  instance = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount(
    container ? container.querySelector("#hash-app-sub") : "#hash-app-sub",
  ); // 这里匹配的是public文件夹下面的index.html的id
}
export async function bootstrap() {
  console.log("[vue] vue app bootstraped");
}
export async function mount(props) {
  commonStore.globalRegister(store, props);
  // 独立运行时
  if (!window.__POWERED_BY_QIANKUN__) {
  } else {
    // eslint-disable-next-line no-undef
    __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
    store.commit("global/setGlobalState", {
      isInBaseSite: true,
    });
  }
  Vue.prototype.parentProps = props;
  //获取基座的token有就设置
  const { token } = store.state.global.user || {};
  //皮肤设置---------------------------------
  const theme = store.state.theme.theme;
  store.dispatch("theme/setTheme", theme).then((theme) => {
    import(`@/assets/styles/theme/${theme}/element-variables.scss`);
  });
  if (token) {
    Vue.prototype.request = initApi(
      {
        router: mainroutes,
        tokenkey: "tyHseSubVue_token",
        outVue: Vue,
      },
      "m2",
    );
    setToken(token);
    render(props);
  } else {
    render(props);
  }
}

export async function unmount() {
  instance.$destroy();
  // instance.$el.innerHTML = ''
  instance = null;
  router = null;
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  //皮肤设置---------------------------------
  const theme = store.state.theme.theme;
  store.dispatch("theme/setTheme", theme).then((theme) => {
    import(`@/assets/styles/theme/${theme}/element-variables.scss`);
  });
  // 这里是子应用独立运行的环境，实现子应用的登录逻辑
  // 独立运行时，也注册一个名为global的store module
  commonStore.globalRegister(store);
  // 模拟登录后，存储用户信息到global module
  const userInfo = {
    name: "微应用账号",
  }; // 假设登录后取到的用户信息
  store.commit("global/setGlobalState", {
    user: userInfo,
    isInBaseSite: false,
  });
  render();
}
import CtTable from "@/components/Table";
import Pagination from "@/components/Pagination";
import BackBar from "@/components/backBar";
import FormDialog from "@/components/FormDialog";
import FormDrawer from "@/components/FormDrawer";
Vue.component("CtTable", CtTable);
Vue.component("Pagination", Pagination);
Vue.component("BackBar", BackBar);
Vue.component("FormDialog", FormDialog);
Vue.component("FormDrawer", FormDrawer);
import {
  handleExpression,
  getNameByKey,
  ObjEqual,
  approvalStatus,
  awaySecond,
} from "@/utils/tool.js";
import { getTypeCode } from "@/api/system/custom-code.js";
import { getDeptTreeListByOrgId } from "@/api/user.js";
import {
  getOrgList,
  getPersonList,
} from "@/api/access-control-permission/organization-control";

Vue.prototype.handleExpression = handleExpression;
Vue.prototype.getNameByKey = getNameByKey;
Vue.prototype.$getTypeCode = getTypeCode;
Vue.prototype.$ObjEqual = ObjEqual;
Vue.prototype.$approvalStatus = approvalStatus;
// 部门树、组织树接口
Vue.prototype.getDeptTreeListByOrgId = getDeptTreeListByOrgId;
Vue.prototype.getOrgList = getOrgList;
Vue.prototype.getPersonList = getPersonList;
Vue.prototype.awaySecond = awaySecond;

// 获取文件访问地址
Vue.prototype.getFileUrl = (id) => {
  if (process.env.NODE_ENV == "development") {
    return `${baseUrl}/api/sysfile/file_info/download?id=${id}`;
  } else {
    return `${window.location.origin}${baseUrl}/api/sysfile/file_info/download?id=${id}`;
  }
};
