//领域管理
import Vue from "vue";
const selt = Vue.prototype;
// 查看领域管理列表
export function getFieldManageList(params) {
  return selt.request({
    url: `/api/work-flow/domain/list`,
    method: "GET",
    params,
  });
}
//获取一个或所有的领域列表
export function getDomainInfo(id) {
  return selt.request({
    url: `/api/work-flow/domain/${id}`,
    method: "get",
  });
}

//定义领域功能(新建)
export function defineDomain(data) {
  return selt.request({
    url: `/api/work-flow/domain/editDomain`,
    method: "post",
    data,
  });
}

//获取方法列表
export function getFunList(id) {
  return selt.request({
    url: `/api/work-flow/function/${id}`,
    method: "get",
  });
}
