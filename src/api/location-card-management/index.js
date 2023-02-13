import Vue from "vue";
const selt = Vue.prototype;

// 查询预约单信息
export function getReserveInfo(data) {
  return selt.request({
    url: "/api/gatedpark/reserveVisitorEx/getVisitorInfo",
    method: "post",
    data,
  });
}
// 分页查询预约单信息
export function getPageVisitorInfo(data) {
  return selt.request({
    url: "/api/gatedpark/reserveVisitorEx/pageVisitorInfo",
    method: "post",
    data,
  });
}
// 查询访客类型预约单详情
export function getVisitorDetails(id) {
  return selt.request({
    url: `/api/gatedpark/reserveVisitorEx/getVisitor/${id}`,
    method: "get",
  });
}

// 查询人车类型预约单详情
export function getVehicleDetails(id) {
  return selt.request({
    url: `/api/gatedpark/reserveVehicleEx/getVehicle/${id}`,
    method: "get",
  });
}
// 新增/保存中长期卡/续卡
export function saveOrUpdateCardApply(data) {
  return selt.request({
    url: `/api/gatedpark/sealedCardApply/saveOrUpdateCardApply`,
    method: "put",
    data,
  });
}
// 查询中长期卡/续卡列表
export function getCardApplyList(data) {
  return selt.request({
    url: `/api/gatedpark/sealedCardApply/pageCardApplyByQueryExpr`,
    method: "POST",
    data,
  });
}
// 发卡冻结解冻查询
export function pageSendCardByExpr(data) {
  return selt.request({
    url: `/api/gatedpark/sealedCardApply/pageSendCardByExpr`,
    method: "POST",
    data,
  });
}
// 查询中长期卡详情
export function getCardApply(id) {
  return selt.request({
    url: `/api/gatedpark/sealedCardApply/getCardApply/${id}`,
    method: "get",
  });
}
// 删除中长期卡列表数据
export function removeCard(data) {
  return selt.request({
    url: `/api/gatedpark/sealedCardApply/remove`,
    method: "DELETE",
    data,
  });
}
//  查询中长期卡单的人/车辆信息{id}
export function getVisitor(id) {
  return selt.request({
    url: `/api/gatedpark/sealedCardApply/getCardApply/${id}`,
    method: "get",
  });
}
//  绑定定位卡页面，查询批次里的人/车辆信息{id}
export function getSendApplyCardInfo(id) {
  return selt.request({
    url: `/api/gatedpark/sealedCardApply/getSendApplyCardInfo/${id}`,
    method: "get",
  });
}
//  企业发卡列表
export function getCarByApplyId(id) {
  return selt.request({
    url: `/api/gatedpark/cardProvideRec/listOrgCarByApplyId/${id}`,
    method: "get",
  });
}

//查询预约访客或车辆的绑卡信息
export function getVisitorBindCardInfoById(id) {
  return selt.request({
    url: `/api/gatedpark/reserveVisitorEx/getVisitorBindCardInfo/${id}`,
    method: "POST",
  });
}

//预约单发卡校验定位卡号
export function checkCardNo(cardNo) {
  return selt.request({
    url: `/api/gatedpark/reserveVisitorEx/visitorSendCard/${cardNo}`,
    method: "get",
  });
}

