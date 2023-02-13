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
        <template slot="bindName" slot-scope="{ rowData }">
          {{
            rowData.bindType == 0
              ? rowData.bindName
              : rowData.bindName + "(" + rowData.personName + ")"
          }}
        </template>
        <template slot="status" slot-scope="{ rowData }">
          <div v-if="rowData.status == 0">
            <i class="el-icon-error"></i>
            <span>失败</span>
          </div>
          <div v-else>
            <i class="el-icon-success"></i>
            <span>成功</span>
          </div>
        </template>
        <template slot="opts" slot-scope="{ rowData }">
          <el-button type="text" @click="handleCheck(rowData)">
            查看
          </el-button>
        </template>
      </hqit-table>
      <el-dialog
        v-dialogDrag
        :title="dialogTitle"
        :visible.sync="dialogVisiable"
        width="500px"
        append-to-body
        @close="cancel"
      >
        <el-row class="padding-20">
          <el-col :span="12">
            <span>姓名：</span>
            <span>{{
              detailForm.bindType == 0
                ? detailForm.bindName
                : detailForm.personName
            }}</span>
          </el-col>
          <el-col v-if="detailForm.bindType == 1" :span="12">
            <span>车牌号：</span>
            <span>{{ detailForm.bindName }}</span>
          </el-col>
        </el-row>
        <el-row class="padding-20">
          <el-col :span="12">
            <el-tag type="success" effect="dark" size="small"> 普通卡 </el-tag>
            <span> {{ detailForm.cardNo }}</span>
          </el-col>
          <el-col :span="12">
            <el-tag type="warning" effect="dark" size="small"> 防爆卡 </el-tag>
            <span> {{ detailForm.exCardNo }}</span>
          </el-col>
        </el-row>
        <div class="tab-title">
          <div class="cl-hea-title">普卡换防爆卡</div>
        </div>
        <el-row class="padding-20">
          <el-col :span="12">
            <span>操作人：</span>
            <span>{{ detailForm.updateName }}</span>
          </el-col>
          <el-col :span="12">
            <span>操作时间：</span>
            <span>{{ detailForm.exchangeTime }}</span>
          </el-col>
        </el-row>
        <el-row class="padding-20">
          <el-col :span="24" class="flex-col">
            <span class="flex-label">换卡原因：</span>
            <span>{{ detailForm.exchangeReason }}</span>
          </el-col>
        </el-row>
        <div v-if="detailForm.progressStatus && detailForm.progressStatus == 2">
          <div class="tab-title">
            <div class="cl-hea-title">防爆卡换回普卡</div>
          </div>
          <el-row class="padding-20">
            <el-col :span="12">
              <span>操作人：</span>
              <span>{{ detailForm.updateName }}</span>
            </el-col>
            <el-col :span="12">
              <span>操作时间：</span>
              <span>{{ detailForm.resumeTime }}</span>
            </el-col>
          </el-row>
          <el-row class="padding-20">
            <el-col :span="24" class="flex-col">
              <span class="flex-label">换卡原因：</span>
              <span>{{ detailForm.resumeResaon }}</span>
            </el-col>
          </el-row>
        </div>
        <span slot="footer"> </span>
      </el-dialog>
    </template>
  </hqit-content-page>
</template>

