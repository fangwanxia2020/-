import Vue from "vue";
const selt = Vue.prototype;

// 待办任务-新

// tab选择列表
export function getTabList(params) {
  return selt.request({
    url: `/api/work-flow/domain/listSort`,
    method: "GET",
    params,
  });
}

// 根据domainid获取业务id集合(待办任务、已办任务)
export function getTaskIds(params) {
  return selt.request({
    url: `/api/work-flow/task/newTaskList`,
    method: "GET",
    params,
  });
}

// 根据domainid获取业务id集合(我的申请)
export function getMyApplyIds(params) {
  return selt.request({
    url: `/api/work-flow/instance/listOfMyApplyNew`,
    method: "GET",
    params,
  });
}
