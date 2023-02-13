const parkPlanningRouter = [
  {
    path: "/gatedpark/park-planning",
    component: () => import("@/layout"),
    meta: { title: "园区规划", icon: "platformManage" },
    children: [
      {
        path: "implement",
        component: () => import("@/views/park-planning/bayonet/index"),
        name: "bayonet",
        meta: { title: "卡口管理", icon: "" },
      },
      {
        path: "area",
        component: () => import("@/views/park-planning/area/index"),
        name: "area",
        meta: { title: "区域管理", icon: "" },
      },
    ],
  },
];
export default parkPlanningRouter;
