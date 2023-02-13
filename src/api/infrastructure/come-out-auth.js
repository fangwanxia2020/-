import Vue from "vue";
const selt = Vue.prototype;

// 单位/人员/车辆权限列表
export function getListByType(data) {
  return selt.request({
    url: "/api/gatedpark/perAccessDevice/listAccess",
    method: "POST",
    data,
  });
}

// 单位详情
export function orgDetail(id) {
  return selt.request({
    url: `/api/system/sys_org_details/getByOrgId/${id}`,
    method: "GET",
  });
}

// 人员详情
export function personDetail(id) {
  return selt.request({
    url: `/api/system/sys_person_details/getByPersonId/${id}`,
    method: "GET",
  });
}
// 根据人员getByPersonBaseId取人员详情
export function getByPersonBaseId(id) {
  return selt.request({
    url: `/api/system/sys_person_details/getByPersonBaseId/${id}`,
    method: "GET",
  });
}

// 车辆详情
export function carDetail(id) {
  return selt.request({
    url: `/api/basedata/stvm/get/${id}`,
    method: "GET",
  });
}

// 查询授权的区域
export function areaDetail(data) {
  return selt.request({
    url: `/api/gatedpark/perAccessLogic/listAuthArea`,
    method: "POST",
    data,
  });
}

// 查询授权区域-设备
export function deviceDetailByArea(data) {
  return selt.request({
    url: `/api/gatedpark/areaDeviceRel/listAreaDevice`,
    method: "POST",
    data,
  });
}

// 查询授权的卡口
export function bayonetDetail(data) {
  return selt.request({
    url: `/api/gatedpark/perAccessLogic/listAuthGateway`,
    method: "POST",
    data,
  });
}

// 查询授权卡口-设备
export function deviceDetailByBayonet(data) {
  return selt.request({
    url: `/api/gatedpark/gateway/listGatewayDevice`,
    method: "POST",
    data,
  });
}

// 查询单独授权-设备
export function selfDeviceDetail(data) {
  return selt.request({
    url: `/api/gatedpark/perAccessDevice/listAuthDevice`,
    method: "POST",
    data,
  });
}

// 查询合计授权-设备
export function totalDeviceDetail(data) {
  return selt.request({
    url: `/api/gatedpark/perAccessDevice/allAuthDevice`,
    method: "POST",
    data,
  });
}

// 授权-保存
export function authSave(data) {
  return selt.request({
    url: `/api/gatedpark/perAccessDevice/authDevice`,
    method: "POST",
    data,
  });
}

// 下发权限
export function downAuth(data) {
  return selt.request({
    url: `/api/gatedpark/perDownloadTask/downPacDevicePer`,
    method: "POST",
    data,
  });
}
