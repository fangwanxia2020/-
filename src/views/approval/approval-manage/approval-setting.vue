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
        <template slot="operator">
          <hqit-button
            size="mini"
            btn-text="返回"
            @click="linkTo"
          ></hqit-button>
          <hqit-button
            size="mini"
            btn-type="add"
            btn-text="新增"
            @click="addTemplate"
          ></hqit-button>
        </template>
        <template slot="deployFlag" slot-scope="{ rowData }">
          <el-switch
            v-model="rowData.deployFlag"
            :active-value="1"
            :inactive-value="0"
            :width="50"
            @change="switchStatus(rowData)"
          >
          </el-switch>
        </template>
        <template slot="opts" slot-scope="{ rowData }">
          <el-button type="text" @click="addTemplate(rowData)">
            编辑模板
          </el-button>
          <el-button type="text" @click="delTemplate(rowData)">
            删除
          </el-button>
        </template>
      </hqit-table>
    </template>
  </hqit-content-page>
</template>

<script>
import {
  getTemplateList,
  switchDeployStatus,
  delApprovalTem,
} from "@/api/approval/approval-manege";
export default {
  components: {},
  data() {
    return {
      queryForm: {},
      selections: [],
      columns: [
        {
          prop: "procName",
          label: "模版名称",
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
          prop: "deployFlag",
          label: "使用状态",
          slotname: "deployFlag",
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
          label: "模版名称",
          prop: "procName",
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

  mounted() {},

  methods: {
    // 获取列表数据
    async getList(params) {
      let data = {
        page: params.page,
        size: params.size,
        domainId: this.$route.query.domainId,
      };
      if (this.queryForm.procName && this.queryForm.procName != "") {
        data["procName"] = this.queryForm.procName;
      }
      if (this.queryForm.createTime && this.queryForm.createTime.length) {
        data["beginTime"] = this.queryForm.createTime[0];
        data["endTime"] = this.queryForm.createTime[1];
      }
      let res = await getTemplateList(data);
      this.$refs.table.page.total = res.data.total;
      return Promise.resolve({
        data: res.data.records,
      });
    },
    // 批量删除
    async delTemplate(row) {
      if (row.deployFlag == 1) {
        this.$message.error("不允许删除启用的流程模板！");
        return;
      }
      const valid = await this.errorBoundary(this.delPrompt(this, row.name));
      if (valid) {
        delApprovalTem([row.defineId]).then((res) => {
          if (res.code != 200) return this.$message.error(res.msg);
          this.$message.success(res.msg);
          this.$refs.table.getData({}, true);
        });
      } else {
        this.$message({
          message: "删除取消",
        });
      }
    },
    // 模板开关状态修改
    switchStatus(row) {
      let name;
      row.deployFlag == "1" ? (name = "启用") : (name = "停用");
      this.$confirm(`确定 ${name}模板吗？`, "提示")
        .then(() => {
          switchDeployStatus({
            defineId: row.defineId,
            deployFlag: Number(row.deployFlag),
          })
            .then(() => {
              // 修改成功
              this.$msgSuccess("修改成功");
              this.$refs.table.getData({}, true);
            })
            .catch(() => {
              row.deployFlag == "1"
                ? (row.deployFlag = 0)
                : (row.deployFlag = 1);
            });
        })
        .catch(() => {
          row.deployFlag == "1" ? (row.deployFlag = 0) : (row.deployFlag = 1);
        });
    },
    // 选中的数组
    getSelections(data) {
      this.selections = data;
    },
    addTemplate(row) {
      this.$router.push({
        path: "/gatedpark/approval/approvalEditTemplate",
        query: {
          defineId: row ? row.defineId : "",
          domainId: this.$route.query.domainId,
          isFrame: true,
        },
      });
    },
    linkTo() {
      this.$router.go(-1);
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
::v-deep .el-table-column--selection .cell {
  padding-left: 10px;
}
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
