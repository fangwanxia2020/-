//模板管理
import Vue from "vue";

const selt = Vue.prototype;

//查询某领域下的流程模板定义列表
// export function getFlowsDefineList(params) {
//   return selt.request({
//     url: `/flow/flowInfo/flowsDefine/pagedSimpleList`,
//     method: "get",
//     params,
//   });
// }

//更改某个领域是否需要审批
// export function changeNeedApproval(data) {
//   return selt.request({
//     url: `/work-flow/domainTenant/changeNeedApproval`,
//     method: "post",
//     data,
//   });
// }

//获取某一个流程的模板定义
export function getFlowDefine(id) {
  return selt.request({
    url: `/api/work-flow/define/${id}`,
    method: "get",
  });
}

//新增/修改流程模板
export function defineFlowInfo(data) {
  return selt.request({
    url: `/api/work-flow/define/saveDefine`,
    method: "post",
    data,
  });
}

//快速启用/禁用一个流程模板
export function deploySetting(data) {
  return selt.request({
    url: `/api/work-flow/define/deploySetting`,
    method: "post",
    data,
  });
}

//删除流程模板
export function deleteDefine(ids) {
  return selt.request({
    url: `/api/work-flow/define/removeByIds/${ids}`,
    method: "post",
  });
}
// export function getListNoPage(query) {
//   return selt.request({
//     url: `/worksite/workflowRole/listNoPage`,
//     method: "get",
//     params: query,
//   });
// }
