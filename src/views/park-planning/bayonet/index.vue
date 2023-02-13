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
      >
        <template slot="locationImg" slot-scope="{ rowData }">
          <img
            v-if="rowData.imgSrc"
            :src="rowData.imgSrc"
            class="img-src"
            @click="handleOpenPreview(rowData.imgSrc)"
          />
        </template>
        <template slot="operator">
          <hqit-button
            size="mini"
            btn-type="add"
            btn-text="新增"
            @click="handleAdd"
          ></hqit-button>
        </template>
        <template slot="opts" slot-scope="{ rowData }">
          <el-button type="text" @click="handleCheck(rowData)">查看</el-button>
          <el-button type="text" @click="handleEdit(rowData)">修改</el-button>
          <el-button type="text" @click="handleDel(rowData)">删除</el-button>
        </template>
      </hqit-table>

      <FormDialog ref="model" :title="title" :width="800" @submit="handleReset">
        <template #default="scope">
          <Add v-bind="scope.data" />
        </template>
      </FormDialog>

      <ViewImage
        v-if="dialogVisible"
        style="width: 100%; height: 100%"
        :on-close="handleClosePreview"
        :url-list="[dialogImageUrl]"
      >
      </ViewImage>
    </template>
  </hqit-content-page>
</template>
<script>
import { getDetails, remove, getBayonetList } from "@/api/park-planning";
import MapImg from "@/mixin/map-img.js";
import Add from "./add.vue";
export default {
  components: { Add },
  mixins: [MapImg],
  data() {
    return {
      columns: [
        {
          prop: "name",
          label: "名称",
        },
        {
          label: "位置缩略图",
          width: "200",
          slotname: "locationImg",
          "show-overflow-tooltip": false,
        },
        {
          prop: "remarks",
          label: "备注",
        },
        {
          prop: "updateName",
          label: "更新者",
        },
        {
          prop: "updateTime",
          label: "更新时间",
          formatter: (val) => {
            return this.awaySecond(val);
          },
        },
        {
          prop: "opts",
          label: "操作",
          align: "right",
          slotname: "opts",
        },
      ],
      searchConfig: [
        {
          label: "名称",
          prop: "name",
          expression: "LIKE",
          attrs: {
            clearable: true,
            placeholder: "请输入",
          },
        },
        {
          label: "更新时间",
          type: "daterange",
          prop: "updateTime",
          attrs: {
            "start-placeholder": "开始时间",
            "end-placeholder": "结束时间",
          },
        },
      ],
      queryForm: {},
      title: "",
    };
  },
  methods: {
    // 获取列表
    async getList(params) {
      let resParams = {
        order: "updateTime",
        sort: "DESC",
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        query: [],
      };
      this.searchConfig.forEach((configItem) => {
        if (
          this.queryForm[configItem.prop] &&
          this.queryForm[configItem.prop] != "" &&
          configItem.expression
        ) {
          resParams.query.push({
            key: configItem.prop,
            value: this.queryForm[configItem.prop],
            expression: configItem.expression,
          });
        }
      });
      if (this.queryForm.updateTime) {
        resParams.query.push({
          key: "updateTime",
          expression: "GE",
          value: this.queryForm.updateTime[0],
        });
        // 更新时间 大于等于
        resParams.query.push({
          key: "updateTime",
          expression: "LE",
          value: this.queryForm.updateTime[1],
        }); // 更新时间 小于等于
      }
      let res = await getBayonetList(resParams);
      this.handleFileData(res.data.list);
      return res;
    },
    // 删除
    async handleDel(row) {
      const valid = await this.errorBoundary(this.delPrompt(this, row.name));
      if (valid) {
        remove(row.id).then((res) => {
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
    // 新增
    handleAdd() {
      this.title = `卡口管理— 新增`;
      this.$refs.model.openModel();
    },
    // 修改
    handleEdit(row) {
      this.title = `卡口管理— 修改— ${row.name}`;
      getDetails(row.id).then((res) => {
        this.$refs.model.openModel({
          data: {
            data: { ...res.data },
            isUpdate: true,
          },
        });
      });
    },
    // 查看
    handleCheck(row) {
      this.title = `卡口管理— 查看— ${row.name}`;
      getDetails(row.id).then((res) => {
        this.$refs.model.openModel({
          data: {
            data: { ...res.data },
            isUpdate: true,
            pageType: "check",
          },
        });
      });
    },
    // 查询
    handleSearch(params) {
      this.queryForm = {
        ...params,
      };
      this.$refs.table.getData({}, true);
    },
    // 重置
    handleReset() {
      this.queryForm = {};
      this.$refs.table.$refs.table.clearFilter();
      this.$refs.table.getData({}, true);
    },
  },
};
</script>

<style lang="scss" scoped>
.img-src {
  width: 100%;
  height: 50px;
  cursor: pointer;
  margin-top: 8px;
}
</style>
