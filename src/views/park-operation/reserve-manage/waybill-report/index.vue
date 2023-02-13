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
        @reset="handleReset"
        @filter-change="tableFilterChange"
      >
        <template slot="operator">
          <hqit-button
            size="mini"
            btn-type="add"
            btn-text="新增"
            @click="handlePush('add')"
          ></hqit-button>
        </template>
        <template slot="materialName" slot-scope="{ rowData }">
          <span
            style="color: #358aff; cursor: pointer"
            @click="handleMaterialName(rowData)"
          >
            {{ rowData.hcplmTransWaybillDetailDto.materialName }}
          </span>
        </template>
        <template slot="shipmentPlace" slot-scope="{ rowData }">
          {{ rowData.shipmentProvince }}{{ rowData.shipmentCity
          }}{{ rowData.shipmentCounty }}{{ rowData.shipmentPlace }}
        </template>
        <template slot="destination" slot-scope="{ rowData }">
          {{ rowData.destinationProvince }}{{ rowData.destinationCity
          }}{{ rowData.destinationCounty }}{{ rowData.destination }}
        </template>
        <template slot="shipWeight" slot-scope="{ rowData }">
          {{ rowData.hcplmTransWaybillDetailDto.shipWeight }}
        </template>
        <template slot="waybillSource" slot-scope="{ rowData }">
          {{ rowData.waybillSource | filvalue11 }}
        </template>
        <template slot="waybillStatus" slot-scope="{ rowData }">
          {{ rowData.waybillStatus | filvalue12 }}
        </template>
        <template slot="opts" slot-scope="{ rowData }">
          <el-button type="text" @click="handlePush('check', rowData)">
            查看
          </el-button>
          <el-button type="text" @click="handlePush('edit', rowData)">
            修改
          </el-button>
          <!-- <el-button type="text" @click="handleDel(rowData)"> 删除 </el-button> -->
        </template>
      </hqit-table>
      <el-dialog
        v-if="materialNameDetails"
        v-dialogDrag
        width="1000px"
        :visible.sync="materialNameDetails"
      >
        <waybill :waybill-data="waybillData" :title-name="titleName" />
      </el-dialog>
    </template>
  </hqit-content-page>
</template>

