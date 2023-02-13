//用户管理----------
import Vue from "vue";
import store from "@/store";
const selt = Vue.prototype;

export function login(data) {
  const { grant_type, client_id, client_secret, password, username } = data;
  return selt.request({
    url: `/auth/oauth/token?grant_type=${grant_type}&client_id=${client_id}&client_secret=${client_secret}&username=${username}&password=${password}&tenant=0`,
    method: "post",
  });
}
export function getInfo() {
  return selt.request({
    url: `/auth/user/profile`,
    method: "get",
  });
}
export function logout() {
  return selt.request({
    url: "/api/system/loginOut",
    method: "get",
  });
}
export function getRouters() {
  return selt.request({
    url: `/api/system/sys_menu/route`,
    method: "get",
  });
}

// 根据personId获取部门信息
export function getDeptInfo(personId) {
  return selt.request({
    url: `/api/system/sys_dept/listByPersonId/${personId}`,
    method: "get",
  });
}

//根据单位获取部门树
export function getDeptTreeListByOrgId() {
  console.log(store);
  const orgId = store.getters.orgId;
  console.log(orgId);
  return selt.request({
    url: `/api/system/sys_dept/treeByExpr`,
    method: "post",
    data: [{ expression: "EQ", key: "orgId", value: 1001 }],
  });
}
