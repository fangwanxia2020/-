<template>
  <div class="sync-allot">
    <div class="left-table">
      <div class="cl-header">
        <div class="title">待选设备</div>
        <div class="total">{{ leftSelections.length }}/{{ leftTotal }}项</div>
      </div>
      <div class="cl-body">
        <el-tabs v-model="tabsActive">
          <el-tab-pane
            v-for="item in tabsList"
            :key="item.code"
            :label="item.name"
            :name="item.code"
          ></el-tab-pane>
        </el-tabs>
        <el-input
          v-model="searchVal2"
          placeholder="请输入设备名称/IP地址"
          prefix-icon="el-icon-search"
          clearable
          class="cl-search"
          @keyup.enter.native="getSearch2"
        >
        </el-input>
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
            :prop="
              tabsActive == 1 ? 'cameraName' : tabsActive == 2 ? 'name' : ''
            "
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="IP地址"
            :prop="tabsActive == 1 ? 'ipV4' : tabsActive == 2 ? 'ip' : ''"
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
        <el-input
          v-model="searchVal3"
          placeholder="请输入设备名称/IP地址"
          prefix-icon="el-icon-search"
          clearable
          class="cl-search"
          @keyup.enter.native="getSearch3"
        >
        </el-input>
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
            :prop="
              tabsActive == 1 ? 'cameraName' : tabsActive == 2 ? 'name' : ''
            "
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="IP地址"
            :prop="tabsActive == 1 ? 'ipV4' : tabsActive == 2 ? 'ip' : ''"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="进出属性"
            prop="inOutFlag"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.inOutFlag"
                :active-value="1"
                :inactive-value="0"
                active-color="#539afe"
                inactive-color="#1fbe6c"
              >
              </el-switch>
            </template>
          </el-table-column>
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
import {
  personLockList,
  carLockList,
} from "@/api/infrastructure/access-control-equipment.js";
import { saveAllot } from "@/api/park-planning/area.js";
import dataMixin from "@/mixin/data.js";
export default {
  mixins: [dataMixin],
  data() {
    return {
      tabsList: [
        { code: "2", name: "人闸" },
        { code: "1", name: "车闸" },
      ],
      tabsActive: "2",
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
  watch: {
    tabsActive(newVal, oldVal) {
      if (this.rightTableData.length) {
        this.tabsActive = oldVal;
        let who = oldVal == 1 ? "车闸" : "人闸";
        this.$confirm(`要保存所选中${who}设备吗？取消会清空所选数据！`, {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          dangerouslyUseHTMLString: true,
          cancelButtonClass: "cancelButton",
          confirmButtonClass: "deleteButton-confirm",
        })
          .then(() => {
            this.tabsActive = newVal;
            this.request();
          })
          .catch(() => {
            this.tabsActive = newVal;
            this.getList();
            this.handleReset();
          });
      } else {
        this.tabsActive = newVal;
        this.getList();
        this.handleReset();
      }
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 获取人闸/车闸列表
    getList() {
      // 车闸
      if (this.tabsActive == 1) {
        let params = {
          order: "updateTime",
          sort: "DESC",
          pageNum: this.leftPage, // 页码
          pageSize: 5, // 显示数量
          query: [],
        };
        carLockList(params).then((res) => {
          this.leftTableData = res.data.list;
          this.leftTotal = res.data.pagination.total;
        });
      }
      // 人闸
      if (this.tabsActive == 2) {
        let params = {
          order: "updateTime",
          sort: "DESC",
          pageNum: this.leftPage, // 页码
          pageSize: 5, // 显示数量
          expr: [],
          query: {},
        };
        personLockList(params).then((res) => {
          this.leftTableData = res.data.list;
          this.leftTotal = res.data.pagination.total;
        });
      }
    },
    // 待选设备（左边）当前页码切换
    handleLeftCurrent(val) {
      this.leftPage = val;
      this.getList();
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
      this.rightTableData = this.leftSelections;
      this.rightPage = 1;
      this.rightShowData = this.rightTableData.slice(0, 5);
    },
    // 穿梭（右➡左）
    handleLeftTransfer() {
      // 清除掉左边table的选中
      this.rightSelections.forEach((ritem) => {
        this.leftTableData.forEach((litem) => {
          if (ritem.id == litem.id) {
            this.$refs.ltable.toggleRowSelection(litem, false);
          }
        });
      });
      // 删除掉右边table的数据
      this.rightSelections.forEach((ritem) => {
        this.rightTableData.forEach((litem, lindex) => {
          if (ritem.id == litem.id) {
            this.rightTableData.splice(lindex, 1);
            this.$refs.rtable.toggleRowSelection(litem, false);
          }
        });
        this.rightShowData.forEach((litem, lindex) => {
          if (ritem.id == litem.id) {
            this.rightShowData.splice(lindex, 1);
            this.$refs.rtable.toggleRowSelection(litem, false);
          }
        });
      });
      this.rightPage = 1;
      this.rightShowData = this.rightTableData.slice(0, 5);
    },
    getSearch2() {},
    // 已选设备（右边）的模糊搜索
    getSearch3() {
      let newName =
        this.tabsActive == 1
          ? "cameraName"
          : this.tabsActive == 2
          ? "name"
          : "";
      let newIp =
        this.tabsActive == 1 ? "ipV4" : this.tabsActive == 2 ? "ip" : "";
      if (this.searchVal3) {
        this.rightShowData = [];
        this.rightTableData.forEach((item) => {
          if (
            item[newName].indexOf(this.searchVal3) > -1 ||
            item[newIp].indexOf(this.searchVal3) > -1
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
    handleReset() {
      this.searchVal2 = null;
      this.searchVal3 = null;
      this.leftTableData = [];
      this.rightTableData = [];
      this.rightShowData = [];
      this.$refs.ltable.clearSelection();
      this.$refs.rtable.clearSelection();
    },
    request() {
      if (!this.rightTableData.length) return;
      let arr = this.rightTableData.map((item) => {
        return {
          areaId: this.data.areaId, // 区域id
          deviceId: item.id, // 设备id
          deviceType: this.tabsActive, // 设备类型 1-车闸 2-人闸
          inOutFlag: item.inOutFlag, // 进出标志 0-出 1-进
        };
      });
      return saveAllot(arr).then(() => {
        this.$message({
          type: "success",
          message: "分配成功",
        });
      });
    },
    // 重写表单验证
    validate() {
      return Promise.resolve();
    },
  },
};
</script>

<style lang="scss" scoped>
.sync-allot {
  display: flex;
  margin-bottom: 20px;
  .left-table {
    flex: 4;
    border: 1px solid #c1c1c1;
    border-radius: 5px;
    .cl-header {
      border-radius: 5px 5px 0 0;
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
  ::v-deep .el-switch__core::before {
    content: "出";
    position: absolute;
    font-size: 12px;
    top: -1px;
    right: 5px;
    color: #fff;
  }

  .is-checked ::v-deep .el-switch__core::before {
    content: "进";
    position: absolute;
    font-size: 12px;
    top: -1px;
    left: 5px;
    color: #fff;
  }
}
</style>
