import Vue from "vue";
const selt = Vue.prototype;

// 查询运单列表
export function getWaybillList(data) {
  return selt.request({
    url: `/api/hcplm/htw/QueryWaybillList`,
    method: "POST",
    data,
  });
}
// 电子运单品名
export function getListByExpr(data) {
  return selt.request({
    url: `/api/hazard/hm/listByExpr`,
    method: "POST",
    data,
  });
}
// 保存电子运单单据
export function saveWaybillAndDetail(data) {
  return selt.request({
    url: `/api/hcplm/htw/saveWaybillAndDetail`,
    method: "PUT",
    data,
  });
}

// 根据运单id获取运单信息
export function getWaybillInfo(id) {
  return selt.request({
    url: `/api/hcplm/htw/getWaybill/${id}`,
    method: "get",
  });
}
// 根据name获取危化品详情信息
export function getWaybillGetMaterialByName(name) {
  return selt.request({
    url: `/api/hcplm/htw/waybillGetMaterialByName/${name}`,
    method: "get",
  });
}

// 查询两客一危列表
export function getVerifyRec(data) {
  return selt.request({
    url: `/api/gatedpark/cvVerifyRec/pageByQueryExpr`,
    method: "POST",
    data,
  });
}
// 两客一危校验-查看详情
export function getWaybillByWaybillCode(waybillCode) {
  return selt.request({
    url: `/api/gatedpark/cvVerifyRec/getWaybillByWaybillCode/${waybillCode}`,
    method: "POST",
    // data,
  });
}

// 删除电子运单
// export function delArea(id) {
//   return selt.request({
//     url: `/api/basedata/area/remove/${id}`,
//     method: "DELETE",
//   });
// }
