<template>
  <div class="frame-box">
    <div class="search-content">
      <el-form
        ref="queryForm"
        :model="params"
        v-bind="formProps"
        class="search-form"
        label-width="84px"
      >
        <el-form-item label="模板名称: " prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入模板名称"
            clearable
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="模板分类: " prop="fillingId">
          <el-select
            v-model="form.fillingId"
            placeholder="请选择模板分类"
            clearable
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="item in contaList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态: " prop="fillingId">
          <el-select
            v-model="form.fillingId"
            placeholder="状态"
            clearable
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="item in contaList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <template v-if="highSel">
          <el-form-item label="更新时间: " prop="updateTime">
            <el-date-picker
              v-model="form.updateTime"
              type="daterange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd HH:mm"
              :default-time="['00:00:00', '23:59:59']"
            />
          </el-form-item>
        </template>
      </el-form>
      <div class="search-content-button">
        <el-button type="primary" @click="reload(1)">查询</el-button>
        <el-button plain class="search-content-button__reset" @click="reset()">
          重置
        </el-button>
        <span
          v-if="hasHighSearch"
          class="cl-highSel"
          @click="handleHighSel(highSel)"
        >
          {{ highSel ? "收起" : "更多" }}
          <i :class="highSel ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        </span>
      </div>
    </div>
    <div class="button-group">
      <div class="action-warpper">
        <button class="button-group-add">
          <i class="tyicon tyicon-whp_add"></i>
          <span>新增</span>
        </button>
      </div>
    </div>
    <div class="box">
      <template>
        <div
          v-for="item in videoList"
          :key="item.videoManageTaskInfoId"
          class="box-item"
        >
          <div class="img-box">
            <img
              class="item-img"
              src="@/assets/images/login_img/push.jpg"
              alt=""
            />
            <div class="icon-box">
              <div class="size-icon">
                <i size="50" class="el-icon-view" style="color: #fff"></i>
                <div>预览</div>
              </div>
              <div class="size-icon">
                <i size="50" class="el-icon-edit" style="color: #fff"></i>
                <div>编辑</div>
              </div>
              <div class="size-icon">
                <i
                  size="50"
                  class="el-icon-s-promotion"
                  style="color: #fff"
                ></i>
                <div>发布</div>
              </div>
              <div class="size-icon">
                <i size="50" class="el-icon-delete" style="color: red"></i>
                <div>删除</div>
              </div>
            </div>
            <img
              class="item-img-left"
              src="@/assets/images/approval/used.png"
            />
          </div>

          <div class="item-template">常用通知模板1</div>
          <div class="time-box">
            <div class="time-box-left">已关联终端数量: 2</div>
            <div class="time-box-right">1920*1080</div>
          </div>
          <el-checkbox
            v-if="checked"
            v-model="item.isCheck"
            class="check-item"
            size="medium"
            @change="selectItem(item)"
          ></el-checkbox>
        </div>
      </template>
      <!-- <div v-else class="no-data">暂无数据</div> -->
    </div>
    <div class="pagination">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-count="pages"
        :current-page.sync="page"
        :total="total"
        :page-size="pagesize"
        :page-sizes="pageSizes"
        @current-change="setPage"
        @size-change="changesize"
      />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
