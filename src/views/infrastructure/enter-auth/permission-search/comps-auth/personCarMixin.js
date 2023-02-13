import { bayonetList } from "@/api/infrastructure/access-control-equipment.js";
import DialogMessage from "../check-dialog/message.vue";
import {
  personList,
  carList,
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
      searchId: "", // 列表搜索id
      personList: [], // 人员列表
      carList: [], // 车辆列表
      bayonetList: [], // 卡口列表
      // radioId: "", // 人id/车id  1234561001 或者 11
      radioId: "", // 人id/车id  1600494625120862209 或者 1600492477398138882
      msgTitle: null,
      tableData: [],
      reqNum: 0,
      reqPage: 1, // 请求页码
      reqTotal: 0, // 总数
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
          prop: "value5",
          label: "权限来源",
          width: "150",
          slotname: "value5",
          attrs: {
            filters: [
              { text: "独立配置", value: 0 },
              { text: "继承自单位", value: 1 },
            ],
            "filter-method": this.handleFilter,
          },
        },
        {
          prop: "status2",
          label: "下载状态",
          width: "150",
          slotname: "status2",
          attrs: {
            filters: [
              { text: "下载成功", value: 1 },
              { text: "下载失败", value: 2 },
              { text: "待下载", value: 3 },
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
      this.personList = [];
      this.carList = [];
      this.fuTabs == "1" ? this.getPersonList() : this.getCarList();
    },
    // 因为人、车都是同用一个组件 因为要在tab切换的时候重置搜索
    fuTabs() {
      this.reqPage = 1;
      this.reqTotal = 0;
      this.personList = [];
      this.carList = [];
      this.searchId = "";
      this.radioId = "";
      this.getSelList();
      this.radioId && this.handleReset();
    },
  },
  mounted() {
    this.getSelList();
    this.getBayonetList();
  },
  methods: {
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
        deviceType: this.fuTabs == "1" ? 2 : 1, // 2-人脸门禁、1-车辆门禁
        resourceId: this.radioId, // 单位id
        resourceType: this.fuTabs, // 2-单位权限、1-人员权限、3-车辆权限
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
    // 人员列表
    getPersonList() {
      let resParams = {
        sort: "DESC",
        orderBy: "updateTime",
        pageNum: this.reqPage,
        pageSize: 30,
        query: {
          hasOrg: true,
        },
      };
      if (this.searchId) resParams.query.name = this.searchId;
      personList(resParams).then((res) => {
        this.personList = this.personList.concat(res.data.list);
        this.reqTotal = res.data.pagination.total;
      });
    },
    // 车辆列表
    getCarList() {
      let resParams = {
        sort: "DESC",
        order: "createTime",
        pageNum: this.reqPage,
        pageSize: 30,
        expr: [],
      };
      this.searchId &&
        resParams.expr.push(this.handleExpression("EQ", "id", this.searchId)); // 搜索id
      carList(resParams).then((res) => {
        this.carList = this.carList.concat(res.data.list);
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
    getSelList() {
      this.fuTabs == "1" ? this.getPersonList() : this.getCarList();
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
    handleOpenMsg(row) {
      let request;
      this.fuTabs == "1"
        ? (request = personLockDetail)
        : (request = carLockDetail);
      request(row.deviceId).then((res) => {
        this.msgTitle = `设备信息—查看—${row.deviceName}`;
        this.$refs.msgModel.openModel({
          data: {
            data: { tab: this.fuTabs == "1" ? 2 : 1, ...res.data },
          },
        });
      });
    },
    // 列表滚动事件
    handleScroll(e) {
      let request;
      let arrList;
      if (this.fuTabs == "1") {
        request = this.getPersonList;
        arrList = this.personList;
      } else {
        request = this.getCarList;
        arrList = this.carList;
      }
      let scrollTop = e.target.scrollTop; // 滚动条滚动时，距离顶部的距离
      let windowHeight = e.target.clientHeight; // 可视区的高度
      let scrollHeight = e.target.scrollHeight; // 滚动条的总高度
      // 滚动条到底部的条件
      if (Math.ceil(scrollTop + windowHeight + 5) >= scrollHeight) {
        // 触发更多函数
        if (this.reqTotal > arrList.length) {
          this.reqPage += 1;
          request();
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
