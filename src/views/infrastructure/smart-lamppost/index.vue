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
        <template slot="operator">
          <hqit-button
            size="mini"
            btn-type="add"
            btn-text="新增"
            @click="handleAdd"
          ></hqit-button>
        </template>
        <template slot="opts" slot-scope="{ rowData }">
          <el-button type="text" @click="handleCheck(rowData)">
            查看
          </el-button>
          <el-button type="text" @click="handleEdit(rowData)"> 修改 </el-button>
          <el-button type="text" @click="handleDel(rowData)"> 删除 </el-button>
        </template>
      </hqit-table>
      <FormDialog
        ref="model"
        :width="460"
        :title="title"
        :show-cancel-btn="(title || '').indexOf('查看—') == -1"
        :show-submit-btn="(title || '').indexOf('查看—') == -1"
        @submit="resetForm"
      >
        <template #default="scope">
          <Add v-bind="scope.data" />
        </template>
      </FormDialog>
    </template>
  </hqit-content-page>
</template>

<script>
import {
  getLampList,
  getLampById,
  delLampById,
} from "@/api/infrastructure/smart-lamppost.js";
import { errorBoundary, delPrompt } from "@/utils/tool.js";
import Add from "./add.vue";
export default {
  name: "led-infoscreen",
  components: { Add },
  data() {
    return {
      title: "新增",
      columns: [
        {
          prop: "code",
          label: "灯杆编号",
        },
        {
          prop: "name",
          label: "灯杆名称",
        },
        {
          prop: "modelNumber",
          label: "灯杆型号",
        },
        {
          prop: "deviceNum",
          label: "挂载设备数",
        },
        {
          prop: "position",
          label: "位置",
        },
        {
          prop: "updateTime",
          label: "更新时间",
          sortable: true,
          formatter: (val) => {
            return this.awaySecond(val);
          },
        },
        {
          prop: "opts",
          label: "操作",
          align: "right",
          slotname: "opts",
          width: 170,
        },
      ],
      searchConfig: [
        {
          label: "编号",
          prop: "code",
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "名称",
          prop: "name",
          expression: "EQ",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "型号",
          prop: "modelNumber",
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "更新时间",
          prop: "updateTime",
          type: "daterange",
        },
      ],
      queryForm: {},
    };
  },
  methods: {
    async getList(params) {
      let resParams = {
        order: "updateTime",
        sort: "DESC",
        pageNum: params.page, // 页码
        pageSize: params.size, // 显示数量
        query: {},
        expr: [],
      };
      this.searchConfig.forEach((configItem) => {
        if (
          this.queryForm[configItem.prop] &&
          this.queryForm[configItem.prop] != "" &&
          configItem.expression
        ) {
          resParams.expr.push({
            key: configItem.prop,
            value: this.queryForm[configItem.prop],
            expression: configItem.expression,
          });
        }
      });
      // 更新时间
      if (this.queryForm.updateTime) {
        resParams.expr.push({
          key: "updateTime",
          expression: "GE",
          value: this.queryForm.updateTime[0] + " 00:00:00",
        });
        resParams.expr.push({
          key: "updateTime",
          expression: "LE",
          value: this.queryForm.updateTime[1] + " 23:59:59",
        });
      }
      let res = await getLampList(resParams);
      this.$refs.table.page.total = res.data.pagination.total;
      return Promise.resolve({
        data: res.data.list,
      });
    },
    // 查看
    handleCheck(row) {
      this.title = "智慧灯杆— 查看— " + row.name;
      console.log("查看");
      this.$refs.model.openModel({
        data: {
          data: { ...row },
          pageType: "check",
        },
      });
    },
    // 新增
    handleAdd() {
      this.title = "智慧灯杆— 新增";
      console.log("新增");

      this.$refs.model.openModel({
        data: {
          pageType: "add",
        },
      });
    },
    // 修改
    handleEdit(row) {
      this.title = "智慧灯杆— 修改— " + row.name;
      console.log("修改");

      getLampById(row.id).then((res) => {
        this.$refs.model.openModel({
          data: {
            data: { ...res.data },
            isUpdate: true,
            pageType: "edit",
          },
        });
      });
    },
    // // 删除
    // handleDel(row) {
    //   this.$refs.table.deleteNotice(() => delLampById(row.id));
    // },
    // 删除
    async handleDel(row) {
      const valid = await errorBoundary(delPrompt(this, row.protocol));
      if (valid) {
        const res = await delLampById(row.id);
        if (res.code == "200") {
          this.$message.success("删除成功");
          this.handleSearch();
        }
      } else {
        this.$message({
          message: "删除取消",
        });
      }
    },
    // 查询
    handleSearch(params) {
      this.queryForm = {
        ...this.queryForm,
        ...params,
      };
      this.$refs.table.getData({}, true);
    },
    //重置搜索
    resetForm() {
      this.queryForm = {};
      this.$refs.table.$refs.table.clearSort();
      this.$refs.table.getData({}, true);
    },
  },
};
</script>

<style lang="scss" scoped>
.smart-lamppost {
  height: 100%;
  padding: 10px !important;
}
</style>
