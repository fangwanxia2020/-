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
        :use-expr="false"
        :show-select="false"
        :show-index="false"
        @search="handleSearch"
        @reset="resetForm"
      >
        <template slot="needApproval" slot-scope="{ rowData }">
          <el-switch
            v-model="rowData.needApproval"
            :active-value="1"
            :inactive-value="0"
            :width="50"
            @change="switchStatus(rowData)"
          >
          </el-switch>
        </template>
        <template slot="opts" slot-scope="{ rowData }">
          <el-button type="text" @click="handleEdit(rowData)">
            查看模板
          </el-button>
        </template>
      </hqit-table>
    </template>
  </hqit-content-page>
</template>

<script>
import { ChangeApprovalStatus } from "@/api/approval/approval-manege";
import { getTemplateList } from "@/api/approval/role-setting";
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
          prop: "needApproval",
          label: "需要审批",
          slotname: "needApproval",
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
      if (this.queryForm.domainName && this.queryForm.domainName != "") {
        data["domainName"] = this.queryForm.domainName;
      }
      if (this.queryForm.createTime && this.queryForm.createTime.length) {
        data["beginTime"] = this.queryForm.createTime[0];
        data["endTime"] = this.queryForm.createTime[1];
      }
      let result = await getTemplateList(data);
      this.$refs.table.page.total = result.data.total;
      return Promise.resolve({
        data: {
          list: result.data.records,
        },
      });
    },
    // 审批状态修改
    switchStatus(row) {
      let name;
      row.needApproval == "1" ? (name = "启用") : (name = "停用");
      this.$confirm(`确定 ${name}审批吗？`, "提示")
        .then(() => {
          ChangeApprovalStatus({
            domainId: row.domainId,
            needApproval: Number(row.needApproval),
          })
            .then(() => {
              // 修改成功
              this.$msgSuccess("修改成功");
              this.$refs.table.getData({}, true);
            })
            .catch(() => {
              row.needApproval == "1"
                ? (row.needApproval = 0)
                : (row.needApproval = 1);
            });
        })
        .catch(() => {
          row.needApproval == "1"
            ? (row.needApproval = 0)
            : (row.needApproval = 1);
        });
    },
    // 查看详情
    handleEdit(row) {
      this.$router.push({
        path: "/gatedpark/approval/approval-setting",
        query: { domainId: row.domainId },
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

<style lang="scss" scoped>
::v-deep .el-switch__core::before {
  content: "停用";
  position: absolute;
  font-size: 12px;
  top: -1px;
  right: 5px;
  color: #fff;
}

.is-checked ::v-deep .el-switch__core::before {
  content: "启用";
  position: absolute;
  font-size: 12px;
  top: -1px;
  left: 5px;
  color: #fff;
}
</style>
