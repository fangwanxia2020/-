<template>
  <hqit-content-page type="list">
    <template slot="content">
      <hqit-table
        ref="table"
        border
        :data-source="getList"
        :columns="columns"
        :prop-show-pager="true"
        :search-config="searchConfig"
        :use-expr="false"
        :show-select="false"
        :show-index="false"
        @search="handleSearch"
        @reset="resetForm"
        @filter-change="tableFilterChange"
      >
        <template slot="operator">
          <hqit-button
            size="mini"
            btn-type="add"
            btn-text="新增"
            @click="handleAdd"
          ></hqit-button>
        </template>
        <template slot="status" slot-scope="{ rowData }">
          <i
            :class="[
              rowData.status === 0 ? 'el-icon-error' : 'el-icon-success',
            ]"
            :style="{
              color: rowData.status === 0 ? '#F56C6C' : '#19be6b',
              verticalAlign: 'middle',
            }"
          ></i>
          <span>{{ rowData.status === 0 ? "离线" : "在线" }}</span>
        </template>
        <template slot="opts" slot-scope="{ rowData }">
          <el-button type="text" @click="handleCheck(rowData)">
            查看
          </el-button>
          <el-button type="text" @click="handleEdit(rowData)"> 修改 </el-button>
          <el-button type="text" @click="handleDel(rowData)"> 删除 </el-button>
          <el-button type="text" @click="handleMore(rowData)"> 更多 </el-button>
        </template>
      </hqit-table>
      <FormDialog
        ref="model"
        :width="650"
        :title="title"
        :show-cancel-btn="(title || '').indexOf('查看—') == -1"
        :show-submit-btn="(title || '').indexOf('查看—') == -1"
        @submit="handleReset"
      >
        <template #default="scope">
          <Add v-bind="scope.data" />
        </template>
      </FormDialog>
    </template>
  </hqit-content-page>
  <!-- <div class="page-wrapper">
    <CtTable
      ref="table"
      row-key="id"
      :is-select="false"
      :has-high-search="true"
      :request="getList"
    >
      <template #search="scope">
        <el-form-item label="设备名称: " prop="name">
          <el-input
            v-model="scope.params.name"
            placeholder="请输入设备名称"
            clearable
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="设备厂家: " prop="deviceFactory">
          <el-select
            v-model="scope.params.deviceFactory"
            placeholder="请选择设备厂家"
            clearable
            filterable
          >
            <el-option
              v-for="item in deviceFactoryList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属灯杆: " prop="lampId">
          <el-select
            v-model="scope.params.lampId"
            placeholder="请选择所属灯杆"
            clearable
            filterable
          >
            <el-option
              v-for="item in lamppostList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template #high-search="scope">
        <el-form-item label="所属平台: " prop="edgePlatId">
          <el-select
            v-model="scope.params.edgePlatId"
            placeholder="请选择所属平台"
            clearable
            filterable
          >
            <el-option
              v-for="item in platList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="IP地址: " prop="ip">
          <el-input
            v-model="scope.params.ip"
            placeholder="请输入IP地址"
            clearable
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="更新时间: " prop="updateTime">
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
        <el-table-column
          label="LED编号"
          prop="code"
          width="140px"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="LED名称"
          prop="name"
          width="120px"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="LED型号"
          prop="modelNumber"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="所属平台"
          prop="edgePlatName"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="访问用户名"
          prop="accessUsername"
          width="100px"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="访问密码"
          width="120px"
          prop="accessPassword"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="IP地址"
          prop="ip"
          width="120px"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="协议"
          prop="protocol"
          width="120px"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="端口"
          prop="port"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="更新时间"
          prop="updateTime"
          width="140px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ rowData.updateTime && rowData.updateTime.slice(0, -3) }}
          </template>
        </el-table-column>
        <el-table-column
          label="运行状态"
          prop="status"
          width="100px"
          :filters="[
            { text: '在线', value: 1 },
            { text: '离线', value: 0 },
          ]"
          :filter-method="filterStatus"
          filter-placement="bottom-end"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            
          </template>
        </el-table-column>
        <el-table-column
          label="位置"
          prop="position"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="操作"
          width="200"
          align="right"
          fixed="right"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
           
          </template>
        </el-table-column>
      </template>
    </CtTable>

    
  </div> -->
</template>

