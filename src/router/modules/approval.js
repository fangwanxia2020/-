const approvalRouter = [
  {
    path: "/gatedpark/approval",
    component: () => import("@/layout"),
    meta: { title: "审批管理", icon: "platformManage" },
    children: [
      {
        path: "approval-manage",
        component: () => import("@/views/approval/approval-manage/index"),
        name: "approval-manage",
        meta: { title: "审批模板管理", icon: "" },
        // props: { systemFlag: "gatepark" },
      },
      {
        path: "approval-setting",
        hidden: true,
        component: () =>
          import("@/views/approval/approval-manage/approval-setting"),
        name: "approval-setting",
        meta: { title: "审批设置", icon: "" },
      },
      {
        path: "role-setting",
        component: () => import("@/views/approval/role-setting/index"),
        name: "role-setting",
        meta: { title: "权限审批管理", icon: "" },
      },
      {
        path: "association-user",
        hidden: true,
        component: () => import("@/views/approval/association-user/index"),
        name: "association-user",
        meta: { title: "关联用户", icon: "" },
      },
      {
        path: "field-manage",
        component: () => import("@/views/approval/field-manage/index"),
        name: "field-manage",
        meta: { title: "领域管理-技术配置", icon: "" },
      },
      {
        path: "edit-field",
        hidden: true,
        component: () => import("@/views/approval/field-manage/edit/index"),
        name: "edit-field",
        meta: { title: "编辑领域", icon: "" },
      },
      {
        path: "hasDo",
        hidden: true,
        component: () => import("@/views/approval/index"),
        name: "ApprovalhandleHasdo",
        meta: {
          title: "已办处理",
          activeMenu: "/approval/hasDo",
        },
      },
      {
        path: "approvalEditTemplate",
        hidden: true,
        component: () =>
          import("@/views/approval/approval-manage/approval-template"), //空模板
        name: "approvalTemplateSet",
        meta: {
          title: "编辑模板",
          activeMenu: "/approval/template",
        },
      },
    ],
  },
];
export default approvalRouter;