const selt = Vue.prototype;
import { deepClone } from "@/utils/tool.js";
export default {
  name: "ct-table",
  props: {
    request: {
      type: Function,
      default: () => Promise.resolve({ list: [], pages: 1 }),
    },
    // 单行数据主键，用于删除传值
    rowKey: {
      type: String,
      default: "id",
    },
    // 默认搜索值
    defaultParams: {
      type: Object,
      default() {
        return {};
      },
    },
    // 查询表单props
    formProps: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      // 表格数据
      dataSource: [],
      checked: false,
      pageSizes: [10, 20, 30, 50],
      imgUrl:
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F2018-06-27%2F5b3345789ca2c.jpg&refer=http%3A%2F%2Fpic1.win4000.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1672315300&t=e72c7c66a86a93540767ac098d665168",
      contaList: [],
      videoList: [
        { name: "张三" },
        { name: "李四" },
        { name: "王五" },
        { name: "王五" },
        { name: "王五" },
      ],
      form: {},
      // 筛选条件
      params: { ...this.defaultParams },
      pages: 1,
      page: 1,
      total: 0,
      extra: {},
      loading: false,
      timer: null,
      radioId: null,
      showSearch: true,
      hasHighSearch: true,
      pagesize: 10,
      highSel: false,
      activeNum: this.tabsActive, // 接收tab对应显示的值 避免直接使用导致报错
      selections: [], //多选框所选中的数据
    };
  },
  watch: {
    activeNum: function (newval, oldval) {
      if (newval != oldval) this.reset();
    },
  },
  mounted() {
    if (this.shouldReload) this.reload();
  },
  methods: {
    // 更新数据
    reload(page) {
      if (page) {
        this.page = page;
      }
    },
    selectItem() {
      this.$forceUpdate();
    },
    //改变条数
    changesize(val) {
      this.pagesize = val;
      this.getDataSource(this.page, this.params);
    },

    // 设置筛选项
    setParam(key, value) {
      this.$set(this.params, key, value);
    },
    setParams(data) {
      const keys = Object.keys(data);
      keys.forEach((key) => {
        this.$set(this.params, key, data[key]);
      });
    },
    // 更改页码
    setPage(page) {
      this.getDataSource(page, this.params);
    },
    // 表格选择
    handleSelectionChange(selections) {
      this.selections = selections;
      this.$emit("selections", selections);
    },
    reset(params, page = 1, isRequest = true) {
      this.page = page;
      this.params = params || { ...this.defaultParams };
      this.setParams(this.params);
      isRequest && this.reload();
      this.$emit("reset");
    },
    setLoad(loading) {
      this.loading = loading;
    },
    // 高级查询条件显示/隐藏
    handleHighSel(val) {
      this.highSel = val ? false : true;
    },
    // tab切换
    handleClick(tab) {
      this.$emit("update:tabsActive", tab.name);
    },
    getId(data, rowKey) {
      if (!Array.isArray(data)) {
        throw new Error("data 必须是数组");
      }
      return data.map((d) => d[rowKey]);
    },
    // 删除提示
    deleteNotice(request, message = "确定删除所选的数据？") {
      this.$confirm(message, "警告", {
        confirmButtonText: "删除",
        confirmButtonClass: "el-button--danger",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return request();
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this.getDataSource(this.page, this.params);
          this.handleClear();
        })
        .catch(() => {});
    },
    // 取消选择
    handleClear() {
      this.$refs.batchTable.clearSelection();
    },
    //
    changeRowSelection(rows, tag) {
      //tag是为了解决分页选不上的问题,表示判断两个对象相等的唯一标识
      if (!this.$refs.batchTable) return;
      this.$refs.batchTable.clearSelection();
      if (rows && rows.length > 0) {
        if (tag) {
          rows.forEach((row) => {
            const rr = (this.data || []).find((i) => i[tag] == row[tag]);
            rr && this.$refs.batchTable.toggleRowSelection(rr, true);
          });
        } else {
          rows.forEach((row) => {
            row && this.$refs.batchTable.toggleRowSelection(row, true);
          });
        }
      }
      this.allPageSelection = rows || [];
    },
    //过滤器事件
    handleFilterChange(val) {
      this.$emit("filter-change", val);
    },
    // 单选
    handleRadio(row) {
      this.$emit("update:radioObj", deepClone(row));
    },
    // 清楚表格列筛选状态
    clearTableFilter() {
      this.$refs.batchTable.clearFilter();
    },
  },
};
</script>

<style lang="scss" scoped>
.frame-box {
  position: relative;
  height: 100%;
  display: flex;
  padding: 10px;
  flex-direction: column;
}
.search {
  display: flex;
  justify-content: flex-start;
  flex-wrap: nowrap;
}
.button-group {
  display: flex;
  justify-content: flex-end;
  .btn-add {
    color: #419eff;
    background-color: #ecf5ff;
    border-color: #b3d8ff;
    height: 30px;
    width: 88px;
  }
}
@media only screen and (max-width: 992px) {
  .button-group {
    justify-content: flex-start;
  }
}
.button-batch-group {
  .batch-btn {
    width: 100%;
    height: 50px;
    background-color: #f6faff;
    padding: 0 10px;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      font-size: 14px;
    }
    ::v-deep .el-button {
      height: 30px;
      padding: 0 10px;
    }
  }
}

