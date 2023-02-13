<template>
  <div ref="framebox" class="hq-crud">
    <div class="search-content">
      <el-form
        v-show="showSearch && hasSearch"
        ref="queryForm"
        :model="params"
        v-bind="formProps"
        class="search-form"
        :label-width="labelWidth"
      >
        <slot
          name="search"
          :setParams="setParams"
          :params="params"
          :selections="selections"
        />
        <template v-if="highSel">
          <slot
            name="high-search"
            :setParams="setParams"
            :params="params"
            :selections="selections"
          />
        </template>
      </el-form>
      <div v-if="showSearchBtn" class="search-content-button">
        <el-button type="primary" :disabled="!shouldSearch" @click="reload(1)">
          查询
        </el-button>
        <el-button
          plain
          :disabled="!shouldSearch"
          class="search-content-button__reset"
          @click="reset()"
        >
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
    <div v-if="tabsList.length" class="cl-tab">
      <el-tabs v-model="activeNum" @tab-click="handleClick">
        <el-tab-pane
          v-for="item in tabsList"
          :key="item.code"
          :label="item.name"
          :name="item.code"
        ></el-tab-pane>
      </el-tabs>
    </div>

    <el-row v-show="hasBtn" class="flex-end">
      <div class="action-warpper">
        <slot name="button-group"> </slot>
      </div>
    </el-row>
    <div v-show="hasBatchBtn && selections.length" class="button-batch-group">
      <div class="batch-btn">
        <div class="batch-l">
          <span>选择了{{ selections.length }}项</span>
          <el-button type="text" @click="handleClear">取消选择</el-button>
        </div>
        <div class="batch-r">
          <slot name="button-batch-group">
            <el-dropdown>
              <el-button type="default">
                批量操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <span @click="clickBatchDelete">批量删除</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </slot>
        </div>
      </div>
    </div>

    <el-row class="flex-full">
      <div class="hq-table">
        <el-table
          ref="batchTable"
          border
          :height="tableHeight"
          v-bind="$attrs"
          :row-key="rowKey"
          :data="dataSource"
          :row-class-name="
            ({ row, rowIndex }) =>
              selectable && !selectable(row, rowIndex) ? 'disableRow' : ''
          "
          @selection-change="handleSelectionChange"
          @filter-change="handleFilterChange"
        >
          <el-table-column
            v-if="isSelect"
            type="selection"
            :selectable="selectable"
            width="60"
            :reserve-selection="true"
          />
          <el-table-column v-if="isRadio" width="40">
            <template slot-scope="scope">
              <el-radio
                v-model="radioId"
                :label="scope.row.id"
                @change.native="handleRadio(scope.row)"
              >
                &nbsp;
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column
            v-if="isIndex"
            type="index"
            label="序号"
            width="60"
          />
          <slot
            name="table-columns"
            :setParams="setParams"
            :params="params"
            :selections="selections"
          >
          </slot>
        </el-table>
      </div>
    </el-row>
    <slot name="bottom-buttom"></slot>
    <el-row v-show="hasPage" class="pagination">
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
    </el-row>
  </div>
</template>

