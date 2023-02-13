import Vue from "vue";
const selt = Vue.prototype;

// 根据code获取字典数据
export function getTypeCode(code) {
  return selt.request({
    url: `/api/sysudc/udc/typeCodeExpr/${code}`,
    method: "post",
  });
}
// 根据一级id获取二级数据
export function getListByParentId(id, data) {
  return selt.request({
    url: `/api/sysudc/udc/pageRelsByQueryExpr/${id}`,
    method: "post",
    data,
  });
}
