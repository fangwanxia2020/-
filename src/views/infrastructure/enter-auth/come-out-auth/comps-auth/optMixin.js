import DialogMessage from "../check-dialog/message.vue";
import DialogDevice from "../check-dialog/device.vue";
import AllotAuth from "../allot-auth/index.vue";
import {
  getListByType,
  orgDetail,
  personDetail,
  carDetail,
  selfDeviceDetail,
  totalDeviceDetail,
  downAuth,
} from "@/api/infrastructure/come-out-auth.js";
import { contractorDetail } from "@/api/access-control-permission/organization-control.js";
export default {
  components: { DialogMessage, DialogDevice, AllotAuth },
  props: {
    tabsActive: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      msgTitle: null,
      authTitle: null,
      columnsBase: [
        {
          prop: "areaNums",
          label: "授权区域",
          width: "150",
          slotname: "areaNums",
        },
        {
          prop: "getewayNums",
          label: "授权卡口",
          width: "150",
          slotname: "getewayNums",
        },
        {
          prop: "deviceNums",
          label: "单独授权设备",
          width: "150",
          slotname: "deviceNums",
        },
        {
          prop: "totalNums",
          label: "合计授权设备",
          width: "150",
          slotname: "totalNums",
        },
        {
          prop: "updateName",
          label: "授权人",
        },
        {
          prop: "updateTime",
          label: "授权时间",
          formatter: (val) => {
            return this.awaySecond(val);
          },
          width: "150",
          sortable: true,
        },
        {
          prop: "permissionStatus",
          label: "授权状态",
          // width: "100",
          slotname: "permissionStatus",
          attrs: {
            filters: [
              { text: "未授权", value: 0 },
              { text: "授权中", value: 1 },
              { text: "全部授权", value: 2 },
              { text: "部分授权", value: 3 },
              { text: "授权失败", value: 4 },
            ],
            "filter-method": this.handleFilter,
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
      searchConfigBase: [
        {
          label: "授权人",
          prop: "authPersonName",
          expression: "LIKE",
          attrs: {
            clearable: true,
            placeholder: "请输入",
          },
        },
        {
          label: "授权时间",
          prop: "updateTime",
          type: "daterange",
          attrs: {
            "start-placeholder": "开始时间",
            "end-placeholder": "结束时间",
          },
        },
      ],
      queryForm: {},
    };
  },
  methods: {
    // 获取列表数据 2-单位权限 1-人员权限 3-车辆权限 4-承包商权限
    getList(params) {
      let resParams = {
        // order: "updateTime",
        // sort: "DESC",
        pageNum: params.page, // 页码
        pageSize: params.size, // 显示数量
        expr: [],
        query: {
          resourceType: this.tabsActive,
        },
      };
      if (this.tabsActive != 4) {
        resParams = {
          order: "updateTime",
          sort: "DESC",
          ...resParams,
        };
      }
      this.searchConfig.forEach((configItem) => {
        if (
          this.queryForm[configItem.prop] &&
          this.queryForm[configItem.prop] != "" &&
          configItem.expression
        ) {
          // resParams.expr.push({
          //   key: configItem.prop,
          //   value: this.queryForm[configItem.prop],
          //   expression: configItem.expression,
          // });
          resParams.query[configItem.prop] = this.queryForm[configItem.prop];
          if (configItem.prop == "ctrFilingIds") {
            resParams.query["ctrFilingIds"] = [this.queryForm[configItem.prop]];
          }
        }
      });
      // 授权时间
      if (this.queryForm.updateTime) {
        resParams.query.updateTimeStart =
          this.queryForm.updateTime[0] + " 00:00:00";
        resParams.query.updateTimeEnd =
          this.queryForm.updateTime[1] + " 23:59:59";
      }
      return getListByType(resParams);
    },
    // 下发权限
    handleDown() {
      this.$confirm("此操作将下发权限, 是否继续?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
        dangerouslyUseHTMLString: true,
        cancelButtonClass: "cancelButton",
        confirmButtonClass: "deleteButton-confirm",
      }).then(() => {
        downAuth({ resourceType: this.tabsActive }).then(() => {
          this.$message({
            type: "success",
            message: "下发权限成功",
          });
          this.handleSearch();
        });
      });
    },
    // 授权
    handleAuth(row) {
      this.$refs.allotModel.openModel({
        data: {
          data: {
            resourceId: row.resourceId,
            resourceType: this.tabsActive,
          },
        },
      });
    },
    // 撤销
    handleBackout() {
      // this.$confirm("此操作将撤销, 是否继续?", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning",
      // }).then(() => {
      //   this.$message({
      //     type: "success",
      //     message: "撤销成功!",
      //   });
      // });
    },
    async handleOpenMsg(num, row) {
      let resData;
      if (num == 2) {
        this.msgTitle = `单位信息— 查看— ${row.resourceName}`;
        await orgDetail(row.resourceId).then((res) => {
          resData = res.data;
        });
      }
      if (num == 1) {
        this.msgTitle = "人员信息— 查看— " + row.resourceName;
        await personDetail(row.resourceId).then((res) => {
          resData = res.data;
        });
      }
      if (num == 3) {
        this.msgTitle = "车牌信息— 查看— " + row.resourceName;
        await carDetail(row.resourceId).then((res) => {
          resData = res.data;
        });
      }
      if (num == 4) {
        this.msgTitle = "承包商信息— 查看— " + row.resourceName;
        await contractorDetail(row.resourceId).then((res) => {
          resData = res.data;
        });
      }
      this.$refs.msgModel.openModel({
        data: {
          data: { ...resData },
          title: this.msgTitle,
        },
      });
    },
    async handleOpenAuth(num, row) {
      let resData;
      let params = {
        resourceId: row.resourceId,
        resourceType: this.tabsActive,
      };
      if (num == 1) {
        this.authTitle = `单独授权设备— 查看— ${row.resourceName}`;
        await selfDeviceDetail(params).then((res) => {
          resData = res.data;
        });
      }
      if (num == 2) {
        this.authTitle = `合计授权设备— 查看— ${row.resourceName}`;
        await totalDeviceDetail(params).then((res) => {
          resData = res.data;
        });
      }
      if (num == 3) {
        this.authTitle = `授权设备状态— 查看— ${row.resourceName}`;
      }
      this.$refs.authModel.openModel({
        data: {
          data: { dataArr: resData },
        },
      });
    },
    handleJump(path, row) {
      this.$router.push({
        path,
        query: {
          resourceId: row.resourceId,
          resourceName: row.resourceName,
          resourceType: this.tabsActive,
        },
      });
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
  },
};