<script>
import { getListCardReplaceRec } from "@/api/location-card-management/index.js";
export default {
  name: "explosion-proof-card-log",
  data() {
    return {
      bindType: null,
      changeType: null,
      status: null,
      bindTypeValue: [],
      changeTypeValue: [],
      statusValue: [],
      dialogTitle: null,
      dialogVisiable: false,
      detailForm: {},
      personList: [],
      columns: [
        {
          prop: "id",
          label: "操作ID",
          width: 200,
        },
        {
          prop: "bindName",
          label: "操作对象",
          slotname: "bindName",
          width: 150,
        },
        {
          prop: "bindType",
          label: "卡片类型",
          formatter: (val) => {
            return val == "1" ? "车卡" : "人卡";
          },
          attrs: {
            filters: [
              { text: "人卡", value: 0 },
              { text: "车卡", value: 1 },
            ],
            columnKey: "bindType",
          },
        },
        {
          prop: "cardNo",
          label: "普通卡",
        },
        {
          prop: "exCardNo",
          label: "防爆卡",
        },
        {
          prop: "progressStatus",
          label: "状态",
          formatter: (val) => {
            return val && val == "1" ? "已换卡" : "已归还";
          },
          attrs: {
            filters: [
              { text: "已换卡", value: 1 },
              { text: "已归还", value: 2 },
            ],
            columnKey: "progressStatus",
          },
        },
        {
          prop: "status",
          label: "操作状态",
          slotname: "status",
          attrs: {
            filters: [
              { text: "成功", value: 1 },
              { text: "失败", value: 0 },
            ],
            columnKey: "status",
          },
        },
        {
          prop: "updateTime",
          label: "更新时间",
          sortable: true,
          formatter: (val) => {
            return this.awaySecond(val);
          },
        },
        {
          prop: "opts",
          label: "操作",
          align: "right",
          slotname: "opts",
        },
      ],
      searchConfig: [
        {
          label: "操作ID",
          prop: "id",
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "操作对象",
          prop: "bindId",
          expression: "IN",
          type: "hqit-pro-select",
          attrs: {
            clearable: true,
            idKey: "personBaseId",
            singleSelect: true,
            selectAttrs: { placeholder: "请选择操作对象" },
          },
        },
        {
          label: "更新时间",
          prop: "updateTime",
          type: "daterange",
        },
      ],
      queryForm: {},
    };
  },
  created() {
    this.getPersonListData();
  },
  methods: {
    //操作记录list
    getList(params) {
      let resParams = {
        order: "createTime",
        sort: "DESC",
        pageNum: params.page,
        pageSize: params.size,
        query: {},
        expr: [],
      };
      this.searchConfig.forEach((configItem) => {
        if (
          this.queryForm[configItem.prop] &&
          this.queryForm[configItem.prop] != "" &&
          configItem.expression
        ) {
          resParams.expr.push({
            key: configItem.prop,
            value: this.queryForm[configItem.prop],
            expression: configItem.expression,
          });
        }
      });
      // 卡片类型
      if (this.queryForm.bindType && this.queryForm.bindType.length == 1) {
        resParams.query.bindType = this.queryForm.bindType[0];
      }
      // 状态
      if (
        this.queryForm.progressStatus &&
        this.queryForm.progressStatus.length == 1
      ) {
        resParams.query.progressStatus = this.queryForm.progressStatus[0];
      }
      // 操作状态
      if (this.queryForm.status && this.queryForm.status.length == 1) {
        resParams.query.status = this.queryForm.status[0];
      }
      if (this.queryForm.updateTime) {
        resParams.expr.push({
          key: "updateTime",
          expression: "GE",
          value: this.queryForm.updateTime[0],
        });
        resParams.expr.push({
          key: "updateTime",
          expression: "LE",
          value: this.queryForm.updateTime[1],
        });
      }
      return getListCardReplaceRec(resParams);
    },
    //人员列表
    async getPersonListData() {
      const { data } = await this.getPersonList({
        pageNum: 1,
        pageSize: 10000,
        query: {},
      });
      this.personList = data.list;
    },
    //查看详情
    handleCheck(row) {
      console.log(row);
      this.detailForm = row;
      this.dialogTitle = `防爆卡操作记录— 查看— ${
        row.bindType == 0 ? row.bindName : row.personName
      }`;
      this.dialogVisiable = true;
    },
    cancel() {
      this.dialogVisiable = false;
    },
    handleSearch(params) {
      this.queryForm = {
        ...this.queryForm,
        ...params,
      };
      this.$refs.table.getData({}, true);
    },
    resetForm() {
      this.queryForm = {};
      this.$refs.table.$refs.table.clearSort();
      this.$refs.table.$refs.table.clearFilter();
      this.$refs.table.getData({}, true);
    },
    tableFilterChange(val) {
      console.log(val);
      this.queryForm = {
        ...this.queryForm,
        ...val,
      };
      console.log(this.queryForm);
      this.$refs.table.getData({}, true);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-icon-error {
  color: #f56c6c;
}
.el-icon-success {
  color: #19be6b;
}
.padding-20 {
  padding: 15px 0px 15px 10px;
}
.flex-col {
  display: flex;
}
.flex-label {
  white-space: nowrap;
}
</style>
