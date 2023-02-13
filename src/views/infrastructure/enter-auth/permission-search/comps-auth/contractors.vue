<template>
  <div class="permission-search-comps-auth" style="height: calc(100vh - 145px)">
    <div class="left-box">
      <el-select
        v-model="searchId"
        placeholder="请选择承包商名称"
        clearable
        filterable
        class="cl-search"
        style="width: 100%"
      >
        <el-option
          v-for="item in filingList"
          :key="item.id"
          :label="item.name"
          :value="item.name"
        ></el-option>
      </el-select>
      <div class="all-list" @scroll="handleScroll">
        <div v-for="item in filingList" :key="item.id" class="list-item">
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
            <label>企业类型：</label>
            <span>
              {{
                getNameByKey(companyTypeOptions, item.enterpriseTypeId, "id")
              }}
            </span>
          </div>
          <div class="fl-label">
            <label>行业：</label>
            <span>
              {{ getNameByKey(industryOptions, item.industryId, "id") }}
            </span>
          </div>
          <div class="fl-label">
            <label>经营范围：</label>
            <span>{{ item.businessScope }}</span>
          </div>
        </div>
      </div>
    </div>
    <hqit-content-page type="list">
      <template slot="content">
        <hqit-table
          ref="table"
          :data-source="getList"
          :columns="columns"
          :prop-show-pager="true"
          :search-config="searchConfig"
          :use-expr="false"
          :show-select="false"
          :show-index="false"
          :label-width="'130px'"
          @search="handleSearch"
          @reset="handleReset"
        >
          <template slot="deviceName" slot-scope="{ rowData }">
            <span class="cl-jump" @click="handleOpenMsg(rowData)">
              {{ rowData.deviceName }}
            </span>
          </template>
          <template slot="status" slot-scope="{ rowData }">
            <span v-if="rowData.status">
              <i class="el-icon-success" style="color: #1fbe6c"></i> 在线
            </span>
            <span v-if="!rowData.status">
              <i class="el-icon-error" style="color: #f26f6d"></i> 离线
            </span>
          </template>
          <template slot="opts" slot-scope="{ rowData }">
            <el-button
              v-if="rowData.status2 != 1"
              type="text"
              @click="handleDownload(rowData)"
            >
              手动下载
            </el-button>
          </template>
        </hqit-table>

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
      </template>
    </hqit-content-page>
  </div>
</template>

