import Vue from "vue";
const selt = Vue.prototype;

// 访客管理列表
export function getVisitorList(data) {
  return selt.request({
    url: "/api/gatedpark/sealedTemporaryPerson/pageTemporaryPersonList",
    method: "POST",
    data,
  });
}

// 新建/编辑访客 编辑的话data中需要有id
export function addVisitor(data) {
  return selt.request({
    url: "/api/gatedpark/sealedTemporaryPerson/save",
    method: "PUT",
    data,
  });
}

// 访客详情
export function visitorDetail(id) {
  return selt.request({
    url: "/api/gatedpark/sealedTemporaryPerson/get/" + id,
    method: "GET",
  });
}
