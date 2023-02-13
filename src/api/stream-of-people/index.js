import Vue from "vue";
const selt = Vue.prototype;

// 获取人员工种配置
export function getJobConfig() {
  return selt.request({
    url: `/api/gatedpark/jobConfig/listJobConfig`,
    method: "post",
  });
}

//保存人员工种配置
export function saveJobConfig(data) {
  return selt.request({
    url: `/api/gatedpark/jobConfig/saveJobConfig`,
    method: "put",
    data,
  });
}

//活动区域分析
export function activityAreaAnalysis(data) {
  return selt.request({
    url: `/api/gatedpark/perVehicleAccessTime/activityAreaAnalysis`,
    method: "post",
    data,
  });
}
