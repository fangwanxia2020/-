const flowAnalysisRouter = [
  {
    path: "/gatedpark/flow-analysis",
    component: () => import("@/layout"),
    meta: { title: "人流分析", icon: "platformManage" },
    children: [
      {
        path: "personnel-record",
        component: () => import("@/views/flow-analysis/personnel-record/index"),
        name: "personnel-record",
        meta: { title: "人员入园记录", icon: "" },
      },
      // {
      //   path: "personnel-analysis",
      //   component: () =>
      //     import("@/views/flow-analysis/personnel-analysis/index"),
      //   name: "personnel-analysis",
      //   meta: { title: "人员进出分析", icon: "" },
      // },
    ],
  },
];
export default flowAnalysisRouter;
