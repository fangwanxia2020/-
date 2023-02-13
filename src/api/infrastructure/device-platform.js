import Vue from "vue";
const selt = Vue.prototype;

// 平台列表
export function getPlatformList(data) {
  return selt.request({
    url: "/api/gatedpark/sealedEdgePlat/pageByExpr",
    method: "POST",
    data,
  });
}

// 新增平台/编辑平台
export function addPlatform(data) {
  return selt.request({
    url: "/api/gatedpark/sealedEdgePlat/save",
    method: "PUT",
    data,
  });
}

// 平台详情
export function platformDetail(id) {
  return selt.request({
    url: `/api/gatedpark/sealedEdgePlat/get/${id}`,
    method: "GET",
  });
}

// 删除平台
export function delPlatform(data) {
  return selt.request({
    url: "/api/gatedpark/sealedEdgePlat/remove",
    method: "DELETE",
    data,
  });
}
