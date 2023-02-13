import Vue from "vue";
const selt = Vue.prototype;

// 机具管理列表
export function getMachineList(data) {
  return selt.request({
    url: "/api/gatedpark/SealedMachinesManager/pageByExpr",
    method: "POST",
    data,
  });
}

// 新建/编辑机具 编辑的话data中需要有id
export function addMachine(data) {
  return selt.request({
    url: "/api/gatedpark/SealedMachinesManager/save",
    method: "PUT",
    data,
  });
}

// 机具详情
export function machineDetail(id) {
  return selt.request({
    url: "/api/gatedpark/SealedMachinesManager/get/" + id,
    method: "GET",
  });
}

// 机具拉黑
export function machineBlack(data) {
  return selt.request({
    url: "/api/gatedpark/SealedMachinesManager/addMachinesBlack",
    method: "POST",
    data,
  });
}
