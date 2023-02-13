import Vue from "vue";
const selt = Vue.prototype;

// 单位列表
export function companyList(data) {
  return selt.request({
    url: "/api/system/sys_ic/pageByExpr",
    method: "POST",
    data,
  });
}

// 人员列表
export function personList(data) {
  return selt.request({
    url: "/api/system/sys_person_details/pageByQuery",
    method: "POST",
    data,
  });
}

// 车辆列表
export function carList(data) {
  return selt.request({
    url: "/api/basedata/stvm/pageByQueryExpr",
    method: "POST",
    data,
  });
}

// 综合查询列表
export function searchList(data) {
  return selt.request({
    url: "/api/gatedpark/perAccessDevice/listAccessComprehensive",
    method: "POST",
    data,
  });
}
