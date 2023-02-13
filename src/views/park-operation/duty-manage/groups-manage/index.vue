<template>
  <div class="page-wrapper">
    <CtTable
      ref="table"
      row-key="id"
      :is-select="false"
      :has-high-search="true"
      :request="getList"
      @filter-change="filterTag"
    >
      <template #search="scope">
        <el-form-item label="班组名称: ">
          <el-input
            v-model="scope.params.name"
            placeholder="请输入"
            clearable
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="值班编号: ">
          <el-input
            v-model="scope.params.name"
            placeholder="请输入"
            clearable
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="更新者: ">
          <el-input
            v-model="scope.params.identityCard"
            placeholder="请输入"
            clearable
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
      </template>
      <template #high-search="scope">
        <el-form-item label="更新时间: ">
          <el-date-picker
            v-model="scope.params.createTime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
          />
        </el-form-item>
      </template>
      <template slot="button-group">
        <el-button
          class="btn-add"
          icon="el-icon-circle-plus"
          @click="handleAdd"
        >
          新增
        </el-button>
      </template>
      <template #table-columns>
        <template>
          <el-table-column
            label="班组名称"
            prop="one"
            show-overflow-tooltip
            width="100"
          >
          </el-table-column>
          <el-table-column
            label="重复评率"
            prop="two"
            show-overflow-tooltip
            width="250"
          >
            <template slot-scope="scope">
              <span class="rating">白班</span>
              <span class="rating">晚班</span>
              <span class="rating">休息</span>
              <span class="rating">休息</span>
            </template>
          </el-table-column>
          <el-table-column
            label="开始日期"
            :filters="timeList"
            show-overflow-tooltip
            column-key="sex"
            prop="three"
          >
          </el-table-column>
          <el-table-column
            label="结束日期"
            prop="endTime"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="描述"
            prop="four"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="更新者"
            prop="five"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="更新时间"
            prop="updateTime"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="状态"
            prop="status"
            show-overflow-tooltip
            :filters="statusList"
            column-key="status"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :width="50"
                :active-value="1"
                :inactive-value="2"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="right"
            class-name="small-padding fixed-width"
            width="170"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="linkDetails(scope.row)">
                查看
              </el-button>
              <el-button type="text" @click="handleAdd(scope.row)">
                修改
              </el-button>
              <el-button type="text" @click="linkDetails(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </template>
      </template>
    </CtTable>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      changeStatus: [], // 筛选状态
      changeTime: [], // 筛选时间跨度
      statusList: [
        { text: "启用", value: 1 },
        { text: "冻结", value: 2 },
      ],
      timeList: [
        {
          text: "当天",
          value: 0,
        },
        {
          text: "跨天",
          value: 1,
        },
      ],
      list: [
        {
          one: "甲班",
          two: "当天",
          time1: "8:00",
          time2: "16:00",
          three: "2022-09-01",
          endTime: "2022-10-01",
          four: "这是关于甲组的描述",
          five: "管理员",
          updateTime: "2022-08-27 09:50",
          status: 1,
        },
      ],
    };
  },
  computed: {},
  watch: {},
  methods: {
    getList(params) {
      let resParams = {
        sort: "DESC",
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        query: {},
      };
      this.changeTime.length && (resParams.query.sex = this.changeTime);
      this.changeStatus.length &&
        (resParams.query.approvalStatus = this.changeStatus);
      params.name && (resParams.query.name = params.name); // 姓名
      params.phone && (resParams.query.phone = params.phone); // 手机号
      params.createTime &&
        (resParams.query.visitStartTime = params.createTime[0]);
      params.createTime &&
        (resParams.query.visitEndTime = params.createTime[1]);
      // return getVisitorList(resParams).then((res) => {
      //   return {
      //     list: res.data.list,
      //     total: res.data.pagination.total,
      //   };
      // });
      return Promise.resolve({
        list: this.list,
      });
    },
    filterTag(val) {
      if (val.sex) {
        this.changeTime = val.sex;
      }
      if (val.approvalStatus) {
        this.changeStatus = val.approvalStatus;
      }
      this.$refs.table.reload();
    },
    // 查看
    linkDetails() {
      this.$router.push({
        path: "/gatedpark/park-operation/duty-manage/groups-manage/edit",
        query: { id: 111, isCheck: true },
      });
    },
    // 新增
    handleAdd() {
      this.$router.push({
        path: "/gatedpark/park-operation/duty-manage/groups-manage/add",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.copy-icon {
  margin-left: 5px;
  color: #409eff;
  cursor: pointer;
}
.rating {
  border-radius: 8px;
  margin: 0 5px;
  padding: 5px 5px;
  background: #7f7f7f;
  color: #fff;
}
::v-deep .el-switch__core::before {
  content: "禁用";
  position: absolute;
  font-size: 12px;
  top: -1px;
  right: 5px;
  color: #fff;
}

.is-checked ::v-deep .el-switch__core::before {
  content: "启用";
  position: absolute;
  font-size: 12px;
  top: -1px;
  left: 5px;
  color: #fff;
}
</style>
