//流程实例处理
import Vue from "vue";
const selt = Vue.prototype;
// 获取流程角色设置列表
export function getRoleSettingList(params) {
  return selt.request({
    url: `/api/work-flow/workFlowRole/list`,
    method: "GET",
    params,
  });
}
// 新增流程角色
export function addRole(data) {
  return selt.request({
    url: `/api/work-flow/workFlowRole/addWorkflowRole`,
    method: "POST",
    data,
  });
}
//  删除流程角色
export function DeleteRole(params) {
  return selt.request({
    url: `/api/work-flow/workFlowRole/removeByIds/${params}`,
    method: "POST",
  });
}
//  修改流程角色状态
export function updateStatus(data) {
  return selt.request({
    url: `/api/work-flow/workFlowRole/updateWRoleStatus`,
    method: "POST",
    data,
  });
}
// 审批流程下拉列表（领域管理查询列表接口）
export function getTemplateList(params) {
  return selt.request({
    url: `/api/work-flow/domain/list`,
    method: "GET",
    params,
  });
}
// 模板设置选择流程角色列表
export function getProcessRoleList(domainId) {
  return selt.request({
    url: `/api/work-flow/workFlowRole/listRole?domainId=${domainId}&status=1`,
    method: "GET",
  });
}

// 查询关联用户列表
export function getAssociationUserList(params) {
  return selt.request({
    url: `/api/work-flow/workflowRoleRel/list`,
    method: "GET",
    params,
  });
}
// 新增关联用户人员
export function addAssociationUser(data) {
  return selt.request({
    url: `/api/work-flow/workflowRoleRel/addWorkflowRoleRel`,
    method: "POST",
    data,
  });
}
// 删除关联用户人员
export function deleteAssociationUser(params) {
  return selt.request({
    url: `/api/work-flow/workflowRoleRel/removeByIds/${params}`,
    method: "POST",
  });
}
// 查询岗位列表
export function searchPostList(data) {
  return selt.request({
    url: `api/system/sys_post/pageByExpr`,
    method: "POST",
    data,
  });
}
