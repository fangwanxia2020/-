<template>
  <div id="area" class="page-wrapper">
    <div class="left-box">
      <div class="cl-search">
        <el-input
          v-model="searchVal"
          placeholder="请输入区域名称"
          prefix-icon="el-icon-search"
          clearable
          @keyup.enter.native="getList"
        >
        </el-input>
        <i class="el-icon-circle-plus" @click="handleAdd"></i>
      </div>
      <div class="cl-list">
        <div
          v-for="item in areaList"
          :key="item.id"
          :class="currentId == item.id ? 'list-item active' : 'list-item'"
          @click="handleClick(item.id)"
        >
          <div class="item-t">
            <i
              class="el-icon-location"
              :style="currentId == item.id ? 'color: #3766fe;' : ''"
            ></i>
            <span>{{ item.name }}</span>
            <i class="el-icon-edit" @click.stop="handleEdit(item.id)"></i>
            <i class="el-icon-delete" @click.stop="handleDel(item)"></i>
          </div>
          <div class="item-b">
            <span>设备总数({{ item.deviceNum }})</span> |
            <span>在线({{ item.onlineNum }})</span> |
            <span>离线({{ item.unOnlineNum }})</span>
          </div>
        </div>
      </div>
      <div class="cl-page">
        <el-pagination
          v-if="areaList.length"
          layout="prev, pager, next"
          :total="total"
          :page-size="5"
          :current-page.sync="pageNum"
          @current-change="handleCurrent"
        ></el-pagination>
      </div>
    </div>
    <div class="right-box">
      <el-tabs v-model="tabsActive">
        <el-tab-pane
          v-for="item in tabsList"
          :key="item.code"
          :label="item.name"
          :name="item.code"
        ></el-tab-pane>
      </el-tabs>
      <Map v-if="tabsActive == 1" ref="map" />
      <Warn v-if="tabsActive == 2" />
      <Device v-if="tabsActive == 3" :area-id="currentId" />
    </div>

    <FormDialog ref="model" :title="title" :width="800" @submit="getList">
      <template #default="scope">
        <Add v-bind="scope.data" :sucbol.sync="sucbol" />
      </template>
    </FormDialog>
  </div>
</template>

<script>
import Map from "./map/index.vue";
import Warn from "./warn/index.vue";
import Device from "./device/index.vue";
import Add from "./add.vue";
import {
  getAreaList,
  areaDetail,
  delArea,
  getDeviceCount,
} from "@/api/park-planning/area.js";
import { errorBoundary, delPrompt } from "@/utils/tool.js";
import {
  createPolygonByPoint,
  createCircleByPoint,
} from "@/map/map/modules/drawActiveByself";
export default {
  components: { Map, Warn, Device, Add },
  data() {
    return {
      areaList: [],
      total: 0,
      pageNum: 1,
      searchVal: null,
      currentId: null,
      tabsList: [
        { code: "1", name: "地图区域" },
        { code: "2", name: "告警规则" },
        { code: "3", name: "设备列表" },
      ],
      tabsActive: "1",
      title: "",
      sucbol: false,
    };
  },
  watch: {
    sucbol(val) {
      if (val) {
        this.handleClick(this.currentId);
        this.sucbol = false;
      }
    },
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取区域列表数据
    getList() {
      let params = {
        order: "createTime",
        sort: "DESC",
        pageNum: this.pageNum,
        pageSize: 5,
        query: {},
        expr: [],
      };
      this.searchVal &&
        params.expr.push(this.handleExpression("LIKE", "name", this.searchVal)); // 区域地址
      getAreaList(params).then((res) => {
        this.areaList = res.data.list;
        this.total = res.data.pagination.total;
        if (res.data.list.length) {
          this.getDeviceCount(res.data.list.map((item) => item.id));
        }
      });
    },
    // 根据区域id获取区域对应的设备数/在线数/离线数
    getDeviceCount(idArr) {
      getDeviceCount(idArr).then((res) => {
        this.areaList.forEach((aitem) => {
          res.data.forEach((ritem) => {
            if (aitem.id == ritem.areaId) {
              this.$set(aitem, "deviceNum", ritem.deviceNum); // 设备总数
              this.$set(aitem, "onlineNum", ritem.onlineNum); // 在线数
              this.$set(aitem, "unOnlineNum", ritem.unOnlineNum); // 离线数
            }
          });
        });
      });
    },
    // 区域地址选中
    handleClick(id) {
      this.currentId = id;
      console.log("this.$refs.map", this.$refs.map);
      const view = this.$refs.map.$children[0].view;

      areaDetail(id).then((res) => {
        console.log("res", res);
        if (res.code == 200) {
          if (res.data.shapeType == 0) {
            createCircleByPoint(res.data.roundArray, res.data.radius, view);
            return;
          }
          if (res.data.shapeType == 1) {
            createPolygonByPoint(res.data.polygonArray, view);
            return;
          }
          this.$message({
            type: "warning",
            message: "该区域下没有维护区域信息",
          });
        }
      });
    },
    // 页码切换
    handleCurrent(pageNum) {
      this.pageNum = pageNum;
      this.getList();
    },
    // 新增
    handleAdd() {
      this.title = "新增";
      this.$refs.model.openModel();
    },
    // 修改
    handleEdit(id) {
      this.title = "修改";
      areaDetail(id).then((res) => {
        this.$refs.model.openModel({
          data: {
            data: { ...res.data },
            isUpdate: true,
          },
        });
      });
    },
    // 删除
    async handleDel(row) {
      const valid = await errorBoundary(delPrompt(this, row.name));
      if (valid) {
        const res = await delArea(row.id);
        if (res.code == "200") {
          this.$message.success("删除成功");
          this.getList();
        }
      } else {
        this.$message({ message: "删除取消" });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#area {
  display: flex;
  justify-content: space-between;
  height: 100%;
  .left-box {
    height: 100%;
    width: 280px;
    margin-right: 20px;
    padding: 10px;
    border: 1px solid #f6f7f9;
    .cl-search {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      .el-icon-circle-plus {
        color: #3766fe;
        font-size: 20px;
        cursor: pointer;
        margin-left: 10px;
      }
    }
    .cl-list {
      .list-item {
        padding: 10px;
        cursor: pointer;
        border: 1px solid #f2f2f2;
        border-radius: 5px;
        margin-bottom: 10px;
        .item-t {
          display: flex;
          // justify-content: center;
          align-items: center;
          border-bottom: 1px solid #e8e8e8;
          margin-bottom: 10px;
          padding-bottom: 10px;
          span {
            display: inline-block;
            width: calc(100% - 45px);
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 14px;
            padding: 0 5px;
          }
          .el-icon-location {
            font-size: 14px;
          }
          .el-icon-edit,
          .el-icon-delete {
            cursor: pointer;
            margin-left: 3.5px;
            font-size: 12px;
            color: #4e5969;
          }
        }
        .item-b {
          font-size: 12px;
          color: #909399;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
      .active {
        background-color: #eef5ff;
        border: 1px solid #f2f2f2;
        border-radius: 5px;
      }
    }
    .cl-page {
      text-align: center;
    }
  }
  .right-box {
    height: 100%;
    width: calc(100% - 300px);
  }
}
</style>
