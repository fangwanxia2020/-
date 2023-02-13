<template>
  <div class="edit-content">
    <div v-if="!businessId" class="edit-content-top">
      <back-bar :title="title" />
    </div>
    <div class="edit-content-body">
      <div class="content-box">
        <div class="tab-title">
          <div class="cl-hea-title">基础信息</div>
        </div>
        <el-form
          ref="baseForm"
          :model="baseForm"
          :rules="baseRules"
          class="content-form"
          label-width="120px"
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
              <el-form-item label="单位: ">
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
                <el-input
                  v-if="!isCheck"
                  v-model="baseForm.applyNum"
                  placeholder="请输入内容"
                  controls-position="right"
                  type="number"
                  :min="0"
                >
                  <template slot="append">张</template>
                </el-input>
                <span v-if="isCheck">{{ baseForm.applyNum }}</span>
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
              <el-form-item label="申请事由: " prop="applyReason" class="visit">
                <el-input
                  v-if="!isCheck"
                  v-model="baseForm.applyReason"
                  type="textarea"
                  maxlength="100"
                  :show-word-limit="true"
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
        <div class="tab-title">
          <div class="cl-hea-title">附件信息</div>
        </div>
        <div class="content-file">
          <div class="file-tip">
            <span>附件材料：</span>
            <FileUpload
              v-if="!isCheck"
              :files-list.sync="machineFilesList"
              :before-upload="beforeUpload"
            />
            <span class="tip">
              支持格式:pdf、jpg、png、doc、rar、zip等文件,单个文件不能超过10MB
            </span>
          </div>

          <CtTable
            ref="fileTable"
            :table-height="null"
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
                show-overflow-tooltip
                prop="createName"
              ></el-table-column>
              <el-table-column
                label="上传时间"
                prop="createTime"
              ></el-table-column>
              <el-table-column
                label="操作"
                align="right"
                :width="150"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button type="text" @click="handleDownload(scope.row)">
                    下载
                  </el-button>
                  <el-button
                    v-if="isCheck"
                    type="text"
                    @click="handlePreView(scope.row)"
                  >
                    预览
                  </el-button>
                  <el-button
                    v-if="!isCheck"
                    type="text"
                    @click="handleDel(scope.$index)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </template>
          </CtTable>
        </div>
      </div>
    </div>
    <div v-if="!businessId" class="edit-content-footer">
      <el-button v-if="!isCheck" type="primary" @click="save">保存</el-button>
      <el-button
        v-if="isCheck"
        type="primary"
        :disabled="approvalStatusComputed"
        @click="editBtn"
      >
        编辑
      </el-button>
      <!-- <el-button @click="linkTo">取消</el-button> -->
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
    <FormDialog ref="personModel" title="添加人员" :width="1200">
      <template #default="scope">
        <PersonSel
          v-bind="scope.data"
          :is-select="true"
          :checkboxlist.sync="PersonDataList"
        />
      </template>
    </FormDialog>
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
export default {
  components: { FileUpload, PersonSel },
  props: {
    businessId: {
      type: String,
    },
  },
  data() {
    let validateDuty = (rule, value, callback) => {
      if (!this.radioPersonData.personBaseId) {
        callback(new Error("请选择申领人"));
      } else {
        callback();
      }
    };
    return {
      title: "新增-防爆卡申请流程",
      isCheck: false,
      machineFilesList: [],
      baseForm: {
        validTime: [],
      },
      baseRules: {
        applyPersonId: [
          { required: true, trigger: "change", validator: validateDuty },
        ],
        applyOrgId: [
          { required: true, message: "请输入单位", trigger: "blur" },
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
      approvalStatus: 1,
      stepList: [], // 审批历史
      formLabelAlign: {},
      busInstance: {},
      radio: 3,
    };
  },
  computed: {
    //审批状态
    approvalStatusComputed() {
      return this.approvalStatus != 1;
    },
    //审批内容
    editApprovalTitle() {
      return (obj) => {
        let name;
        if (obj.operationType == 1) {
          name = obj.userName + "提交了" + obj.domainName;
        } else if (obj.operationType == 3) {
          name = "由" + obj.userName + "审批通过";
        } else {
          name = "由" + obj.userName + "审批通过";
        }
        return name;
      };
    },
  },
  watch: {
    machineFilesList() {
      this.$refs.fileTable.reload();
    },
  },
  mounted() {
    if (this.$route.query.id || this.businessId) {
      this.isCheck = true;
      const id = this.$route.query.id || this.businessId;
      this.getDetails(id);
      this.title = "查看-防爆卡申请流程";
    }
  },
  methods: {
    getTableList() {
      return Promise.resolve({
        list: this.machineFilesList,
      });
    },
    //保存
    save() {
      // return;
      this.$refs.baseForm.validate((valid) => {
        if (valid) {
          let resData = {
            applyCardType: 1, //卡类型
            applyPersonId: this.radioPersonData.personBaseId, //申领人
            applyOrgId: this.radioPersonData.orgId,
            applyDeptId: this.radioPersonData.deptId, //申请部门
            applyNum: this.baseForm.applyNum, //申请数量
            applyReason: this.baseForm.applyReason, //申请事由
            applyType: 1, //单据类型 1为申请，2为续期
            approvalStatus: 1, // 先写死
            validBeginTime: this.baseForm.validTime[0],
            validEndTime: this.baseForm.validTime[1],
            fileDtos: this.machineFilesList, // 文件信息
          };
          if (this.$route.query.id) {
            resData.id = this.$route.query.id;
          }
          saveOrUpdateCardApply(resData).then(() => {
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
    // 获取详情
    getDetails(id) {
      getCardApply(id).then((res) => {
        console.log(res.data, "详情");
        this.radioPersonData = {
          name: res.data.applyPersonName,
          orgName: res.data.applyOrgName,
          deptName: res.data.applyDeptName,
          personBaseId: res.data.applyPersonId,
        };
        this.baseForm = {
          applyNum: res.data.applyNum,
          applyReason: res.data.applyReason,
          validTime: [res.data.validBeginTime, res.data.validEndTime],
        };
        this.approvalStatus = res.data.approvalStatus;
        this.machineFilesList = res.data.fileDtos;
      });
    },
    //文件大小校验
    beforeUpload(file) {
      if (!file) return;
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.error("单个文件不能超过10MB");
      }
      return isLt10M;
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
    // 预览机具文件
    handlePreView(row) {
      this.previewFile(this.getFileUrl(row.id) + "&fullfilename=" + row.name);
    },
    editBtn() {
      this.isCheck = false;
      this.title = "编辑-防爆卡申请流程";
    },
    linkTo() {
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="scss" scoped>
.edit-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  &-body {
    flex: 1;
    overflow-y: auto;
    .content-box {
      &-approval {
        padding: 10px 0px;
        border-bottom: 1px solid #eee;
      }
      padding: 10px 132px 0px;
      .tab-title {
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
  &-footer {
    display: flex;
    justify-content: center;
    padding: 10px 0px;
  }
}
.approval-btn {
  text-align: center;
}
/deep/ .search-content {
  border-bottom: 0 !important;
}
</style>
