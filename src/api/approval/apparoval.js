//模板管理
import Vue from "vue";

const selt = Vue.prototype;

//获取审批流_流程实例详细信息
export function getInstanceInfo(instanceId) {
  return selt.request({
    url: `/api/work-flow/instance/getInstanceInfo?instanceId=${instanceId}`,
    method: "get",
  });
}

// // 查询_任务_角色_对应的人员列表
// export function getRoleDomainRoleBindInfo(data) {
//   return selt.request({
//     url: `/worksite/workflowOrgRoleUser/roleDomainRoleBindInfo`,
//     method: "post",
//     data,
//     // params: query
//   });
// }
//代办任务 审批保存
export function auditWorkflowTask(data) {
  return selt.request({
    url: `/api/work-flow/task/audit`,
    method: "post",
    data,
  });
}

//修改自由节点任务
export function updataTaslFree(data) {
  return selt.request({
    url: `/api/work-flow/task/free`,
    method: "post",
    data,
  });
}
// //新增/修改流程模板
// export function defineFlowInfo(data) {
//   return selt.request({
//     url: `/worksite/workflowDefine/addWorkflowDefine`,
//     method: "post",
//     data,
//   });
// }
