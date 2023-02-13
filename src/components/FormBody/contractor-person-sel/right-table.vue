<template>
  <div class="cl-r-container">
    <el-form ref="ruleForm" :model="form" label-width="100px">
      <el-row>
        <el-col :span="7">
          <el-form-item label="姓名: " prop="name">
            <el-input
              v-model="form.name"
              placeholder="请输入姓名"
              clearable
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
          <el-form-item v-if="highSel" label="手机号: ">
            <el-input
              v-model="form.phone"
              placeholder="请输入手机号"
              clearable
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="身份证号: ">
            <el-input
              v-model="form.idCard"
              placeholder="请输入身份证号"
              clearable
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
          <el-form-item v-if="highSel" label="承包商: " prop="fillingId">
            <el-select
              v-model="form.fillingId"
              placeholder="请选择承包商"
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
          <el-form-item v-if="highSel" label="人员工种: " prop="jobTypeId">
            <el-select
              v-model="form.jobTypeId"
              placeholder="请选择人员工种"
              clearable
              filterable
              style="width: 66%"
            >
              <el-option
                v-for="item in peopleList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      ref="table"
      class="table-box"
      :data="tableData"
      :row-key="rowKey"
      @selection-change="handleSelection"
      @filter-change="fillterChange"
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
      <el-table-column label="姓名" prop="name">
        <template slot-scope="scope">
          <span class="cl-jump">
            {{ scope.row.name }}
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="性别"
        prop="genderName"
        column-key="genderName"
        :filters="[
          { text: '男', value: 0 },
          { text: '女', value: 1 },
        ]"
        show-overflow-tooltip
      ></el-table-column> -->
      <!-- :filter-method="handleFilter" -->
      <el-table-column
        label="性别"
        :filters="[
          { text: '男', value: 0 },
          { text: '女', value: 1 },
        ]"
        column-key="sex"
        prop="sex"
      >
        <template slot-scope="scope">
          {{ scope.row.sex == 1 ? "女" : "男" }}
        </template>
      </el-table-column>
      <el-table-column
        label="身份证号"
        width="180"
        show-overflow-tooltip
        prop="idCard"
      ></el-table-column>
      <el-table-column
        label="手机号"
        width="120"
        prop="phone"
      ></el-table-column>
      <el-table-column
        label="承包商名称"
        prop="fillingName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="人员工种" prop="jobTypeId" width="180">
        <template slot-scope="scope">
          {{ getNameByKey(peopleList, scope.row.jobTypeId, "id") }}
        </template>
      </el-table-column>
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
import { listByExpr, ctrList } from "@/api/contractor/contractor-management.js";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "right-table",
  components: {},
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
    isPersonBaseId: {
      type: Boolean,
      default: true,
    },
  },
  // 该组件是复选还是单选
  inject: ["isSelect", "isRadio"],
  data() {
    return {
      radioId: this.personobj.id, // 单选时 回显选中的人员
      tableData: [],
      allData: [], // 拿回所有的数据，用于过滤传出去
      multipleSelection: [], // 选中的数据
      contaList: [], //承包商名称
      peopleList: [], //人员工种
      genderNameList: [],
      sexList: [], // 性别列表
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
    listByExpr().then((res) => {
      this.contaList = res.data;
    });
    this.$getTypeCode("sys_job_type").then((res) => {
      this.peopleList = res.data;
    });
    this.$getTypeCode("sys_user_sex").then((res) => {
      this.sexList = res.data;
      this.sexList.forEach((item) => {
        item["text"] = item.name;
        item["value"] = item.id;
      });
    });
  },
  methods: {
    // 筛选
    handleFilter(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    // 获取列表数据
    getList() {
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        query: {},
        expr: [],
      };
      this.form.name &&
        params.expr.push(this.handleExpression("LIKE", "name", this.form.name)); // 姓名
      this.form.idCard &&
        params.expr.push(
          this.handleExpression("LIKE", "idCard", this.form.idCard),
        ); // 身份证号
      this.form.fillingId &&
        params.expr.push(
          this.handleExpression("LIKE", "fillingId", this.form.fillingId),
        ); // 承包商
      this.form.phone &&
        params.expr.push(
          this.handleExpression("LIKE", "phone", this.form.phone),
        ); // 手机号
      this.form.jobTypeId &&
        params.expr.push(
          this.handleExpression("LIKE", "jobTypeId", this.form.jobTypeId),
        ); // 人员工种
      // this.genderNameList.length &&
      //   (params.query["genderIds"] = this.genderNameList); // 性别

      // 运单状态
      if (this.genderNameList.length) {
        // params.expr.sex = this.queryForm.status;
        params.expr.push({
          key: "sex",
          value: this.genderNameList,
          expression: "IN",
        });
      }

      ctrList(params).then((res) => {
        this.tableData = res.data.list;
        this.total = res.data.pagination.total;
        this.handleHasSel(res.data.list);
      });
    },
    fillterChange(val) {
      console.log(val);
      this.genderNameList = val.sex;
      console.log(this.genderNameList, "ggggg");
      this.getList();
    },
    // 搜索
    handleSearch() {
      this.pageNum = 1;
      this.getList();
    },
    // 重置
    handleReset() {
      this.form = {};
      this.genderNameList = [];
      this.$refs.table.clearFilter();
      this.$refs.table.clearSort();
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
      this.multipleSelection = selections;
      this.$emit("update:personarr", selections);
    },
    // 复选 复选框回显选中
    handleHasSel(tableData) {
      if (!this.personarr.length) return;
      this.allData.forEach((sitem) => {
        tableData.forEach((titem) => {
          if (sitem.personBaseId == titem.personBaseId) {
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
::v-deep {
  .table-box .el-table__column-filter-trigger .el-icon-arrow-down {
    color: #909399;
    font-size: 14px;
    transform: unset;
    margin-left: 5px;
    font-family: iconfonttywhp !important;
  }
  .table-box .el-icon-arrow-down:before {
    content: "\E6B6" !important;
  }
}
</style>
