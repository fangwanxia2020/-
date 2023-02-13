import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
import Layout from "@/layout";

import infrastructureRouter from "./modules/infrastructure"; //基础设施
import parkPlanningRouter from "./modules/park-planning";
import parkOperationRouter from "./modules/park-operation"; // 园区运营
import informationDeliveryRouter from "./modules/information-delivery"; // 发布申请
import baseDataRouter from "./modules/base-data"; // 基础数据
import approvalRouter from "./modules/approval"; // 审批管理
import applicationRouter from "./modules/my-application"; // 我的审批
import streamOfPeople from "./modules/stream-of-people"; // 人流分析
import streamOfCar from "./modules/stream-of-car"; // 车流分析

export const constantRoutes = [
  {
    path: "/login/:roleKey?",
    component: () => import("@/views/login"),
    hidden: true,
  },
  {
    path: "/map",
    component: () => import("@/views/map/index.vue"),
    hidden: true,
  },
  {
    path: "/404",
    component: Layout,
    children: [
      {
        path: "",
        component: () => import("@/views/404"),
        name: "404",
        meta: {
          title: "404页面",
        },
      },
    ],
    hidden: true,
  },
  {
    path: "/",
    hidden: true,
    redirect: "/gatedpark/park-operation/reserve-manage/reserve-application",
  },
  ...infrastructureRouter,
  ...parkOperationRouter,
  ...informationDeliveryRouter,
  ...parkPlanningRouter,
  ...baseDataRouter,
  ...approvalRouter,
  ...applicationRouter,
  ...streamOfPeople,
  ...streamOfCar,
  {
    path: "/gatedpark/map",
    component: () => import("@/layout"),
    meta: { title: "园区一张图", icon: "platformManage" },
  },
];

const router = new Router({
  routes: constantRoutes,
});
export default router;
