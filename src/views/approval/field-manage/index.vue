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
          <el-button type="text" @click="handleEdit(rowData)"> 编辑 </el-button>
        </template>
      </hqit-table>
    </template>
  </hqit-content-page>
</template>

<script>
import { getFieldManageList } from "@/api/approval/field-manage";
export default {
  components: {},
  data() {
    return {
      queryForm: {},
      columns: [
        {
          prop: "domainName",
          label: "功能名称",
        },
        {
          prop: "updateTime",
          label: "修改时间",
          formatter: (val) => {
            return this.awaySecond(val);
          },
        },
        {
          prop: "createTime",
          label: "创建时间",
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
          label: "功能名称",
          prop: "domainName",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "创建时间",
          type: "daterange",
          prop: "createTime",
        },
      ],
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    // 获取列表数据
    async getList(params) {
      let data = {
        pageNum: params.page,
        pageSize: params.size,
        systemFlag: "gatepark",
      };
      if (this.queryForm.domainName) {
        data["domainName"] = this.queryForm.domainName;
      }
      if (this.queryForm.createTime && this.queryForm.createTime.length) {
        data["beginTime"] = this.queryForm.createTime[0] + " 00:00:00";
        data["endTime"] = this.queryForm.createTime[1] + " 23:59:59";
      }
      let res = await getFieldManageList(data);
      this.$refs.table.page.total = res.data.total;
      return Promise.resolve({
        data: res.data.records,
      });
    },
    // 查看详情
    handleEdit(row) {
      const { domainId } = row || {};
      this.$router.push({
        path: "/gatedpark/approval/edit-field",
        query: {
          domainId,
        },
      });
      //
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
