let baseUrl = "";
let previewUrl = "/preview/onlinePreview";
let VUE_APP_VERSION = "当前微应用版本号：V1.0.8";
console.log(VUE_APP_VERSION);
switch (process.env.VUE_APP_TITLE) {
  case "production": //生产
    baseUrl = "";
    break;
  case "development": //开发
    baseUrl = "http://124.227.1.175:9998/apigateway";
    previewUrl = "http://124.227.1.175:8012/onlinePreview";
    // baseUrl = "http://124.227.1.175:9998/api";
    break;
  case "Internal": //内部
    // baseUrl = 'http://gateway-hyit-dev.tianyuaninternet.com/apigateway/'
    baseUrl = "http://192.168.1.84:8892/";
    break;
  case "71test": //内部
    baseUrl = "/apigateway";
    break;
  case "hy": //华谊
    baseUrl = "http://192.168.1.84:8892/";
    break;
  default: // 本地开发
    baseUrl = "http://124.227.1.175:9998/apigateway";
}
export default baseUrl;
export { previewUrl };
