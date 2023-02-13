<template>
  <div class="select-people">
    <template v-if="nodeData.length">
      <el-tag
        v-for="(tag, idx) in nodeData"
        :key="idx"
        class="select-people-tag"
        closable
        @close="delTagFun(tag)"
      >
        {{ tag.name ? tag.name : tag.postName }}
      </el-tag>
    </template>
    <el-button type="primary" size="small" @click="showPostDialog = true">
      添加/修改岗位
    </el-button>
    <el-dialog
      v-if="'showPostDialog'"
      title="添加/修改岗位"
      :visible.sync="showPostDialog"
      width="900px"
      height="600px"
      :append-to-body="true"
    >
      <CtTable
        ref="table"
        :request="getList"
        row-key="id"
        :has-batch-btn="false"
        :page-sizes="[5, 10, 15, 20]"
        :default-page-size="5"
        @selections="selections"
      >
        <template #search="scope">
          <el-form-item label="岗位代码: " prop="code">
            <el-input
              v-model="scope.params.code"
              placeholder="请输入"
              clearable
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
          <el-form-item label="岗位名称: " prop="name">
            <el-input
              v-model="scope.params.name"
              placeholder="请输入"
              clearable
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
          <el-form-item label="所属单位: " prop="name">
            <hqit-tree-select
              v-model="scope.params.orgId"
              style="width: 100%"
              v-bind="{
                clearable: true,
                selectAttrs: { placeholder: '请选择单位' },
              }"
            >
            </hqit-tree-select>
          </el-form-item>
        </template>
        <template #table-columns>
          <el-table-column label="岗位代码" prop="code"> </el-table-column>
          <el-table-column label="岗位名称" prop="name"> </el-table-column>
          <el-table-column
            label="所属单位"
            prop="orgName"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column label="所属部门" prop="deptName"> </el-table-column>
        </template>
      </CtTable>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showPostDialog = false">取 消</el-button>
        <el-button type="primary" @click="handelEmit"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { searchPostList } from "@/api/approval/role-setting.js";

export default {
  name: "select-post",
  props: {
    nodeData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      showPostDialog: false,
      multipleSelection: [],
      tableData: [],
      allData: [],
    };
  },
  watch: {
    nodeData: {
      handler: function () {
        this.multipleSelection = this.nodeData;
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
            const isDel =
              val.findIndex((o) => o["postId"] == item["postId"]) < 0;
            const inPage =
              this.tableData.findIndex((o) => o["postId"] == item["postId"]) >=
              0;
            return isDel && inPage;
          });
          if (delItem.length > 0) {
            delItem.forEach((obj) => {
              const delIndex = selList.findIndex(
                (item) => item["postId"] == obj["postId"],
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
  methods: {
    getList(params) {
      let resParams = {
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        query: [],
      };
      params.code &&
        resParams.query.push(
          this.handleExpression("LIKE", "code", params.code),
        ); // 岗位代码
      params.name &&
        resParams.query.push(
          this.handleExpression("LIKE", "name", params.name),
        ); // 岗位名称
      params.orgId &&
        resParams.query.push(
          this.handleExpression("IN", "orgId", params.orgId),
        ); // 单位

      return searchPostList(resParams).then((res) => {
        this.tableData = res.data.list;
        this.handleHasSel(res.data.list);
        res.data.list.forEach((item) => {
          this.$set(item, "postId", item.id);
        });
        return {
          list: res.data.list,
          total: res.data.pagination.total,
        };
      });
    },
    // 复选 复选框回显选中
    handleHasSel(tableData) {
      if (!this.nodeData.length) return;
      this.allData.forEach((sitem) => {
        tableData.forEach((titem) => {
          if (sitem.postId == titem.id) {
            this.$nextTick(() => {
              this.$refs.table.$refs.batchTable.toggleRowSelection(titem, true);
            });
          }
        });
      });
    },
    handleSearch() {
      this.$refs.table.reload(1);
    },
    handelEmit() {
      this.showPostDialog = false;
    },
    selections(val) {
      let newVal = this.unique(val);
      let arr = newVal.map((item) => {
        return {
          postId: item.id,
          postName: item.name,
        };
      });
      this.$emit("update:nodeData", arr);
    },
    delTagFun(item) {
      this.nodeData.forEach((titem, idx) => {
        if (titem.postId == item.postId) {
          this.nodeData.splice(idx, 1);
        }
      });
    },
    unique(arr) {
      const hash = {};
      const newArray = arr.reduce((item, next) => {
        hash[next["postId"]]
          ? ""
          : (hash[next["postId"]] = true && item.push(next));
        return item;
      }, []);
      return newArray;
    },
  },
};
</script>

<style lang="scss" scoped>
.select-people {
  ::v-deep .el-tag {
    margin: 0 10px 10px 0;
  }
}
</style>
