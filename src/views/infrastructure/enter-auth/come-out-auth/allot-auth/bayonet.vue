<template>
  <div class="allot-bayonet">
    <CtTable
      ref="table"
      row-key="id"
      :has-btn="false"
      :request="getList"
      :page-sizes="[5, 10, 20, 30]"
      :default-page-size="5"
      :table-height="null"
      @selections="getSelections"
    >
      <template #search="scope">
        <el-form-item label="卡口名称: " prop="name">
          <el-input
            v-model="scope.params.name"
            placeholder="请输入卡口名称"
            clearable
            style="width: 200px"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
      </template>
      <template #table-columns>
        <el-table-column
          label="卡口名称"
          prop="name"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="位置缩略图" prop="imgSrc">
          <template slot-scope="scope">
            <img
              v-if="scope.row.imgSrc"
              :src="scope.row.imgSrc"
              class="img-src"
              @click="handleOpenPreview(scope.row.imgSrc)"
            />
          </template>
        </el-table-column>
      </template>
    </CtTable>
    <ViewImage
      v-if="dialogVisible"
      style="width: 100%; height: 100%"
      :on-close="handleClosePreview"
      :url-list="[dialogImageUrl]"
    >
    </ViewImage>
  </div>
</template>

<script>
import { bayonetList } from "@/api/infrastructure/access-control-equipment.js";
import MapImg from "@/mixin/map-img.js";
export default {
  mixins: [MapImg],
  data() {
    return {};
  },
  methods: {
    async getList(params) {
      let resParams = {
        order: "updateTime",
        sort: "DESC",
        pageNum: params.pageNum, // 页码
        pageSize: params.pageSize, // 显示数量
        query: [],
      };
      params.name &&
        resParams.query.push(
          this.handleExpression("LIKE", "name", params.name),
        ); // 卡口名称
      let res = await bayonetList(resParams);
      this.handleFileData(res.data.list);
      return {
        list: res.data.list,
        total: res.data.pagination.total,
      };
    },
    getSelections(selections) {
      this.$emit("selections", selections);
    },
    // 搜索
    handleSearch() {
      this.$refs.table.reload(1);
    },
    // 重置
    handleReset() {
      this.$refs.table.reset();
    },
  },
};
</script>

<style lang="scss" scoped>
.hq-crud {
  padding: 0 !important;
}
.img-src {
  width: 100%;
  height: 50px;
  cursor: pointer;
  margin-top: 8px;
}
</style>
