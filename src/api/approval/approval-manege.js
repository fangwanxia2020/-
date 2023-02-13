//流程实例处理
import Vue from "vue";
const selt = Vue.prototype;
// 查看模板列表
export function getTemplateList(params) {
  return selt.request({
    url: `/api/work-flow/define/list`,
    method: "GET",
    params,
  });
}
// 删除审批模板
export function delApprovalTem(params) {
  return selt.request({
    url: `/api/work-flow/define/removeByIds/${params}`,
    method: "POST",
  });
}
// 修改审批状态
export function ChangeApprovalStatus(data) {
  return selt.request({
    url: `/api/work-flow/domainTenant/changeNeedApproval`,
    method: "POST",
    data,
  });
}
// 审批设置里的开关状态
export function switchDeployStatus(data) {
  return selt.request({
    url: `/api/work-flow/define/deploySetting`,
    method: "POST",
    data,
  });
}
// 是否需要审批
export function hasNeedApproval(data) {
  return selt.request({
    url: `/api/work-flow/instance/noInstance`,
    method: "POST",
    data,
  });
}
// 新建审批任务
export function newApprovalTask(data) {
  return selt.request({
    url: `/api/work-flow/instance/newInstance`,
    method: "POST",
    data,
  });
}
//  可选的审批模板
export function ApprovalTemplate(domainId) {
  return selt.request({
    url: `/api/work-flow/define/list?deployFlag=1&domainId=${domainId}&pageNum=1&pageSize=9999`,
    method: "GET",
  });
}
// 获取实例模板id
export function getTemplateId(params) {
  return selt.request({
    url: `/api/work-flow/instance/getInstanceId`,
    method: "GET",
    params,
  });
}
// 撤回审批任务
export function withdrawTask(data) {
  return selt.request({
    url: `/api/work-flow/instance/cancel`,
    method: "POST",
    data,
  });
}
