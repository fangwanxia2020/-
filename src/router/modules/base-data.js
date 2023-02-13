const baseDataRouter = [
  {
    path: "/gatedpark/base-data",
    component: () => import("@/layout"),
    meta: { title: "基础数据", icon: "platformManage" },
    children: [
      {
        path: "machine-tool",
        component: () => import("@/views/base-data/machine-tool/index"),
        name: "machine-tool",
        meta: { title: "机具管理", icon: "" },
      },
      {
        path: "machine-tool/add",
        hidden: true,
        component: () => import("@/views/base-data/machine-tool/edit"),
        name: "machine-tool/add",
        meta: { title: "新增机具", icon: "" },
      },
      {
        path: "machine-tool/edit",
        hidden: true,
        component: () => import("@/views/base-data/machine-tool/edit"),
        name: "machine-tool/edit",
        meta: { title: "查看机具", icon: "" },
      },
    ],
  },
];
export default baseDataRouter;
