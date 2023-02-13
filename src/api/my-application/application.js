//流程实例处理
import Vue from "vue";
const selt = Vue.prototype;
// 获取我的申请列表
export function getApplicationList(params) {
  return selt.request({
    url: `/api/work-flow/instance/listOfMyApply`,
    method: "get",
    params,
  });
}
// 待办任务跟已办任务列表
export function getTaskList(params) {
  return selt.request({
    url: `/api/work-flow/task/taskList`,
    method: "get",
    params,
  });
}
