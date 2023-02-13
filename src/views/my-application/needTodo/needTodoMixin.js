import { getTaskIds, getMyApplyIds } from "@/api/my-application/needTodo.js";

export default {
  inject: {
    tabsId: { default: "" },
    listType: { default: "" },
  },
  computed: {
    gettabsId() {
      return this.tabsId ? this.tabsId() : "";
    },
    getlistType() {
      return this.listType ? this.listType() : "";
    },
  },
  watch: {
    getlistType() {
      this.handleSearch();
    },
  },
  methods: {
    async handleIds(params) {
      let idParams = {
        domainId: this.gettabsId,
        pageNum: params.page || params.pageNum,
        pageSize: params.size || params.pageSize,
      };
      let request = this.getlistType == 3 ? getMyApplyIds : getTaskIds;
      let res = await request(
        this.getlistType == 3
          ? idParams
          : Object.assign(idParams, { taskType: this.getlistType }),
      );
      return this.getlistType == 3 ? res.data : res.data.records[0];
    },
    // 去审批/查看结果/查看详情
    handleToOperate(row, who) {
      // who 1-待办任务 2-已办任务 3-我的申请
      let obj = {
        instanceId: row.instanceId,
        domainId: this.gettabsId,
        isTaskId: true,
      };
      this.$router.push({
        path: "/gatedpark/approval/hasDo",
        query:
          who == 2 || who == 3 ? Object.assign(obj, { detail: true }) : obj,
      });
    },
  },
};
