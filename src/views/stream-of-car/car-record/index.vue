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
            btn-text="模拟进出"
            @click="showAdd"
          ></hqit-button>
          <el-dropdown style="margin-left: 10px">
            <span class="el-dropdown-link">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <ty-export
                    size="small"
                    button-text="导出"
                    action="/api/gatedpark/vehicleAccessRec/export"
                    export-name="车辆入园记录"
                    method="post"
                    :action-params="exportActionParams"
                  >
                    <span> 导出Excel </span>
                  </ty-export>
                </el-dropdown-item>
              </el-dropdown-menu>
            </span>
          </el-dropdown>
        </template>
        <template slot="vehicleNumber" slot-scope="{ rowData }">
          <span
            style="color: #358aff; cursor: pointer"
            @click="handleCheckCar(rowData)"
          >
            {{ rowData.vehicleNumber }}
          </span>
        </template>
        <template slot="carOwnerName" slot-scope="{ rowData }">
          <span
            style="color: #358aff; cursor: pointer"
            @click="handleCheckPerson(rowData)"
          >
            {{ rowData.carOwnerName }}
          </span>
        </template>
        <template slot="orgName" slot-scope="{ rowData }">
          <span
            style="color: #358aff; cursor: pointer"
            @click="handleChecksealedCtr(rowData)"
          >
            {{ rowData.orgName }}
          </span>
        </template>
        <template slot="inOutFlag" slot-scope="{ rowData }">
          <span>
            {{ rowData.inOutFlag | filvalue11 }}
          </span>
        </template>
        <template slot="opts" slot-scope="{ rowData }">
          <!-- @click="handleCheck(rowData)" -->
          <el-button type="text" @click="handleCheckEntrance(rowData)">
            查看
          </el-button>
        </template>
      </hqit-table>
      <el-dialog
        v-if="accessShow"
        v-dialogDrag
        width="700px"
        title="车辆入园记录— 模拟进出"
        :visible.sync="accessShow"
      >
        <el-form
          ref="accessForm"
          :model="accessForm"
          :rules="rules1"
          label-width="80px"
        >
          <el-row style="padding: 0 50px">
            <el-col :span="20">
              <el-form-item label="已选车辆">
                <div class="select-people" @click="showPeopleSelect">
                  选择车辆
                </div>
                <template v-if="applyIdList && applyIdList.personarrLeft[0]">
                  <el-tag
                    v-for="(item, index) in applyIdList.personarrLeft"
                    :key="index"
                    style="margin-right: 10px"
                    closable
                    class="nick-name"
                    @close="handleClose4(item)"
                  >
                    {{ item.vehicleCode }}
                  </el-tag>
                </template>
                <template v-if="applyIdList && applyIdList.personarr[0]">
                  <el-tag
                    v-for="(item, index1) in applyIdList.personarr"
                    :key="index1"
                    style="margin-right: 10px"
                    closable
                    class="nick-name"
                    @close="handleClose5(item)"
                  >
                    {{ item.vehicleCode }}
                  </el-tag>
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="区域" prop="areaId">
                <el-select
                  v-model="accessForm.areaId"
                  placeholder="请选择"
                  clearable
                  size="small"
                  style="width: 100%"
                >
                  <el-option
                    v-for="dict in areaList"
                    :key="dict.id"
                    :label="dict.name"
                    :value="dict.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="卡口" prop="gatewayId">
                <el-select
                  v-model="accessForm.gatewayId"
                  placeholder="请选择"
                  clearable
                  size="small"
                  style="width: 100%"
                >
                  <el-option
                    v-for="dict in bayonetList"
                    :key="dict.id"
                    :label="dict.name"
                    :value="dict.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="进出属性" prop="inOutFlag">
                <el-radio-group v-model="accessForm.inOutFlag">
                  <el-radio
                    v-for="dict in visibleOptions"
                    :key="dict.dictValue"
                    :label="dict.dictValue"
                    >{{ dict.dictLabel }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="车闸设备" prop="cameraId">
                <el-select
                  v-model="accessForm.cameraId"
                  filterable
                  placeholder="请选择"
                  clearable
                  size="small"
                  style="width: 100%"
                >
                  <el-option
                    v-for="dict in controlList"
                    :key="dict.id"
                    :label="dict.cameraName"
                    :value="dict.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="时间" prop="accessTime">
                <el-date-picker
                  v-model="value1"
                  style="width: 100%"
                  type="datetime"
                  :picker-options="pickerOptions1"
                  placeholder="选择日期"
                  format="yyyy-MM-dd HH:mm"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="">
                <div style="line-height: 24px; color: #999">
                  备注：模拟进出相当于在系统中模拟了进出记录，适用于手动开闸的场景，做实际的进出场记录之用。
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button class="cancelButton" @click="cancelAccessForm">
            取消
          </el-button>
          <el-button class="confirmButton" type="primary" @click="submitForm1">
            确定
          </el-button>
        </span>
      </el-dialog>
      <!-- 车辆信息 -->
      <el-dialog
        v-if="carDetails"
        v-dialogDrag
        width="400px"
        :title="carDetailsTitle"
        :visible.sync="carDetails"
      >
        <carDetails v-if="orgType == 2" :car-obj="carObj" :is-ctr="true" />
        <carDetails v-if="orgType == 1" :car-obj="carObj" :is-org="true" />
      </el-dialog>
      <el-dialog
        v-if="personDetails"
        v-dialogDrag
        width="400px"
        :title="personDetailsTitle"
        :visible.sync="personDetails"
      >
        <PersonDetails
          v-if="orgType == 2"
          :person-id="personId"
          :is-ctr="true"
          :ctr-name="ctrName"
          :is-base="true"
        />
        <PersonDetails
          v-if="orgType == 1"
          :person-id="personId"
          :is-org="true"
          :is-base="true"
        />
      </el-dialog>
      <el-dialog
        v-if="corDetails"
        v-dialogDrag
        width="1000px"
        :title="cortractorDetailsTitle"
        :visible.sync="corDetails"
      >
        <cortractorDetails v-if="orgType == 2" :contractor-id="ctrId" />
        <ordDetails v-if="orgType == 1" :org-id="orgId" />
      </el-dialog>
      <!-- 车辆入园详情 -->
      <el-dialog
        v-if="carShowDetails"
        v-dialogDrag
        width="1000px"
        :title="carShowDetailsTitle"
        :visible.sync="carShowDetails"
      >
        <carEntrance :car-id="carId" />
      </el-dialog>
      <el-dialog
        v-if="personList"
        v-dialogDrag
        width="1200px"
        title="选择车辆"
        :visible.sync="personList"
      >
        <PersonSel :is-select="true" :checkboxlist.sync="applyIdList" />

        <span slot="footer" class="dialog-footer">
          <el-button class="cancelButton" @click="personList = false">
            取消
          </el-button>
          <el-button
            class="confirmButton"
            type="primary"
            @click="personList = false"
          >
            确定
          </el-button>
        </span>
      </el-dialog>
    </template>
  </hqit-content-page>
</template>

<script>
import PersonDetails from "@/components/FormBody/person-details/index.vue";
import carDetails from "@/components/FormBody/car-record-details/index.vue";
import carEntrance from "@/components/FormBody/car-entrance-details/index.vue";
import ordDetails from "@/components/FormBody/org-details/index.vue";
import cortractorDetails from "@/components/FormBody/contractor-details/index.vue";
import PersonSel from "./car-sel/index.vue";
import {
  bayonetList,
  carLockList,
} from "@/api/infrastructure/access-control-equipment.js";

import { getAreaList } from "@/api/park-planning/area.js";
import {
  getVehicleAccessRecList,
  addVehicleAccessRec,
} from "@/api/flow-analysis/index.js";
export default {
  filters: {
    filvalue11(val) {
      if (val == 0) return "出";
      if (val == 1) return "进";
    },
  },
  components: {
    PersonDetails,
    PersonSel,
    cortractorDetails,
    ordDetails,
    carDetails,
    carEntrance,
  },
  data() {
    return {
      accessShow: false,
      personDetails: false,
      carDetails: false, //车辆信息
      carDetailsTitle: "", //车辆名称
      carObj: {}, //车辆数据
      corDetails: false, //承包商查看详情
      personList: false,
      orgType: 1,
      personDetailsTitle: "",
      cortractorDetailsTitle: "",
      ctrId: "", //承包商id
      carId: "", //入园数据id
      carShowDetailsTitle: "", //入园数据弹窗title
      carShowDetails: false, //入园数据弹窗
      orgId: "", //组织id
      personId: null, //查看负责人详情ID
      ctrName: null, //承包商名称
      waybillData: {},
      exportActionParams: {
        expr: [],
      },
      accessForm: {
        accessTime: null,
        deviceName: "",
        inOutFlag: 1,
        recDtoList: [],
      },
      value1: "",
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      applyIdList: {
        personarrLeft: [],
        personarr: [],
      }, //选择车辆列表
      visibleOptions: [
        { dictLabel: "进门", dictValue: 1 },
        { dictLabel: "出门", dictValue: 0 },
      ],
      rules1: {
        areaId: [
          {
            required: true,
            message: "区域不能为空",
            trigger: "blur",
          },
        ],
        gatewayId: [
          {
            required: true,
            message: "卡口不能为空",
            trigger: "blur",
          },
        ],
        inOutFlag: [
          {
            required: true,
            message: "进出属性不能为空",
            trigger: "blur",
          },
        ],
        cameraId: [
          {
            required: true,
            message: "门禁设备不能为空",
            trigger: "blur",
          },
        ],
        accessTime: [
          {
            required: true,
            message: "时间不能为空",
            trigger: "blur",
          },
        ],
      },
      columns: [
        {
          prop: "vehicleNumber",
          label: "车牌号",
          slotname: "vehicleNumber",
          width: 150,
        },
        {
          prop: "orgName",
          label: "单位/承包商",
          slotname: "orgName",
          width: 150,
        },
        {
          prop: "carOwnerName",
          label: "驾驶人",
          slotname: "carOwnerName",
        },
        {
          prop: "phone",
          label: "手机号",
          width: 150,
        },
        {
          prop: "areaName",
          label: "区域",
          width: 120,
        },
        {
          prop: "inOutFlag",
          label: "进/出",
          width: 120,
          attrs: {
            filters: [
              { text: "出", value: 0 },
              { text: "进", value: 1 },
            ],
            columnKey: "inOutFlag",
          },
        },
        // {
        {
          prop: "gatewayName",
          label: "卡口",
        },
        {
          prop: "deviceName",
          label: "设备",
        },
        {
          prop: "accessTime",
          label: "入场时间",
          width: 180,
          formatter: (val) => {
            return this.awaySecond(val);
          },
          sortable: true,
        },
        {
          prop: "opts",
          label: "操作",
          align: "right",
          slotname: "opts",
          width: 60,
        },
      ],
      searchConfig: [
        {
          label: "车牌号",
          prop: "vehicleNumber",
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "单位/承包商",
          prop: "orgName",
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "驾驶人",
          prop: "carOwnerName",
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "手机号",
          prop: "phone",
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "区域",
          prop: "areaId",
          expression: "LIKE",
          attrs: {
            placeholder: "请选择区域",
          },
          type: "select",
          options: [],
        },
        {
          label: "卡口",
          prop: "gatewayId",
          expression: "LIKE",
          attrs: {
            placeholder: "请选择卡口",
          },
          type: "select",
          options: [],
        },
        {
          label: "设备",
          prop: "deviceName",
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "入场时间",
          prop: "accessTime",
          type: "daterange",
        },
      ],
      queryForm: {},
      bayonetList: [],
      areaList: [],
      controlList: [], //设备列表
    };
  },
  watch: {
    value1(val) {
      if (val) {
        this.accessForm.accessTime = this.$toDateUtil.formatDateTime(
          val,
          "yyyy-MM-dd HH:mm:ss",
        );
      } else {
        this.accessForm.accessTime = "";
      }
    },
    "accessForm.cameraId"(val) {
      if (val) {
        const deviceName = this.controlList.find((item) => item.id == val);
        this.accessForm.deviceName = deviceName.cameraName;
      } else {
        this.accessForm.deviceName = "";
      }
    },
  },
  created() {
    let arr2 = [];
    arr2.push(this.getBeforeDate(6));
    arr2.push(this.getBeforeDate(0));
    this.searchConfig.accessTime = arr2;
    this.queryForm.accessTime = arr2;
    console.log(this.searchConfig, "刚进来");
    console.log(this.queryForm, "刚进来12345");
  },
  mounted() {
    this.getBayonetList();
    this.getAreaList();
    this.getCarLockList();
  },
  methods: {
    handleClose4(item) {
      if (this.isCheck) return;
      this.applyIdList.personarrLeft.splice(
        this.applyIdList.personarrLeft.indexOf(item),
        1,
      );
    },
    handleClose5(item) {
      if (this.isCheck) return;
      this.applyIdList.personarr.splice(
        this.applyIdList.personarr.indexOf(item),
        1,
      );
    },
    // 查看人员详情信息
    handleCheckPerson(row) {
      console.log(row);
      this.orgType = row.orgType;
      this.ctrName = row.orgName;
      this.personId = row.personId;
      this.personDetailsTitle = `查看— ${row.carOwnerName}`;
      this.personDetails = true;
    },
    // 查看车辆详情信息
    handleCheckCar(row) {
      console.log(row);
      this.orgType = row.orgType;
      this.carObj = row;
      this.carDetailsTitle = `查看— ${row.vehicleNumber}`;
      this.carDetails = true;
    },
    // 查看车辆入园详情信息
    handleCheckEntrance(row) {
      console.log(row);
      this.carId = row.id;
      this.carShowDetailsTitle = `车辆入场记录— 查看— ${row.vehicleNumber}`;
      this.carShowDetails = true;
    },
    // 查询承包商详情
    handleChecksealedCtr(row) {
      console.log(row);
      this.orgType = row.orgType;
      this.ctrId = row.orgId;
      this.orgId = row.orgId;
      this.corDetails = true;
      if (row.orgType == 1) {
        this.cortractorDetailsTitle = "拜访单位— 查看—" + row.orgName;
      } else {
        this.cortractorDetailsTitle = "承包商— 查看—" + row.orgName;
      }
    },
    // 查看人员详情信息
    showPeopleSelect(row) {
      console.log("个沟沟壑壑");
      this.personList = true;
    },
    // 获取列表数据
    getList(params) {
      console.log(this.searchConfig, "123456");
      console.log(this.queryForm, "12345");
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
      if (this.queryForm.inOutFlag) {
        resParams.expr.push({
          key: "inOutFlag",
          value: this.queryForm.inOutFlag,
          expression: "IN",
        });
      }
      if (this.queryForm.accessTime && this.queryForm.accessTime.length > 0) {
        // 更新时间 大于等于
        resParams.expr.push({
          key: "accessTime",
          expression: "GE",
          value: this.queryForm.accessTime[0],
        });
        // 更新时间 小于等于
        resParams.expr.push({
          key: "accessTime",
          expression: "LE",
          value: this.queryForm.accessTime[1] + " 23:59:59",
        });
      }
      this.exportActionParams.expr = resParams.expr;
      return getVehicleAccessRecList(resParams);
    },
    // 新增/查看/修改
    showAdd() {
      this.reset1();
      this.accessShow = true;
      this.value1 = "";
      // return;
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
    // 门禁设备列表
    getCarLockList() {
      let params = {
        order: "updateTime",
        sort: "DESC",
        pageNum: 1, // 页码
        pageSize: 99999, // 显示数量
        query: [],
      };
      carLockList(params).then((res) => {
        this.controlList = res.data.list;
      });
    },
    getAreaList() {
      let resParams = {
        order: "createTime",
        sort: "DESC",
        pageNum: 1,
        pageSize: 9999999,
        query: {},
        expr: [],
      };
      getAreaList(resParams).then((res) => {
        this.areaList = res.data.list;
        this.searchConfig.find((v) => v.prop == "areaId").options =
          this.areaList.map((item) => {
            return { label: item.name, value: item.id };
          });
      });
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
    // 表单重置
    reset1() {
      let that = this;
      this.accessForm = {
        accessTime: null,
        inOutFlag: 1,
        areaId: null,
        gatewayId: null,
        cameraId: null,
        deviceName: "",
        recDtoList: [],
      };
      that.$resetForm("accessForm");
      that.applyIdList = {
        personarrLeft: [],
        personarr: [],
      };
    },
    cancelAccessForm() {
      this.reset1();
      this.accessShow = false;
    },
    submitForm1() {
      console.log(this.applyIdList, "12345");
      this.$refs["accessForm"].validate((valid) => {
        // return;
        if (valid) {
          let personarr = [];
          let personarrLeft = [];
          if (
            this.applyIdList.personarrLeft.length == 0 &&
            this.applyIdList.personarr.length == 0
          ) {
            this.$message.warning("请选择车辆");
            return;
          }
          if (this.applyIdList.personarr && this.applyIdList.personarr[0]) {
            personarr = this.getImgIds(this.applyIdList.personarr);
          }
          if (
            this.applyIdList.personarrLeft &&
            this.applyIdList.personarrLeft[0]
          ) {
            personarrLeft = this.getImgIds1(this.applyIdList.personarrLeft);
          }
          let itemUsers = [...personarr, ...personarrLeft];
          this.accessForm.recDtoList = itemUsers;
          console.log(this.accessForm);
          // return;
          let fn = addVehicleAccessRec;
          fn(this.accessForm).then((response) => {
            console.log(response, "hghgghh");
            if (response.success) {
              this.$msgSuccess(response.msg);
              this.reset1();
              this.accessShow = false;
              this.$refs.table.getData({}, true);
            } else {
              this.$msgError(response.msg);
            }
          });
        }
      });
    },
    // 获取承包商车辆数据
    getImgIds(list) {
      // console.log(list);
      // console.log('234545454545')
      let subList = [];
      list.map((item) => {
        subList.push({
          vehicleNumber: item.vehicleCode,
          phone: item.personPhone,
          carOwnerName: item.personName,
          carType: item.vehicleTypeId,
          orgType: 2,
          orgName: item.sealedCtrName,
          personId: item.personId,
          vehicleId: item.vehicleId,
          orgId: item.sealedCtrId,
        });
      });
      return subList;
    },
    // 获取组织车辆数据
    getImgIds1(list) {
      // console.log(list);
      // console.log('234545454545')
      let subList = [];
      list.map((item) => {
        subList.push({
          vehicleNumber: item.vehicleCode,
          phone: item.personPhone,
          carOwnerName: item.personName,
          carType: item.vehicleTypeId,
          orgType: 1,
          orgName: item.orgName,
          personId: item.personId,
          vehicleId: item.vehicleId,
          orgId: item.orgId,
        });
      });
      return subList;
    },
    getBeforeDate(num, time) {
      let n = num;
      let d = "";
      if (time) {
        d = new Date(time);
      } else {
        d = new Date();
      }
      let year = d.getFullYear();
      let mon = d.getMonth() + 1;
      let day = d.getDate();
      if (day <= n) {
        if (mon > 1) {
          mon = mon - 1;
        } else {
          year = year - 1;
          mon = 12;
        }
      }
      d.setDate(d.getDate() - n);
      year = d.getFullYear();
      mon = d.getMonth() + 1;
      day = d.getDate();
      let s = "";
      if (n == 0) {
        s =
          year +
          "-" +
          (mon < 10 ? "0" + mon : mon) +
          "-" +
          (day < 10 ? "0" + day : day);
      } else {
        s =
          year +
          "-" +
          (mon < 10 ? "0" + mon : mon) +
          "-" +
          (day < 10 ? "0" + day : day);
      }
      // s = new Date(s);
      // console.log(s);
      return s;
    },
  },
};
</script>
<style scope lang="scss">
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
::v-deep .el-menu-item {
  height: 40px !important;
  line-height: 40px !important;
  padding-left: 0px !important;
}
.select-people {
  display: inline-block;
  text-align: center;
  width: 100px;
  background: #358aff;
  height: 33px;
  line-height: 33px;
  color: #fff;
  border-radius: 5px;
  margin-right: 10px;
  cursor: pointer;
}
// }
</style>
