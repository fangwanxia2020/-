import Vue from "vue";
const selt = Vue.prototype;

// 文件详情（单个）
export function fileSingleDetail(id) {
  return selt.request({
    url: "/api/sysfile/file_info/get/" + id,
    method: "GET",
  });
}

// 文件详情（多个）
export function fileBatchDetail(data) {
  return selt.request({
    url: "/api/sysfile/file_info/listByIds",
    method: "POST",
    data,
  });
}

// 文件上传
export function fileUpload(data) {
  return selt.request({
    url: "/api/sysfile/file_info/upload",
    method: "POST",
    data,
    headers: {
      "Content-Type": "multipart/form-data;charset=UTF-8",
    },
  });
}

// 文件流
export function fileFlow(data) {
  return selt.request({
    url: "/api/sysfile/file_info/download",
    method: "GET",
    params: data,
    responseType: "blob",
  });
}
