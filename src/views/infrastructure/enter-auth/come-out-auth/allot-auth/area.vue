<template>
  <div class="allot-area">
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
        <el-form-item label="区域名称: " prop="name">
          <el-input
            v-model="scope.params.name"
            placeholder="请输入区域名称"
            clearable
            style="width: 200px"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
      </template>
      <template #table-columns>
        <el-table-column
          label="区域名称"
          prop="name"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="区域类型"
          prop="shapeType"
          show-overflow-tooltip
          :filters="[
            { text: '普通区域', value: 0 },
            { text: '防爆区域', value: 1 },
          ]"
          :filter-method="handleFilter"
        >
          <template slot-scope="scope">
            {{ getNameByKey(zoneList, scope.row.shapeType) }}
          </template>
        </el-table-column>
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
import { getAreaList } from "@/api/park-planning/area.js";
import MapImg from "@/mixin/map-img.js";
export default {
  mixins: [MapImg],
  data() {
    return {
      zoneList: [
        { code: "0", name: "普通区域" },
        { code: "1", name: "防爆区域" },
      ],
    };
  },
  methods: {
    async getList(params) {
      let resParams = {
        order: "createTime",
        sort: "DESC",
        pageNum: params.pageNum, // 页码
        pageSize: params.pageSize, // 显示数量
        query: {},
        expr: [],
      };
      params.name &&
        resParams.expr.push(this.handleExpression("LIKE", "name", params.name)); // 区域名称
      let res = await getAreaList(resParams);
      this.handleFileData(res.data.list, "picUrl");
      return {
        list: res.data.list,
        total: res.data.pagination.total,
      };
    },
    getSelections(selections) {
      this.$emit("selections", selections);
    },
    // 筛选
    handleFilter(value, row, column) {
      const property = column["property"];
      return row[property] === value;
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
