import Vue from "vue";
const selt = Vue.prototype;

// 承包商列表
export function ctrList(data) {
  return selt.request({
    url: "/api/gatedpark/ctrFilingPersonEx/pageByQueryExpr",
    method: "POST",
    data,
  });
}
// 所属承包商列表
export function listByExpr(data) {
  return selt.request({
    url: "/api/gatedpark/ctrFiling/listByExpr",
    method: "POST",
    data,
  });
}
// 承包商人员资质
export function listBct(data) {
  return selt.request({
    url: "/api/basedata/bct/pageByQueryExpr",
    method: "POST",
    data,
  });
}
// 查询人员详情
export function getFilingPerson(id) {
  return selt.request({
    url: `/api/gatedpark/ctrFilingPersonEx/getFilingPerson/${id}`,
    method: "POST",
  });
}
// 新增承包商人员
export function addFilingPerson(data) {
  return selt.request({
    url: "/api/gatedpark/ctrFilingPersonEx/addFilingPerson",
    method: "POST",
    data,
  });
}
// 修改承包商
export function editFilingPerson(data) {
  return selt.request({
    url: "/api/gatedpark/ctrFilingPersonEx/editFilingPerson",
    method: "POST",
    data,
  });
}
// 修改状态
export function editPersonStatus(data) {
  return selt.request({
    url: "/api/gatedpark/ctrFilingPersonEx/editPersonStatus",
    method: "POST",
    data,
  });
}
// 修改人员冻结状态
export function ctrFilingPersonEx(data) {
  return selt.request({
    url: "/api/gatedpark/ctrFilingPersonEx/save",
    method: "PUT",
    data,
  });
}

// 删除承包商人员
export function deleteFilingPerson(data) {
  return selt.request({
    url: "/api/gatedpark/ctrFilingPersonEx/deleteFilingPerson",
    method: "DELETE",
    data,
  });
}
