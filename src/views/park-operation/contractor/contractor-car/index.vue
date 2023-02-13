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
          <el-dropdown style="margin-left: 10px">
            <span class="el-dropdown-link">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-upload
                    :file-max-size="2"
                    class="fileUpload"
                    action="#"
                    :http-request="handleExcel"
                    :show-file-list="false"
                  >
                    <span>导入Excel</span>
                  </el-upload>
                </el-dropdown-item>
                <el-dropdown-item>
                  <ty-export
                    size="small"
                    button-text="导出"
                    action="/api/gatedpark/ctrVehicle/export"
                    export-name="下载详情"
                    method="post"
                    :action-params="exportActionParams"
                  >
                    <span @click="exportFile"> 导出Excel </span>
                  </ty-export>
                </el-dropdown-item>
                <el-dropdown-item>
                  <ty-export
                    size="small"
                    action="/api/gatedpark/ctrVehicle/dowTemplate"
                    export-name="承包商车辆导入模板"
                  >
                    <span> 模板下载 </span>
                  </ty-export>
                </el-dropdown-item>
              </el-dropdown-menu>
            </span>
          </el-dropdown>
        </template>
        <template slot="vehicleCode" slot-scope="{ rowData }">
          <span
            style="color: #358aff; cursor: pointer"
            @click="handleCheckPerson(rowData)"
          >
            {{ rowData.vehicleCode }}
          </span>
        </template>
        <template slot="sealedCtrName" slot-scope="{ rowData }">
          <span
            style="color: #358aff; cursor: pointer"
            @click="handleChecksealedCtr(rowData)"
          >
            {{ rowData.sealedCtrName }}
          </span>
        </template>
        <template slot="personName" slot-scope="{ rowData }">
          <span
            style="color: #358aff; cursor: pointer"
            @click="handleChecksealedPerson(rowData)"
          >
            {{ rowData.personName }}
          </span>
        </template>
        <template slot="vehicleState" slot-scope="{ rowData }">
          <el-switch
            v-model="rowData.vehicleState"
            :width="50"
            :active-value="0"
            :inactive-value="1"
            @change="switchCarStatus(rowData)"
          >
          </el-switch>
        </template>
        <template slot="opts" slot-scope="{ rowData }">
          <el-button type="text" @click="handlecheck(rowData)">
            查看
          </el-button>
          <el-button type="text" @click="handleEdit(rowData)"> 修改 </el-button>
          <el-button type="text" @click="handleDel(rowData)"> 删除 </el-button>
          <el-button type="text" @click="handleLightCode(rowData)">
            拉黑
          </el-button>
        </template>
      </hqit-table>
      <el-dialog
        v-if="carNoDetails"
        v-dialogDrag
        :title="`承包商车辆管理— 查看— ${carObj.vehicleCode}`"
        width="550px"
        :visible.sync="carNoDetails"
      >
        <carDetails :car-id="carId" :car-obj="carObj" />
      </el-dialog>
      <el-dialog
        v-if="cortractorDetails"
        v-dialogDrag
        :title="`承包商— 查看— ${cortractorDetailsTitle}`"
        :visible.sync="cortractorDetails"
      >
        <cortractorDetails :contractor-id="sealedCtrId" />
      </el-dialog>
      <el-dialog
        v-if="LightCode"
        v-dialogDrag
        width="450px"
        :visible.sync="LightCode"
      >
        <template slot="title">
          <div style="color: #fff">
            请确认是否将<span style="color: red">【{{ vehicleCode }}】</span>
            拉黑?
          </div>
        </template>
        <el-form ref="lightForm" label-width="70px" :model="lightForm">
          <el-form-item
            label="原因:"
            prop="lightReason"
            :rules="{
              required: true,
              message: '请输入拉黑原因',
            }"
          >
            <el-input
              v-model="lightForm.lightReason"
              type="textarea"
              :rows="4"
              placeholder="请输入拉黑原因"
              maxlength="140"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="dialogButton" @click="LightCode = false">
            取 消
          </el-button>
          <el-button type="primary" class="dialogButton" @click="lightCodeBtn">
            确 定
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        v-if="personDetails"
        v-dialogDrag
        width="400px"
        :title="personDetailsTitle"
        :visible.sync="personDetails"
      >
        <personDetails
          :person-id="personId"
          :is-ctr="true"
          :is-base="true"
          :ctr-name="ctrName"
        />
      </el-dialog>
    </template>
  </hqit-content-page>
</template>

