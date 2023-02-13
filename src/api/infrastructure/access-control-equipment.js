import Vue from "vue";
const selt = Vue.prototype;

// 卡口下拉
export function bayonetList(data) {
  return selt.request({
    url: "/api/gatedpark/gateway/pageByExpr",
    method: "POST",
    data,
  });
}

// 平台下拉
export function platformList(data) {
  return selt.request({
    url: "/api/gatedpark/sealedEdgePlat/pageByExpr",
    method: "POST",
    data,
  });
}

// 根据平台ID查询人闸设备列表/根据平台ID查询车闸信息列表
export function getDeviceListByPlatformId(platId, data) {
  return selt.request({
    url: `/api/edgeplat/device/page?platId=${platId}`,
    method: "POST",
    data,
  });
}

// --- 通道 ---
// 通道列表
export function passList(data) {
  return selt.request({
    url: "/api/gatedpark/sealedEdgeAccessChan/pageByExpr",
    method: "POST",
    data,
  });
}

// 新增通道/修改通道
export function addPass(data) {
  return selt.request({
    url: "/api/gatedpark/sealedEdgeAccessChan/addOrUpdateChan",
    method: "POST",
    data,
  });
}

// 通道详情
export function passDetail(id) {
  return selt.request({
    url: `/api/gatedpark/sealedEdgeAccessChan/get/${id}`,
    method: "GET",
  });
}

// 删除通道
export function delPass(data) {
  return selt.request({
    url: "/api/gatedpark/sealedEdgeAccessChan/remove",
    method: "DELETE",
    data,
  });
}

// 修改状态
export function editStatus(data) {
  return selt.request({
    url: "/api/gatedpark/sealedEdgeAccessChan/save",
    method: "PUT",
    data,
  });
}

// --- 通道 ---

// --- 人闸 ---
// 人闸列表
export function personLockList(data) {
  return selt.request({
    url: "/api/gatedpark/sealedEdgePacDevice/pageByQueryExpr",
    method: "POST",
    data,
  });
}

// 修改人闸
export function editPersonLock(data) {
  return selt.request({
    url: "/api/gatedpark/sealedEdgePacDevice/save",
    method: "PUT",
    data,
  });
}

// 人闸详情
export function personLockDetail(id) {
  return selt.request({
    url: `/api/gatedpark/sealedEdgePacDevice/get/${id}`,
    method: "GET",
  });
}

// 删除人闸
export function delPersonLock(data) {
  return selt.request({
    url: "/api/gatedpark/sealedEdgePacDevice/remove",
    method: "DELETE",
    data,
  });
}

// 保存人闸设备
export function savePersonLockDevice(data) {
  return selt.request({
    url: "/api/gatedpark/sealedEdgePacDevice/saveFaceDevice",
    method: "POST",
    data,
  });
}
// --- 人闸 ---

// --- 车闸 ---
// 车闸列表
export function carLockList(data) {
  return selt.request({
    url: "/api/gatedpark/sealedEdgeVacDevice/pageVacDevice",
    method: "POST",
    data,
  });
}

// 修改车闸
export function editCarLock(data) {
  return selt.request({
    url: "/api/gatedpark/sealedEdgeVacDevice/updateVacDevice",
    method: "POST",
    data,
  });
}

// 车闸详情
export function carLockDetail(id) {
  return selt.request({
    url: `/api/gatedpark/sealedEdgeVacDevice/getById/${id}`,
    method: "GET",
  });
}

// 删除车闸
export function delCarLock(data) {
  return selt.request({
    url: "/api/gatedpark/sealedEdgeVacDevice/remove",
    method: "DELETE",
    data,
  });
}

// 保存车闸设备
export function saveCarLockDevice(data) {
  return selt.request({
    url: "/api/gatedpark/sealedEdgeVacDevice/saveVacDevice",
    method: "POST",
    data,
  });
}
// --- 车闸 ---
