<template>
  <div class="cl-r-container">
    <el-form ref="ruleForm" :model="form" label-width="100px">
      <el-row>
        <el-col :span="7">
          <el-form-item label="车牌号: ">
            <el-input
              v-model="form.vehicleCode"
              placeholder="请输入车牌号"
              clearable
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
          <el-form-item v-if="highSel" label="联系人: ">
            <el-input
              v-model="form.personName"
              placeholder="请输入联系人"
              clearable
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="车辆类型: ">
            <el-input
              v-model="form.vehicleType"
              placeholder="请输入车辆类型"
              clearable
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
          <el-form-item v-if="highSel" label="单位: ">
            <treeselect
              v-if="treeList"
              v-model="form.orgId"
              style="line-height: 36px"
              :options="treeList"
              :normalizer="normalizer"
              :show-count="true"
              placeholder="选择上级菜单"
            />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item>
            <el-button @click="handleSearch">查询</el-button>
            <el-button type="primary" @click="handleReset">重置</el-button>
            <span class="cl-highSel" @click="handleHighSel(highSel)">
              {{ highSel ? "收起" : "更多" }}
              <i
                :class="highSel ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
              ></i>
            </span>
          </el-form-item>
          <el-form-item v-if="highSel" label="手机号: ">
            <el-input
              v-model="form.personPhone"
              style="width: 66%"
              placeholder="请输入手机号"
              clearable
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      ref="table"
      :data="tableData"
      :row-key="rowKey"
      @selection-change="handleSelection"
    >
      <el-table-column
        v-if="isSelect"
        type="selection"
        width="60"
        :reserve-selection="true"
      />
      <el-table-column width="30">
        <template slot-scope="scope">
          <el-radio
            v-if="isRadio"
            v-model="radioId"
            :label="scope.row.id"
            @change.native="handleRadio(scope.row)"
          >
            &nbsp;
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column label="车牌号" prop="vehicleCode"></el-table-column>
      <el-table-column label="车辆类型" prop="vehicleType"></el-table-column>
      <el-table-column label="联系人" prop="personName"></el-table-column>
      <el-table-column label="手机号" prop="personPhone"></el-table-column>
      <el-table-column label="所属单位" prop="orgName"></el-table-column>
      <el-table-column label="经营范围" prop="scopeBusiness"></el-table-column>
    </el-table>
    <Pagination
      :total="total"
      :page.sync="pageNum"
      :limit.sync="pageSize"
      @pagination="handleGetPageData"
    />
  </div>
</template>

