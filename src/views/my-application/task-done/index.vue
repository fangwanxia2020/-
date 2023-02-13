<template>
  <hqit-content-page type="list">
    <template slot="content">
      <hqit-table
        ref="table"
        border
        :data-source="getList"
        :columns="columns"
        :prop-show-pager="true"
        :search-config="searchConfig"
        :show-select="false"
        :use-expr="false"
        @search="handleSearch"
        @reset="resetForm"
      >
        <template slot="opts" slot-scope="{ rowData }">
          <el-button type="text" @click="handleEdit(rowData)">
            查看结果
          </el-button>
        </template>
      </hqit-table>
    </template>
  </hqit-content-page>
</template>

<script>
import { getTemplateList } from "@/api/approval/role-setting.js";
import { getTaskList } from "@/api/my-application/application.js";
export default {
  components: {},
  data() {
    return {
      queryForm: {},
      columns: [
        {
          prop: "domainName",
          label: "任务类型",
        },
        {
          prop: "instanceName",
          label: "任务名称",
        },
        {
          prop: "originatorUserName",
          label: "发起人",
        },
        {
          prop: "originatorDeptName",
          label: "发起部门",
        },
        {
          prop: "operationType",
          label: "处理结果",
          formatter: (val) => {
            return this.checkOperaType(val);
          },
        },
        {
          prop: "startTime",
          label: "发起时间",
          formatter: (val) => {
            return this.awaySecond(val);
          },
        },
        {
          prop: "opts",
          label: "操作",
          align: "right",
          slotname: "opts",
          width: 200,
        },
      ],
      searchConfig: [
        {
          label: "任务类型",
          prop: "domainName",
          type: "select",
          options: [],
        },
        {
          label: "发起人",
          prop: "originatorUserName",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "发起时间",
          type: "daterange",
          prop: "createTime",
        },
      ],
    };
  },
  computed: {
    checkOperaType() {
      return (num) => {
        let name;
        switch (num) {
          case 1:
            name = "待审批";
            break;
          case 2:
            name = "审批中";
            break;
          case 3:
            name = "审批通过";
            break;
          case 4:
            name = "审批不通过";
            break;
          case 6:
            name = "审批驳回";
            break;
          default:
            name = "";
            break;
        }
        return name;
      };
    },
  },
  watch: {},
  mounted() {
    getTemplateList().then((res) => {
      this.searchConfig.find((v) => v.prop == "domainName").options =
        res.data.records.map((item) => {
          return { label: item.domainName, value: item.domainId };
        });
    });
  },
  methods: {
    // 获取列表数据
    async getList(params) {
      let data = {
        pageNum: params.page,
        pageSize: params.size,
        taskType: 2,
      };
      this.queryForm.originatorUserName &&
        (data["originatorUserName"] = this.queryForm.originatorUserName);
      this.queryForm.domainName &&
        (data["domainId"] = this.queryForm.domainName);
      this.queryForm.createTime &&
        (data["beginTime"] = this.queryForm.createTime[0] + " 00:00:00");
      this.queryForm.createTime &&
        (data["endTime"] = this.queryForm.createTime[1] + " 23:59:59");
      let res = await getTaskList(data);
      this.$refs.table.page.total = res.data.total;
      return Promise.resolve({
        data: res.data.records,
      });
    },
    // 查看结果
    handleEdit(row) {
      this.$router.push({
        path: "/gatedpark/approval/hasDo",
        query: {
          instanceId: row.instanceId,
          domainId: row.domainId,
          isTaskId: true,
          detail: true,
        },
      });
    },
    // 查询
    handleSearch(params) {
      this.queryForm = {
        ...params,
      };
      this.$refs.table.getData({}, true);
    },
    resetForm() {
      this.queryForm = {};
      this.$refs.table.getData({}, true);
    },
  },
};
</script>

<style lang="scss" scoped></style>
