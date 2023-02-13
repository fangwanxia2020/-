//main.js 入口函数引入的相关工具类库

import Vue from "vue";

import toDateUtil from "ty-pc/lib/utils/date";
import { previewFile } from "./previewFile";
import md5 from "js-md5";
//公共方法引入--------------------------------------
import {
  parseTime,
  resetForm,
  addDateRange,
  selectDictLabel,
  download,
  handleTree,
  getImgArr,
  getIdStr,
  checkStatus,
} from "@/utils/tool.js";
Vue.prototype.parseTime = parseTime;
Vue.prototype.$toDateUtil = toDateUtil; //时间转换工具
Vue.prototype.$md5 = md5; // MD5加密
Vue.prototype.$previewFile = previewFile; // 预览文件
Vue.prototype.$resetForm = resetForm;
Vue.prototype.$addDateRange = addDateRange;
Vue.prototype.$selectDictLabel = selectDictLabel;
Vue.prototype.$download = download;
Vue.prototype.$handleTree = handleTree;
Vue.prototype.$getImgArr = getImgArr;
Vue.prototype.$getIdStr = getIdStr;
Vue.prototype.$checkStatus = checkStatus;
Vue.prototype.$msgSuccess = function (msg) {
  this.$message({
    showClose: true,
    message: msg,
    type: "success",
  });
};
Vue.prototype.$msgError = function (msg) {
  this.$message({
    showClose: true,
    message: msg,
    type: "error",
  });
};
Vue.prototype.$msgInfo = function (msg) {
  this.$message.info(msg);
};
Vue.prototype.$msgWarning = function (msg) {
  this.$message({
    showClose: true,
    message: msg,
    type: "warning",
  });
};
/**
 * 检测图片是否存在
 * @param url
 */
let imageIsExist = function (url) {
  return new Promise((resolve) => {
    var img = new Image();
    img.onload = function () {
      if (this.complete == true) {
        resolve(true);
        img = null;
      }
    };
    img.onerror = function () {
      resolve(false);
      img = null;
    };
    img.src = url;
  });
};

//全局注册自定义指令，用于判断当前图片是否能够加载成功，可以加载成功则赋值为img的src属性，否则使用默认图片
Vue.directive("temp-img", async function (el, binding) {
  //指令名称为：temp-img
  let imgURL = binding.value; //获取图片地址
  if (imgURL) {
    let exist = await imageIsExist(imgURL);
    if (exist) {
      el.setAttribute("src", imgURL);
    }
  }
});
import "./drag"; // 自定义拖拽事件
// 引入delPopover
import delPopover from "@/components/delPopover/delPopover";
import addNode from "@/components/approval/addNode";
import nodeWrap from "@/components/approval/nodeWrap";
Vue.use(delPopover).use(addNode).use(nodeWrap);
Vue.component("delPopover", delPopover);
Vue.component("nodeWrap", nodeWrap); //初始化组件
Vue.component("addNode", addNode); //初始化组件

//引入公共组件---------------
//引入样式
import "ty-pc/lib/index/style.css";
//按需引入
import {
  TyCheckbox,
  TyIcon,
  TyTable,
  TyDictionary,
  TyDialog,
  TyCascader,
  TyTable1,
  TyBusinessCrud1,
  TyUpload,
  TyUploadFile,
  TyUploadFile1,
  PcForm,
  TyEditTable,
  TyRadio,
  TyExport,
  TyMultiText,
  TyDateTime,
  TyDropdown,
  TyRadio2,
} from "ty-pc";
[
  TyCheckbox,
  TyIcon,
  TyTable,
  TyDictionary,
  TyDialog,
  TyCascader,
  TyTable1,
  TyBusinessCrud1,
  TyUpload,
  TyUploadFile,
  TyUploadFile1,
  PcForm,
  TyEditTable,
  TyRadio,
  TyExport,
  TyMultiText,
  TyDateTime,
  TyDropdown,
  TyRadio2,
].forEach((v) => {
  Vue.use(v);
});
import hqitComponent from "hqit-component";
Vue.use(hqitComponent);
