<template>
  <div class="tab-pass page-wrapper">
    <CtTable
      ref="table"
      row-key="id"
      :is-select="false"
      :has-high-search="false"
      :request="getList"
    >
      <template #search="scope">
        <el-form-item label="编号: " prop="name">
          <el-input
            v-model="scope.params.name"
            placeholder="请输入编号"
            clearable
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="发布主题: " prop="idCard">
          <el-input
            v-model="scope.params.idCard"
            placeholder="请输入发布主题"
            clearable
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="有效时间: " prop="updateTime">
          <el-date-picker
            v-model="scope.params.updateTime"
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
      <!-- <template slot="button-group">
        <button class="button-group-add" @click="handleAdd">
          <i class="tyicon tyicon-whp_add"></i>
          <span>新增</span>
        </button>
      </template> -->
      <template #table-columns>
        <el-table-column label="编号" prop="name">
          <template slot-scope="scope">
            <span class="cl-jump">
              {{ scope.row.name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="消息类型"
          width="150"
          :filters="[
            { text: '文本消息', value: 0 },
            { text: '视频消息', value: 1 },
          ]"
          :filter-method="handleFilter"
          prop="sex"
        >
          <template slot-scope="scope">
            {{ scope.row.sex == 1 ? "文本消息" : "视频消息" }}
          </template>
        </el-table-column>
        <el-table-column
          label="发布主题"
          width="180"
          show-overflow-tooltip
          prop="idCard"
        ></el-table-column>
        <el-table-column
          label="发布设备"
          width="150"
          :filters="[
            { text: 'LED屏幕', value: 0 },
            { text: 'IP广播', value: 1 },
          ]"
          :filter-method="handleFilter"
          prop="sex"
        >
          <template slot-scope="scope">
            {{ scope.row.sex == 1 ? "LED屏幕" : "IP广播" }}
          </template>
        </el-table-column>
        <el-table-column
          label="展示类型"
          width="150"
          :filters="[
            { text: '滚动展示', value: 0 },
            { text: '固定展示', value: 1 },
          ]"
          :filter-method="handleFilter"
          prop="sex"
        >
          <template slot-scope="scope">
            {{ scope.row.sex == 1 ? "滚动展示" : "固定展示" }}
          </template>
        </el-table-column>
        <el-table-column
          width="350"
          label="有效时间"
          prop="updateTime"
          sortable
          :filters="[
            { text: '有效', value: 0 },
            { text: '过期', value: 1 },
            { text: '预备', value: 2 },
          ]"
          :filter-method="handleFilter"
        >
          <template slot-scope="scope">
            <div>
              2022-10-01 10:00 - 2022-10-02 10:00
              <span>(<span class="spot"></span>预备)</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="剩余时间"
          prop="updateTime"
          width="200"
          sortable
        >
          <div>
            剩余1天2时03分
            <span>（开始）</span>
          </div>
        </el-table-column>
        <el-table-column
          label="审批人"
          width="100"
          show-overflow-tooltip
          prop="fillingName"
        ></el-table-column>
        <el-table-column
          label="审批时间"
          prop="updateTime"
          width="150"
          sortable
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>
              {{ awaySecond(scope.row.updateTime) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="状态"
          :filters="[
            { text: '待提交', value: 0 },
            { text: '待审核', value: 1 },
            { text: '已通过', value: 2 },
            { text: '不通过', value: 3 },
          ]"
          :filter-method="handleFilter"
          prop="sex"
        >
          <template slot-scope="scope">
            {{ scope.row.sex == 1 ? "待提交" : "待审核" }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="right"
          fixed="right"
          width="130"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="handleCheck(scope.row)">
              查看
            </el-button>
            <el-button type="text" @click="handleEdit(scope.row)">
              发布
            </el-button>
            <!-- <el-button type="text">终止</el-button> -->
          </template>
        </el-table-column>
      </template>
    </CtTable>
  </div>
</template>

<script>
import {
  ctrList,
  listByExpr,
  deleteFilingPerson,
  ctrFilingPersonEx,
} from "@/api/contractor/contractor-management.js";
export default {
  components: {},
  data() {
    return {
      title: null,
      contaList: [], //承包商名称
      peopleList: [], //人员工种
    };
  },
  created() {
    this.getListByExpr();
    this.$getTypeCode("sys_job_type").then((res) => {
      this.peopleList = res.data;
    });
  },
  methods: {
    // 承包商列表
    getListByExpr() {
      listByExpr().then((res) => {
        this.contaList = res.data;
      });
    },
    getList(params) {
      let resParams = {
        order: "createTime",
        sort: "DESC",
        pageNum: params.pageNum, // 页码
        pageSize: params.pageSize, // 显示数量
        query: {},
        expr: [],
      };
      params.name &&
        resParams.expr.push(this.handleExpression("LIKE", "name", params.name)); // 姓名
      params.idCard &&
        resParams.expr.push(
          this.handleExpression("LIKE", "idCard", params.idCard),
        ); // 身份证号
      params.phone &&
        resParams.expr.push(
          this.handleExpression("LIKE", "phone", params.phone),
        ); // 电话
      params.fillingId &&
        resParams.expr.push(
          this.handleExpression("LIKE", "fillingId", params.fillingId),
        ); // 承包商
      params.jobTypeId &&
        resParams.expr.push(
          this.handleExpression("LIKE", "jobTypeId", params.jobTypeId),
        ); // 人员工种
      // 更新时间
      params.updateTime &&
        resParams.expr.push(
          this.handleExpression("GE", "updateTime", params.updateTime[0]),
        );
      params.updateTime &&
        resParams.expr.push(
          this.handleExpression("LE", "updateTime", params.updateTime[1]),
        );
      return Promise.resolve({
        total: 0,
        list: [],
      });
      return ctrList(resParams).then((res) => {
        return {
          list: res.data.list,
          total: res.data.pagination.total,
        };
      });
    },
    // 新增
    handleAdd() {
      this.$router.push(
        "/gatedpark/park-operation/contractor/contractor-management/add",
      );
    },
    // 查看
    handleCheck(row) {
      this.$router.push({
        path: "/gatedpark/information-delivery/start-publishing/check",
        query: {
          id: row.id,
        },
      });
    },
    // 发布
    handleEdit(row) {
      console.log(row);
      // return;
      this.$confirm(`确定要发布'${row.name}'的数据吗？`, "警告", {
        confirmButtonText: "确认",
        confirmButtonClass: "el-button--primary",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let arr = [row.id];
        deleteFilingPerson(arr).then(() => {
          this.$msgSuccess("发布成功");
          this.$refs.table.reset();
        });
      });
    },
    // 删除
    handleDel(row) {
      this.$refs.table.deleteNotice(
        () => deleteFilingPerson([row.id]),
        row.name,
      );
    },
    // 修改状态
    handleChangeSt(row) {
      let params = {
        id: row.id,
        status: row.status,
      };
      ctrFilingPersonEx(params).then(() => {
        this.$message({
          type: "success",
          message: "状态修改成功",
        });
        this.handleSearch();
      });
    },
    // 筛选
    handleFilter(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    // 搜索
    handleSearch() {
      this.$refs.table.reload(1);
    },
    // 重置
    handleReset() {
      this.$refs.table.reset();
    },
  },
};
</script>
<style lang="scss" scoped>
/* switch按钮样式 */
::v-deep .el-switch__core::before {
  content: "冻结";
  position: absolute;
  font-size: 12px;
  top: -1px;
  right: 5px;
  color: #fff;
}

.is-checked ::v-deep .el-switch__core::before {
  content: "激活";
  position: absolute;
  font-size: 12px;
  top: -1px;
  left: 5px;
  color: #fff;
}
.spot {
  width: 10px;
  height: 10px;
  background: #19be6b;
  display: inline-block;
  border-radius: 50%;
}
</style>
