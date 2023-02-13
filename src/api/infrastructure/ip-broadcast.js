import Vue from "vue";
const selt = Vue.prototype;

// 分页表达式获取ip广播列表
export function getIpBroadcastList(data) {
  return selt.request({
    url: "/api/gatedpark/broadcast/pageByQueryExpr",
    method: "POST",
    data,
  });
}

// 根据id获取ip广播数据
export function getIpBroadcastById(id) {
  return selt.request({
    url: "/api/gatedpark/broadcast/get/" + id,
  });
}

// 根据id删除ip广播
export function delIpBroadcastById(id) {
  return selt.request({
    url: "/api/gatedpark/broadcast/remove/" + id,
    method: "DELETE",
  });
}

// 新增或修改ip广播
export function addOrUpdateIpBroadcast(data) {
  return selt.request({
    url: "/api/gatedpark/broadcast/saveOrUpdate",
    method: "PUT",
    data,
  });
}
