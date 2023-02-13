<template>
  <div class="sync-device">
    <div class="left-table">
      <div class="device-list">
        <div class="cl-header">
          <div class="title">选择对应平台</div>
        </div>
        <div class="cl-body">
          <el-input
            v-model="searchVal1"
            placeholder="请输入平台名称"
            prefix-icon="el-icon-search"
            clearable
            class="cl-search"
            @keyup.enter.native="getPlatformList"
          >
          </el-input>
          <div class="platform-list">
            <div
              v-for="(item, index) in platformList"
              :key="index"
              :class="currentIndex === index ? 'list-item active' : 'list-item'"
              @click="handleSelItem(item, index)"
            >
              {{ item.protocol }}
            </div>
          </div>
          <el-button
            size="mini"
            style="width: 100%"
            :loading="loading"
            :disabled="!currentData"
            @click="getDeviceData"
          >
            加载设备列表
            <i class="el-icon-arrow-right el-icon--right"> </i>
          </el-button>
        </div>
      </div>
      <div class="table-list">
        <div class="cl-header">
          <div class="title">待选设备</div>
          <div class="total">{{ leftSelections.length }}/{{ leftTotal }}项</div>
        </div>
        <div class="cl-body">
          <!-- <el-input
            v-model="searchVal2"
            placeholder="请输入设备名称/IP地址"
            prefix-icon="el-icon-search"
            clearable
            class="cl-search"
            @keyup.enter.native="getSearch2"
          >
          </el-input> -->
          <el-table
            ref="ltable"
            :data="leftTableData"
            :row-key="'id'"
            @selection-change="handleLeftSelectionChange"
          >
            <el-table-column
              type="selection"
              width="50"
              :reserve-selection="true"
            >
            </el-table-column>
            <el-table-column
              label="设备名称"
              prop="deviceName"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              label="IP地址"
              prop="deviceIp"
              show-overflow-tooltip
            ></el-table-column>
          </el-table>
          <el-pagination
            v-if="leftTableData.length"
            layout="prev, pager, next"
            :total="leftTotal"
            :page-size="5"
            :current-page.sync="leftPage"
            @current-change="handleLeftCurrent"
          ></el-pagination>
        </div>
      </div>
    </div>
    <div class="tool-btn">
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-arrow-right"
        :disabled="!leftSelections.length"
        @click="handleRightTransfer"
      ></el-button>
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-arrow-left"
        style="margin: 10px 0 0 0"
        :disabled="!rightSelections.length"
        @click="handleLeftTransfer"
      ></el-button>
    </div>
    <div class="right-table">
      <div class="cl-header">
        <div class="title">已选设备</div>
        <div class="total">
          {{ rightSelections.length }}/{{ rightTableData.length }}项
        </div>
      </div>
      <div class="cl-body">
        <!-- <el-input
          v-model="searchVal3"
          placeholder="请输入设备名称/IP地址"
          prefix-icon="el-icon-search"
          clearable
          class="cl-search"
          @keyup.enter.native="getSearch3"
        >
        </el-input> -->
        <el-table
          ref="rtable"
          :data="rightShowData"
          :row-key="'id'"
          @selection-change="handleRightSelectionChange"
        >
          <el-table-column
            type="selection"
            width="50"
            :reserve-selection="true"
          >
          </el-table-column>
          <el-table-column
            label="设备名称"
            prop="deviceName"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="IP地址"
            prop="deviceIp"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
        <el-pagination
          v-if="rightShowData.length"
          layout="prev, pager, next"
          :total="rightTableData.length"
          :page-size="5"
          :current-page.sync="rightPage"
          @current-change="handleRightCurrent"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getPlatformList } from "@/api/infrastructure/device-platform.js";