<script>
import waybill from "@/components/waybill/index.vue";
import {
  getWaybillList,
  getWaybillGetMaterialByName,
} from "@/api/reserve-manage/waybill.js";
export default {
  filters: {
    filvalue11(val) {
      if (val == 0) return "园区内部";
      if (val == 1) return "自治区同步";
      if (val == 2) return "封闭填报";
    },
    filvalue12(val) {
      if (val == 0) return "待执行";
      if (val == 1) return "运输中";
      if (val == 2) return "已完成";
      if (val == 3) return "作废";
      if (val == 4) return "待装货";
      if (val == 5) return "待上报";
    },
  },
  components: { waybill },
  data() {
    return {
      materialNameDetails: false,
      waybillData: {},
      columns: [
        {
          prop: "waybillCode",
          label: "运单编号",
          width: 200,
        },
        {
          prop: "materialName",
          label: "品名",
          slotname: "materialName",
        },
        {
          prop: "shipWeight",
          label: "托运数量(吨)",
          slotname: "shipWeight",
          width: 120,
        },
        {
          prop: "shipperName",
          label: "托运人",
        },
        // {
        {
          prop: "loadName",
          label: "装货人",
          formatter: (val) => {
            return val ? val : "-";
          },
        },
        {
          prop: "receiverName",
          label: "收货人",
          formatter: (val) => {
            return val ? val : "-";
          },
        },
        {
          prop: "shipmentPlace",
          label: "起运地",
          slotname: "shipmentPlace",
          width: 240,
        },
        {
          prop: "destination",
          label: "目的地",
          slotname: "destination",
          width: 240,
        },
        {
          prop: "vehicleLicense",
          label: "车牌号",
        },
        {
          prop: "waybillSource",
          label: "运单来源",
          slotname: "waybillSource",
          width: 120,
          attrs: {
            filters: [
              { text: "园区内部", value: 0 },
              { text: "自治区同步", value: 1 },
              { text: "封闭填报", value: 2 },
            ],
            columnKey: "waybillSource",
          },
        },
        {
          prop: "waybillStatus",
          label: "运单状态",
          slotname: "waybillStatus",
          width: 120,
          attrs: {
            filters: [
              { text: "待执行", value: 0 },
              { text: "运输中", value: 1 },
              { text: "已完成", value: 2 },
              { text: "作废", value: 3 },
              { text: "待装货", value: 4 },
              { text: "待上报", value: 5 },
            ],
            columnKey: "waybillStatusList",
          },
        },
        {
          prop: "updateTime",
          label: "更新时间",
          width: 180,
          sortable: true,
          formatter: (val) => {
            return this.awaySecond(val);
          },
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
          label: "运单编号",
          prop: "waybillCode",
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "品名",
          prop: "materialName",
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "装货人",
          prop: "loadName",
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "托运人",
          prop: "shipperName",
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "收货人",
          prop: "receiverName",
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "车牌号",
          prop: "vehicleLicense",
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "更新时间",
          prop: "updateTime",
          type: "daterange",
        },
      ],
      queryForm: {},
      titleName: "",
    };
  },
  methods: {
    // 获取列表数据
    getList(params) {
      console.log(params, "搜索缩减");
      console.log(this.searchConfig, "123456");
      console.log(this.queryForm, "12345");
      let resParams = {
        orderBy: "createTime",
        sort: "DESC",
        pageNum: params.page,
        pageSize: params.size,
        query: {},
      };
      // this.searchConfig.forEach((configItem) => {
      //   if (
      //     this.queryForm[configItem.prop] &&
      //     this.queryForm[configItem.prop] != "" &&
      //     configItem.expression
      //   ) {
      //     resParams.query.push({
      //       key: configItem.prop,
      //       value: this.queryForm[configItem.prop],
      //       expression: configItem.expression,
      //     });
      //   }
      // });
      // waybillCode 运单编号
      if (this.queryForm.waybillCode) {
        resParams.query.waybillCode = this.queryForm.waybillCode;
      }
      // 品名
      if (this.queryForm.materialName) {
        resParams.query.materialName = this.queryForm.materialName;
      }
      // 装货人
      if (this.queryForm.loadName) {
        resParams.query.loadName = this.queryForm.loadName;
      }
      // 托运人
      if (this.queryForm.shipperName) {
        resParams.query.shipperName = this.queryForm.shipperName;
      }
      // 收货人
      if (this.queryForm.receiverName) {
        resParams.query.receiverName = this.queryForm.receiverName;
      }
      // 车牌号
      if (this.queryForm.vehicleLicense) {
        resParams.query.vehicleLicense = this.queryForm.vehicleLicense;
      }
      // 运单来源
      if (this.queryForm.waybillSource) {
        resParams.query.waybillSourceList = this.queryForm.waybillSource;
      }
      // 运单状态
      if (this.queryForm.waybillStatusList) {
        resParams.query.waybillStatusList = this.queryForm.waybillStatusList;
      }

      // 更新时间
      if (this.queryForm.updateTime) {
        resParams.query.startTime = this.queryForm.updateTime[0] + " 00:00:00";
        resParams.query.endTime = this.queryForm.updateTime[1] + " 23:59:59";
      }
      return getWaybillList(resParams);
    },
    // 新增/查看/修改
    handlePush(path, row) {
      console.log(row);
      // return;
      this.$router.push({
        path: `/gatedpark/park-operation/reserve-manage/waybill-report/${path}`,
        query: {
          id: row ? row.id : "",
          title: row ? row.hcplmTransWaybillDetailDto.materialName : "",
          who: row ? 2 : "",
        },
      });
    },
    // 删除
    async handleDel(row) {
      const valid = await this.errorBoundary(this.delPrompt(this, row.value1));
      if (valid) {
        let listArr = this.$store.state.static.list;
        listArr.map((item) => {
          if (item.id == row.id) {
            listArr.splice(
              listArr.findIndex((item) => item.id == row.id),
              1,
            );
          }
        });
        this.$message({
          type: "success",
          message: "删除成功",
        });
        this.handleReset();
      } else {
        this.$message({ message: "删除取消" });
      }
    },
    // 搜索
    handleSearch(params) {
      console.log(params, "叫华哥湖广会馆");
      this.queryForm = {
        ...params,
      };
      this.$refs.table.getData({}, true);
    },
    // 表格条件筛选
    tableFilterChange(val) {
      console.log(val, "叫华哥湖广会馆val1");
      this.queryForm = {
        ...this.queryForm,
        ...val,
      };
      this.$refs.table.getData({}, true);
    },
    // 重置
    handleReset() {
      this.queryForm = {};
      this.$refs.table.$refs.table.clearFilter();
      this.$refs.table.getData({}, true);
    },
    // 根据name获取危化品详情
    handleMaterialName(row) {
      console.log(row, "1234");
      getWaybillGetMaterialByName(
        row.hcplmTransWaybillDetailDto.materialName,
      ).then((res) => {
        this.waybillData = res.data;
        this.materialNameDetails = true;
        this.titleName = row.hcplmTransWaybillDetailDto.materialName;
      });
    },
  },
};
</script>
<style scope lang="scss">
::v-deep .el-menu-item {
  height: 40px !important;
  line-height: 40px !important;
  padding-left: 0px !important;
}

.el-dialog {
  .el-dialog__headerbtn {
    .el-dialog__close {
      color: #a6a6a6 !important;
    }
  }
}
// }
</style>
