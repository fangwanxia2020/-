const applicationRouter = [
  {
    path: "/gatedpark/application",
    component: () => import("@/layout"),
    meta: { title: "我的审批", icon: "platformManage" },
    children: [
      {
        path: "upcoming-task",
        component: () => import("@/views/my-application/upcoming-task/index"),
        name: "upcoming-task",
        meta: { title: "待办任务", icon: "" },
        // props: { systemFlag: "gatepark" },
      },
      {
        path: "needTodo",
        component: () => import("@/views/my-application/needTodo/index"),
        name: "needTodo",
        meta: { title: "待办任务-新", icon: "" },
      },
      {
        path: "task-done",
        component: () => import("@/views/my-application/task-done/index"),
        name: "task-done",
        meta: { title: "已办任务", icon: "" },
      },
      {
        path: "my-application",
        component: () => import("@/views/my-application/application/index"),
        name: "my-application",
        meta: { title: "我的申请", icon: "" },
      },
    ],
  },
];
export default applicationRouter;