.loading {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #fff;
  opacity: 0.8;
  z-index: 100;
  i {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -50px;
    margin-left: -50px;
    font-size: 100px;
  }
}
.table-area {
  margin-top: 10px;
  margin-bottom: 30px;
  flex: 1;
  overflow-y: hidden;
  .el-table {
    height: 100%;
    &::before {
      display: none;
    }
  }
  ::v-deep .el-table__body-wrapper {
    max-height: calc(100% - 82px) !important;
    overflow-y: auto;
  }
}
.search-wrap {
  height: 40px;
  overflow: hidden;
}
.action-warpper {
  ::v-deep .el-button {
    height: 30px;
    padding: 0 10px;
  }
}
.pagination {
  text-align: center;
}
.search-content {
  display: flex;
  border-bottom: 1px solid rgba(207, 213, 222, 0.3) !important;
  margin-bottom: 9px !important;
  margin-top: 10px;
  ::v-deep {
    .el-button {
      height: 36px;
      width: 100px;
      padding: 0;
    }
    .el-select {
      width: 100%;
    }
  }
  &-button {
    margin-left: 20px;
    &__reset {
      color: #026dff;
      border: 1px solid #026dff;
      &:hover {
        background-color: #e6f0ff !important;
      }
    }
  }
}
.search-form {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  ::v-deep {
    .el-input__inner {
      width: 100% !important;
    }
    .el-form-item {
      flex: 0 0 33%;
    }
  }
}
.el-form {
  ::v-deep .el-form-item__label {
    color: #666;
    font-weight: 400;
  }
  ::v-deep .el-input__inner {
    height: 36px;
  }
}
.cl-highSel {
  margin-left: 10px;
  color: $primaryColor-ie !important;
  color: $primaryColor !important;
  font-size: 12px;
  cursor: pointer;
  i {
    font-weight: bold;
  }
}
.cl-tab {
  ::v-deep .el-tabs__nav-wrap::after {
    height: 1px;
    background-color: rgba(207, 213, 222, 0.3);
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
.box {
  padding: 20px 10px;
  display: flex;
  flex-flow: wrap;
  background: #fff;
  justify-content: flex-start;
}
.box-item {
  position: relative;
  width: calc(25% - 38px);
  height: 250px;
  text-align: center;
  background: #f5f5f5;
  margin-bottom: 40px;
  margin-right: 50px;
  // padding: 10px;
  border-radius: 15px;
  background: #fff;
  box-shadow: 5px 5px 5px #ccc;
  .img-box {
    position: relative;
    border-radius: 15px 15px 0 0;
    width: 100%;
    height: 170px;
    display: block;
  }
  .item-img-left {
    position: absolute;
    right: 0;
    top: 0;
    width: 80px;
    height: 80px;
  }
  .icon-box {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: #7a7a7a;
    display: flex;
    flex-flow: wrap;
    justify-content: center;
    align-items: center;
    display: none;
  }
  .size-icon {
    cursor: pointer;
    margin-left: 20px;
    font-size: 25px;
    i {
      padding: 6px;
      background: #aaaaaa;
      border-radius: 50%;
    }
    div {
      font-size: 14px;
      color: #fff;
      margin-top: 4px;
    }
  }
  .item-img {
    width: 100%;
    height: 100%;
    border-radius: 15px 15px 0 0;
  }
  .item-template {
    text-align: left;
    padding-left: 15px;
    padding-top: 15px;
    font-weight: bold;
  }
  .time-box {
    margin-top: 10px;
    padding: 0 15px;
    display: flex;
    font-size: 12px;
    align-items: center;
    justify-content: space-between;
    .time-box-left {
      color: #026dff;
    }
    .time-box-right {
      color: #999999;
    }
  }
  .check-item {
    position: absolute;
    top: 0;
    right: 0;
  }
}
.box-item:hover .icon-box {
  // display: block;
  display: flex;
  flex-flow: wrap;
  justify-content: center;
  align-items: center;
  border-radius: 15px 15px 0 0;
  opacity: 0.7;
}
.box-item:nth-child(4n) {
  margin-right: 0px;
}
</style>
