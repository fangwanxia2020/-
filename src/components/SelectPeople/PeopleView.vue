<template>
  <div class="people-dialog-view">
    <!-- opacity: 0 -->
    <el-row :gutter="20">
      <el-col :span="6" :xs="24" :style="noTree ? 'display: none' : ''">
        <div class="tree-box">
          <el-tree
            ref="tree"
            :data="treeList"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            default-expand-all
            @node-click="handleNodeClick"
          >
            <span slot-scope="{ data }" class="custom-tree-node">
              <span>{{ data.name }}</span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="noTree ? 24 : 18" :xs="24">
        <el-form ref="ruleForm" :model="form" label-width="100px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="用户账号: ">
                <el-input
                  v-model="form.phone"
                  placeholder="请输入"
                  clearable
                  @keyup.enter.native="handleSearch"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用户昵称: ">
                <el-input
                  v-model="form.name"
                  placeholder="请输入"
                  clearable
                  @keyup.enter.native="handleSearch"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <el-button @click="handleSearch">查询</el-button>
                <el-button type="primary" @click="handleReset">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table
          ref="table"
          :data="tableData"
          row-key="personId"
          @selection-change="handleSelection"
        >
          <el-table-column
            type="selection"
            width="60"
            :reserve-selection="true"
          />
          <el-table-column label="用户账号" show-overflow-tooltip prop="phone">
          </el-table-column>
          <el-table-column
            label="用户昵称"
            prop="name"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="性别"
            prop="genderName"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="锁定状态" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.isLock ? "停用" : "启用" }}
            </template>
          </el-table-column>
          <el-table-column
            label="人员类型"
            prop="personTypeName"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
        <Pagination
          :total="total"
          :page.sync="pageNum"
          :limit.sync="pageSize"
          @pagination="handleGetPageData"
        />
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="2" :xs="24">
        <div style="text-align: right; line-height: 30px">已选人员</div>
      </el-col>
      <el-col :span="22" :xs="24">
        <el-tag
          v-for="tag in allData"
          :key="tag.enterprisePersonId"
          closable
          @close="closeTagFun(tag)"
        >
          {{ tag.name }}
        </el-tag>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "people-dialog-view",
  props: {
    selectData: {
      //选择的人员
      type: Array,
      default: () => [],
    },
    //多选模式
    multiple: {
      type: Boolean,
      default: false,
    },
    //部门id， 考核管理处使用
    checkDeptId: {
      type: [String, Number],
      default: "",
    },
    //安全责任制管理-考核管理-考核签约
    noTree: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 树结构点击组织ID
      clickOrgId: null,
      id: "personId",
      total: 0,
      pageNum: 1,
      pageSize: 10,
      multipleSelection: [], // 选中的数据
      tableData: [],
      allData: [], // 拿回所有的数据，用于过滤传出去
      checkList: this.selectData,
      // 部门树选项
      treeList: [],
      // checkList: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      form: {},
    };
  },
  computed: {},
  watch: {
    selectData: {
      handler() {
        console.log(1111);
        this.multipleSelection = this.selectData;
      },
      immediate: true,
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
      immediate: true,
    },
  },
  created() {
    this.getTreeSelect();
    this.getList();
  },
  methods: {
    getList() {
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        query: {
          hasOrg: true,
        },
      };
      this.form.phone && (data.query.phone = this.form.phone);
      this.form.name && (data.query.name = this.form.name);
      this.clickOrgId && (data.query.orgId = this.clickOrgId);
      this.getPersonList(data).then((res) => {
        this.tableData = res.data.list;
        this.total = res.data.pagination.total;
        this.handleHasSel(res.data.list);
      });
    },
    handleClear() {
      this.clickOrgId = null;
    },
    handleSelection(selections) {
      // this.checkList = selections;
      this.multipleSelection = selections;
    },
    /** 查询部门下拉树结构 */
    getTreeSelect() {
      this.getOrgList().then((response) => {
        this.treeList = response.data;
      });
    },
    // 复选 复选框回显选中
    handleHasSel(tableData) {
      if (!this.checkList.length) return;
      this.allData.forEach((sitem) => {
        tableData.forEach((titem) => {
          if (sitem.personId == titem.personId) {
            this.$nextTick(() => {
              this.$refs.table.toggleRowSelection(titem, true);
            });
          }
        });
      });
    },
    // 树结构筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 树结构节点单击事件
    handleNodeClick(data) {
      this.clickOrgId = data.id;
      this.getList();
    },
    //删掉tag
    closeTagFun(tag) {
      this.$refs.table.changeRowSelection(
        this.allData.filter((item) => item.id != tag.id),
      );
    },
    // 搜索
    handleSearch() {
      this.getList();
    },
    // 重置
    handleReset() {
      this.form = {};
      this.clickOrgId = null;
      this.pageNum = 1;
      this.handleSearch();
    },
    // 分页切换
    handleGetPageData({ page, limit }) {
      this.pageNum = page;
      this.pageSize = limit;
      this.getList();
    },
    // 父组件使用
    getCheckList() {
      return this.allData;
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
.people-dialog-view {
  .tree-box {
    width: 100%;
    overflow: auto;
    height: 330px;

    ::v-deep .el-tree-node > .el-tree-node__children {
      overflow: initial;
    }
  }
  /deep/.search-form {
    .el-input__inner {
      width: 150px !important;
    }
  }
  .el-tag {
    margin: 0 10px 10px 0;
  }
}
</style>
