<template>
  <div class="container">
    <!-- <left-tree
      :left-sel-data-arr.sync="leftSelDataArr"
      :is-checkbox="true"
    ></left-tree> -->
    <CtTable
      ref="table"
      :request="getList"
      row-key="id"
      @selections="getSelections"
    >
      <template #search="scope">
        <el-form-item label="用户账号: ">
          <el-input
            v-model="scope.params.username"
            placeholder="请输入"
            clearable
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="姓名: ">
          <el-input
            v-model="scope.params.nickname"
            placeholder="请输入"
            clearable
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
      </template>
      <template #table-columns>
        <el-table-column
          label="用户账号"
          show-overflow-tooltip
          prop="username"
          width="300"
        >
        </el-table-column>
        <el-table-column
          label="用户昵称"
          prop="nickname"
          width="300"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="锁定状态" show-overflow-tooltip width="200">
          <template slot-scope="scope">
            {{ scope.row.isLocks ? "停用" : "启用" }}
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="所属组织"
          prop="orgName"
          width="200"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="身份证"
          prop="idNo"
          width="200"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="手机号"
          prop="phone"
          width="150"
          show-overflow-tooltip
        ></el-table-column> -->
      </template>
    </CtTable>
  </div>
</template>

<script>
// import leftTree from "@/components/FormBody/left-tree/index.vue";
// import { getPersonList } from "@/api/access-control-permission/organization-control.js";
// import { getUserList } from "@/api/system/role.js";
export default {
  // components: { leftTree },
  props: {
    getUserSelections: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      leftSelDataArr: [], //被选中的组织
      selections: [], //被选中的人员
    };
  },

  computed: {
    changeSex() {
      return (str) => {
        let sex;
        switch (str) {
          case "MAN":
            sex = "男";
            break;
          case "WOMAN":
            sex = "女";
            break;

          default:
            sex = "未知";
            break;
        }
        return sex;
      };
    },
  },
  watch: {
    leftSelDataArr() {
      this.$refs.table.reset();
    },
  },

  methods: {
    getList(params) {
      let data = {
        pageNum: params.pageNum, // 页码
        pageSize: params.pageSize, // 显示数量
        query: [],
      };
      params.username &&
        data.query.push(
          this.handleExpression("LIKE", "username", params.username),
        );
      params.nickname &&
        data.query.push(
          this.handleExpression("LIKE", "nickname", params.nickname),
        );
      this.leftSelDataArr.length &&
        data.query.push(
          this.handleExpression("IN", "orgId", this.leftSelDataArr),
        ); // 组织id
      // return getUserList(data).then((res) => {
      //   return {
      //     list: res.data.list,
      //     total: res.data.pagination.total,
      //   };
      // });
      return Promise.resolve([{ list: [] }]);
    },
    getSelections(data) {
      this.selections = data;
      this.$emit("getUserSelections", this.selections);
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}
</style>
