import Vue from "vue";
const selt = Vue.prototype;

// 组织树
export function getOrgList(data) {
  return selt.request({
    url: "/api/system/sys_org/treeByExpr",
    method: "POST",
    data,
  });
}
export function getOrgtree(params) {
  return selt.request({
    url: "/api/system/sys_org_details/queryOrgByName",
    method: "GET",
    params,
  });
}
//获取组织列表
export function getOrgListData(data) {
  return selt.request({
    url: "/api/system/sys_org/listByExpr",
    method: "POST",
    data,
  });
}
// 人员列表
export function getPersonList(data) {
  return selt.request({
    url: "/api/system/sys_person_details_ex/pageByQuery",
    method: "POST",
    data,
  });
}
// 车辆列表
export function getCarList(data) {
  return selt.request({
    // url: "/api/basedata/bvc/pageQuery",
    url: "/api/basedata/stvm/pageByQueryExpr",
    method: "POST",
    data,
  });
}

// 组织门禁分配列表
export function getOrganizationList(data) {
  return selt.request({
    url: "/api/gatedpark/accessPermission/pageAccessPermissionList",
    method: "POST",
    data,
  });
}

// 分配权限-提交
export function saveAllot(data) {
  return selt.request({
    url: "/api/gatedpark/accessPermission/saveAccessPermissionAndSend",
    method: "PUT",
    data,
  });
}

// 分配权限-删除
export function delAllot(data) {
  return selt.request({
    url: "/api/gatedpark/accessPermission/removeByIds",
    method: "DELETE",
    data,
  });
}
// 根据姓名/手机号查询人员信息(单张发卡查询)
export function getPersonListByQuery(data) {
  return selt.request({
    url: "/api/system/sys_person_details/listByQuery",
    method: "POST",
    data,
  });
}
// 根据姓名/车牌号查询车辆信息（单张发卡查询）
export function getCarListByQuery(name) {
  return selt.request({
    url: `/api/basedata/bvc/listByPersonNameOrVehicleCode?name=${name}`,
    method: "GET",
  });
}
// 已绑卡人员/车辆列表
export function getBandCardList(data) {
  return selt.request({
    url: "/api/location/locCardBindRt/queryPerson",
    method: "POST",
    data,
  });
}
// 获取组织详情信息
export function getOrgDetails(id) {
  return selt.request({
    url: `/api/system/sys_org_details/getByOrgId/${id}`,
    method: "GET",
  });
}
// 查询车辆种类
export function getCarKindList(data) {
  return selt.request({
    url: `/api/basedata/stvt/list`,
    method: "POST",
    data,
  });
}
// 人员详情(根据personId去查)
export function personIdDetail(id) {
  return selt.request({
    url: `/api/system/sys_person_details/getByPersonId/${id}`,
    method: "GET",
  });
}
// 承包商详情
export function contractorDetail(id) {
  return selt.request({
    url: `/api/gatedpark/ctrFiling/getCtrFiling/${id}`,
    method: "GET",
  });
}
