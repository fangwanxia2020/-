const parkOperationRouter = [
  {
    //
    path: "/gatedpark/park-operation",
    component: () => import("@/layout"),
    meta: { title: "园区运营", icon: "platformManage" },
    children: [
      {
        path: "reserve-manage",
        component: () => import("@/layout/layout"),
        name: "reserve-manage",
        meta: { title: "预约管理", icon: "" },
        children: [
          {
            path: "reserve-application",
            component: () =>
              import(
                "@/views/park-operation/reserve-manage/reserve-application/index"
              ),
            name: "reserve-application",
            meta: { title: "预约申请", icon: "" },
          },
          {
            path: "reserve-record",
            component: () =>
              import(
                "@/views/park-operation/reserve-manage/reserve-record/index"
              ),
            name: "reserve-record",
            meta: { title: "预约记录", icon: "" },
          },
          {
            hidden: true,
            path: "details",
            component: () =>
              import(
                "@/views/park-operation/reserve-manage/reserve-record/details"
              ),
            name: "reserve-details",
            meta: { title: "详情", icon: "" },
          },
          {
            path: "self-check",
            component: () =>
              import("@/views/park-operation/reserve-manage/self-check/index"),
            name: "self-check",
            meta: { title: "两客一危自助校验", icon: "" },
          },
          {
            path: "self-check/check",
            hidden: true,
            component: () =>
              import("@/views/park-operation/reserve-manage/self-check/add"),
            name: "self-check-check",
            meta: {
              title: "两客一危自助校验查看",
              icon: "",
              activeMenu: "/gatedpark/park-operation/reserve-manage/self-check",
            },
          },
          {
            path: "waybill-report",
            component: () =>
              import(
                "@/views/park-operation/reserve-manage/waybill-report/index"
              ),
            name: "waybill-report",
            meta: { title: "危化品电子运单报备", icon: "" },
          },
          {
            path: "waybill-report/add",
            hidden: true,
            component: () =>
              import(
                "@/views/park-operation/reserve-manage/waybill-report/add"
              ),
            name: "waybill-report-add",
            meta: {
              title: "新增电子运单",
              icon: "",
              activeMenu:
                "/gatedpark/park-operation/reserve-manage/waybill-report",
            },
          },
          {
            path: "waybill-report/edit",
            hidden: true,
            component: () =>
              import(
                "@/views/park-operation/reserve-manage/waybill-report/add"
              ),
            name: "waybill-report-edit",
            meta: {
              title: "修改电子运单",
              icon: "",
              activeMenu:
                "/gatedpark/park-operation/reserve-manage/waybill-report",
            },
          },
          {
            path: "waybill-report/check",
            hidden: true,
            component: () =>
              import(
                "@/views/park-operation/reserve-manage/waybill-report/add"
              ),
            name: "waybill-report-check",
            meta: {
              title: "电子运单查看",
              icon: "",
              activeMenu:
                "/gatedpark/park-operation/reserve-manage/waybill-report",
            },
          },
        ],
      },
      {
        path: "location-manage",
        component: () => import("@/layout/layout"),
        name: "location-manage",
        meta: { title: "定位卡管理", icon: "" },
        children: [
          {
            path: "freeze-report",
            component: () =>
              import(
                "@/views/park-operation/location-card-manage/freeze-report"
              ),
            name: "freeze-report",
            meta: { title: "发卡、冻结、挂失", icon: "" },
          },
          {
            path: "corporate-card",
            component: () =>
              import(
                "@/views/park-operation/location-card-manage/corporate-card"
              ),
            name: "corporate-card",
            meta: { title: "企业发卡", icon: "" },
          },
          {
            path: "pedestrian-reserve",
            component: () =>
              import(
                "@/views/park-operation/location-card-manage/pedestrian-reserve"
              ),
            name: "pedestrian-reserve",
            meta: { title: "访客预约单发卡", icon: "" },
          },
          {
            path: "lost-settlement",
            component: () =>
              import(
                "@/views/park-operation/location-card-manage/lost-settlement/index"
              ),
            name: "lost-settlement",
            meta: { title: "丢失结算", icon: "" },
          },
          {
            path: "long-card",
            component: () =>
              import(
                "@/views/park-operation/location-card-manage/long-term-card/index"
              ),
            name: "long-card",
            meta: { title: "中长期卡申请/续期", icon: "" },
          },
          {
            path: "add",
            hidden: true,
            component: () =>
              import(
                "@/views/park-operation/location-card-manage/long-term-card/edit"
              ),
            name: "add",
            meta: { title: "新增中长期卡申请/续期", icon: "" },
          },
          {
            path: "edit",
            hidden: true,
            component: () =>
              import(
                "@/views/park-operation/location-card-manage/long-term-card/edit"
              ),
            name: "edit",
            meta: { title: "查看中长期卡申请/续期", icon: "" },
          },
          // 承包商发卡
          {
            path: "contractor-card",
            component: () =>
              import(
                "@/views/park-operation/location-card-manage/contractor-card"
              ),
            name: "contractor-card",
            meta: { title: "承包商发卡", icon: "" },
          },
          //防爆卡
          {
            path: "explosion-proof-card",
            component: () =>
              import(
                "@/views/park-operation/location-card-manage/explosion-proof-card/index"
              ),
            name: "explosion-proof-card",
            meta: { title: "防爆卡申请", icon: "" },
          },
          {
            path: "explosion-proof-card/add",
            hidden: true,
            component: () =>
              import(
                "@/views/park-operation/location-card-manage/explosion-proof-card/edit"
              ),
            name: "explosion-proof-card-add",
            meta: {
              title: "新增防爆卡申请",
              icon: "",
              activeMenu:
                "/gatedpark/park-operation/location-manage/explosion-proof-card",
            },
          },
          // 普卡防爆卡替换
          {
            path: "explosion-proof-card-replace",
            component: () =>
              import(
                "@/views/park-operation/location-card-manage/explosion-proof-card/replace"
              ),
            name: "explosion-proof-card-replace",
            meta: { title: "普卡防爆卡替换", icon: "" },
          },
          // 防爆卡操作记录
          {
            path: "explosion-proof-card-log",
            component: () =>
              import(
                "@/views/park-operation/location-card-manage/explosion-proof-card/log"
              ),
            name: "explosion-proof-card-log",
            meta: { title: "防爆卡操作记录", icon: "" },
          },
        ],
      },
      // 承包商管理
      {
        path: "contractor",
        component: () => import("@/layout/layout"),
        name: "contractor",
        meta: { title: "承包商管理", icon: "" },
        children: [
          // 承包商管理列表
          {
            path: "contractor-management",
            component: () =>
              import(
                "@/views/park-operation/contractor/contractor-management/index"
              ),
            name: "contractor-management",
            meta: { title: "承包商管理", icon: "" },
          },
          // 新增承包商管理
          {
            path: "contractor-management/add",
            hidden: true,
            component: () =>
              import(
                "@/views/park-operation/contractor/contractor-management/edit"
              ),
            name: "contractor-management-add",
            meta: {
              title: "新增员工",
              icon: "",
              activeMenu:
                "/gatedpark/park-operation/contractor/contractor-management",
            },
          },
          // 修改承包商管理
          {
            path: "contractor-management/edit",
            hidden: true,
            component: () =>
              import(
                "@/views/park-operation/contractor/contractor-management/edit"
              ),
            name: "contractor-management-edit",
            meta: {
              title: "修改员工",
              icon: "",
              activeMenu:
                "/gatedpark/park-operation/contractor/contractor-management",
            },
          },
          // 查看承包商管理员工
          {
            path: "contractor-management/check",
            hidden: true,
            component: () =>
              import(
                "@/views/park-operation/contractor/contractor-management/check"
              ),
            name: "contractor-management-check",
            meta: {
              title: "查看员工",
              icon: "",
              activeMenu:
                "/gatedpark/park-operation/contractor/contractor-management",
            },
          },
          // 承包商中长期卡
          {
            path: "contractor-long-card",
            component: () =>
              import(
                "@/views/park-operation/contractor/contractor-long-card/index"
              ),
            name: "contractor-long-card",
            meta: { title: "承包商卡申请/续期", icon: "" },
          },
          {
            path: "add",
            hidden: true,
            component: () =>
              import(
                "@/views/park-operation/contractor/contractor-long-card/edit"
              ),
            name: "add",
            meta: {
              title: "新增中长期卡申请/续期",
              icon: "",
              activeMenu:
                "/gatedpark/park-operation/contractor/contractor-long-card",
            },
          },
          {
            path: "edit",
            hidden: true,
            component: () =>
              import(
                "@/views/park-operation/contractor/contractor-long-card/edit"
              ),
            name: "edit",
            meta: {
              title: "查看中长期卡申请/续期",
              icon: "",
              activeMenu:
                "/gatedpark/park-operation/contractor/contractor-long-card",
            },
          },
          // 承包商机具管理
          {
            path: "machine-tool",
            component: () =>
              import("@/views/park-operation/contractor/machine-tool/index"),
            name: "contractor-machine",
            meta: { title: "承包商机具管理", icon: "" },
          },
          {
            path: "machine-tool/add",
            hidden: true,
            component: () =>
              import("@/views/park-operation/contractor/machine-tool/edit"),
            name: "machine-tool-add",
            meta: { title: "新增机具", icon: "" },
          },
          {
            path: "machine-tool/edit",
            hidden: true,
            component: () =>
              import("@/views/park-operation/contractor/machine-tool/edit"),
            name: "machine-tool-edit",
            meta: { title: "查看机具", icon: "" },
          },
          // 承包商车辆管理
          {
            path: "contractor-car",
            component: () =>
              import("@/views/park-operation/contractor/contractor-car/index"),
            name: "contractor-car",
            meta: { title: "承包商车辆管理", icon: "" },
          },
          // 承包商车辆管理
          {
            path: "contractor-car/add",
            hidden: true,
            component: () =>
              import("@/views/park-operation/contractor/contractor-car/edit"),
            name: "contractor-car/add",
            meta: { title: "新增车辆", icon: "" },
          },
          {
            path: "contractor-car/edit",
            hidden: true,
            component: () =>
              import("@/views/park-operation/contractor/contractor-car/edit"),
            name: "contractor-car/edit",
            meta: { title: "查看车辆", icon: "" },
          },
          // 入驻备案
          {
            path: "registration",
            component: () =>
              import("@/views/park-operation/contractor/registration/index"),
            name: "registration",
            meta: { title: "入驻备案", icon: "" },
          },
          {
            path: "registration/add",
            hidden: true,
            component: () =>
              import("@/views/park-operation/contractor/registration/add"),
            name: "registration-add",
            meta: {
              title: "新增承包商入驻",
              icon: "",
              activeMenu: "/gatedpark/park-operation/contractor/registration",
            },
          },
          {
            path: "registration/edit",
            hidden: true,
            component: () =>
              import("@/views/park-operation/contractor/registration/add"),
            name: "registration-add",
            meta: {
              title: "修改承包商入驻",
              icon: "",
              activeMenu: "/gatedpark/park-operation/contractor/registration",
            },
          },
          {
            path: "registration/change",
            hidden: true,
            component: () =>
              import("@/views/park-operation/contractor/registration/add"),
            name: "registration-add",
            meta: {
              title: "变更承包商入驻",
              icon: "",
              activeMenu: "/gatedpark/park-operation/contractor/registration",
            },
          },
          {
            path: "registration/check",
            hidden: true,
            component: () =>
              import("@/views/park-operation/contractor/registration/check"),
            name: "registration-check",
            meta: {
              title: "查看承包商入驻",
              icon: "",
              activeMenu: "/gatedpark/park-operation/contractor/registration",
            },
          },
          //入驻审批
          {
            path: "residence-approval",
            component: () =>
              import(
                "@/views/park-operation/contractor/residence-approval/index"
              ),
            name: "residence-approval",
            meta: { title: "入驻审批", icon: "" },
          },
          //变更审批
          {
            path: "change-approval",
            component: () =>
              import("@/views/park-operation/contractor/change-approval/index"),
            name: "change-approval",
            meta: { title: "变更审批", icon: "" },
          },
          //查看变更审批
          {
            path: "change-approval/check",
            hidden: true,
            component: () =>
              import("@/views/park-operation/contractor/change-approval/check"),
            name: "change-approva-check",
            meta: {
              title: "查看变更审批",
              icon: "",
              activeMenu:
                "/gatedpark/park-operation/contractor/change-approval",
            },
          },
        ],
      },
      // 值班管理
      {
        path: "duty-manage",
        component: () => import("@/layout/layout"),
        name: "duty-manage",
        meta: { title: "值班管理", icon: "" },
        children: [
          {
            path: "classes-manage",
            component: () =>
              import("@/views/park-operation/duty-manage/classes-manage/index"),
            name: "classes-manage",
            meta: { title: "班次管理", icon: "" },
          },
          {
            hidden: true,
            path: "classes-manage/add",
            component: () =>
              import("@/views/park-operation/duty-manage/classes-manage/edit"),
            name: "classes-manage/add",
            meta: { title: "新增班次", icon: "" },
          },
          {
            hidden: true,
            path: "classes-manage/edit",
            component: () =>
              import("@/views/park-operation/duty-manage/classes-manage/edit"),
            name: "classes-manage/edit",
            meta: { title: "查看班次", icon: "" },
          },
          {
            path: "groups-manage",
            component: () =>
              import("@/views/park-operation/duty-manage/groups-manage/index"),
            name: "groups-manage",
            meta: { title: "班组管理", icon: "" },
          },
          {
            hidden: true,
            path: "groups-manage/add",
            component: () =>
              import("@/views/park-operation/duty-manage/groups-manage/edit"),
            name: "groups-manage/add",
            meta: { title: "新增班组", icon: "" },
          },
          {
            hidden: true,
            path: "groups-manage/edit",
            component: () =>
              import("@/views/park-operation/duty-manage/groups-manage/edit"),
            name: "groups-manage/edit",
            meta: { title: "查看班组", icon: "" },
          },
          {
            path: "word-calendar",
            component: () =>
              import("@/views/park-operation/duty-manage/word-calendar"),
            name: "word-calendar",
            meta: { title: "工作日历表", icon: "" },
          },
        ],
      },
    ],
  },
];
export default parkOperationRouter;
