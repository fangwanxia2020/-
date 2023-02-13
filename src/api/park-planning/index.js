import Vue from "vue";
const selt = Vue.prototype;
// 获取卡口列表
export function getBayonetList(data) {
  return selt.request({
    url: "/api/gatedpark/gateway/pageByExpr",
    method: "post",
    data,
  });
}

// 卡口保存
export function save(data) {
  return selt.request({
    url: "/api/gatedpark/gateway/save",
    method: "put",
    data,
  });
}
//
// 查询卡口详情
export function getDetails(id) {
  return selt.request({
    url: `/api/gatedpark/gateway/get/${id}`,
    method: "get",
  });
}

// 卡口删除
export function remove(id) {
  return selt.request({
    url: `/api/gatedpark/gateway/remove/${id}`,
    method: "delete",
  });
}
