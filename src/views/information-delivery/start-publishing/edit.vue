<template>
  <div class="edit-content">
    <div class="edit-content-top">
      <back-bar :title="title" />
      <div class="edit-tabs">
        <span
          v-if="isShow && isReserve"
          :class="selectTabs ? 'select-tabs' : 'unselect-tabs'"
          @click="selectTabs = true"
        >
          中长期卡申请
        </span>
        <span
          v-if="isShow && isRenewal"
          :class="selectTabs ? 'unselect-tabs' : 'select-tabs'"
          @click="selectTabs = false"
        >
          中长期卡续期
        </span>
      </div>
      <div class="content">
        <div v-if="selectTabs" class="content-box">
          <div class="content-title">
            <span class="title-bg"></span>
            <span class="title-text">基础信息</span>
          </div>
          <el-form
            ref="baseForm"
            :model="baseForm"
            :rules="baseRules"
            class="content-form"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item label="申领人: " prop="applyPersonId">
                  <div class="cl-charge">
                    <el-tag
                      v-if="radioPersonData.name"
                      type="success"
                      style="margin-right: 10px"
                    >
                      {{ radioPersonData.name }}
                    </el-tag>
                    <el-button
                      v-if="!isCheck"
                      type="primary"
                      size="mini"
                      @click="handleShowRadioPerson"
                    >
                      选择人员
                    </el-button>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="单位: " prop="applyOrgId">
                  {{ radioPersonData.orgName ? radioPersonData.orgName : "" }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="部门: ">
                  {{ radioPersonData.deptName ? radioPersonData.deptName : "" }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="申领数量: " prop="applyNum">
                  <el-input-number
                    v-if="!isCheck"
                    v-model="baseForm.applyNum"
                    placeholder="请输入内容"
                    controls-position="right"
                    :min="0"
                    disabled
                  >
                  </el-input-number>
                  <span v-if="isCheck">{{ baseForm.applyNum }}</span>
                  <span class="input-unit">张</span>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="有效期: " prop="validTime">
                  <el-date-picker
                    v-if="!isCheck"
                    v-model="baseForm.validTime"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                  />
                  <span v-if="isCheck">
                    {{ baseForm.validTime[0] }}-{{ baseForm.validTime[1] }}
                  </span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="访问事由: "
                  prop="applyReason"
                  class="visit"
                >
                  <el-input
                    v-if="!isCheck"
                    v-model="baseForm.applyReason"
                    type="textarea"
                    maxlength="100"
                    placeholder="请输入内容"
                  >
                  </el-input>
                  <span v-if="isCheck">
                    {{ baseForm.applyReason }}
                  </span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="content-title">
            <span class="title-bg"></span>
            <span class="title-text">花名册</span>
          </div>
          <div class="cl-charge">
            <el-button
              v-if="!isCheck"
              type="primary"
              size="mini"
              @click="handleShowPerson"
            >
              选择人员
            </el-button>
          </div>
          <CtTable
            ref="personTable"
            :request="getList"
            row-key="id"
            :is-select="false"
            :show-search="false"
            :has-search="false"
            :show-search-btn="false"
            :has-batch-btn="false"
            :page-sizes="[5, 10, 15, 20]"
            :default-page-size="5"
          >
            <template #table-columns>
              <el-table-column label="工号" prop="code"> </el-table-column>
              <el-table-column label="姓名" prop="name"> </el-table-column>
              <el-table-column
                label="性别"
                prop="genderName"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                label="身份证号"
                prop="idNo"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                label="手机号"
                prop="phone"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                label="操作"
                align="right"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="!isCheck"
                    type="text"
                    @click="handlePersonDel(scope.$index)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </template>
          </CtTable>
          <div class="cl-charge">
            <el-button
              v-if="!isCheck"
              type="primary"
              size="mini"
              @click="handleShowCar"
            >
              选择车辆
            </el-button>
          </div>
          <CtTable
            ref="carTable"
            :request="getCarList"
            row-key="id"
            :is-select="false"
            :show-search="false"
            :has-search="false"
            :show-search-btn="false"
            :has-batch-btn="false"
            :page-sizes="[5, 10, 15, 20]"
            :default-page-size="5"
          >
            <template #table-columns>
              <el-table-column
                label="车辆号"
                prop="vehicleCode"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                label="车辆种类"
                prop="vehicleType"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                label="联系人"
                prop="personName"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                label="手机号"
                prop="personPhone"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                label="操作"
                align="right"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="!isCheck"
                    type="text"
                    @click="delCarList(scope.$index)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </template>
          </CtTable>
          <div class="content-title">
            <span class="title-bg"></span>
            <span class="title-text">附件信息</span>
          </div>
          <div class="content-file">
            <div class="file-tip">
              <span>附件材料：</span>
              <FileUpload v-if="!isCheck" :files-list.sync="machineFilesList" />
              <span class="tip">
                支持格式:pdf、jpg、png、doc、rar、zip等文件,单个文件不能超过10MB
              </span>
            </div>

            <CtTable
              ref="fileTable"
              :request="getTableList"
              row-key="id"
              :has-search="false"
              :is-select="false"
              :has-btn="false"
              :show-search-btn="false"
              :has-page="false"
            >
              <template #table-columns>
                <el-table-column
                  label="上传文件名称"
                  show-overflow-tooltip
                  prop="name"
                ></el-table-column>
                <el-table-column
                  label="上传人"
                  width="150"
                  show-overflow-tooltip
                  prop="createName"
                ></el-table-column>
                <el-table-column
                  label="上传时间"
                  width="180"
                  prop="createTime"
                ></el-table-column>
                <el-table-column
                  v-if="!isCheck"
                  label="操作"
                  align="right"
                  width="100"
                  class-name="small-padding fixed-width"
                >
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleDownload(scope.row)">
                      下载
                    </el-button>
                    <el-button type="text" @click="handleDel(scope.$index)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </template>
            </CtTable>
          </div>
        </div>
        <renewal v-if="!selectTabs" ref="renewal" :is-check="isCheck"></renewal>
      </div>
    </div>
    <div class="footer">
      <el-button v-if="!isCheck" type="primary" @click="save">保存</el-button>
      <el-button v-if="isCheck" type="primary" @click="editBtn">
        编辑
      </el-button>
      <el-button @click="linkTo">取消</el-button>
    </div>
    <FormDialog ref="radioPersonModel" title="选择人员" :width="1200">
      <template #default="scope">
        <PersonSel
          v-bind="scope.data"
          :is-radio="true"
          :radiodata.sync="radioPersonData"
        />
      </template>
    </FormDialog>
    <el-dialog
      v-if="personDialogTable"
      v-dialogDrag
      title="添加人员"
      :visible.sync="personDialogTable"
    >
      <PersonSel :is-select="true" :checkboxlist.sync="PersonDataList" />
      <span slot="footer" class="dialog-footer">
        <el-button class="cancelButton" @click="personDialogTable = false">
          取消
        </el-button>
        <el-button
          class="confirmButton"
          type="primary"
          @click="personDialogTable = false"
        >
          确定
        </el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="carDialogTable"
      v-dialogDrag
      title="选择车辆"
      :visible.sync="carDialogTable"
    >
      <carSelect :is-select="true" :checkboxlist.sync="radioCarList" />
      <span slot="footer" class="dialog-footer">
        <el-button class="cancelButton" @click="carDialogTable = false">
          取消
        </el-button>
        <el-button
          class="confirmButton"
          type="primary"
          @click="carDialogTable = false"
        >
          确定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fileFlow } from "@/api/system/file.js";
import {
  saveOrUpdateCardApply,
  getCardApply,
} from "@/api/location-card-management/index.js";
import FileUpload from "@/components/file-upload/file-upload.vue";
import PersonSel from "@/components/FormBody/person-sel/index.vue";
import carSelect from "@/components/FormBody/car-select/index.vue";
import renewal from "./components/renewal.vue";
export default {
  components: { FileUpload, PersonSel, carSelect, renewal },
  data() {
    let validateDuty = (rule, value, callback) => {
      if (!this.radioPersonData.personBaseId) {
        callback(new Error("请选择接待人"));
      } else {
        callback();
      }
    };
    return {
      title: "新增-中长期卡申请/续期流程",
      isCheck: false,
      personDialogTable: false,
      carDialogTable: false,
      isShow: true,
      isReserve: true,
      isRenewal: true,
      selectTabs: true,
      selectTimeTabs: true,
      treeList: [],
      machineFilesList: [],
      baseForm: {
        applyNum: "",
        validTime: [],
      },
      baseRules: {
        applyPersonId: [
          { required: true, trigger: "change", validator: validateDuty },
        ],
        applyOrgId: [
          { required: true, message: "请输入单位", trigger: "blur" },
        ],
        applyDeptId: [
          { required: true, message: "请输入部门", trigger: "blur" },
        ],
        applyNum: [{ required: true, message: "请输入数量", trigger: "blur" }],
        applyReason: [
          { required: true, message: "请输入访问事由", trigger: "blur" },
        ],
        validTime: [
          {
            type: "array",
            required: true,
            message: "请选择日期",
          },
        ],
      },
      radioPersonData: {}, // 申领人
      PersonDataList: [], // 花名册
      radioCarList: [], // 车辆
    };
  },
  computed: {},
  watch: {
    PersonDataList(val) {
      console.log(val, "val");
      this.baseForm.applyNum =
        this.PersonDataList.length + this.radioCarList.length;
      this.$refs.personTable.reload();
    },
    radioCarList() {
      this.baseForm.applyNum =
        this.PersonDataList.length + this.radioCarList.length;
      this.$refs.carTable.reload();
    },
    machineFilesList() {
      this.$refs.fileTable.reload();
    },
  },
  mounted() {
    if (this.$route.query.id && this.$route.query.tabsActive == "1") {
      this.isRenewal = false;
      this.isCheck = this.$route.query.isCheck == "false" ? false : true;
      this.getDetails(this.$route.query.id);
      if (this.isCheck) {
        this.title = "查看-中长期卡申请/续期流程";
      } else {
        this.title = "编辑-中长期卡申请/续期流程";
      }
    }
    if (this.$route.query.tabsActive == "2") {
      this.isReserve = false;
      this.selectTabs = false;
      this.isCheck = this.$route.query.isCheck == "false" ? false : true;
      if (this.isCheck) {
        this.title = "查看-中长期卡申请/续期流程";
      } else {
        this.title = "编辑-中长期卡申请/续期流程";
      }
    }
  },

  methods: {
    getList() {
      return Promise.resolve({
        list: this.PersonDataList,
        total: this.PersonDataList.length,
      });
    },
    getCarList() {
      return Promise.resolve({
        list: this.radioCarList,
        total: this.radioCarList.length,
      });
    },
    getTableList() {
      return Promise.resolve({
        list: this.machineFilesList,
        total: this.machineFilesList.length,
      });
    },
    save() {
      if (this.selectTabs) {
        let resData = {
          applyCardType: 0, //卡类型
          orgType: 1,
          applyPersonId: this.radioPersonData.personBaseId, //申领人
          applyOrgId: this.radioPersonData.orgId,
          applyDeptId: this.radioPersonData.deptId, //申请部门
          applyNum: this.baseForm.applyNum, //申请数量
          applyReason: this.baseForm.applyReason, //申请事由
          applyType: 1, //单据类型 1为申请，2为续期
          approvalStatus: 3, // 先写死
          validBeginTime: this.baseForm.validTime[0],
          validEndTime: this.baseForm.validTime[1],
          fileDtos: this.machineFilesList, // 文件信息
          cardApplyDetailDtos: [], // 申请卡人员车辆信息
        };
        if (this.$route.query.id) {
          resData.id = this.$route.query.id;
        }

        this.PersonDataList.forEach((item) => {
          resData.cardApplyDetailDtos.push({
            applyObjectType: 0,
            createId: item.createId,
            personId: item.personBaseId,
          });
        });
        this.radioCarList.forEach((item) => {
          resData.cardApplyDetailDtos.push({
            applyObjectType: 1,
            vehicleId: item.id,
          });
        });
        saveOrUpdateCardApply(resData).then(() => {
          if (this.$route.query.id) {
            this.$msgSuccess("修改成功");
          } else {
            this.$msgSuccess("新增成功");
          }
          this.$router.go(-1);
        });
      } else {
        this.$refs.renewal.save();
      }
    },
    // 获取详情
    getDetails(id) {
      getCardApply(id).then((res) => {
        this.radioPersonData = {
          name: res.data.applyPersonName,
          orgName: res.data.applyOrgName,
          deptName: res.data.applyDeptName,
          deptId: res.data.applyDeptId,
        };
        this.baseForm = {
          applyNum: res.data.applyNum,
          applyReason: res.data.applyReason,
          validTime: [res.data.validBeginTime, res.data.validEndTime],
        };
        this.machineFilesList = res.data.fileDtos;
        res.data.cardApplyDetailVos.forEach((item) => {
          if (item.applyObjectType == "1") {
            this.radioCarList.push(item.baseVehicleDto);
          } else {
            item.personBaseDto["code"] = item.personCode;
            item.personBaseDto["personBaseId"] = item.personId;
            this.PersonDataList.push(item.personBaseDto);
            // this.PersonDataList[idx].code = item.personCode;
          }
        });
      });
    },
    // 文件下载
    async handleDownload(row) {
      let res = await fileFlow({ id: row.id }); // 获取文件流
      let csvData = new Blob([res.data], { type: "text/csv" });
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // IE
        window.navigator.msSaveOrOpenBlob(csvData, row.name);
      } else {
        let url = window.URL.createObjectURL(csvData);
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = row.name;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    },

    // 文件删除
    handleDel(index) {
      this.$confirm("确定删除该数据？", "警告", {
        confirmButtonText: "删除",
        confirmButtonClass: "el-button--danger",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.machineFilesList.splice(index, 1);
        this.$msgSuccess("删除成功");
      });
    },
    // 花名册删除
    handlePersonDel(index) {
      this.PersonDataList.splice(index, 1);
    },
    // 车辆删除
    delCarList(index) {
      this.radioCarList.splice(index, 1);
    },
    // 打开人员选择弹框
    handleShowRadioPerson() {
      this.$refs.radioPersonModel.openModel({
        data: {
          data: {
            personBaseId: this.radioPersonData.personBaseId,
            name: this.radioPersonData.name,
          },
        },
      });
    },
    // 打开花名册选择弹框
    handleShowPerson() {
      this.personDialogTable = true;
    },
    // 打开车辆选择弹框
    handleShowCar() {
      this.carDialogTable = true;
    },
    editBtn() {
      this.isCheck = false;
      this.title = "编辑-中长期卡申请/续期流程";
    },
    linkTo() {
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="scss" scoped>
.edit-content {
  .edit-content-top {
    .content {
      overflow: hidden;
      height: calc(100vh - 200px);
      overflow-y: auto;
      .content-box {
        padding: 0px 8% 0px;
        .content-title {
          margin: 20px 0px;
          display: flex;
          align-items: center;
          .title-bg {
            display: inline-block;
            height: 18px;
            background: #00a1e9;
            width: 3px;
            margin-right: 7px;
          }
        }
        .content-form {
          margin: 20px;
        }
        .content-file {
          padding: 20px 30px;
          .file-tip {
            display: flex;
            line-height: 28px;
            .tip {
              display: inline-block;
              margin-left: 8px;
              font-size: 14px;
              color: #999999;
            }
          }
        }
      }
    }
  }
  .edit-tabs {
    margin: 20px 50px;
    display: inline-block;
    border-radius: 25%;

    span {
      padding: 10px;
    }
    :nth-child(1) {
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
    }
    :nth-child(2) {
      border-top-right-radius: 20px;
      border-bottom-right-radius: 20px;
    }
    .select-tabs {
      background: #0089ff;
      color: white;
    }
    .unselect-tabs {
      background: #e7eaef;
    }
  }

  .input-unit {
    margin-left: 10px;
    display: inline-block;
    height: 40px;
    width: 25px;
    line-height: 40px;
    color: #999999;
  }
  .visit {
    display: flex;
    /deep/ .el-form-item__content {
      width: 55%;
    }
  }
  .time-tabs {
    display: inline-block;
    margin-right: 20px;
    span {
      padding: 10px;
    }
    :nth-child(1) {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }
    :nth-child(2) {
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
    }
    .select-tabs {
      background: #0089ff;
      color: white;
    }
    .unselect-tabs {
      background: #e7eaef;
    }
  }
  .footer {
    position: fixed;
    bottom: 30px;
    left: 55%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
  }
}
/deep/ .search-content {
  border-bottom: 0 !important;
}
</style>
