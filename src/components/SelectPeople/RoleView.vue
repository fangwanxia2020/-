<template>
  <div class="people-dialog-view">
    <!--角色数据-->
    <CtTable
      ref="table"
      :request="getList"
      row-key="id"
      @reset="handleClear"
      @selections="getSelections"
    >
      <template #search="scope">
        <el-form-item label="角色名称: ">
          <el-input
            v-model="scope.params.name"
            placeholder="请输入"
            clearable
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
      </template>
      <template #table-columns>
        <el-table-column label="角色编号" show-overflow-tooltip prop="code">
        </el-table-column>
        <el-table-column
          label="角色名称"
          prop="name"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="状态" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.status ? "启用" : "停用" }}
          </template>
        </el-table-column>
      </template>
    </CtTable>
    <el-row :gutter="20">
      <el-col :span="3" :xs="24">
        <div style="text-align: right; line-height: 30px">已选角色</div>
      </el-col>
      <el-col :span="21" :xs="24">
        <el-tag
          v-for="tag in checkList"
          :key="tag.roleId"
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
import { getRoleList } from "@/api/system/role.js";
export default {
  name: "people-dialog-view",
  props: {
    data: {
      //选择的人员
      type: Array,
    },
    //多选模式
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      //记录当选选中的行
      selectionRow: null,
      //人员类型数据字典数据
      personTypeOptions: [],
      //选择的人员
      checkList: this.data,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    getList(params) {
      let data = {
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        query: [],
      };
      params.name &&
        data.query.push({
          expression: "LIKE",
          key: "name",
          value: params.name,
        });
      return getRoleList(data).then((res) => {
        return { list: res.data.list, total: res.data.pagination.total };
      });
    },
    handleClear() {},
    getSelections(data) {
      this.checkList = data;
    },
    getCheckList() {
      return this.checkList;
    },
    //字典翻译
    sjzdFormat(value) {
      return this.selectDictLabel(this.personTypeOptions, value);
    },
    //删掉tag
    closeTagFun(tag) {
      this.$refs.table.changeRowSelection(
        this.checkList.filter((item) => item.id != tag.id),
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.people-dialog-view {
  .el-tag {
    margin: 0 10px 10px 0;
  }
}
</style>
