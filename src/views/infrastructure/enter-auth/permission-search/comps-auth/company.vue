<template>
  <div class="permission-search-comps-auth" style="height: calc(100vh - 145px)">
    <div class="left-box">
      <el-select
        v-model="searchId"
        placeholder="请选择单位名称"
        clearable
        filterable
        class="cl-search"
        style="width: 100%"
      >
        <el-option
          v-for="item in companyList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
      <div class="all-list" @scroll="handleScroll">
        <div v-for="item in companyList" :key="item.id" class="list-item">
          <div class="fl-title">
            <h4>{{ item.name }}</h4>
            <el-radio v-model="radioId" :label="item.id">&nbsp;</el-radio>
          </div>
          <div class="fl-label">
            <label>联系人：</label>
            <span>{{ item.contacts }}</span>
          </div>
          <div class="fl-label">
            <label>联系电话：</label>
            <span>{{ item.phone }}</span>
          </div>
          <div class="fl-label">
            <label>单位类型：</label>
            <span>{{ item.value4 }}</span>
          </div>
          <div class="fl-label">
            <label>行业：</label>
            <span>{{ item.industryName }}</span>
          </div>
          <div class="fl-label">
            <label>经营范围：</label>
            <span>{{ item.businessScope }}</span>
          </div>
        </div>
      </div>
    </div>
    <CtTable
      ref="table"
      row-key="id"
      :is-select="false"
      :has-btn="false"
      :tabs-list="tabsList"
      :tabs-active.sync="tabsActive"
      :request="getList"
      style="width: calc(100% - 310px)"
      @reset="handleTabReset"
    >
      <template #search="scope">
        <el-col :span="12">
          <el-form-item label="设备名称/IP地址: " prop="search">
            <el-input
              v-model="scope.params.search"
              placeholder="请输入"
              clearable
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="卡口: " prop="gatewayId">
            <el-select
              v-model="scope.params.gatewayId"
              placeholder="请选择"
              clearable
              filterable
            >
              <el-option
                v-for="item in bayonetList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </template>
      <template #table-columns>
        <el-table-column
          label="设备名称"
          prop="deviceName"
          width="200"
          sortable
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="cl-jump" @click="handleOpenMsg(scope.row)">
              {{ scope.row.deviceName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="IP地址"
          prop="ip"
          width="150"
          sortable
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="设备状态"
          prop="status"
          width="100"
          :filters="[
            { text: '离线', value: 0 },
            { text: '在线', value: 1 },
          ]"
          :filter-method="handleFilter"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status">
              <i class="el-icon-success" style="color: #1fbe6c"></i> 在线
            </span>
            <span v-if="!scope.row.status">
              <i class="el-icon-error" style="color: #f26f6d"></i> 离线
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="卡口"
          prop="gatewayName"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="权限数量"
          prop="value5"
          width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="已下载数量"
          prop="value6"
          width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="待下载数量"
          prop="value7"
          width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="操作"
          align="right"
          fixed="right"
          width="100"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="handleSend(scope.row)">
              手动下发
            </el-button>
          </template>
        </el-table-column>
      </template>
    </CtTable>

    <FormDialog
      ref="msgModel"
      :title="msgTitle"
      :show-cancel-btn="false"
      :show-submit-btn="false"
      :width="800"
      @submit="handleReset"
    >
      <template #default="scope">
        <DialogMessage v-bind="scope.data" />
      </template>
    </FormDialog>
  </div>
</template>

<script>
import { bayonetList } from "@/api/infrastructure/access-control-equipment.js";
import DialogMessage from "../check-dialog/message.vue";
import {
  companyList,
  searchList,
} from "@/api/infrastructure/permission-search.js";
import {
  personLockDetail,
  carLockDetail,
} from "@/api/infrastructure/access-control-equipment.js";
export default {
  components: { DialogMessage },
  props: {
    fuTabs: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      bayonetList: [], // 卡口列表
      searchId: "",
      companyList: [],
      radioId: "", // 单位id 1600436334860701698 或者 1583325901217226754
      msgTitle: null,
      tabsList: [
        { code: "2", name: "人闸" },
        { code: "1", name: "车闸" },
      ],
      tabsActive: "2",
      tableData: [],
      reqNum: 0,
      reqPage: 1, // 请求页码
      reqTotal: 0, // 总数
    };
  },
  watch: {
    radioId() {
      this.reqNum = 0;
      this.handleSearch();
    },
    tabsActive() {
      this.handleSearch();
    },
    searchId() {
      this.companyList = [];
      this.getCompanyList();
    },
  },
  mounted() {
    this.getCompanyList();
    this.getBayonetList();
  },
  methods: {
    // 综合查询table 后端返回全部数据 前端做分页
    getList(params) {
      if (!this.radioId) {
        return Promise.resolve({
          list: [],
          total: 0,
        });
      }
      let resParams = {
        deviceType: this.tabsActive, // 2-人脸门禁、1-车辆门禁
        resourceId: this.radioId, // 单位id
        resourceType: this.fuTabs, // 2-单位权限、1-人员权限、3-车辆权限
      };
      if (params.search) {
        resParams["search"] = params.search; // 设备名称/IP地址
        this.reqNum = 0;
      }
      if (params.gatewayId) {
        resParams["gatewayId"] = params.gatewayId; // 卡口
        this.reqNum = 0;
      }
      if (!this.reqNum) {
        return searchList(resParams).then((res) => {
          ++this.reqNum;
          this.tableData = res.data;
          return {
            list: this.tableData.slice(
              (params.pageNum - 1) * params.pageSize,
              params.pageNum * params.pageSize,
            ),
            total: this.tableData.length,
          };
        });
      } else {
        return Promise.resolve({
          list: this.tableData.slice(
            (params.pageNum - 1) * params.pageSize,
            params.pageNum * params.pageSize,
          ),
          total: this.tableData.length,
        });
      }
    },
    // 单位列表
    getCompanyList() {
      let resParams = {
        sort: "DESC",
        orderBy: "updateTime",
        pageNum: this.reqPage,
        pageSize: 30,
        query: [],
      };
      this.searchId &&
        resParams.query.push(this.handleExpression("EQ", "id", this.searchId)); // 搜索id
      companyList(resParams).then((res) => {
        this.companyList = this.companyList.concat(res.data.list);
        this.reqTotal = res.data.pagination.total;
      });
    },
    // 卡口下拉
    getBayonetList() {
      let params = {
        order: "updateTime",
        sort: "DESC",
        pageNum: 1,
        pageSize: 9999999,
        query: [],
      };
      bayonetList(params).then((res) => {
        this.bayonetList = res.data.list;
      });
    },
    // 下发
    handleSend() {
      this.$confirm("此操作将下发, 是否继续?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        cancelButtonClass: "cancelButton",
        confirmButtonClass: "deleteButton-confirm",
      }).then(() => {
        // this.$message({
        //   type: "success",
        //   message: "下发成功!",
        // });
      });
    },
    handleOpenMsg(row) {
      let request;
      this.tabsActive == "2"
        ? (request = personLockDetail)
        : (request = carLockDetail);
      request(row.deviceId).then((res) => {
        this.msgTitle = `设备信息—查看—${row.deviceName}`;
        this.$refs.msgModel.openModel({
          data: {
            data: { tab: this.tabsActive, ...res.data },
          },
        });
      });
    },
    // 列表滚动事件
    handleScroll(e) {
      let scrollTop = e.target.scrollTop; // 滚动条滚动时，距离顶部的距离
      let windowHeight = e.target.clientHeight; // 可视区的高度
      let scrollHeight = e.target.scrollHeight; // 滚动条的总高度
      // 滚动条到底部的条件
      if (Math.ceil(scrollTop + windowHeight) >= scrollHeight) {
        // 触发更多函数
        if (this.reqTotal > this.companyList.length) {
          this.reqPage += 1;
          this.getCompanyList();
        }
      }
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
    // table的重置
    handleTabReset() {
      this.reqNum = 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.hq-crud {
  padding: 15px 30px 20px;
}
</style>
