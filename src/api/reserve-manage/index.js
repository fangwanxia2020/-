import Vue from "vue";
const selt = Vue.prototype;

// 搜索拜访单位
export function getOrgList(data) {
  return selt.request({
    url: `/api/system/sys_org/listByExpr`,
    method: "POST",
    data,
  });
}
// 搜索接待人
export function getPersonList(data) {
  return selt.request({
    url: `/api/system/sys_person/listByExpr`,
    method: "POST",
    data,
  });
}
// 查询行人列表
export function getVisitorList(data) {
  return selt.request({
    url: `/api/gatedpark/reserveVisitorEx/pageList`,
    method: "POST",
    data,
  });
}
// 查询人车列表
export function getVehicleList(data) {
  return selt.request({
    url: `/api/gatedpark/reserveVehicleEx/pageList`,
    method: "POST",
    data,
  });
}

// 查询机具列表
export function getMachineList(data) {
  return selt.request({
    url: `/api/gatedpark/reserveMachineEx/pageList`,
    method: "POST",
    data,
  });
}
// 新增/修改行人预约
export function saveVisitor(data) {
  return selt.request({
    url: "/api/gatedpark/reserveVisitorEx/saveVisitor",
    method: "put",
    data,
  });
}

// 查询访客详情
export function getVisitorDetails(id) {
  return selt.request({
    url: `/api/gatedpark/reserveVisitorEx/getVisitor/${id}`,
    method: "get",
  });
}
//
// 新增/修改人车预约
export function saveVehicle(data) {
  return selt.request({
    url: "/api/gatedpark/reserveVehicleEx/saveVehicle",
    method: "put",
    data,
  });
}
// 查询人车详情
export function getCarDetails(id) {
  return selt.request({
    url: `/api/gatedpark/reserveVehicleEx/getVehicle/${id}`,
    method: "get",
  });
}
// 新增/修改机具预约
export function saveMachine(data) {
  return selt.request({
    url: "/api/gatedpark/reserveMachineEx/saveMachine",
    method: "put",
    data,
  });
}

// 查询机具详情
export function getEquipmentDetails(id) {
  return selt.request({
    url: `/api/gatedpark/reserveMachineEx/getMachine/${id}`,
    method: "get",
  });
}
// 提交审批
export function submitApproval(data) {
  return selt.request({
    url: `/api/gatedpark/busInstance/submitApproval`,
    method: "POST",
    data,
  });
}
// 查看审批详情
export function getApprovalDetails(params) {
  return selt.request({
    url: `/api/gatedpark/busInstance/getBusInstanceInfo`,
    method: "get",
    params,
  });
}
// 审批
export function getApprovalInfo(data) {
  return selt.request({
    url: `/api/gatedpark/busInstance/approval`,
    method: "POST",
    data,
  });
}
// 查询车辆类型
export function getCarKind(data) {
  return selt.request({
    url: `/api/basedata/stvt/pageByQueryExpr`,
    method: "POST",
    data,
  });
}
// 查询车牌号
export function getCarNum(data) {
  return selt.request({
    url: `/api/basedata/bvc/listByExpr`,
    method: "POST",
    data,
  });
}
