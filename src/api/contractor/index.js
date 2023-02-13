import Vue from "vue";
const selt = Vue.prototype;

// 查询入驻备案列表
export function getCtrFilingList(data) {
  return selt.request({
    url: "/api/gatedpark/ctrFiling/pageList",
    method: "post",
    data,
  });
}

//新增入驻备案
export function addCtrFiling(data) {
  return selt.request({
    url: "/api/gatedpark/ctrFiling/addCtrFiling",
    method: "post",
    data,
  });
}
//修改入驻备案
export function editCtrFiling(data) {
  return selt.request({
    url: "/api/gatedpark/ctrFiling/editCtrFiling",
    method: "post",
    data,
  });
}
//变更入驻备案
export function changeCtrFiling(data) {
  return selt.request({
    url: "/api/gatedpark/ctrFiling/changeCtrFiling",
    method: "post",
    data,
  });
}

// 获取资质列表
export function getBctList(data) {
  return selt.request({
    url: "/api/basedata/scc/list",
    method: "post",
    data,
  });
}
// 查询入驻备案全部列表
export function getCtrAllList(data) {
  return selt.request({
    url: "/api/gatedpark/ctrFiling/listByExpr",
    method: "post",
    data,
  });
}
//获取入驻备案详情
export function getCtrFilingDetail(id) {
  return selt.request({
    url: `/api/gatedpark/ctrFiling/getCtrFiling/${id}`,
    method: "get",
  });
}
//删除入驻备案
export function removeCtr(id) {
  return selt.request({
    url: `/api/gatedpark/ctrFiling/remove/${id}`,
    method: "delete",
  });
}
//提交审批
export function submitApproval(id) {
  return selt.request({
    url: `/api/gatedpark/ctrFiling/submitApproval/${id}`,
    method: "post",
  });
}

//获取入驻备案变更详情
export function getChangeCtrFiling(id) {
  return selt.request({
    url: `/api/gatedpark/ctrFiling/getChangeCtrFiling/${id}`,
    method: "get",
  });
}

// 查询变更备案列表
export function getPageChangeList(data) {
  return selt.request({
    url: "/api/gatedpark/ctrFiling/pageChangeList",
    method: "post",
    data,
  });
}
