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

// 查询人员入园记录
export function getPersonAccessRecList(data) {
  return selt.request({
    url: `/api/gatedpark/personAccessRec/pageByQueryExpr`,
    method: "POST",
    data,
  });
}
// 模拟人员入园数据
export function addPersonAccessRec(data) {
  return selt.request({
    url: `/api/gatedpark/personAccessRec/addPersonAccessRec`,
    method: "POST",
    data,
  });
}

// 查询车辆入园记录
export function getVehicleAccessRecList(data) {
  return selt.request({
    url: `/api/gatedpark/vehicleAccessRec/pageByQueryExpr`,
    method: "POST",
    data,
  });
}

// 模拟车辆入园数据
export function addVehicleAccessRec(data) {
  return selt.request({
    url: `/api/gatedpark/vehicleAccessRec/addVehicleAccessRec`,
    method: "POST",
    data,
  });
}

// 车辆入园查看详情记录
export function getVehicleAccessRecDto(id) {
  return selt.request({
    url: `/api/gatedpark/vehicleAccessRec/getVehicleAccessRecDto/${id}`,
    method: "GET",
  });
}

// 人员入园趋势-今日
export function getPersonNowCount(data) {
  return selt.request({
    url: `/api/gatedpark/personAccessRec/nowCount`,
    method: "POST",
    data,
  });
}
// 人员入园趋势-本周
export function getPersonWeekCount(data) {
  return selt.request({
    url: `/api/gatedpark/personAccessRec/weekCount`,
    method: "POST",
    data,
  });
}
// 人员入园趋势-本月
export function getPersonMonthCount(data) {
  return selt.request({
    url: `/api/gatedpark/personAccessRec/monthCount`,
    method: "POST",
    data,
  });
}
// 人员入园趋势-自定义
export function getPersonCustomCount(data) {
  return selt.request({
    url: `/api/gatedpark/personAccessRec/customCount`,
    method: "POST",
    data,
  });
}

// 车辆入园趋势-今日
export function getVehicleNowCount(data) {
  return selt.request({
    url: `/api/gatedpark/vehicleAccessRec/nowCount`,
    method: "POST",
    data,
  });
}
// 车辆入园趋势-本周
export function getVehicleWeekCount(data) {
  return selt.request({
    url: `/api/gatedpark/vehicleAccessRec/weekCount`,
    method: "POST",
    data,
  });
}
// 车辆入园趋势-本月
export function getVehicleMonthCount(data) {
  return selt.request({
    url: `/api/gatedpark/vehicleAccessRec/monthCount`,
    method: "POST",
    data,
  });
}
// 车辆入园趋势-自定义
export function getVehicleCustomCount(data) {
  return selt.request({
    url: `/api/gatedpark/vehicleAccessRec/customCount`,
    method: "POST",
    data,
  });
}

// 车辆人员进出分析-今日
export function getPerVehicleAccessTimeNowCount(data) {
  return selt.request({
    url: `/api/gatedpark/perVehicleAccessTime/nowCount`,
    method: "POST",
    data,
  });
}
// 车辆人员进出分析-本周
export function getPerVehicleAccessTimeWeekCount(data) {
  return selt.request({
    url: `/api/gatedpark/perVehicleAccessTime/weekCount`,
    method: "POST",
    data,
  });
}
// 车辆人员进出分析-本月
export function getPerVehicleAccessTimeMonthCount(data) {
  return selt.request({
    url: `/api/gatedpark/perVehicleAccessTime/monthCount`,
    method: "POST",
    data,
  });
}
// 车辆人员进出分析-自定义
export function getPerVehicleAccessTimeCustomCount(data) {
  return selt.request({
    url: `/api/gatedpark/perVehicleAccessTime/customCount`,
    method: "POST",
    data,
  });
}
// 人员进出分析数量统计
export function getPersonInOut4TypeCout(data) {
  return selt.request({
    url: `/api/gatedpark/perVehicleAccessTime/getPersonInOut4TypeCout`,
    method: "POST",
    data,
  });
}
// 车辆进出分析数量统计
export function getVehicleInOut4TypeCout(data) {
  return selt.request({
    url: `/api/gatedpark/perVehicleAccessTime/getVehicleInOut4TypeCout`,
    method: "POST",
    data,
  });
}
