<template>
  <div class="content-box">
    <div class="content-title">
      <!-- <span class="title-bg"></span>
      <span class="title-text">基础信息</span> -->
      <div class="cl-hea-title">基础信息</div>
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
          <el-form-item label="承包商: " prop="applyOrgId">
            {{ radioPersonData.fillingName ? radioPersonData.fillingName : "" }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="有效期: " prop="validTime">
            <div class="edit-tabs">
              <span
                v-if="isDetailsShow"
                :class="customize ? 'Customize-tabs' : 'unCustomize-tabs'"
                @click="customize = true"
              >
                延长
              </span>
              <span
                v-if="isDetailsShowInt"
                :class="customize ? 'unCustomize-tabs' : 'Customize-tabs'"
                @click="customize = false"
              >
                自定义
              </span>
            </div>
            <template v-if="customize && !isCheck">
              <el-input-number
                v-model="baseForm.num"
                controls-position="right"
                :min="1"
              ></el-input-number>
              <span class="input-unit">天</span>
            </template>
            <el-date-picker
              v-if="!customize && !isCheck"
              v-model="baseForm.validTime"
              type="datetime"
              placeholder="选择日期时间"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
            <span v-if="isCheck && isDetailsShow"> {{ baseForm.num }}天 </span>
            <span v-if="isCheck && isDetailsShowInt">
              {{ baseForm.validTime && changeCreateTime(baseForm.validTime) }}
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="续期事由: " prop="applyReason" class="visit">
            <el-input
              v-if="!isCheck"
              v-model="baseForm.applyReason"
              type="textarea"
              maxlength="100"
              show-word-limit
              placeholder="请输入内容"
            >
            </el-input>
            <span v-if="isCheck">
              {{ baseForm.applyReason }}
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <div>请选择需要续期的类型</div>
        </el-col>
        <el-col :span="8">
          <el-form-item label="续期数量: " prop="applyNum">
            <el-input-number
              v-if="!isCheck"
              v-model="baseForm.applyNum"
              placeholder="请输入内容"
              controls-position="right"
              :min="0"
              :disabled="true"
            >
            </el-input-number>
            <span v-if="isCheck">{{ baseForm.applyNum }}</span>
            <span class="input-unit">张</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-tabs v-model="renewalType">
      <el-tab-pane label="按申请批次" name="first"></el-tab-pane>
      <el-tab-pane label="按个人" name="second"></el-tab-pane>
      <el-tab-pane label="按车辆" name="third"></el-tab-pane>
    </el-tabs>
    <template v-if="renewalType == 'first'">
      <CtTable
        ref="FirstTable"
        :request="getFirstList"
        row-key="id"
        :has-search="false"
        :is-select="false"
        :has-btn="false"
        :is-radio="!isCheck"
        :show-search-btn="false"
        :radio-obj.sync="radioObj"
        :page-sizes="[5, 10, 15, 20]"
        :default-page-size="5"
      >
        <template #table-columns>
          <template>
            <!-- <el-table-column
              label="部门"
              prop="applyDeptName"
              show-overflow-tooltip
            >
            </el-table-column> -->
            <el-table-column
              label="申请批次"
              prop="code"
              show-overflow-tooltip
              width="160"
            >
            </el-table-column>
            <el-table-column
              label="申请人"
              prop="applyPersonName"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              label="申请时间"
              prop="createTime"
              sortable
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="有效期" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip placement="top">
                  <div slot="content">
                    {{ scope.row.validBeginTime }} 至{{
                      scope.row.validEndTime
                    }}
                  </div>
                  <span>
                    {{
                      scope.row.validBeginTime &&
                      scope.row.validBeginTime.split(" ")[0]
                    }}
                  </span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              label="数量（张）"
              prop="applyNum"
              sortable
              show-overflow-tooltip
            >
            </el-table-column>
          </template>
        </template>
      </CtTable>
    </template>
    <template v-if="renewalType == 'second'">
      <div class="cl-charge" style="margin-bottom: 10px">
        <el-button
          v-if="!isCheck"
          type="primary"
          size="mini"
          @click="handleShowPerson"
        >
          选择人员
        </el-button>
      </div>
      <el-table :data="tablePeopleList" style="width: 100%">
        <!-- <el-table-column label="工号" prop="code"> </el-table-column> -->
        <el-table-column label="姓名" prop="name"> </el-table-column>
        <el-table-column label="性别" prop="sex" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.sex == 1 ? "女" : "男" }}
          </template>
        </el-table-column>
        <el-table-column label="身份证号" prop="idCard" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="手机号" prop="phone" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" class-name="small-padding fixed-width">
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
      </el-table>
      <el-pagination
        class="pagination"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="currentPageSize1"
        :current-page="currentPage1"
        layout="total, sizes, prev, pager, next, jumper"
        :total="PersonDataList.length"
        @size-change="handleSizeChange1"
        @current-change="handleCurrentChange1"
      >
      </el-pagination>
    </template>
    <template v-if="renewalType == 'third'">
      <div class="cl-charge" style="margin-bottom: 10px">
        <el-button
          v-if="!isCheck"
          type="primary"
          size="mini"
          @click="handleShowCar"
        >
          选择车辆
        </el-button>
      </div>
      <!-- <el-table :data="radioCarList" style="width: 100%"> -->
      <el-table :data="tableCarList" style="width: 100%">
        <el-table-column
          label="车辆号"
          prop="vehicleCode"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="车辆种类"
          prop="vehicleTypeName"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column label="联系人" prop="personName" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="手机号"
          prop="personPhone"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column label="操作" class-name="small-padding fixed-width">
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
      </el-table>
      <el-pagination
        class="pagination"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="currentPageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="radioCarList.length"
        :current-page="currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </template>
    <div class="content-title">
      <!-- <span class="title-bg"></span>
      <span class="title-text">附件信息</span> -->
      <div class="cl-hea-title">附件信息</div>
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
        :request="getFileTableList"
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
            width="140"
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
      width="1200px"
      :visible.sync="personDialogTable"
    >
      <!-- <reservePersonSel :is-select="true" :checkboxlist.sync="PersonDataList" /> -->
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
      width="1200px"
      :visible.sync="carDialogTable"
    >
      <reserveCarSel :is-select="true" :checkboxlist.sync="radioCarList" />
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
import reservePersonSel from "@/components/FormBody/reserve-person-sel/index.vue";
// import reserveCarSel from "@/components/FormBody/reserve-car-sel/index.vue";
import PersonSel from "@/components/FormBody/contractor-person-sel/index.vue";
import reserveCarSel from "@/components/FormBody/contractor-car-select/index.vue";
import FileUpload from "@/components/file-upload/file-upload.vue";
import {
  getCardApplyList,
  saveOrUpdateCardRenew,
  getCardRenew,
} from "@/api/location-card-management/index.js";
import { fileFlow } from "@/api/system/file.js";
export default {
  components: { reservePersonSel, FileUpload, PersonSel, reserveCarSel },
  props: {
    isCheck: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    let validateDuty = (rule, value, callback) => {
      if (!this.radioPersonData.personBaseId) {
        callback(new Error("请选择接待人"));
      } else {
        callback();
      }
    };
    return {
      isDetailsShow: true,
      isDetailsShowInt: true,
      personDialogTable: false,
      carDialogTable: false,
      customize: true,
      currentPage: 1,
      currentPageSize: 5,
      currentPage1: 1,
      currentPageSize1: 5,
      renewalType: "first",
      machineFilesList: [], // 文件信息
      batchList: [], // 批次信息（用于回显）
      PersonDataList: [], // 人员信息
      radioCarList: [], // 车辆信息
      tableCarList: [], // 车辆信息
      tablePeopleList: [], // 人员信息
      radioPersonData: {}, // 申领人
      radioObj: {}, // 按审批批次
      baseForm: {
        applyOrgId: "",
        validTime: "",
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
        // num: [{ required: true, message: "请输入有效期", trigger: "blur" }],
        applyReason: [
          { required: true, message: "请输入续期事由", trigger: "blur" },
        ],
        validTime: [
          {
            type: "string",
            required: true,
            message: "请选择日期",
          },
        ],
      },
    };
  },
  computed: {
    changeCreateTime() {
      return (time) => {
        let hourMS = time.split(" ")[1];
        return (
          time.split(" ")[0] +
          " " +
          hourMS.split(":")[0] +
          ":" +
          hourMS.split(":")[1]
        );
      };
    },
  },
  watch: {
    renewalType(val) {
      switch (val) {
        case "first":
          this.baseForm.applyNum = this.radioObj.applyNum;
          break;
        case "second":
          this.baseForm.applyNum = this.PersonDataList.length;
          break;
        case "third":
          this.baseForm.applyNum = this.radioCarList.length;
          break;
        default:
          break;
      }
    },
    PersonDataList(val) {
      let begin = (this.currentPage1 - 1) * this.currentPageSize1;
      let end = this.currentPage1 * this.currentPageSize1;
      this.tablePeopleList = this.PersonDataList.slice(begin, end);
      this.baseForm.applyNum = val.length;
    },
    radioCarList(val) {
      let begin = (this.currentPage - 1) * this.currentPageSize;
      let end = this.currentPage * this.currentPageSize;
      this.tableCarList = this.radioCarList.slice(begin, end);
      this.baseForm.applyNum = val.length;
    },
    radioPersonData() {
      this.baseForm.applyOrgId = this.radioPersonData.fillingId;
      console.log(this.baseForm);
    },
    isCheck() {
      if (this.isDetailsShowInt) {
        this.customize = false;
      }
      this.isDetailsShow = true;
      this.isDetailsShowInt = true;
    },
    radioObj(val) {
      this.baseForm.applyNum = val.applyNum;
    },
    customize(val) {
      console.log(val);
      if (val) {
        this.baseForm.validTime = "";
      }
    },
    machineFilesList() {
      this.$refs.fileTable.reload();
    },
    "baseForm.num"(val) {
      this.baseForm.validTime = "2022-12-08 10:46:59";
      // this.baseForm.validTime.push(val);
      console.log(this.baseForm, "哈哈哈共和国");
    },
  },
  mounted() {
    if (this.$route.query.id) {
      this.getDetails(this.$route.query.id);
    }
  },

  methods: {
    handleSizeChange(val) {
      this.currentPageSize = val;
      let begin = (this.currentPage - 1) * this.currentPageSize;
      let end = this.currentPage * this.currentPageSize;
      this.tableCarList = this.radioCarList.slice(begin, end);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      let begin = (this.currentPage - 1) * this.currentPageSize;
      let end = this.currentPage * this.currentPageSize;
      this.tableCarList = this.radioCarList.slice(begin, end);
    },
    handleSizeChange1(val) {
      this.currentPageSize1 = val;
      let begin = (this.currentPage1 - 1) * this.currentPageSize1;
      let end = this.currentPage1 * this.currentPageSize1;
      this.tablePeopleList = this.PersonDataList.slice(begin, end);
    },
    handleCurrentChange1(val) {
      this.currentPage1 = val;
      let begin = (this.currentPage1 - 1) * this.currentPageSize1;
      let end = this.currentPage1 * this.currentPageSize1;
      this.tablePeopleList = this.PersonDataList.slice(begin, end);
    },
    getFirstList() {
      let resParams = {
        order: "createTime",
        sort: "DESC",
        pageNum: 1,
        pageSize: 5,
        query: {
          applyType: 1,
          orgType: 2,
        },
        expr: [],
      };
      if (this.$route.query.id) {
        return Promise.resolve({
          list: this.batchList,
        });
      } else {
        return getCardApplyList(resParams).then((res) => {
          return {
            list: res.data.list,
            total: res.data.pagination.total,
          };
        });
      }
    },
    getFileTableList() {
      return Promise.resolve({
        list: this.machineFilesList,
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
    save() {
      this.$refs["baseForm"].validate((valid) => {
        if (valid) {
          let resData = {
            applyCardType: 0, //卡类型
            orgType: 2,
            applyPersonId: this.radioPersonData.personBaseId, //申领人
            applyOrgId: this.radioPersonData.fillingId,
            applyDeptId: this.radioPersonData.fillingId, //申请部门
            applyNum: this.baseForm.applyNum, //申请数量
            applyReason: this.baseForm.applyReason, //申请事由
            applyType: 2, //单据类型 1为申请，2为续期
            fileDtos: this.machineFilesList, // 文件信息
            cardRenewDetailDtos: [], // 续期卡人员车辆信息
          };
          if (this.customize) {
            resData.extendTime = this.baseForm.num;
          } else {
            resData.validEndTime = this.baseForm.validTime;
          }
          if (this.renewalType == "first") {
            resData["cardRenewBatchDto"] = {
              code: this.radioObj.code,
              id: this.radioObj.id,
              validBeginTime: this.radioObj.validBeginTime,
              validEndTime: this.radioObj.validEndTime,
            };
          } else if (this.renewalType == "second") {
            console.log(this.PersonDataList, "1234");
            this.PersonDataList.forEach((item) => {
              var time2 = new Date().dateFormat("yyyy-MM-dd hh:mm:ss");
              resData.cardRenewDetailDtos.push({
                applyObjectType: 0,
                personId: item.personBaseId,
                // endExpireDate: item.expireEndTime ? item.expireEndTime : time2,
              });
            });
          } else {
            //  车辆
            this.radioCarList.forEach((item) => {
              resData.cardRenewDetailDtos.push({
                applyObjectType: 1,
                vehicleId: item.vehicleId,
              });
            });
          }
          if (this.$route.query.id) {
            resData.id = this.$route.query.id;
            if (this.renewalType == "first") {
              resData.cardRenewBatchDto = this.batchList[0];
            }
          }
          console.log(resData, "就感觉钢筋感觉");
          // return;
          saveOrUpdateCardRenew(resData).then(() => {
            if (this.$route.query.id) {
              this.$msgSuccess("修改成功");
            } else {
              this.$msgSuccess("新增成功");
            }
            this.$router.go(-1);
          });
        }
      });
    },
    // 详情
    getDetails(id) {
      getCardRenew(id).then((res) => {
        this.radioPersonData = {
          fillingName: res.data.applyOrgName,
          orgId: res.data.applyOrgId,
          deptId: res.data.applyDeptId,
          personBaseId: res.data.applyPersonId,
          fillingId: res.data.applyDeptId,
          name: res.data.applyPersonName,
          ...res.data,
        };
        this.baseForm = {
          applyNum: res.data.applyNum,
          applyReason: res.data.applyReason,
          fillingName: res.data.applyOrgName,
          validTime: res.data.validEndTime,
        };
        if (res.data.extendTime) {
          this.baseForm.num = res.data.extendTime;
          this.isDetailsShowInt = false;
        } else {
          this.isDetailsShow = false;
        }

        if (!this.isCheck) {
          if (this.isDetailsShowInt) {
            this.customize = false;
          }
          this.isDetailsShow = true;
          this.isDetailsShowInt = true;
        }
        if (res.data.cardApplyDetailVos.length) {
          res.data.cardApplyDetailVos.forEach((item) => {
            if (item.applyObjectType == "1") {
              console.log("车辆");
              this.radioCarList.push(item.ctrVehicleDto);
              this.renewalType = "third";
            } else {
              this.renewalType = "second";
              item.personBaseDto["code"] = item.personCode;
              item.personBaseDto["bindId"] = item.personId;
              item.personBaseDto["personBaseId"] = item.personId;
              this.PersonDataList.push(item.personBaseDto);
              // this.PersonDataList[idx].code = item.personCode;
            }
          });
        } else {
          this.batchList.push(res.data.cardApplyDtos);
        }
        if (this.PersonDataList.length) {
          this.PersonDataList.forEach((item) => {
            item.idCard = item.idNo;
            item.sex = item.genderId;
          });
        }
        if (res.data.fileDtos.length) {
          this.machineFilesList = res.data.fileDtos;
        }
      });
    },
    //
    // 打开花名册选择弹框
    handleShowPerson() {
      this.personDialogTable = true;
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
    // 打开车辆选择弹框
    handleShowCar() {
      this.carDialogTable = true;
    },
    // 花名册删除
    handlePersonDel(index) {
      this.PersonDataList.splice(index, 1);
    },
    // 车辆删除
    delCarList(index) {
      this.radioCarList.splice(index, 1);
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
  },
};
</script>
<style lang="scss" scoped>
.content-box {
  padding: 0px 118px 20px;
  .edit-tabs {
    display: inline-block;
    margin-right: 10px;
    span {
      padding: 10px;
    }
    :nth-child(1) {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    :nth-child(2) {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
    .Customize-tabs {
      background: #0089ff;
      color: white;
    }
    .unCustomize-tabs {
      background: #e7eaef;
    }
  }
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
  .input-unit {
    margin-left: 10px;
    display: inline-block;
    height: 40px;
    width: 25px;
    line-height: 40px;
    color: #999999;
  }
  .pagination {
    margin-top: 5px;
    text-align: center;
  }
  .visit {
    display: flex;
    /deep/ .el-form-item__content {
      width: 55%;
    }
  }
}
</style>
