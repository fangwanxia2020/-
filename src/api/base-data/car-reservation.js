import Vue from "vue";
const selt = Vue.prototype;

// 机具预约管理列表
export function getVehicleManager(data) {
  return selt.request({
    url: "/api/gatedpark/sealedVehicleManager/pageByExpr",
    method: "post",
    data,
  });
}
// 新增/修改机具预约管理
export function saveVehicleManager(data) {
  return selt.request({
    url: "/api/gatedpark/sealedVehicleManager/save",
    method: "put",
    data,
  });
}
// 查询预约详情
export function getVehicleManagerDeltails(id) {
  return selt.request({
    url: `/api/gatedpark/sealedVehicleManager/get/${id}`,
    method: "get",
  });
}
