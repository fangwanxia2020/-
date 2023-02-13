const parkPlanningRouter = [
  {
    path: "/gatedpark/stream-of-car",
    component: () => import("@/layout"),
    meta: { title: "车流分析", icon: "platformManage" },
    children: [
      {
        path: "car-record",
        component: () => import("@/views/stream-of-car/car-record/index"),
        name: "car-record",
        meta: { title: "车辆入园记录", icon: "" },
      },
      {
        path: "car-analyse",
        component: () =>
          import("@/views/stream-of-people/visitor-analyse/index"),
        name: "car-analyse",
        meta: { title: "车辆来访分析", icon: "" },
      },
      {
        path: "car-access",
        component: () => import("@/views/stream-of-car/car-access/index"),
        name: "car-access",
        meta: { title: "车辆进出分析", icon: "" },
      },
      {
        path: "car-trends",
        component: () => import("@/views/stream-of-car/car-trends/index"),
        name: "car-trends",
        meta: { title: "车辆入园趋势", icon: "" },
      },
    ],
  },
];
export default parkPlanningRouter;
