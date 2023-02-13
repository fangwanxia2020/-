import Vue from "vue";
const selt = Vue.prototype;

// 查询值域关联列表
export function udcTypeList() {
  return selt.request({
    url: "api/sysudc/udc-type/pageByQueryExpr",
    method: "POST",
    data: {
      pageNum: 1,
      pageSize: 9999,
      expr: [
        { value: "1539446888431976450", key: "udcGroupId", expression: "LIKE" },
      ],
      code: "",
      name: "",
      udcGroupId: "1539446888431976450",
      order: "createTime",
      sort: "DESC",
      createTime: "",
    },
  });
}

// 查询字典类型详细
export function getType(dictId) {
  return selt.request({
    url: "/basic/system/dict/type/" + dictId,
    method: "get",
  });
}
