/**
 * 为 Vue 添加全局功能
 */
 import {addInstanceProperties} from '@/assets/js/plugins/constants.js';

 export default {
   install(Vue, options) {
     // 添加全局实例属性
     addInstanceProperties(Vue, options);
   }
 }
