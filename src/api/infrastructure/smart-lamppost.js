import Vue from "vue";
const selt = Vue.prototype;

// 分页表达式获取智慧灯杆列表
export function getLampList(data) {
  return selt.request({
    url: "/api/gatedpark/lamp/queries",
    method: "POST",
    data,
  });
}

// 根据id获取智慧灯杆数据
export function getLampById(id) {
  return selt.request({
    url: "/api/gatedpark/lamp/get/" + id,
  });
}

// 根据id删除智慧灯杆
export function delLampById(id) {
  return selt.request({
    url: "/api/gatedpark/lamp/remove/" + id,
    method: "DELETE",
  });
}

// 新增或修改智慧灯杆
export function addOrUpdateLamp(data) {
  return selt.request({
    url: "/api/gatedpark/lamp/saveOrUpdate",
    method: "PUT",
    data,
  });
}
