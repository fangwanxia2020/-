let Base64 = require("js-base64").Base64;
export function previewFile(previewUrl, url, params) {
  params = params || {};
  url = decodeURIComponent(url); // 防止文件名过长或中文名或特殊字符问题

  var u = navigator.userAgent; // const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端

  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端

  var base64Url = Base64.encode(url);
  var encodeUrl = encodeURIComponent(base64Url);
  var queryMap = {
    url: encodeUrl,
  };

  for (var key in params) {
    queryMap[key] = params[key];
  }

  var queryArr = [];
  Object.keys(queryMap).forEach(function (key, index) {
    var pair = "".concat(key, "=").concat(queryMap[key]);

    if (index === 0) {
      pair = "?".concat(key, "=").concat(queryMap[key]);
    }

    queryArr.push(pair);
  });
  var query = queryArr.join("&");
  var openUrl = previewUrl + query;

  if (isiOS) {
    // ios 兼容问题修复
    window.location.href = openUrl;
    return;
  }

  window.open(openUrl);
}
