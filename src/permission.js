import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { getToken } from "ty-pc/lib/utils/auth";
import getPageTitle from "@/utils/get-page-title";
import { needLogin } from "@/settings";
NProgress.configure({
  showSpinner: false,
});
const whiteList = [
  "/login",
  "/login/admin",
  "/404",
  "/index",
  "/activiti/definition/edit",
]; //白名单
const jumpUrl = window.origin + window.location.pathname;
router.beforeEach(async (to, from, next) => {
  NProgress.start();
  document.title = getPageTitle(to.meta.title);
  if (to.path.includes("/gatedpark")) {
    // 解决在基站里跳转其他微应用执行这个微应用的路由拦截，导致网页title改变了
    setTimeout(() => {
      document.title = getPageTitle(to.meta.title);
    }, 100);
  }
  const hasToken = getToken();
  if (to.path.indexOf("/gatedpark/monitor/camera-wall") != -1) {
    let href = `${jumpUrl}#/camera-wall`;
    window.open(href, "_blank");
    NProgress.done();
  } else if (to.path.indexOf("/gatedpark/map") != -1) {
    let href = `${jumpUrl}#/map`;
    window.open(href, "_self");
    NProgress.done();
  } else if (needLogin) {
    //是否需要登录，在设置页面设置
    if (hasToken) {
      // 判断是否有token
      if (to.path.indexOf("/login") == 0) {
        next({
          path: "/",
        });
        NProgress.done();
      } else {
        const userId = store.getters.userId;
        if (userId) {
          next();
        } else {
          try {
            await store.dispatch("user/getInfo"); // 拉取info
            next({
              ...to,
              replace: true,
            });
          } catch (error) {
            await store.dispatch("user/resetToken");
            Message.error(error || "Has Error");
            next(`/login`);
            NProgress.done();
          }
        }
      }
    } else {
      if (whiteList.indexOf(to.path) >= 0 || to.path.indexOf("/login") >= 0) {
        // 在免登录白名单，直接进入
        next();
      } else {
        next(`/login`);
        NProgress.done();
      }
    }
  } else {
    next();
  }
});
router.afterEach(() => {
  NProgress.done();
});
