import Vue from "vue";
const selt = Vue.prototype;

// 区域列表
export function getAreaList(data) {
  return selt.request({
    url: "/api/basedata/area/queries",
    method: "POST",
    data,
  });
}

// 设备列表
export function getDeviceList(data) {
  return selt.request({
    url: "/api/gatedpark/areaDeviceRel/listAreaDevice",
    method: "POST",
    data,
  });
}

// 新增区域
export function addArea(data) {
  return selt.request({
    url: "/api/basedata/area/saveArea",
    method: "POST",
    data,
  });
}

// 编辑区域
export function editArea(data) {
  return selt.request({
    url: "/api/basedata/area/updateArea",
    method: "POST",
    data,
  });
}

// 区域详情
export function areaDetail(id) {
  return selt.request({
    url: `/api/basedata/area/getArea/${id}`,
    method: "GET",
  });
}

// 删除区域
export function delArea(id) {
  return selt.request({
    url: `/api/basedata/area/remove/${id}`,
    method: "DELETE",
  });
}

// 删除区域关联的设备
export function delDeviceArea(id) {
  return selt.request({
    url: `/api/gatedpark/areaDeviceRel/remove/${id}`,
    method: "DELETE",
  });
}

// 设备分配-提交分配
export function saveAllot(data) {
  return selt.request({
    url: "/api/gatedpark/areaDeviceRel/saveBatch",
    method: "POST",
    data,
  });
}

// 获取设备总数
export function getDeviceCount(data) {
  return selt.request({
    url: "/api/gatedpark/areaDeviceRel/countDeviceNums",
    method: "POST",
    data,
  });
}
