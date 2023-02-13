import Vue from "vue";
const selt = Vue.prototype;

// 查询摄像头设备
export function getEdgevacDeviceList(data) {
  return selt.request({
    url: "/api/gatedpark/graph/edgevacDeviceList",
    method: "post",
    data,
  });
}

//根据code获取拉流地址
export function getVideoByCode(code) {
  return selt.request({
    url: `/api/basedata/bc/videoByCode/${code}`,
    method: "get",
  });
}

// 查询门禁设备
export function getEdgePacDeviceList(data) {
  return selt.request({
    url: "/api/gatedpark/graph/edgePacDeviceList",
    method: "post",
    data,
  });
}