// 预约发卡一键绑卡
export function reserveSendCard(data) {
  return selt.request({
    url: `/api/gatedpark/reserveVisitorEx/reserveSendCard`,
    method: "POST",
    data,
  });
}
// 单张发卡
export function singleSendCard(data) {
  return selt.request({
    url: `/api/gatedpark/cardProvideRec/sendCard`,
    method: "POST",
    data,
  });
}
// 查询人员或车辆绑定的卡号
export function getBindCardNum(data) {
  return selt.request({
    url: `/api/location/lc/batchQueryByBindId`,
    method: "POST",
    data,
  });
}
// 新增/编辑中长期卡续期
export function saveOrUpdateCardRenew(data) {
  return selt.request({
    url: `/api/gatedpark/sealedCardApply/saveOrUpdateCardRenew`,
    method: "put",
    data,
  });
}
//  查询中长期卡续期详情
export function getCardRenew(id) {
  return selt.request({
    url: `/api/gatedpark/sealedCardApply/getCardRenew/${id}`,
    method: "get",
  });
}
//  查询中长期卡续期详情（新）
export function getCardRenewNew(id) {
  return selt.request({
    url: `/api/gatedpark/sealedCardApply/getCardRenewNew/${id}`,
    method: "get",
  });
}
// 根据卡号/姓名/手机号查询定位卡实时绑定信息
export function getBindInfo(data) {
  return selt.request({
    url: `/api/location/locCardBindRt/queryBindInfo`,
    method: "POST",
    data,
  });
}
// 根据卡号/姓名/手机号查询定位卡实时绑定信息(冻结卡)
export function getCardInfo(data) {
  return selt.request({
    url: `/api/location/locCardBindRt/querycardInfo`,
    method: "POST",
    data,
  });
}
// 查询定位卡列表
export function getLocCardList(data) {
  return selt.request({
    url: `/api/location/lc/pageByExpr`,
    method: "post",
    data,
  });
}
//查询空闲状态定位卡
export function getIDleLocCardList(data) {
  return selt.request({
    url: `/api/location/lc/listByExpr`,
    method: "post",
    data,
  });
}
// 卡挂失
export function cardLoseRec(data) {
  return selt.request({
    url: `/api/gatedpark/cardLoseRec/lose`,
    method: "post",
    data,
  });
}
// 卡冻结
export function freezeCard(data) {
  return selt.request({
    url: `/api/location/lc/batchStatusChange`,
    method: "post",
    data,
  });
}

// 查询防爆卡操作记录列表
export function getListCardReplaceRec(data) {
  return selt.request({
    url: `/api/gatedpark/cardReplaceRec/listCardReplaceRec`,
    method: "post",
    data,
  });
}

//定位卡一键换绑
export function reBindingCard(data) {
  return selt.request({
    url: `/api/gatedpark/sealedCardApply/reBinding`,
    method: "post",
    data,
  });
}
// 定位卡列表
export function cardList(data) {
  return selt.request({
    url: "/api/gatedpark/cardLoseReport/pageByExpr",
    method: "POST",
    data,
  });
}
// 批量删除定位卡
export function removeCardLoseReport(data) {
  return selt.request({
    url: `/api/gatedpark/cardLoseReport/remove`,
    method: "DELETE",
    data,
  });
}
// 定位卡列表处理
export function cardDeal(data) {
  return selt.request({
    url: "/api/gatedpark/cardLoseReport/deal",
    method: "POST",
    data,
  });
}
// 定位卡列表处理
export function batchQueryLocCard(data) {
  return selt.request({
    url: "/api/location/lc/listByCardNos",
    method: "POST",
    data,
  });
}
// 定位卡列表导出
export function cardExportDeal(data) {
  return selt.request({
    url: "/api/gatedpark/cardLoseReport/export",
    method: "POST",
    responseType: "blob", // 表明返回服务器返回的数据类型
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });
}
//  查询定位卡详情
export function getLocCardModel(id) {
  return selt.request({
    url: `/api/location/locCardModel/get/${id}`,
    method: "get",
  });
}
// 根据续期批次ID查询人/车信息
export function getApplyCodeInfo(id) {
  return selt.request({
    url: `/api/gatedpark/sealedCardApply/getApplyCodeInfo/${id}`,
    method: "get",
  });
}
// 企业发卡一键绑卡
export function saveOrgCar(data) {
  return selt.request({
    url: `/api/gatedpark/cardProvideRec/saveOrgCar`,
    method: "PUT",
    data,
  });
}