<script>
import Vue from "vue";
const selt = Vue.prototype;
import { deepClone } from "@/utils/tool.js";
import { errorBoundary, delPrompt } from "@/utils/tool.js";
export default {
  name: "ct-table",
  props: {
    /**
     * 获取 dataSource 的方法
     * 期望: ({params, pages}) => Promise({list: [], pages: number, total: number, extra: {}})
     * @param params: 筛选条件 this.params 会以 params 参数传给组件引用者，引用者自行组织接口链接
     * @param page: 当前页码传给组件引用者，引用者自行组织接口链接
     * @returns list: 函数返回中必须包含 list, 指表格数据
     * @returns pages: 函数返回中必须包含 pages, 指表格总页数
     * @returns total(可选): 数据总数
     * @returns extra(可选): 扩展数据，根据需求自行组织
     */
    request: {
      type: Function,
      default: () => Promise.resolve({ list: [], pages: 1 }),
    },
    // 单行数据主键，用于删除传值
    rowKey: {
      type: String,
      default: "id",
    },
    /**
     *  批量删除接口
     *  当传入字符串，删除请求方法为 axios.delete(deleteBatch, [ids])
     *  当传入function，删除请求会以该方法为主，方法结构为([ids]) => {}
     */
    deleteBatch: [String, Function],
    // 表格是否需要多选框
    isSelect: {
      type: Boolean,
      default: true,
    },
    // 表格是否需要序号
    isIndex: {
      type: Boolean,
      default: false,
    },
    // 新增回调
    add: Function,
    // 导入
    import: Function,
    // 等待加载
    waitState: {
      type: Boolean,
      default: false,
    },
    selectable: Function,
    tableRowClassName: Function,
    // 默认每页显示条目个数
    defaultPageSize: {
      type: Number,
      default: 10,
    },
    // 每页条目数量列表
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 50],
    },
    // 每页条目数量key
    pageSizeKey: {
      type: String,
      default: "pageSize",
    },
    // 当前页码key
    pageNumKey: {
      type: String,
      default: "pageNum",
    },
    // 默认搜索值
    defaultParams: {
      type: Object,
      default() {
        return {};
      },
    },
    // 是否有翻页
    hasPage: {
      type: Boolean,
      default: true,
    },
    // 查询表单props
    formProps: {
      type: Object,
      default() {
        return {};
      },
    },
    // 是否显示模糊搜索项
    hasSearch: {
      type: Boolean,
      default: true,
    },
    // 是否显示按钮工具栏
    hasBtn: {
      type: Boolean,
      default: true,
    },
    // 是否显示高级筛选
    hasHighSearch: {
      type: Boolean,
      default: false,
    },
    // tab对应显示的值
    tabsActive: {
      type: String,
      default: "1",
    },
    // 是否显示批量按钮工具栏
    hasBatchBtn: {
      type: Boolean,
      default: false,
    },
    // 搜索表单的label宽度
    // labelWidth: {
    //   type: Number,
    //   default: 80,
    // },
    labelWidth: {
      type: String,
      default: "auto",
    },
    //标签页数据
    tabsList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 是否显示查询重置按钮
    showSearchBtn: {
      type: Boolean,
      default: true,
    },
    // 单选框
    isRadio: {
      type: Boolean,
      default: false,
    },
    // 是否允许进入页面时就可以加载列表数据
    shouldReload: {
      type: Boolean,
      default: true,
    },
    // 滚动区域高度,传null高度内容撑开
    tableHeight: {
      type: String,
      default: "100%",
    },
    // 是否允许搜索
    shouldSearch: {
      type: Boolean,
      default: true,
    },
    // 单选框对象
    radioObj: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      // 表格数据
      dataSource: [],
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
      pagesize: this.defaultPageSize,
      highSel: false,
      activeNum: this.tabsActive, // 接收tab对应显示的值 避免直接使用导致报错
      selections: [], //多选框所选中的数据
    };
  },
  watch: {
    activeNum: function (newval, oldval) {
      if (newval != oldval) this.reset();
    },
    radioObj: {
      handler: function (val) {
        if (val) {
          this.radioId = val.id;
        }
      },
      immediate: true,
    },
  },
  mounted() {
    if (this.shouldReload) this.reload();
  },
  // 解决表格设置动态列 表头闪烁
  beforeUpdate() {
    this.$nextTick(() => {
      this.$refs.batchTable.doLayout();
    });
  },
  methods: {
    getDataSource(_page, _params) {
      if (this.timer !== null) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        const page = _page || this.page;
        const params = _params || this.params;
        this.loading = true;
        if (!this.waitState) {
          const promise = this.request(
            this.hasPage
              ? {
                  [this.pageNumKey]: page,
                  [this.pageSizeKey]: this.pagesize,
                  ...params,
                }
              : { ...params },
          );
          if (!promise.then) {
            this.loading = false;
            throw new Error("request必须返回Promise");
          }
          promise
            .then((res) => {
              if (!Array.isArray(res.list)) {
                throw new Error("list必须是数组");
              }
              // if (res.pages === undefined) {
              //   throw new Error("pages不能为undefined");
              // }
              this.dataSource = res.list;
              this.total = res.total;
              this.extra = res.extra;
              if (this.hasPage) {
                this.pages = res.pages || Math.ceil(res.total / this.pagesize);
                if (this.page > this.pages && this.pages > 0) {
                  this.page = this.pages;
                  this.reload();
                }
              }
            })
            .finally(() => {
              this.loading = false;
            });
        }
      }, 500);
    },
    // 更新数据
    reload(page) {
      if (page) {
        this.page = page;
      }
      this.getDataSource(this.page, this.params);
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
    // 点击批量删除
    clickBatchDelete() {
      this.deleteNotice(this.handleBatchDelete);
    },
    // 批量删除
    handleBatchDelete() {
      if (typeof this.deleteBatch === "function") {
        const promise = this.deleteBatch(this.selections, this.params);
        if (!promise.then) {
          throw new Error("deleteBatch必须返回promise");
        }
        return promise;
      }
      if (typeof this.deleteBatch === "string") {
        return selt.request({
          url: this.deleteBatch,
          method: "DELETE",
          data: [...this.getId(this.selections, this.rowKey)],
        });
      }
      throw new Error("deleteBatch必须为funtcion或string");
    },
    getId(data, rowKey) {
      if (!Array.isArray(data)) {
        throw new Error("data 必须是数组");
      }
      return data.map((d) => d[rowKey]);
    },
    // 删除提示
    async deleteNotice(request, showText) {
      const valid = await errorBoundary(delPrompt(this, showText));
      if (valid) {
        const res = await request();
        if (res.code == "200") {
          this.$message.success("删除成功");
          this.getDataSource(this.page, this.params);
          this.handleClear();
        }
      } else {
        this.$message({ message: "删除取消" });
      }
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
  padding-top: 10px;
}
.search-content {
  display: flex;

  border-bottom: 1px solid rgba(211, 219, 234, 0.5) !important;
  // margin-top: 10px;
  ::v-deep {
    .el-button {
      height: 36px;
      width: 100px;
      padding: 0;
    }
    .el-select {
      width: 100%;
    }
    .el-form-item {
      margin-bottom: 11px;
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
    .el-form-item__label {
      color: #909399 !important;
    }
    .el-form-item {
      padding-right: 15px;
      flex: 0 0 33.3%;
    }
  }
}
.el-form {
  ::v-deep .el-form-item {
    margin-bottom: 15px;
  }
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
.hq-crud {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;

  .el-row.flex-full {
    flex: 1;

    .hq-table {
      height: 100%;
      .el-table {
        flex: 1;
        height: 100%;
        position: relative;
        overflow: hidden;
        box-sizing: border-box;

        .el-table__body-wrapper {
          height: calc(100% - 60px) !important;
          // overflow-y: auto;
        }

        .el-table__fixed-body-wrapper {
          top: 47px !important;
          height: calc(100% - 60px) !important;
          // overflow-y: auto;
        }
        .el-table__fixed-right {
          background-color: #fff;
        }
      }
    }
  }
}

.hq-crud > .el-row {
  overflow-x: auto;
  overflow-y: hidden;
  min-height: 33px;
  position: relative;
  box-sizing: border-box;
}
::v-deep .btn-add {
  width: 88px;
  height: 30px;
  padding: 7px 20px;
  color: #419eff !important;
  background: #ecf5ff !important;
  border: 1px solid rgba(179, 216, 255, 1) !important;
  border-radius: 3px;
}
</style>
