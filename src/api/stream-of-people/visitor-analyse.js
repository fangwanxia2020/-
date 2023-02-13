import Vue from "vue";
const selt = Vue.prototype;

// 访客来源统计
export function sourceCount(data) {
  return selt.request({
    url: `/api/gatedpark/reserveInfo/sourceCount`,
    method: "POST",
    data,
  });
}

// 车辆来源统计
export function vehicleSourceCount(data) {
  return selt.request({
    url: `/api/gatedpark/reserveInfo/vehicleSourceCount`,
    method: "POST",
    data,
  });
}

// 理由分析统计
export function reasonCount(data) {
  return selt.request({
    url: `/api/gatedpark/reserveInfo/reasonCount`,
    method: "POST",
    data,
  });
}

// 拜访单位统计
export function visitOrgCount(data) {
  return selt.request({
    url: `/api/gatedpark/reserveInfo/visitOrgCount`,
    method: "POST",
    data,
  });
}

// 时间段分析统计
export function visitTimeCount(data) {
  return selt.request({
    url: `/api/gatedpark/reserveInfo/visitTimeCount`,
    method: "POST",
    data,
  });
}
