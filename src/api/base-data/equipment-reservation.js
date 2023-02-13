import Vue from "vue";
const selt = Vue.prototype;

// 机具预约管理列表
export function getMachinesManager(data) {
  return selt.request({
    url: "/api/gatedpark/machineManager/pageByExpr",
    method: "post",
    data,
  });
}
// 新增/修改机具预约管理
export function saveMachinesManager(data) {
  return selt.request({
    url: "/api/gatedpark/machineManager/saveOrUpdate",
    method: "put",
    data,
  });
}
// 查询预约详情
export function getMachinesManagerDetails(id) {
  return selt.request({
    url: `/api/gatedpark/machineManager/get/${id}`,
    method: "get",
  });
}
// 更改机具状态
export function updateMachineStatus(data) {
  return selt.request({
    url: `/api/gatedpark/machineManager/updateMachineStatus`,
    method: "POST",
    data,
  });
}
//  删除机具信息
export function delMachineStatus(data) {
  return selt.request({
    url: `/api/gatedpark/machineManager/deleteMachine`,
    method: "DELETE",
    data,
  });
}
