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
        <!-- <template slot="operator">
          <hqit-button
            size="mini"
            btn-type="add"
            btn-text="新增"
            @click="handlePush('add')"
          ></hqit-button>
        </template> -->
        <template slot="materialName" slot-scope="{ rowData }">
          <span
            style="cursor: pointer"
            :style="
              rowData.hcplmTransWaybillDto &&
              rowData.hcplmTransWaybillDto != {} &&
              rowData.hcplmTransWaybillDto.hcplmTransWaybillDetailDto
                ? 'color: #358aff'
                : ''
            "
            @click="handleMaterialName(rowData)"
          >
            {{
              rowData.hcplmTransWaybillDto &&
              rowData.hcplmTransWaybillDto != {} &&
              rowData.hcplmTransWaybillDto.hcplmTransWaybillDetailDto
                ? rowData.hcplmTransWaybillDto.hcplmTransWaybillDetailDto
                    .materialName
                : "-"
            }}
          </span>
        </template>
        <template slot="elecWaybillNo" slot-scope="{ rowData }">
          {{ rowData.elecWaybillNo ? rowData.elecWaybillNo : "-" }}
        </template>
        <!-- 起运地 -->
        <template slot="shipmentPlace" slot-scope="{ rowData }">
          {{
            rowData.hcplmTransWaybillDto &&
            JSON.stringify(rowData.hcplmTransWaybillDto) != "{}"
              ? rowData.hcplmTransWaybillDto.shipmentPlace
              : "-"
          }}
          <!-- {{ rowData.shipmentProvince }}{{ rowData.shipmentCity
          }}{{ rowData.shipmentCounty }}{{ rowData.shipmentPlace }} -->
        </template>
        <!-- 目的地 -->
        <template slot="destination" slot-scope="{ rowData }">
          {{
            rowData.hcplmTransWaybillDto &&
            JSON.stringify(rowData.hcplmTransWaybillDto) != "{}"
              ? rowData.hcplmTransWaybillDto.destination
              : "-"
          }}
          <!-- {{ rowData.destinationProvince }}{{ rowData.destinationCity
          }}{{ rowData.destinationCounty }}{{ rowData.destination }} -->
        </template>
        <!-- "托运数量(吨)" -->
        <template slot="shipWeight" slot-scope="{ rowData }">
          {{
            rowData.hcplmTransWaybillDto &&
            rowData.hcplmTransWaybillDto != {} &&
            rowData.hcplmTransWaybillDto.hcplmTransWaybillDetailDto
              ? rowData.hcplmTransWaybillDto.hcplmTransWaybillDetailDto
                  .shipWeight
              : "-"
          }}
        </template>
        <!-- 托运人 -->
        <template slot="shipperName" slot-scope="{ rowData }">
          {{
            rowData.hcplmTransWaybillDto &&
            JSON.stringify(rowData.hcplmTransWaybillDto) != "{}"
              ? rowData.hcplmTransWaybillDto.shipperName
              : "-"
          }}
        </template>
        <!-- 装货人 -->
        <template slot="loadName" slot-scope="{ rowData }">
          {{
            rowData.hcplmTransWaybillDto &&
            JSON.stringify(rowData.hcplmTransWaybillDto) != "{}"
              ? rowData.hcplmTransWaybillDto.loadName
              : "-"
          }}
        </template>
        <!-- 收货人 -->
        <template slot="receiverName" slot-scope="{ rowData }">
          {{
            rowData.hcplmTransWaybillDto &&
            JSON.stringify(rowData.hcplmTransWaybillDto) != "{}"
              ? rowData.hcplmTransWaybillDto.receiverName
              : "-"
          }}
        </template>
        <!-- 收货人 -->
        <template slot="updateTime" slot-scope="{ rowData }">
          {{
            rowData.hcplmTransWaybillDto &&
            JSON.stringify(rowData.hcplmTransWaybillDto) != "{}"
              ? rowData.hcplmTransWaybillDto.updateTime
              : "-"
          }}
        </template>
        <template slot="status" slot-scope="{ rowData }">
          {{ rowData.status | filvalue12 }}
        </template>
        <template slot="opts" slot-scope="{ rowData }">
          <el-button
            v-if="
              rowData.hcplmTransWaybillDto &&
              JSON.stringify(rowData.hcplmTransWaybillDto) != '{}'
            "
            type="text"
            @click="handlePush('check', rowData)"
          >
            查看
          </el-button>
          <el-button v-else type="text" style="color: #aaaaaa">
            查看
          </el-button>
          <!-- <div v-else>查看</div> -->
          <!-- <el-button type="text" @click="handlePush('edit', rowData)">
            修改
          </el-button> -->
          <el-button type="text" @click="handleDel(rowData)"> 删除 </el-button>
        </template>
      </hqit-table>
      <el-dialog
        v-if="materialNameDetails"
        v-dialogDrag
        width="1000px"
        :visible.sync="materialNameDetails"
      >
        <waybill :waybill-data="waybillData" />
      </el-dialog>
    </template>
  </hqit-content-page>