<script>
import { bayonetList } from "@/api/infrastructure/access-control-equipment.js";
import DialogMessage from "../check-dialog/message.vue";
import { searchList } from "@/api/infrastructure/permission-search.js";
import { getCtrFilingList } from "@/api/contractor/index.js";
export default {
  components: { DialogMessage },
  data() {
    return {
      searchId: "", // 列表搜索id
      bayonetList: [], // 卡口列表
      radioId: "", // 承包商id
      msgTitle: null,
      tableData: [],
      reqNum: 0,
      reqPage: 1, // 请求页码
      reqTotal: 0, // 总数
      filingList: [], // 承包商列表
      companyTypeOptions: [],
      industryOptions: [],
      columns: [
        {
          prop: "deviceName",
          label: "设备名称",
          width: "200",
          slotname: "deviceName",
          sortable: true,
        },
        {
          prop: "ip",
          label: "IP地址",
          width: "150",
          sortable: true,
        },
        {
          prop: "status",
          label: "设备状态",
          width: "150",
          slotname: "status",
          attrs: {
            filters: [
              { text: "离线", value: 0 },
              { text: "在线", value: 1 },
            ],
            "filter-method": this.handleFilter,
          },
        },
        {
          prop: "gatewayName",
          label: "卡口",
        },
        {
          prop: "value1",
          label: "权限数量",
        },
        {
          prop: "value2",
          label: "已下载数量",
        },
        {
          prop: "value3",
          label: "待下载数量",
        },
        {
          prop: "opts",
          label: "操作",
          align: "right",
          fixed: "right",
          slotname: "opts",
          width: "150",
        },
      ],
      searchConfig: [
        {
          label: "设备名称/IP地址",
          prop: "search",
          expression: "LIKE",
          attrs: {
            clearable: true,
            placeholder: "请输入",
          },
        },
        {
          label: "卡口",
          prop: "gatewayId",
          expression: "EQ",
          type: "select",
          options: [],
          attrs: {
            clearable: true,
          },
        },
      ],
      queryForm: {},
    };
  },
  watch: {
    radioId() {
      this.reqNum = 0;
      this.handleSearch();
    },
    searchId() {
      this.filingList = [];
      this.getCtrFilingList();
    },
  },
  mounted() {
    this.getCtrFilingList();
    this.getBayonetList();
    // 企业类型
    this.$getTypeCode("gatedpark_company_type").then((res) => {
      this.companyTypeOptions = res.data;
    });
    // 行业
    this.$getTypeCode("hse_rm_risk_industry_involved").then((res) => {
      this.industryOptions = res.data;
    });
  },
  methods: {
    // 承包商下拉
    getCtrFilingList() {
      let params = {
        pageNum: 1,
        pageSize: 999999,
        query: {
          statusList: [3], // 3-审核通过
        },
      };
      if (this.searchId) params.query.name = this.searchId;
      getCtrFilingList(params).then((res) => {
        this.filingList = this.filingList.concat(res.data.list);
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
        this.searchConfig.find((v) => v.prop == "gatewayId").options =
          this.bayonetList.map((item) => {
            return { label: item.name, value: item.id };
          });
      });
    },
    // 综合查询table 后端返回全部数据 前端做分页
    getList(params) {
      if (!this.radioId) {
        return Promise.resolve({
          data: {
            list: [],
            pagination: { total: 0 },
          },
        });
      }
      let resParams = {
        deviceType: 2, // 2-人脸门禁、1-车辆门禁
        resourceId: this.radioId, // 承包商id
        resourceType: 4, // 2-单位权限、1-人员权限、3-车辆权限、4-承包商权限
      };
      if (this.queryForm.search) {
        resParams["search"] = this.queryForm.search; // 设备名称/IP地址
        this.reqNum = 0;
      }
      if (this.queryForm.gatewayId) {
        resParams["gatewayId"] = this.queryForm.gatewayId; // 卡口
        this.reqNum = 0;
      }
      if (!this.reqNum) {
        return searchList(resParams).then((res) => {
          ++this.reqNum;
          this.tableData = res.data;
          return {
            data: {
              list: this.tableData.slice(
                (params.page - 1) * params.size,
                params.page * params.size,
              ),
              pagination: { total: this.tableData.length },
            },
          };
        });
      } else {
        return Promise.resolve({
          data: {
            list: this.tableData.slice(
              (params.page - 1) * params.size,
              params.page * params.size,
            ),
            pagination: { total: this.tableData.length },
          },
        });
      }
    },
    // 下载
    handleDownload() {
      this.$confirm("此操作将下载, 是否继续?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        cancelButtonClass: "cancelButton",
        confirmButtonClass: "deleteButton-confirm",
      }).then(() => {
        // this.$message({
        //   type: "success",
        //   message: "下载成功!",
        // });
      });
    },
    handleOpenMsg() {
      this.$refs.msgModel.openModel();
    },
    // 列表滚动事件
    handleScroll(e) {
      let scrollTop = e.target.scrollTop; // 滚动条滚动时，距离顶部的距离
      let windowHeight = e.target.clientHeight; // 可视区的高度
      let scrollHeight = e.target.scrollHeight; // 滚动条的总高度
      // 滚动条到底部的条件
      if (Math.ceil(scrollTop + windowHeight + 5) >= scrollHeight) {
        // 触发更多函数
        if (this.reqTotal > this.filingList.length) {
          this.reqPage += 1;
          this.getCtrFilingList();
        }
      }
    },
    // 筛选
    handleFilter(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    // 搜索
    handleSearch(params) {
      this.queryForm = {
        ...params,
      };
      this.$refs.table.getData({}, true);
    },
    // 重置
    handleReset() {
      this.queryForm = {};
      this.$refs.table.$refs.table.clearFilter();
      this.$refs.table.getData({}, true);
    },
    // table的重置
    handleTabReset() {
      this.reqNum = 0;
    },
  },
};
</script>
