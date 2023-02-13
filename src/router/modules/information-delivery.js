const parkOperationRouter = [
  {
    //
    path: "/gatedpark/information-delivery",
    component: () => import("@/layout"),
    meta: { title: "信息发布", icon: "platformManage" },
    children: [
      {
        path: "publish-application",
        component: () =>
          import("@/views/information-delivery/publish-application/index"),
        name: "publish-application",
        meta: { title: "发布申请", icon: "" },
      },
      {
        path: "publish-application/add",
        hidden: true,
        component: () =>
          import("@/views/information-delivery/publish-application/edit"),
        name: "publish-application-add",
        meta: {
          title: "新增-发布申请",
          icon: "",
          activeMenu: "/gatedpark/information-delivery/publish-application",
        },
      },
      {
        path: "publish-application/edit",
        hidden: true,
        component: () =>
          import("@/views/information-delivery/publish-application/edit"),
        name: "publish-application-edit",
        meta: {
          title: "修改-发布申请",
          icon: "",
          activeMenu: "/gatedpark/information-delivery/publish-application",
        },
      },
      {
        path: "publish-application/check",
        hidden: true,
        component: () =>
          import("@/views/information-delivery/publish-application/check"),
        name: "publish-application-check",
        meta: {
          title: "查看-发布申请",
          icon: "",
          activeMenu: "/gatedpark/information-delivery/publish-application",
        },
      },
      {
        path: "start-publishing/check",
        hidden: true,
        component: () =>
          import("@/views/information-delivery/publish-application/check"),
        name: "start-publishing-check",
        meta: {
          title: "查看-发布申请",
          icon: "",
          activeMenu: "/gatedpark/information-delivery/start-publishing",
        },
      },
      {
        path: "release-approval/check",
        hidden: true,
        component: () =>
          import("@/views/information-delivery/publish-application/check"),
        name: "release-approval-check",
        meta: {
          title: "查看-发布申请",
          icon: "",
          activeMenu: "/gatedpark/information-delivery/release-approval",
        },
      },
      {
        path: "release-approval/edit",
        hidden: true,
        component: () =>
          import("@/views/information-delivery/release-approval/edit"),
        name: "release-approval-edit",
        meta: {
          title: "审批-发布申请",
          icon: "",
          activeMenu: "/gatedpark/information-delivery/release-approval",
        },
      },
      // {
      //   path: "publish-application-add",
      //   component: () =>
      //     import("@/views/information-delivery/publish-application/edit"),
      //   name: "publish-application-add",
      //   meta: { title: "新增-发布申请", icon: "" },
      // },
      {
        path: "start-publishing",
        component: () =>
          import("@/views/information-delivery/start-publishing/index"),
        name: "start-publishing",
        meta: { title: "开始发布", icon: "" },
      },
      {
        path: "release-approval",
        component: () =>
          import("@/views/information-delivery/release-approval/index"),
        name: "release-approval",
        meta: { title: "发布审批", icon: "" },
      },
      {
        path: "led-template",
        component: () =>
          import("@/views/information-delivery/led-template/index"),
        name: "led-template",
        meta: { title: "LED模板管理", icon: "" },
      },
      // 发布申请
      // {
      //   path: "contractor",
      //   component: () => import("@/layout/layout"),
      //   name: "contractor",
      //   meta: { title: "发布申请", icon: "" },
      //   children: [
      //     // 承包商管理列表
      //     {
      //       path: "contractor-management",
      //       component: () =>
      //         import(
      //           "@/views/information-delivery/contractor/contractor-management/index"
      //         ),
      //       name: "contractor-management",
      //       meta: { title: "承包商管理", icon: "" },
      //     },
      //     // 新增承包商管理
      //     {
      //       path: "contractor-management/add",
      //       hidden: true,
      //       component: () =>
      //         import(
      //           "@/views/information-delivery/contractor/contractor-management/edit"
      //         ),
      //       name: "contractor-management-add",
      //       meta: {
      //         title: "新增员工",
      //         icon: "",
      //         activeMenu:
      //           "/gatedpark/information-delivery/contractor/contractor-management",
      //       },
      //     },
      //     // 修改承包商管理
      //     {
      //       path: "contractor-management/edit",
      //       hidden: true,
      //       component: () =>
      //         import(
      //           "@/views/information-delivery/contractor/contractor-management/edit"
      //         ),
      //       name: "contractor-management-edit",
      //       meta: {
      //         title: "修改员工",
      //         icon: "",
      //         activeMenu:
      //           "/gatedpark/information-delivery/contractor/contractor-management",
      //       },
      //     },
      //     // 查看承包商管理员工
      //     {
      //       path: "contractor-management/check",
      //       hidden: true,
      //       component: () =>
      //         import(
      //           "@/views/information-delivery/contractor/contractor-management/check"
      //         ),
      //       name: "contractor-management-check",
      //       meta: {
      //         title: "查看员工",
      //         icon: "",
      //         activeMenu:
      //           "/gatedpark/information-delivery/contractor/contractor-management",
      //       },
      //     },
      //     // 承包商机具管理
      //     {
      //       path: "machine-tool",
      //       component: () =>
      //         import(
      //           "@/views/information-delivery/contractor/machine-tool/index"
      //         ),
      //       name: "machine-tool",
      //       meta: { title: "承包商机具管理", icon: "" },
      //     },
      //     {
      //       path: "machine-tool/add",
      //       hidden: true,
      //       component: () =>
      //         import(
      //           "@/views/information-delivery/contractor/machine-tool/edit"
      //         ),
      //       name: "machine-tool-add",
      //       meta: { title: "新增机具", icon: "" },
      //     },
      //     {
      //       path: "machine-tool/edit",
      //       hidden: true,
      //       component: () =>
      //         import(
      //           "@/views/information-delivery/contractor/machine-tool/edit"
      //         ),
      //       name: "machine-tool-edit",
      //       meta: { title: "查看机具", icon: "" },
      //     },
      //     // 承包商车辆管理
      //     {
      //       path: "contractor-car",
      //       component: () =>
      //         import(
      //           "@/views/information-delivery/contractor/contractor-car/index"
      //         ),
      //       name: "contractor-car",
      //       meta: { title: "承包商车辆管理", icon: "" },
      //     },
      //     // 承包商车辆管理
      //     {
      //       path: "contractor-car/add",
      //       hidden: true,
      //       component: () =>
      //         import(
      //           "@/views/information-delivery/contractor/contractor-car/edit"
      //         ),
      //       name: "contractor-car/add",
      //       meta: { title: "新增车辆", icon: "" },
      //     },
      //     {
      //       path: "contractor-car/edit",
      //       hidden: true,
      //       component: () =>
      //         import(
      //           "@/views/information-delivery/contractor/contractor-car/edit"
      //         ),
      //       name: "contractor-car/edit",
      //       meta: { title: "查看车辆", icon: "" },
      //     },
      //     // 入驻备案
      //     {
      //       path: "registration",
      //       component: () =>
      //         import(
      //           "@/views/information-delivery/contractor/registration/index"
      //         ),
      //       name: "registration",
      //       meta: { title: "入驻备案", icon: "" },
      //     },
      //     {
      //       path: "registration/add",
      //       hidden: true,
      //       component: () =>
      //         import(
      //           "@/views/information-delivery/contractor/registration/add"
      //         ),
      //       name: "registration-add",
      //       meta: {
      //         title: "新增承包商入驻",
      //         icon: "",
      //         activeMenu:
      //           "/gatedpark/information-delivery/contractor/registration",
      //       },
      //     },
      //     {
      //       path: "registration/edit",
      //       hidden: true,
      //       component: () =>
      //         import(
      //           "@/views/information-delivery/contractor/registration/add"
      //         ),
      //       name: "registration-add",
      //       meta: {
      //         title: "修改承包商入驻",
      //         icon: "",
      //         activeMenu:
      //           "/gatedpark/information-delivery/contractor/registration",
      //       },
      //     },
      //     {
      //       path: "registration/change",
      //       hidden: true,
      //       component: () =>
      //         import(
      //           "@/views/information-delivery/contractor/registration/add"
      //         ),
      //       name: "registration-add",
      //       meta: {
      //         title: "变更承包商入驻",
      //         icon: "",
      //         activeMenu:
      //           "/gatedpark/information-delivery/contractor/registration",
      //       },
      //     },
      //     {
      //       path: "registration/check",
      //       hidden: true,
      //       component: () =>
      //         import(
      //           "@/views/information-delivery/contractor/registration/check"
      //         ),
      //       name: "registration-check",
      //       meta: {
      //         title: "查看承包商入驻",
      //         icon: "",
      //         activeMenu:
      //           "/gatedpark/information-delivery/contractor/registration",
      //       },
      //     },
      //     //入驻审批
      //     {
      //       path: "residence-approval",
      //       component: () =>
      //         import(
      //           "@/views/information-delivery/contractor/residence-approval/index"
      //         ),
      //       name: "residence-approval",
      //       meta: { title: "入驻审批", icon: "" },
      //     },
      //     //变更审批
      //     {
      //       path: "change-approval",
      //       component: () =>
      //         import(
      //           "@/views/information-delivery/contractor/change-approval/index"
      //         ),
      //       name: "change-approval",
      //       meta: { title: "变更审批", icon: "" },
      //     },
      //     //查看变更审批
      //     {
      //       path: "change-approval/check",
      //       hidden: true,
      //       component: () =>
      //         import(
      //           "@/views/information-delivery/contractor/change-approval/check"
      //         ),
      //       name: "change-approva-check",
      //       meta: {
      //         title: "查看变更审批",
      //         icon: "",
      //         activeMenu:
      //           "/gatedpark/information-delivery/contractor/change-approval",
      //       },
      //     },
      //   ],
      // },
    ],
  },
];
export default parkOperationRouter;
