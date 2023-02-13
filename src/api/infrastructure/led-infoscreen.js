import Vue from "vue";
const selt = Vue.prototype;

// 分页表达式获取led信息屏列表
export function getLedInfoScreenList(data) {
  return selt.request({
    url: "/api/gatedpark/sealedEdgeLed/pageByQueryExpr",
    method: "POST",
    data,
  });
}

// 根据id获取led信息屏数据
export function getLedInfoScreenById(id) {
  return selt.request({
    url: "/api/gatedpark/sealedEdgeLed/get/" + id,
  });
}

// 根据id删除led信息屏
export function delLedScreenById(id) {
  return selt.request({
    url: "/api/gatedpark/sealedEdgeLed/remove/" + id,
    method: "DELETE",
  });
}

// 新增或修改led信息屏
export function addOrUpdateLedScreen(data) {
  return selt.request({
    url: "/api/gatedpark/sealedEdgeLed/saveOrUpdate",
    method: "PUT",
    data,
  });
}