<script>
import dataMixin from "../mixin/data";
import { deepClone } from "@/utils/tool.js";
import {
  getCarList,
  getOrgList,
} from "@/api/access-control-permission/organization-control.js";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "right-table",
  components: { Treeselect },
  mixins: [dataMixin],
  props: {
    // 右边被选中的人员（复选）
    personarr: {
      type: Array,
      default: () => [],
    },
    // 右边被选中的人员（单选）
    personobj: {
      type: Object,
      default: () => {},
    },
  },
  // 该组件是复选还是单选
  inject: ["isSelect", "isRadio"],
  data() {
    return {
      radioId: this.personobj.id, // 单选时 回显选中的人员
      tableData: [],
      treeList: [],
      multipleSelection: [],
      allData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      id: "id",
      highSel: false,
    };
  },
  watch: {
    personarr() {
      this.multipleSelection = this.personarr;
    },
    multipleSelection: {
      handler(val, oldval) {
        if (this.multipleSelection == null) return; //避免切换分页的时候重置值
        if (!val) val = [];
        if (!oldval) oldval = [];
        const selList = this.allData.concat(val); //复制一个备份并且
        if (oldval.length > val.length) {
          //删除
          const delItem = oldval.filter((item) => {
            const isDel = val.findIndex((o) => o[this.id] == item[this.id]) < 0;
            const inPage =
              this.tableData.findIndex((o) => o[this.id] == item[this.id]) >= 0;
            return isDel && inPage;
          });
          if (delItem.length > 0) {
            delItem.forEach((obj) => {
              const delIndex = selList.findIndex(
                (item) => item[this.id] == obj[this.id],
              );
              if (delIndex >= 0) {
                selList.splice(delIndex, 1);
              }
            });
          }
        } else {
          //添加
          const addItem = val.filter((item) => !oldval.includes(item));
          if (addItem.length > 0) {
            addItem.forEach((obj) => {
              selList.push(obj);
            });
          }
        }
        this.allData = this.unique(selList); //去重
      },
      deep: true,
    },
  },
  mounted() {
    this.getList();
    getOrgList().then((res) => {
      this.treeList = res.data;
    });
  },
  methods: {
    // 获取列表数据
    getList() {
      let params = {
        expr: [],
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        query: {},
      };
      this.form.vehicleCode &&
        params.expr.push(
          this.handleExpression("LIKE", "vehicleCode", this.form.vehicleCode),
        ); // 车牌号
      this.form.personName &&
        params.expr.push(
          this.handleExpression("LIKE", "personName", this.form.personName),
        ); // 联系人
      this.form.orgId &&
        params.expr.push(this.handleExpression("EQ", "orgId", this.form.orgId)); // 单位
      this.form.vehicleType &&
        params.expr.push(
          this.handleExpression("LIKE", "vehicleType", this.form.vehicleType),
        ); // 车辆类型
      this.form.personPhone &&
        params.expr.push(
          this.handleExpression("LIKE", "personPhone", this.form.personPhone),
        ); // 手机号
      getCarList(params).then((res) => {
        this.tableData = res.data.list;
        this.total = res.data.pagination.total;
        this.handleHasSel(res.data.list);
      });
    },
    // 搜索
    handleSearch() {
      this.pageNum = 1;
      this.getList();
    },
    // 重置
    handleReset() {
      this.form = {};
      this.handleSearch();
    },
    // 分页切换
    handleGetPageData({ page, limit }) {
      this.pageNum = page;
      this.pageSize = limit;
      this.getList();
    },
    rowKey(row) {
      return row.id;
    },
    // 高级查询条件显示/隐藏
    handleHighSel(val) {
      this.highSel = val ? false : true;
    },
    // 单选
    handleRadio(row) {
      this.$emit("update:personobj", deepClone(row));
    },
    // 复选
    handleSelection(selections) {
      this.$emit("update:personarr", selections);
    },
    // 复选 复选框回显选中
    handleHasSel(tableData) {
      if (!this.personarr.length) return;
      this.allData.forEach((sitem) => {
        tableData.forEach((titem) => {
          if (sitem.id == titem.id) {
            this.$nextTick(() => {
              this.$refs.table.toggleRowSelection(titem, true);
            });
          }
        });
      });
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      const children =
        node.children === null || node.children === undefined
          ? []
          : node.children;
      if (Array.isArray(children) && children.length == 0) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
    },
    unique(arr) {
      const hash = {};
      const newArray = arr.reduce((item, next) => {
        hash[next[this.id]]
          ? ""
          : (hash[next[this.id]] = true && item.push(next));
        return item;
      }, []);
      return newArray;
    },
  },
};
</script>

<style lang="scss" scoped>
.cl-r-container {
  margin-bottom: 20px;
}
.el-form {
  ::v-deep .el-form-item__label {
    color: #666;
    font-weight: 400;
  }
  ::v-deep .el-input__inner {
    height: 36px;
  }
  ::v-deep .el-button {
    height: 36px;
    width: 100px;
    padding: 0;
  }
}
.el-table {
  margin-bottom: 10px;
}
.el-pagination {
  text-align: center;
  margin-bottom: 20px;
}
::v-deep .el-table-column--selection .cell {
  padding-left: 10px !important;
}
/deep/ .vue-treeselect__input-container {
  height: 36px !important;
}

::v-deep .vue-treeselect__placeholder {
  line-height: 36px !important;
}
</style>