<script>
import personDetails from "@/components/FormBody/person-details/index.vue";
import carDetails from "@/components/FormBody/car-details/index.vue";
import cortractorDetails from "@/components/FormBody/contractor-details/index.vue";
import { getCtrAllList } from "@/api/contractor";
import { getCarKindList } from "@/api/access-control-permission/organization-control.js";
import {
  getCtrCarList,
  DelCtrCar,
  updateCtrCarStatus,
  saveBlackList,
  getCtrCarDetails,
  importCarExcel,
} from "@/api/contractor/contractor-car.js";
import { getPersonList } from "@/api/access-control-permission/organization-control.js";
export default {
  components: { carDetails, cortractorDetails, personDetails },
  data() {
    return {
      personId: "",
      ctrName: "",
      personDetails: false,
      personDetailsTitle: "",
      sealedCtrId: "",
      vehicleCode: "", // 拉黑的车牌号
      carNoDetails: false,
      LightCode: false,
      cortractorDetails: false,
      cortractorDetailsTitle: "",
      openAdd: false, // 导出框
      carId: 0, // 查询承包商车辆详情
      carObj: {}, // 某条承包商车辆详情（因查询承包商车辆接口有问题，暂时先传点击的数据进去）
      externalBizId: "", // 点击的对象的id
      selId: [], // 多选框所选中的id
      approvalTemList: [], // 可用审批模块列表
      title: "",
      clearbol: false, // 批量按钮工具栏出现时 是否清空已经选择了的数据
      exportActionParams: {
        ids: [],
      },
      queryForm: {},
      lightForm: {
        lightReason: "",
      },
      columns: [
        {
          prop: "vehicleCode",
          label: "车牌号",
          slotname: "vehicleCode",
        },
        {
          prop: "vehicleTypeName",
          label: "车辆种类",
        },
        {
          prop: "personName",
          label: "联系人",
          slotname: "personName",
        },
        {
          prop: "personPhone",
          label: "手机号码",
        },
        {
          prop: "sealedCtrName",
          label: "所属承包商",
          slotname: "sealedCtrName",
        },
        {
          prop: "scopeBusiness",
          label: "经营范围",
        },
        {
          prop: "vehicleState",
          label: "车辆状态",
          slotname: "vehicleState",
          attrs: {
            filters: [
              { text: "激活", value: 0 },
              { text: "冻结", value: 1 },
            ],
            columnKey: "vehicleState",
          },
        },
        {
          prop: "blackStatus",
          label: "是否拉黑",
          formatter: (val) => {
            return val == 0 ? "是" : "否";
          },
          attrs: {
            filters: [
              { text: "是", value: 0 },
              { text: "否", value: 1 },
            ],
            columnKey: "blackStatus",
          },
        },
        {
          prop: "opts",
          label: "操作",
          align: "right",
          slotname: "opts",
          width: 180,
        },
      ],
      searchConfig: [
        {
          label: "车牌号",
          prop: "vehicleCode",
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "车辆种类",
          prop: "vehicleTypeId",
          expression: "LIKE",
          type: "select",
          options: [],
          attrs: {
            placeholder: "请选择车辆种类",
          },
        },
        {
          label: "联系人",
          prop: "personName",
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "手机号码",
          prop: "personPhone",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "所属承包商",
          prop: "sealedCtrId",
          expression: "EQ",
          type: "select",
          options: [],
          attrs: {
            placeholder: "请选择所属承包商",
          },
        },
        {
          label: "经营范围",
          prop: "scopeBusiness",
          attrs: {
            clearable: true,
          },
        },
      ],
    };
  },
  activated() {
    this.$refs.table.getData({}, true);
  },
  mounted() {
    this.getCarKindList(); // 获取车辆种类列表
    this.getCtrAllList(); // 获取车报送列表
  },
  methods: {
    // 获取列表数据
    getList(params) {
      let resParams = {
        order: "createTime",
        sort: "DESC",
        expr: [],
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        query: {},
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
      if (this.queryForm["personPhone"]) {
        resParams.query["personPhone"] = this.queryForm["personPhone"];
      }
      if (this.queryForm["scopeBusiness"]) {
        resParams.query["scopeBusiness"] = this.queryForm["scopeBusiness"];
      }
      if (this.queryForm.blackStatus && this.queryForm.blackStatus.length) {
        resParams.expr.push({
          key: "blackStatus",
          value: this.queryForm.blackStatus,
          expression: "IN",
        });
      }
      if (this.queryForm.vehicleState && this.queryForm.vehicleState.length) {
        resParams.expr.push({
          key: "vehicleState",
          value: this.queryForm.vehicleState,
          expression: "IN",
        });
      }
      return getCtrCarList(resParams);
    },
    // 车辆种类列表，直接传进去
    getCarKindList() {
      getCarKindList({}).then((res) => {
        this.searchConfig.find((v) => v.prop == "vehicleTypeId").options =
          res.data.map((item) => {
            return { label: item.name, value: item.id };
          });
      });
    },
    // 获取承包商列表
    getCtrAllList() {
      let params = [
        {
          expression: "EQ",
          key: "status",
          value: 3,
        },
      ];
      getCtrAllList(params).then((res) => {
        this.searchConfig.find((v) => v.prop == "sealedCtrId").options =
          res.data.map((item) => {
            return { label: item.name, value: item.id };
          });
      });
    },
    // 修改车辆状态
    switchCarStatus(row) {
      updateCtrCarStatus({
        id: row.id,
        machineStatus: row.vehicleState,
      })
        .then(() => {
          this.$msgSuccess("状态修改成功");
        })
        .catch(() => {
          row.machineStatus == "1"
            ? (row.machineStatus = 0)
            : (row.machineStatus = 1);
        });
    },
    // 接待人搜索查询
    querySearchAsync(queryString, cb) {
      if (queryString) {
        let params = {
          pageNum: 1,
          pageSize: 99999,
          query: {
            hasOrg: true,
            name: queryString,
          },
        };
        getPersonList(params).then((res) => {
          var results = res.data.list.map((person) => {
            return {
              value: `${person.name}-${person.personBaseId}`,
              ...person,
            };
          });
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            cb(results);
          }, 3000 * Math.random());
        });
      }
    },
    // 导出文件的条件筛选
    exportFile() {
      let arr = this.$refs.table.tableData;
      arr.forEach((item) => {
        this.exportActionParams.ids.push(item.id);
      });
    },
    handleExcel(file) {
      const formData = new FormData();
      // 把文件添加到表单对象中
      formData.append("file", file.file);
      importCarExcel(formData).then(() => {
        this.$message.success("导入成功");
        this.$refs.table.getData({}, true);
      });
    },
    // 拉黑弹窗
    handleLightCode(row) {
      this.vehicleCode = row.vehicleCode;
      this.vehicleId = row.vehicleId;
      this.LightCode = true;
      this.lightForm.lightReason = "";
    },
    // 拉黑
    lightCodeBtn() {
      this.$refs["lightForm"].validate((valid) => {
        if (valid) {
          let params = {
            handleReason: this.lightForm.lightReason,
            resourceId: this.vehicleId,
            resourceType: 30,
          };
          saveBlackList(params).then((res) => {
            this.$message.success(res.msg == "保存成功" ? "拉黑成功" : res.msg);
            this.$refs.table.getData({}, true);
            this.LightCode = false;
          });
        }
      });
    },
    // 新增
    handleAdd() {
      this.$router.push({
        path: "/gatedpark/park-operation/contractor/contractor-car/add",
      });
    },
    // 查看
    handlecheck(data) {
      console.log(data);
      this.$router.push({
        path: "/gatedpark/park-operation/contractor/contractor-car/edit",
        query: { id: data.id, isCheck: true, vehicleCode: data.vehicleCode },
      });
    },
    // 修改
    handleEdit(data) {
      this.$router.push({
        path: "/gatedpark/park-operation/contractor/contractor-car/edit",
        query: { id: data.id, vehicleCode: data.vehicleCode },
      });
    },
    // 删除
    async handleDel(row) {
      const valid = await this.errorBoundary(
        this.delPrompt(this, row.vehicleCode),
      );
      if (valid) {
        DelCtrCar([row.id]).then((res) => {
          if (res.code != 200) return this.$message.error(res.msg);
          this.$message.success(res.msg);
          this.$refs.table.getData({}, true);
        });
      } else {
        this.$message({
          message: "删除取消",
        });
      }
    },
    // 查看车辆详情信息
    handleCheckPerson(row) {
      this.carId = row.id;
      this.getDetail(row);
    },
    // 获取单条详情
    getDetail(row) {
      getCtrCarDetails(row.id).then(async (res) => {
        this.carObj = res.data;
        // 避免改值为空导致无法选择时间范围
        // 车辆照片
        let machineImgList = [];
        if (res.data.vehiclePhotoId) {
          machineImgList = res.data.vehiclePhotoId.split(",").map((id) => {
            return {
              url: this.getFileUrl(id),
              response: {
                data: {
                  id,
                },
              },
            };
          });
        }
        this.carObj.machineImgList = machineImgList;
        console.log(this.carObj, "this.baseForm");
        this.carNoDetails = true;
      });
    },
    // 查询承包商详情
    handleChecksealedCtr(row) {
      this.sealedCtrId = row.sealedCtrId;
      this.cortractorDetails = true;
      this.cortractorDetailsTitle = row.sealedCtrName;
    },
    // 查询联系人详情
    handleChecksealedPerson(row) {
      this.personId = row.personId;
      this.ctrName = row.sealedCtrName;
      this.personDetails = true;
      this.personDetailsTitle = row.personName;
    },
    // -------------------分割线
    // 搜索
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
.fileUpload {
  width: 100px !important;
}
.dialogButton {
  width: 100px;
  height: 30px;
  font-size: 14px !important;
  padding: 7px 0 !important;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
::v-deep .el-switch__core::before {
  content: "冻结";
  position: absolute;
  font-size: 12px;
  top: -1px;
  right: 5px;
  color: #fff;
}

.is-checked ::v-deep .el-switch__core::before {
  content: "激活";
  position: absolute;
  font-size: 12px;
  top: -1px;
  left: 5px;
  color: #fff;
}
</style>
