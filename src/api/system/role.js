import Vue from "vue";
const selt = Vue.prototype;

// 查询角色列表
export function getRoleList(data) {
  return selt.request({
    url: "/api/system/sys_role/pageByExpr",
    method: "POST",
    data,
  });
}

// 查询用户列表
export function getUserList(data) {
  return selt.request({
    url: "/api/system/sys_user/pageByExpr",
    method: "POST",
    data,
  });
}