import {
  getDeviceListByPlatformId,
  savePersonLockDevice,
  saveCarLockDevice,
} from "@/api/infrastructure/access-control-equipment.js";
import dataMixin from "@/mixin/data.js";
export default {
  mixins: [dataMixin],
  data() {
    return {
      // 平台
      platformList: [], // 平台列表
      searchVal1: null, // 搜索关键字
      loading: false, // 按钮loading
      currentData: null, // 被选中的数据
      currentIndex: null, // 被选中的索引
      // 待选设备（左边）
      leftTableData: [],
      leftTotal: 0,
      searchVal2: null, // 搜索关键字
      leftSelections: [],
      leftPage: 1,
      // 已选设备（右边）
      rightTableData: [],
      rightShowData: [],
      searchVal3: null, // 搜索关键字
      rightSelections: [],
      rightPage: 1,
    };
  },
  mounted() {
    this.getPlatformList();
  },
  methods: {
    // 获取平台列表
    getPlatformList() {
      let params = {
        order: "updateTime",
        sort: "DESC",
        pageNum: 1,
        pageSize: 9999999,
        query: [],
      };
      this.searchVal1 &&
        params.query.push(
          this.handleExpression("LIKE", "protocol", this.searchVal1),
        ); // 平台名称
      getPlatformList(params).then((res) => {
        this.platformList = res.data.list;
      });
    },
    // 选中平台
    handleSelItem(item, index) {
      this.currentData = item;
      this.currentIndex = index;
    },
    // 根据平台ID查询人脸信息列表
    getDeviceData() {
      this.loading = true;
      // 请求不同的平台信息时清空之前的选中
      this.$refs.ltable.clearSelection();
      this.$refs.rtable.clearSelection();
      let params = {
        deviceTypeCodes:
          this.data.tabsActive == 2
            ? "8"
            : this.data.tabsActive == 3
            ? "35"
            : "", // 后端说固定写死
        page: {
          page: this.leftPage,
          size: 5,
        },
      };
      getDeviceListByPlatformId(this.currentData.id, params)
        .then((res) => {
          this.loading = false;
          if (res.code == 200) {
            this.leftTableData = res.data.list;
            this.leftTotal = res.data.pagination.total;
            // 若右边的数据和请求回来的数据相匹配则选中
            if (this.rightTableData.length) {
              res.data.list.forEach((litem) => {
                this.rightTableData.forEach((ritem) => {
                  if (litem.deviceCode == ritem.deviceCode) {
                    this.$refs.ltable.toggleRowSelection(litem, true);
                  }
                });
              });
            }
          } else {
            this.leftTableData = [];
            this.leftTotal = 0;
            this.$message({
              type: "warning",
              message: res.msg,
            });
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 待选设备（左边）当前页码切换
    handleLeftCurrent(val) {
      this.leftPage = val;
      this.getDeviceData();
    },
    // 已选设备（右边）当前页码切换
    handleRightCurrent(val) {
      this.rightPage = val;
      this.rightShowData = this.rightTableData.slice(
        (this.rightPage - 1) * 5,
        this.rightPage * 5,
      );
    },
    // 待选设备（左边） table中选中的数据
    handleLeftSelectionChange(data) {
      this.leftSelections = [];
      this.leftSelections = data;
    },
    // 已选设备（右边） table中选中的数据
    handleRightSelectionChange(data) {
      this.rightSelections = [];
      this.rightSelections = data;
    },
    // 穿梭（左➡右）
    handleRightTransfer() {
      if (this.rightTableData.length) {
        let arr = [];
        this.rightTableData.forEach((ritem) => {
          this.leftSelections.forEach((litem) => {
            if (ritem.deviceCode.indexOf(litem.deviceCode) == -1) {
              arr.push(litem);
            }
          });
        });
        this.rightTableData = this.handleRemoveDuplicateObj([
          ...this.rightTableData,
          ...arr,
        ]);
      } else {
        this.rightTableData = this.leftSelections;
      }
      this.rightPage = 1;
      this.rightShowData = this.rightTableData.slice(0, 5);
    },
    // 穿梭（右➡左）
    handleLeftTransfer() {
      // 清除掉左边table的选中
      this.rightSelections.forEach((ritem) => {
        this.leftTableData.forEach((litem) => {
          if (ritem.deviceCode == litem.deviceCode) {
            this.$refs.ltable.toggleRowSelection(litem, false);
          }
        });
      });
      // 删除掉右边table的数据
      this.rightSelections.forEach((ritem) => {
        this.rightTableData.forEach((litem, lindex) => {
          if (ritem.deviceCode == litem.deviceCode) {
            this.rightTableData.splice(lindex, 1);
            this.$refs.rtable.toggleRowSelection(litem, false);
          }
        });
        this.rightShowData.forEach((litem, lindex) => {
          if (ritem.deviceCode == litem.deviceCode) {
            this.rightShowData.splice(lindex, 1);
            this.$refs.rtable.toggleRowSelection(litem, false);
          }
        });
      });
    },
    getSearch2() {},
    // 已选设备（右边）的模糊搜索
    getSearch3() {
      if (this.searchVal3) {
        this.rightShowData = [];
        this.rightTableData.forEach((item) => {
          if (
            item.deviceName.indexOf(this.searchVal3) > -1 ||
            item.deviceIp.indexOf(this.searchVal3) > -1
          ) {
            this.rightShowData.push(item);
          }
        });
      } else {
        this.rightShowData = this.rightTableData.slice(
          (this.rightPage - 1) * 5,
          this.rightPage * 5,
        );
      }
    },
    // 去掉一样的数据
    handleRemoveDuplicateObj(arr) {
      let obj = {};
      arr = arr.reduce((newArr, next) => {
        obj[next.deviceCode]
          ? ""
          : (obj[next.deviceCode] = true && newArr.push(next));
        return newArr;
      }, []);
      return arr;
    },
    request() {
      if (!this.rightTableData.length) return;
      // 人闸保存
      if (this.data.tabsActive == 2) {
        let arr = this.rightTableData.map((item) => {
          return {
            edgePlatId: this.currentData.id, // 平台id
            name: item.deviceName, // 设备名称
            modelNumber: item.deviceModel, // 设备型号
            code: item.deviceCode, // 设备编号
            ip: item.deviceIp, // ip地址
            port: item.devicePort, // 端口
            latitude: 0, // 纬度
            longitude: 0, // 经度
            status: item.isOnline, // 设备在线状态 0=离线，1=在线
            brand: "", // 品牌
            protocol: "", // 协议
            remark: "", // 备注
            accessUsername: "", // 访问用户名
            accessPassword: "", // 访问用户密码
          };
        });
        return savePersonLockDevice(arr).then(() => {
          this.$message({
            type: "success",
            message: "同步成功",
          });
        });
      }
      // 车闸保存
      if (this.data.tabsActive == 3) {
        let arr = this.rightTableData.map((item) => {
          return {
            edgePlatId: this.currentData.id, // 平台id
            cameraId: item.deviceCode, // 设备编号
          };
        });
        return saveCarLockDevice(arr).then(() => {
          this.$message({
            type: "success",
            message: "同步成功",
          });
        });
      }
    },
    // 重写表单验证
    validate() {
      return Promise.resolve();
    },
  },
};
</script>

<style lang="scss" scoped>
.sync-device {
  display: flex;
  margin-bottom: 20px;
  .left-table {
    flex: 6;
    border: 1px solid #c1c1c1;
    border-radius: 5px;
    .device-list {
      width: 33%;
      height: 100%;
      float: left;
      border-right: 1px solid #c1c1c1;
      .cl-header {
        border-radius: 5px 0 0 0;
      }
      .cl-body {
        .el-button {
          color: #026dff;
          border: 1px solid #026dff;
        }
      }
      .platform-list {
        .list-item {
          width: 100%;
          padding: 0 10px;
          height: 30px;
          line-height: 30px;
          border: 1px solid #c1c1c1;
          border-radius: 3px;
          margin-bottom: 10px;
          cursor: pointer;
          color: #000;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          &:hover {
            border-color: #026dff;
          }
        }
        .active {
          background-color: #026dff;
          color: #fff;
        }
      }
    }
    .table-list {
      width: 67%;
      height: 100%;
      float: left;
      .cl-header {
        border-radius: 0 5px 0 0;
      }
    }
  }
  .tool-btn {
    flex: 0.5;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    ::v-deep .el-button--mini {
      padding: 8px;
    }
  }
  .right-table {
    flex: 4;
    border: 1px solid #c1c1c1;
    border-radius: 5px;
    .cl-header {
      border-radius: 5px 5px 0 0;
    }
  }
  .cl-header {
    padding: 0 10px;
    height: 40px;
    line-height: 40px;
    background-color: #f5f5f5;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #c1c1c1;
    .title {
      color: #000;
    }
    .total {
      font-size: 12px;
    }
  }
  .cl-body {
    width: 100%;
    height: calc(100% - 40px);
    padding: 10px;
    ::v-deep .el-table {
      margin-top: 0;
    }
    ::v-deep .el-input {
      margin-bottom: 10px;
    }
    ::v-deep .el-pagination {
      display: flex;
      justify-content: center;
      margin-top: 10px;
    }
  }
}
</style>
