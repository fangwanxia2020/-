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
            查看详情
          </el-button>
        </template>
      </hqit-table>
    </template>
  </hqit-content-page>
</template>

<script>
import { getTemplateList } from "@/api/approval/role-setting.js";
import { getApplicationList } from "@/api/my-application/application.js";
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
          prop: "status",
          label: "审批结果",
          formatter: (val) => {
            return this.getStatus(val);
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
          label: "审批结果",
          prop: "status",
          type: "select",
          options: [
            { value: 2, label: "审批中" },
            { value: 3, label: "审批通过" },
            { value: 4, label: "审批拒绝" },
          ],
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
    getStatus() {
      return (status) => {
        let name;
        switch (status) {
          case 2:
            name = "审批中";
            break;
          case 3:
            name = "审批通过";
            break;
          case 4:
            name = "审批拒绝";
            break;
          case 5:
            name = "审批撤回";
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
      };
      this.queryForm.status && (data["status"] = this.queryForm.status);
      this.queryForm.domainName &&
        (data["domainId"] = this.queryForm.domainName);
      this.queryForm.createTime &&
        (data["beginCreateTime"] = this.queryForm.createTime[0] + " 00:00:00");
      this.queryForm.createTime &&
        (data["endCreateTime"] = this.queryForm.createTime[1] + " 23:59:59");
      let res = await getApplicationList(data);
      this.$refs.table.page.total = res.data.total;
      return Promise.resolve({
        data: res.data.records,
      });
    },
    // 查看详情
    handleEdit(row) {
      console.log(row);
      this.$router.push({
        path: "/gatedpark/approval/hasDo?detail=true",
        query: {
          instanceId: row.instanceId,
          domainId: row.domainId,
          isTaskId: true,
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
