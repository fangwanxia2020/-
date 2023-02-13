<template>
  <div class="auth-area">
    <back-bar :title="`授权区域-查看-${resourceName}`" />
    <div class="cl-body">
      <div class="cl-left">
        <div class="cl-hea-title">授权区域</div>
        <el-table ref="leftTable" :row-key="'id'" :data="leftDataShow">
          <el-table-column width="55">
            <template slot-scope="scope">
              <el-radio
                v-model="leftRadio"
                :label="scope.row.id"
                @click.native="handleSel(scope.row)"
              >
                &nbsp;
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column
            label="区域名称"
            prop="name"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="区域类型"
            prop="isExZone"
            :filters="[
              { text: '普通区域', value: '0' },
              { text: '防爆区域', value: '1' },
            ]"
            :filter-method="handleFilter"
          >
            <template slot-scope="scope">
              {{ getNameByKey(zoneList, scope.row.isExZone) }}
            </template>
          </el-table-column>
          <el-table-column
            label="位置缩略图"
            prop="imgSrc"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <img
                v-if="scope.row.imgSrc"
                :src="scope.row.imgSrc"
                class="img-src"
                @click="handleOpenPreview(scope.row.imgSrc)"
              />
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          :page.sync="l_page"
          :limit.sync="l_limit"
          :total="leftData.length"
          @pagination="handlePageChange_l"
        />
      </div>
      <div class="cl-right">
        <div class="cl-hea-title">{{ `授权设备-${titleName}` }}</div>
        <el-table ref="rightTable" :row-key="'id'" :data="rightDataShow">
          <el-table-column
            label="设备名称"
            prop="deviceName"
            sortable
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="IP地址"
            prop="ip"
            sortable
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="设备类型"
            prop="deviceType"
            :filters="[
              { text: '车闸', value: 1 },
              { text: '人闸', value: 2 },
            ]"
            :filter-method="handleFilter"
          >
            <template slot-scope="scope">
              {{ getNameByKey(tabsList, scope.row.deviceType) }}
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          :page.sync="r_page"
          :limit.sync="r_limit"
          :total="rightData.length"
          @pagination="handlePageChange_r"
        />
      </div>
    </div>
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
import {
  areaDetail,
  deviceDetailByArea,
} from "@/api/infrastructure/come-out-auth.js";
import MapImg from "@/mixin/map-img.js";
export default {
  mixins: [MapImg],
  data() {
    return {
      leftData: [],
      leftDataShow: [],
      rightData: [],
      rightDataShow: [],
      leftRadio: null,
      tabsList: [
        { code: "1", name: "车闸" },
        { code: "2", name: "人闸" },
      ],
      zoneList: [
        { code: "0", name: "普通区域" },
        { code: "1", name: "防爆区域" },
      ],
      resourceName: "",
      titleName: "",
      l_page: 1,
      l_limit: 10,
      r_page: 1,
      r_limit: 10,
    };
  },
  watch: {
    leftRadio(areaId) {
      this.getDevice(areaId);
    },
  },
  mounted() {
    this.getList();
    this.resourceName = this.$route.query.resourceName;
  },
  methods: {
    async getList() {
      let { resourceId, resourceType } = this.$route.query;
      let params = { resourceId, resourceType };
      let res = await areaDetail(params);
      this.leftData = res.data;
      this.leftDataShow = this.leftData.slice(
        (this.l_page - 1) * this.l_limit,
        this.l_page * this.l_limit,
      );
      this.handleFileData(res.data, "picUrl");
    },
    async getDevice(areaId) {
      let params = {
        pageNum: 1, // 页码
        pageSize: 9999999, // 显示数量
        query: {
          areaId,
        },
      };
      let res = await deviceDetailByArea(params);
      this.rightData = res.data.list;
      this.rightDataShow = this.rightData.slice(
        (this.r_page - 1) * this.r_limit,
        this.r_page * this.r_limit,
      );
    },
    handleSel(item) {
      this.titleName = item.name;
    },
    handlePageChange_l(obj) {
      this.l_page = obj.page;
      this.l_limit = obj.limit;
      this.leftDataShow = this.leftData.slice(
        (this.l_page - 1) * this.l_limit,
        this.l_page * this.l_limit,
      );
    },
    handlePageChange_r(obj) {
      this.r_page = obj.page;
      this.r_limit = obj.limit;
      this.rightDataShow = this.rightData.slice(
        (this.r_page - 1) * this.r_limit,
        this.r_page * this.r_limit,
      );
    },
    // 筛选
    handleFilter(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
  },
};
</script>

<style lang="scss" scoped>
.auth-area {
  .cl-body {
    padding: 10px;
    > div {
      float: left;
      width: 48%;
      &:last-child {
        float: right;
      }
    }
    .title {
      color: #000;
      font-size: 20px;
      font-weight: bold;
      margin: 0;
      margin-bottom: 10px;
    }
  }
  ::v-deep {
    .el-table__column-filter-trigger .el-icon-arrow-down {
      font-family: iconfonttywhp !important;
      font-size: 14px;
      color: #999;
      transform: unset;
      margin-left: 5px;
    }
    .el-table__column-filter-trigger .el-icon-arrow-down:before {
      content: "\E6B6" !important;
    }
  }
  .img-src {
    width: 100%;
    height: 50px;
    cursor: pointer;
    margin-top: 8px;
  }
}
</style>