<script>
import Add from "./add.vue";
import {
  getLedInfoScreenList,
  getLedInfoScreenById,
  delLedScreenById,
} from "@/api/infrastructure/led-infoscreen.js";
import { errorBoundary, delPrompt } from "@/utils/tool.js";
export default {
  name: "led-infoscreen",
  components: { Add },
  data() {
    return {
      title: "新增",
      queryForm: {},
      columns: [
        {
          prop: "code",
          label: "LED编号",
          width: "150",
        },
        {
          prop: "name",
          label: "LED名称",
        },
        {
          prop: "modelNumber",
          label: "LED型号",
        },
        {
          prop: "edgePlatName",
          label: "所属平台",
        },
        {
          prop: "accessUsername",
          label: "访问用户名",
          width: "100",
        },
        {
          prop: "accessPassword",
          label: "访问密码",
        },
        {
          prop: "ip",
          label: "IP地址",
        },
        {
          prop: "protocol",
          label: "协议",
        },
        {
          prop: "port",
          label: "端口",
        },
        {
          prop: "updateTime",
          label: "更新时间",
          formatter: (val) => {
            return this.awaySecond(val);
          },
        },
        {
          prop: "status",
          label: "运行状态",
          width: "100",
          slotname: "status",
          formatter: (val) => {
            return this.changeStatus(val);
          },
          attrs: {
            filters: [
              { text: "在线", value: 1 },
              { text: "离线", value: 0 },
            ],
            columnKey: "status",
          },
        },
        {
          prop: "position",
          label: "位置",
        },
        {
          prop: "opts",
          label: "操作",
          align: "right",
          fixed: "right",
          slotname: "opts",
          width: 180,
        },
      ],
      searchConfig: [
        {
          prop: "name",
          label: "设备名称", // 单位下拉框直接用（类型使用tree）
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "设备厂家",
          prop: "deviceFactory",
          expression: "LIKE",
          type: "select",
          options: [
            { value: 1, label: "大华" },
            { value: 2, label: "海康" },
          ],
        },
        {
          label: "所属灯杆",
          prop: "lampId",
          expression: "LIKE",
          type: "select",
          options: [
            { value: 1, label: "LED屏幕灯杆1" },
            { value: 2, label: "LED屏幕灯杆2" },
            { value: 3, label: "LED屏幕灯杆3" },
            { value: 4, label: "球机屏幕灯杆" },
            { value: 5, label: "应急广播灯杆" },
          ],
        },
        {
          prop: "edgePlatId",
          label: "所属平台", // 单位下拉框直接用（类型使用tree）
          expression: "IN",
          type: "select",
          options: [
            { value: 1, label: "大华" },
            { value: 2, label: "海康" },
          ],
        },
        {
          label: "IP地址",
          prop: "ip",
        },
        {
          label: "更新时间",
          prop: "updateTime",
          type: "daterange",
        },
      ],
    };
  },
  methods: {
    async getList(params) {
      let resParams = {
        order: "updateTime",
        sort: "DESC",
        pageNum: params.pageNum, // 页码
        pageSize: params.pageSize, // 显示数量
        query: [],
      };
      this.searchConfig.forEach((configItem) => {
        if (
          this.queryForm[configItem.prop] &&
          this.queryForm[configItem.prop] != "" &&
          configItem.expression
        ) {
          resParams.query.push({
            key: configItem.prop,
            value: this.queryForm[configItem.prop],
            expression: configItem.expression,
          });
        }
      });
      params.name &&
        resParams.query.push(
          this.handleExpression("LIKE", "name", params.name),
        ); // 设备名称
      params.deviceFactory &&
        resParams.query.push(
          this.handleExpression("EQ", "deviceFactory", params.deviceFactory),
        ); // 设备厂家
      params.lampId &&
        resParams.query.push(
          this.handleExpression("LIKE", "lampId", params.lampId),
        ); // 所属灯杆
      params.edgePlatId &&
        resParams.query.push(
          this.handleExpression("LIKE", "edgePlatId", params.edgePlatId),
        ); // 所属平台
      params.ip &&
        resParams.query.push(this.handleExpression("LIKE", "ip", params.ip));
      // 更新时间
      params.updateTime &&
        resParams.query.push(
          this.handleExpression("GE", "updateTime", params.updateTime[0]),
        );
      params.updateTime &&
        resParams.query.push(
          this.handleExpression("LE", "updateTime", params.updateTime[1]),
        );
      let res = await getLedInfoScreenList(resParams);
      this.$refs.table.page.total = res.data.pagination.total;
      return Promise.resolve({
        data: res.data.list,
      });
    },
    // 查看
    handleCheck(row) {
      this.title = "LED信息屏— 查看— " + row.name;
      this.$refs.model.openModel({
        data: {
          data: { ...row },
          pageType: "check",
        },
      });
    },
    // 新增
    handleAdd() {
      this.title = "LED信息屏— 新增";
      this.$refs.model.openModel({
        data: {
          pageType: "add",
        },
      });
    },
    // 修改
    handleEdit(row) {
      this.title = "LED信息屏— 修改— " + row.name;
      getLedInfoScreenById(row.id).then((res) => {
        this.$refs.model.openModel({
          data: {
            data: { ...res.data },
            isUpdate: true,
            pageType: "edit",
          },
        });
      });
    },

    // 删除
    async handleDel(row) {
      const valid = await errorBoundary(delPrompt(this, row.name));
      if (valid) {
        const res = await delLedScreenById(row.id);
        if (res.code == "200") {
          this.$message.success("删除成功");
          this.handleSearch();
        }
      } else {
        this.$message({
          message: "删除取消",
        });
      }
    },
    // 更多
    handleMore(row) {
      console.log("更多", row);
    },
    // 查询
    handleSearch(params) {
      this.queryForm = {
        ...this.queryForm,
        ...params,
      };
      this.$refs.table.getData({}, true);
    },
    //重置搜索
    resetForm() {
      this.queryForm = {};
      this.$refs.table.$refs.table.clearSort();
      this.$refs.table.$refs.table.clearFilter();
      this.$refs.table.getData({}, true);
    },
    // 表格条件筛选
    tableFilterChange(val) {
      this.queryForm = {
        ...this.queryForm,
        ...val,
      };
      this.$refs.table.getData({}, true);
    },
  },
};
</script>

<style lang="scss" scoped>
.led-infoscreen {
  height: 100%;
  padding: 10px !important;
}
</style>