</template>

<script>
import waybill from "@/components/waybill/index.vue";
import {
  getVerifyRec,
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
      if (val == 0) return "不通过";
      if (val == 1) return "通过";
      return "-";
    },
  },
  components: { waybill },
  data() {
    return {
      materialNameDetails: false,
      waybillData: {},
      columns: [
        {
          prop: "elecWaybillNo",
          label: "运单编号",
          width: 200,
          slotname: "elecWaybillNo",
        },
        {
          prop: "vehicleNum",
          label: "车牌号",
          width: 150,
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
          slotname: "shipperName",
        },
        {
          prop: "loadName",
          label: "装货人",
          slotname: "loadName",
        },
        {
          prop: "receiverName",
          label: "收货人",
          slotname: "receiverName",
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
          prop: "status",
          label: "检验状态",
          slotname: "status",
          width: 120,
          attrs: {
            filters: [
              { text: "不通过", value: 0 },
              { text: "通过", value: 1 },
            ],
            columnKey: "status",
          },
        },
        // {
        //   prop: "updateTime",
        //   label: "更新时间",
        //   width: 180,
        //   slotname: "updateTime",
        //   // formatter: (val) => {
        //   //   return val ? this.awaySecond(val) : "-";
        //   // },
        // },
        {
          prop: "updateTime",
          label: "更新时间",
          sortable: true,
          width: 180,
          slotname: "updateTime",
          // formatter: (val) => {
          //   return this.awaySecond(val);
          // },
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
          prop: "elecWaybillNo",
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "车牌号",
          prop: "vehicleNum",
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
          label: "起运地",
          prop: "shipmentPlace",
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "目的地",
          prop: "destination",
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
    };
  },
  methods: {
    // getList() {
    //   return Promise.resolve({
    //     data: {
    //       list: this.$store.state.static.list,
    //       pagination: { total: this.$store.state.static.list.length },
    //     },
    //   });
    // },
    // 获取列表数据
    getList(params) {
      console.log(params, "搜索缩减");
      console.log(this.searchConfig, "搜索参数");
      console.log(this.queryForm, "12345");
      let resParams = {
        orderBy: "createTime",
        sort: "DESC",
        pageNum: params.page,
        pageSize: params.size,
        query: {},
        expr: [],
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
      if (this.queryForm.elecWaybillNo) {
        resParams.query.elecWaybillNo = this.queryForm.elecWaybillNo;
      }
      // 车牌号
      if (this.queryForm.vehicleNum) {
        resParams.query.vehicleNum = this.queryForm.vehicleNum;
      }
      // 品名
      if (this.queryForm.materialName) {
        resParams.query.materialName = this.queryForm.materialName;
      }
      // 起运地
      if (this.queryForm.shipmentPlace) {
        resParams.query.shipmentPlace = this.queryForm.shipmentPlace;
      }
      // 目的地
      if (this.queryForm.destination) {
        resParams.query.destination = this.queryForm.destination;
      }
      // 运单状态
      if (this.queryForm.status) {
        resParams.expr.status = this.queryForm.status;
        resParams.expr.push({
          key: "status",
          value: this.queryForm.status,
          expression: "LIKE",
        });
      }

      // 更新时间
      if (this.queryForm.updateTime && this.queryForm.updateTime.length) {
        resParams.query.startTime = this.queryForm.updateTime[0] + " 00:00:00";
        resParams.query.endTime = this.queryForm.updateTime[1] + " 00:00:00";
      }
      return getVerifyRec(resParams);
    },
    // 新增/查看/修改
    setJson(data) {
      return JSON.stringify(data);
    },
    // 新增/查看/修改
    handlePush(path, row) {
      console.log(row);
      // return;
      this.$router.push({
        path: `/gatedpark/park-operation/reserve-manage/self-check/${path}`,
        query: {
          id: row ? row.elecWaybillNo : "",
          title: row
            ? row.hcplmTransWaybillDto.hcplmTransWaybillDetailDto.materialName
            : "",
          who: row ? 2 : "",
        },
      });
    },
    // 删除
    async handleDel(row) {
      console.log(row);
      const valid = await this.errorBoundary(
        this.delPrompt(this, row.elecWaybillNo),
      );
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
      console.log(val, "叫华哥湖广会馆");
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
        row.hcplmTransWaybillDto.hcplmTransWaybillDetailDto.materialName,
      ).then((res) => {
        this.waybillData = res.data;
        this.materialNameDetails = true;
      });
    },
  },
};
</script>
