const parkPlanningRouter = [
  {
    path: "/gatedpark/stream-of-people",
    component: () => import("@/layout"),
    meta: { title: "人流分析", icon: "platformManage" },
    children: [
      {
        path: "personnel-record",
        component: () =>
          import("@/views/stream-of-people/personnel-record/index"),
        name: "personnel-record",
        meta: { title: "人员入园记录", icon: "" },
      },
      {
        path: "visitor-analyse",
        component: () =>
          import("@/views/stream-of-people/visitor-analyse/index"),
        name: "visitor-analyse",
        meta: { title: "访客来访分析", icon: "" },
      },
      {
        path: "personnel-access",
        component: () =>
          import("@/views/stream-of-people/personnel-access/index"),
        name: "personnel-access",
        meta: { title: "人员进出分析", icon: "" },
      },
      {
        path: "personnel-analyse",
        component: () =>
          import("@/views/stream-of-people/personnel-analyse/index"),
        name: "personnel-analyse",
        meta: { title: "人员入园趋势", icon: "" },
      },
      {
        path: "area-analyse",
        component: () => import("@/views/stream-of-people/area-analyse/index"),
        name: "area-analyse",
        meta: { title: "活动区域分析", icon: "" },
      },
    ],
  },
];
export default parkPlanningRouter;
