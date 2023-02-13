import Vue from "vue";
const selt = Vue.prototype;

// 保存/修改承包商车辆信息
export function saveCtrCar(data) {
  return selt.request({
    url: "/api/gatedpark/ctrVehicle/saveOrUpdate",
    method: "PUT",
    data,
  });
}
// 查询车辆颜色
export function getCarColor() {
  return selt.request({
    url: "/api/sysudc/udc/code/basedata_vehicle_color",
    method: "GET",
  });
}
//  获取承包商车辆详情
export function getCtrCarDetails(id) {
  return selt.request({
    url: `/api/gatedpark/ctrVehicle/getCtrVehicle/${id}`,
    method: "GET",
  });
}
//  获取资历证书接口 资质类型对象 10-组织 20-人员 30-车辆
export function getBctList(data) {
  return selt.request({
    url: `/api/basedata/bct/list`,
    method: "POST",
    data,
  });
}
//  查询承包商下面的人员
export function getCtrPersonList(data) {
  return selt.request({
    url: `/api/gatedpark/ctrFilingPersonEx/listByExpr`,
    method: "POST",
    data,
  });
}
// 查询承包商车辆列表
export function getCtrCarList(data) {
  return selt.request({
    url: `/api/gatedpark/ctrVehicle/pageByQueryExpr`,
    method: "POST",
    data,
  });
}
// 删除承包商车辆
export function DelCtrCar(data) {
  return selt.request({
    url: `/api/gatedpark/ctrVehicle/deleteCtrVehicle`,
    method: "DELETE",
    data,
  });
}
//  修改承包商车辆状态
export function updateCtrCarStatus(data) {
  return selt.request({
    url: `/api/gatedpark/ctrVehicle/updateVehicleStatus`,
    method: "POST",
    data,
  });
}
// 拉黑承包商
export function saveBlackList(data) {
  return selt.request({
    url: `/api/basedata/sbl/saveBlackList`,
    method: "PUT",
    data,
  });
}
// 车辆导入Excel
export function importCarExcel(data) {
  return selt.request({
    url: `/api/gatedpark/ctrVehicle/import`,
    headers: {
      "Content-Type": "multipart/form-data;charset=UTF-8",
    },
    method: "POST",
    data,
  });
}
