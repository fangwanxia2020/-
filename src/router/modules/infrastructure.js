const infrastructureRouter = [
  {
    path: "/gatedpark/infrastructure",
    component: () => import("@/layout"),
    meta: { title: "基础设施", icon: "platformManage" },
    children: [
      {
        path: "device-platform",
        component: () => import("@/views/infrastructure/device-platform/index"),
        name: "device-platform",
        meta: { title: "设备平台管理", icon: "" },
      },
      {
        path: "access-control-equipment",
        component: () =>
          import("@/views/infrastructure/access-control-equipment/index"),
        name: "access-control-equipment",
        meta: { title: "门禁设备", icon: "" },
      },
      {
        path: "led-infoscreen",
        component: () => import("@/views/infrastructure/led-infoscreen/index"),
        name: "led-infoscreen",
        meta: { title: "LED信息屏", icon: "" },
      },
      {
        path: "ip-broadcast",
        component: () => import("@/views/infrastructure/ip-broadcast/index"),
        name: "ip-broadcast",
        meta: { title: "IP广播", icon: "" },
      },
      {
        path: "smart-lamppost",
        component: () => import("@/views/infrastructure/smart-lamppost/index"),
        name: "smart-lamppost",
        meta: { title: "智慧灯杆", icon: "" },
      },
      {
        path: "enter-auth",
        component: () => import("@/layout/layout"),
        name: "enter-auth",
        meta: { title: "门禁权限", icon: "" },
        children: [
          {
            path: "come-out-auth",
            component: () =>
              import("@/views/infrastructure/enter-auth/come-out-auth/index"),
            name: "come-out-auth",
            meta: { title: "出入权限", icon: "" },
          },
          {
            path: "permission-search",
            component: () =>
              import(
                "@/views/infrastructure/enter-auth/permission-search/index"
              ),
            name: "permission-search",
            meta: { title: "权限综合查询", icon: "" },
          },
        ],
      },
    ],
  },
  {
    path: "/gatedpark/infrastructure/access-control-equipment",
    component: () => import("@/layout"),
    children: [
      {
        path: "person-lock-edit",
        component: () =>
          import(
            "@/views/infrastructure/access-control-equipment/person-lock/edit.vue"
          ),
        name: "person-lock-edit",
        meta: { title: "编辑人闸", icon: "" },
      },
      {
        path: "person-lock-check",
        component: () =>
          import(
            "@/views/infrastructure/access-control-equipment/person-lock/edit.vue"
          ),
        name: "person-lock-check",
        meta: { title: "查看人闸", icon: "" },
      },
      {
        path: "car-lock-edit",
        component: () =>
          import(
            "@/views/infrastructure/access-control-equipment/car-lock/edit.vue"
          ),
        name: "car-lock-edit",
        meta: { title: "编辑车闸", icon: "" },
      },
      {
        path: "car-lock-check",
        component: () =>
          import(
            "@/views/infrastructure/access-control-equipment/car-lock/edit.vue"
          ),
        name: "car-lock-check",
        meta: { title: "查看车闸", icon: "" },
      },
    ],
    hidden: true,
  },
  {
    path: "/gatedpark/infrastructure/enter-auth/come-out-auth",
    component: () => import("@/layout"),
    children: [
      {
        path: "auth-area",
        component: () =>
          import(
            "@/views/infrastructure/enter-auth/come-out-auth/auth-area.vue"
          ),
        name: "auth-area",
        meta: { title: "授权区域", icon: "" },
      },
      {
        path: "auth-bayonet",
        component: () =>
          import(
            "@/views/infrastructure/enter-auth/come-out-auth/auth-bayonet.vue"
          ),
        name: "auth-bayonet",
        meta: { title: "授权卡口", icon: "" },
      },
    ],
    hidden: true,
  },
];
export default infrastructureRouter;
