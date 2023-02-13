<template>
  <div class="page-wrapper">
    <CtTable
      ref="table"
      row-key="id"
      :is-select="false"
      :has-high-search="true"
      :request="getList"
    >
      <template #search="scope">
        <el-form-item label="广播编号: " prop="code">
          <el-input
            v-model="scope.params.code"
            placeholder="请输入广播编号"
            clearable
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="广播名称: " prop="name">
          <el-input
            v-model="scope.params.name"
            placeholder="请输入广播名称"
            clearable
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="品牌: " prop="manufacturerId">
          <el-select
            v-model="scope.params.manufacturerId"
            placeholder="请选择品牌"
            clearable
            filterable
          >
            <el-option
              v-for="item in brandList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template #high-search="scope">
        <el-form-item label="平台: " prop="edgePlatId">
          <el-select
            v-model="scope.params.edgePlatId"
            placeholder="请选择平台"
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
        <el-form-item label="广播型号: " prop="modelNumber">
          <el-input
            v-model="scope.params.modelNumber"
            placeholder="请输入广播型号"
            clearable
            @keyup.enter.native="handleSearch"
          />
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
      <!-- 表格 -->
      <template #table-columns>
        <el-table-column
          label="广播编号"
          prop="code"
          width="140px"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="广播名称"
          prop="name"
          width="120px"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="品牌"
          prop="manufacturerId"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="所属平台"
          prop="edgePlatId"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="广播型号"
          prop="modelNumber"
          width="100px"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="IP地址"
          prop="ip"
          width="120px"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="端口"
          prop="port"
          width="100px"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="协议"
          prop="protocolId"
          width="120px"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="描述"
          width="160px"
          prop="remark"
          show-overflow-tooltip
        ></el-table-column>
        <!-- <el-table-column
          label="更新者"
          prop="updateName"
          show-overflow-tooltip
        ></el-table-column> -->
        <el-table-column
          label="更新时间"
          prop="updateTime"
          width="140px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.updateTime && scope.row.updateTime.slice(0, -3) }}
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
        ></el-table-column>
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
            <el-button type="text" @click="handleCheck(scope.row)">
              查看
            </el-button>
            <el-button type="text" @click="handleEdit(scope.row)">
              修改
            </el-button>
            <el-button type="text" @click="handleDel(scope.row)">
              删除
            </el-button>
            <el-button type="text" @click="handleBroadcast(scope.row)">
              广播
            </el-button>
          </template>
        </el-table-column>
      </template>
    </CtTable>

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
  </div>
</template>

<script>
import {
  getIpBroadcastList,
  getIpBroadcastById,
  delIpBroadcastById,
} from "@/api/infrastructure/ip-broadcast.js";
import { errorBoundary, delPrompt } from "@/utils/tool.js";
import Add from "./add.vue";
export default {
  name: "led-infoscreen",
  components: { Add },
  data() {
    return {
      title: "新增LED信息屏",
      deviceFactoryList: [
        { code: 1, name: "大华" },
        { code: 2, name: "海康" },
      ],
      lamppostList: [
        { code: 1, name: "LED屏幕灯杆1" },
        { code: 2, name: "LED屏幕灯杆2" },
        { code: 3, name: "LED屏幕灯杆3" },
        { code: 4, name: "球机屏幕灯杆" },
        { code: 5, name: "应急广播灯杆" },
      ],
      brandList: [
        { code: 1, name: "大华" },
        { code: 2, name: "海康" },
      ],
      platList: [
        { code: 1, name: "大华ICC平台" },
        { code: 2, name: "海康协议-新" },
        { code: 3, name: "海康协议-旧" },
      ],
    };
  },
  methods: {
    getList(params) {
      let resParams = {
        order: "updateTime",
        sort: "DESC",
        pageNum: params.pageNum, // 页码
        pageSize: params.pageSize, // 显示数量
        query: [],
      };
      params.code &&
        resParams.query.push(
          this.handleExpression("LIKE", "code", params.code),
        );
      params.name &&
        resParams.query.push(this.handleExpression("EQ", "name", params.name));
      params.manufacturerId &&
        resParams.query.push(
          this.handleExpression(
            "LIKE",
            "manufacturerId",
            params.manufacturerId,
          ),
        );
      params.edgePlatId &&
        resParams.query.push(
          this.handleExpression("LIKE", "edgePlatId", params.edgePlatId),
        );
      params.modelNumber &&
        resParams.query.push(
          this.handleExpression("LIKE", "modelNumber", params.modelNumber),
        );
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

      resParams.query.length === 0 && delete resParams.query;
      return getIpBroadcastList(resParams).then(({ data }) => {
        console.log(data);
        return {
          list: data.list,
          total: data.pagination.total,
        };
      });
    },
    // 查看
    handleCheck(row) {
      this.title = "IP广播— 查看— " + row.name;
      this.$refs.model.openModel({
        data: {
          data: { ...row },
          pageType: "check",
        },
      });
    },
    // 新增
    handleAdd() {
      this.title = "IP广播— 新增";
      this.$refs.model.openModel({
        data: {
          pageType: "add",
        },
      });
    },
    // 修改
    handleEdit(row) {
      this.title = "IP广播— 修改— " + row.name;
      getIpBroadcastById(row.id).then((res) => {
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
      const valid = await errorBoundary(delPrompt(this, row.protocol));
      if (valid) {
        const res = await delIpBroadcastById(row.id);
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
    // 广播
    handleBroadcast(row) {
      console.log("广播", row);
    },
    // 搜索
    handleSearch() {
      this.$refs.table.reload(1);
    },
    // 重置
    handleReset() {
      this.$refs.table.reset();
    },
    filterStatus(value, row) {
      return row.operatingStatus === value;
    },
  },
};
</script>

<style lang="scss" scoped>
.ip-broadcast {
  height: 100%;
  padding: 10px !important;
}
</style>
