<template>
  <div class="edit-content">
    <div class="edit-content-top">
      <back-bar :title="title" />
    </div>
    <div class="edit-content-body">
      <div class="edit-content-body-box">
        <div class="tab-title padding-l">
          <div class="cl-hea-title">
            {{ isChange ? "变更事由" : "入驻事由:" }}
          </div>
        </div>
        <div class="reason">
          <el-form
            ref="reasonFormRef"
            :model="reasonForm"
            label-width="150px"
            :rules="reasonRules"
            class="reason_form"
          >
            <el-row>
              <el-col :span="9" :offset="3">
                <el-form-item label="服务企业:" prop="company">
                  <el-select
                    v-model="reasonForm.company"
                    filterable
                    placeholder="请选择服务企业"
                    size="small"
                    @change="companyChange"
                  >
                    <el-option
                      v-for="item in orgOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-tag
                  v-for="tag in orgTagList"
                  :key="tag.value"
                  closable
                  @close="handleTagClose(tag)"
                >
                  {{ tag.label }}
                </el-tag>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="9" :offset="3">
                <el-form-item
                  :label="isChange ? '变更事由' : '入驻事由:'"
                  prop="remark"
                >
                  <el-select
                    v-if="!isChange"
                    v-model="reasonForm.reasonId"
                    placeholder="请选择入驻事由"
                    size="small"
                    @change="entryReasonChange"
                  >
                    <el-option
                      v-for="(item, idx) in entryReasonList"
                      :key="idx"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  <div style="height: 10px"></div>
                  <el-input
                    v-model="reasonForm.remark"
                    type="textarea"
                    :maxlength="300"
                    :show-word-limit="true"
                    placeholder="请选择或输入其他原因"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="tab-title padding-l">
          <div class="cl-hea-title">基础信息</div>
        </div>
        <div class="baseInfo">
          <el-form
            ref="baseFormRef"
            :model="baseForm"
            label-width="150px"
            :rules="baseRules"
            class="baseInfo-form"
          >
            <el-row>
              <el-col :span="9" :offset="3">
                <el-form-item label="承包商名称:" prop="name">
                  <el-input
                    v-model="baseForm.name"
                    placeholder="请输入承包商名称"
                    clearable
                    size="small"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="法定代表人:" prop="representative">
                  <el-input
                    v-model="baseForm.representative"
                    placeholder="请输入法定代表人"
                    clearable
                    size="small"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9" :offset="3">
                <el-form-item
                  label="统一社会信用代码:"
                  prop="unitiedIdentifier"
                >
                  <el-input
                    v-model="baseForm.unitiedIdentifier"
                    placeholder="请输入统一社会信用代码"
                    clearable
                    size="small"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="工商注册号:" prop="registrationNo">
                  <el-input
                    v-model="baseForm.registrationNo"
                    placeholder="请输入工商注册号"
                    clearable
                    size="small"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9" :offset="3">
                <el-form-item label="成立日期:" prop="establishDate">
                  <el-date-picker
                    v-model="baseForm.establishDate"
                    type="date"
                    placeholder="选择成立日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="营业期限:" prop="businessTerm">
                  <el-input
                    v-model="baseForm.businessTerm"
                    placeholder="请输入营业期限"
                    clearable
                    size="small"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9" :offset="3">
                <el-form-item label="企业类型:" prop="enterpriseTypeId">
                  <el-select
                    v-model="baseForm.enterpriseTypeId"
                    placeholder="请选择企业类型"
                    size="small"
                  >
                    <el-option
                      v-for="(item, idx) in companyTypeOptions"
                      :key="idx"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="行业:" prop="industryId">
                  <el-select
                    v-model="baseForm.industryId"
                    placeholder="请选择行业"
                    size="small"
                  >
                    <el-option
                      v-for="(item, idx) in industryOptions"
                      :key="idx"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="9" :offset="3">
                <el-form-item label="联系人:" prop="contacts">
                  <el-input
                    v-model="baseForm.contacts"
                    placeholder="请输入联系人"
                    clearable
                    size="small"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="手机号码:" prop="phone">
                  <el-input
                    v-model="baseForm.phone"
                    placeholder="请输入手机号码"
                    clearable
                    maxlength="11"
                    size="small"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="9" :offset="3">
                <el-form-item label="相关资质:" prop="certList">
                  <el-select
                    v-model="baseForm.certList"
                    filterable
                    placeholder="请选择相关资质"
                    size="small"
                    @change="certListChange"
                  >
                    <el-option
                      v-for="item in bctList"
                      :key="item.id"
                      :label="item.certificateName"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-tag
                  v-for="tag in bctTagList"
                  :key="tag.value"
                  closable
                  @close="handleBctTagClose(tag)"
                >
                  {{ tag.label }}
                </el-tag>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="9" :offset="3">
                <el-form-item label="人员规模:" prop="staffScale">
                  <el-input
                    v-model="baseForm.staffScale"
                    placeholder="请输入内容"
                    clearable
                    size="small"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="所在省市区:" prop="region">
                  <el-input
                    v-model="baseForm.region"
                    placeholder="请输入所在省市区"
                    clearable
                    size="small"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="18" :offset="3">
                <el-form-item label="详细地址:" prop="address">
                  <el-input
                    v-model="baseForm.address"
                    type="textarea"
                    :maxlength="140"
                    :show-word-limit="true"
                    placeholder="请输入详细地址"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="18" :offset="3">
                <el-form-item label="注册地址:" prop="registerAddress">
                  <el-input
                    v-model="baseForm.registerAddress"
                    type="textarea"
                    :maxlength="140"
                    :show-word-limit="true"
                    placeholder="请输入注册地址"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="18" :offset="3">
                <el-form-item label="经营范围:" prop="businessScope">
                  <el-input
                    v-model="baseForm.businessScope"
                    type="textarea"
                    :maxlength="300"
                    :show-word-limit="true"
                    placeholder="请输入经营范围"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>
    <div class="edit-content-footer">
      <el-button type="primary" @click="save">保存</el-button>
      <!-- <el-button @click="cancel">取消</el-button> -->
    </div>
  </div>
</template>

<script>
import { getOrgListData } from "@/api/access-control-permission/organization-control.js";
import {
  addCtrFiling,
  editCtrFiling,
  getBctList,
  getCtrFilingDetail,
  changeCtrFiling,
} from "@/api/contractor/index.js";

export default {
  name: "registration-add",
  data() {
    const companyValidtor = (rule, value, callback) => {
      if (this.orgTagList.length == 0) {
        callback(new Error("请选择服务企业"));
      } else {
        callback();
      }
    };
    const bctValidtor = (rule, value, callback) => {
      if (this.bctTagList.length == 0) {
        callback(new Error("请选择相关资质"));
      } else {
        callback();
      }
    };
    const checkPhone = (rule, value, callback) => {
      // 手机号验证
      if (!value) {
        return callback(new Error("请输入手机号"));
      } else {
        const reg = /^1[3456789]\d{9}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
    return {
      title: "入驻备案—— 新增",
      reasonForm: {
        company: null,
        reasonId: null,
        remark: null,
      },
      baseForm: {
        name: null,
        representative: null,
        unitiedIdentifier: null,
        registrationNo: null,
        establishDate: null,
        industryId: null,
        contacts: null,
        phone: null,
        staffScale: null,
        region: null,
        address: null,
        registerAddress: null,
        businessTerm: null,
        enterpriseTypeId: null,
        certList: null,
        businessScope: null,
      },
      orgTagList: [],
      replaceReasonList: [],
      reasonRules: {
        company: {
          required: true,
          validator: companyValidtor,
          trigger: "change",
        },
        remark: {
          required: true,
          message: "请输入入驻事由",
          trigger: "blur",
        },
      },
      baseRules: {
        name: {
          required: true,
          message: "请输入承包商名称",
          trigger: "blur",
        },
        representative: {
          required: true,
          message: "请输入法定代表人",
          trigger: "blur",
        },
        unitiedIdentifier: {
          required: true,
          message: "请输入统一社会信用代码",
          trigger: "blur",
        },
        registrationNo: {
          required: true,
          message: "请输入工商注册号",
          trigger: "blur",
        },
        establishDate: {
          required: true,
          message: "选择成立日期",
          trigger: "blur",
        },
        businessTerm: {
          required: true,
          message: "请输入营业期限",
          trigger: "blur",
        },
        enterpriseTypeId: {
          required: true,
          message: "请选择企业类型",
          trigger: "change",
        },
        industryId: {
          required: true,
          message: "请选择行业",
          trigger: "change",
        },
        contacts: {
          required: true,
          message: "请输入联系人",
          trigger: "blur",
        },
        phone: {
          required: true,
          validator: checkPhone,
          trigger: "blur",
        },
        certList: {
          required: true,
          validator: bctValidtor,
          trigger: "change",
        },
      },
      orgOptions: [],
      entryReasonList: [],
      companyTypeOptions: [],
      industryOptions: [],
      bctList: [],
      bctTagList: [],
      isWrite: false,
      isChange: false,
    };
  },
  created() {
    //获取单位
    getOrgListData().then((res) => {
      this.orgOptions = res.data.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
    });
    //获取入驻原由gatedpark__reasons_entry
    this.$getTypeCode("gatedpark__reasons_entry").then((res) => {
      this.entryReasonList = res.data;
    });
    //企业类型
    this.$getTypeCode("gatedpark_company_type").then((res) => {
      this.companyTypeOptions = res.data;
    });
    //行业
    this.$getTypeCode("hse_rm_risk_industry_involved").then((res) => {
      this.industryOptions = res.data;
    });
    //资质列表
    getBctList({ resourceType: 10 }).then((res) => {
      this.bctList = res.data;
    });
    if (this.$route.query.id) {
      //变更
      if (this.$route.query.status && this.$route.query.status == 3) {
        this.isChange = true;
      } else {
        this.isWrite = true;
      }
      this.title = null;
      this.getDetails(this.$route.query.id);
    }
  },
  methods: {
    // 获取详情
    async getDetails(id) {
      let fn = getCtrFilingDetail;
      const { data } = await fn(id);
      this.title = `入驻备案— ${this.isChange ? "变更" : "修改"}— ${data.name}`;
      Object.keys(this.baseForm).forEach((key) => {
        this.baseForm[key] = data[key];
      });
      this.orgTagList = data.orgExVoList.map((item) => {
        return {
          label: item.orgName,
          value: item.orgId,
        };
      });
      this.bctTagList = data.baseCertificateDtoList.map((item) => {
        return {
          label: item.certificateName,
          value: item.id,
          certPicId: item.fileIdList,
        };
      });
      if (this.isChange) {
        this.reasonForm = {
          remark: data.reason,
        };
      } else {
        this.reasonForm = {
          remark: data.fillingReason,
          reasonId: `${data.fillingTypeId}`,
        };
      }
    },
    //服务单位change
    companyChange(e) {
      this.reasonForm.company = null;
      const ids = this.orgTagList.map((item) => item.value);
      if (!ids.includes(e)) {
        const index = this.orgOptions.findIndex((item) => item.value == e);
        this.orgTagList.push({
          label: this.orgOptions[index].label,
          value: e,
        });
      }
      this.$refs.reasonFormRef.validateField("company");
    },
    //服务单位tag关闭
    handleTagClose(tag) {
      const index = this.orgTagList.findIndex(
        (item) => item.value == tag.value,
      );
      this.orgTagList.splice(index, 1);
    },
    //入驻原由
    entryReasonChange(e) {
      const index = this.entryReasonList.findIndex((item) => item.id == e);
      const remark = this.entryReasonList[index].name;
      if (remark == "其他") {
        this.reasonForm.remark = "";
      } else {
        this.reasonForm.remark = remark;
      }
      this.$refs.reasonFormRef.validateField("remark");
    },
    // 资质
    certListChange(e) {
      this.baseForm.certList = null;
      const ids = this.bctTagList.map((item) => item.value);
      if (!ids.includes(e)) {
        const index = this.bctList.findIndex((item) => item.id == e);
        this.bctTagList.push({
          label: this.bctList[index].certificateName,
          value: e,
          certPicId: this.bctList[index].fileIdList,
        });
      }
      this.$refs.baseFormRef.validateField("certList");
    },
    handleBctTagClose(tag) {
      const index = this.bctTagList.findIndex(
        (item) => item.value == tag.value,
      );
      this.bctTagList.splice(index, 1);
    },
    //保存
    save() {
      this.$refs.reasonFormRef.validate((valid) => {
        console.log(valid);
        if (valid) {
          this.$refs.baseFormRef.validate((baseValid) => {
            if (baseValid) {
              this.baseForm.orgExDtoList = this.orgTagList.map((item) => {
                return {
                  orgId: item.value,
                };
              });
              this.baseForm.certExDtoList = this.bctTagList.map((item) => {
                return {
                  certTypeId: item.value,
                  certPicId:
                    item.certPicId && item.certPicId.length > 0
                      ? item.certPicId[0]
                      : null,
                };
              });
              if (this.isChange) {
                this.baseForm.reason = this.reasonForm.remark;
              } else {
                this.baseForm.fillingTypeId = this.reasonForm.reasonId;
                this.baseForm.fillingReason = this.reasonForm.remark;
              }
              console.log(this.baseForm);
              let fn = addCtrFiling;
              if (this.isWrite) {
                fn = editCtrFiling;
                this.baseForm.id = this.$route.query.id;
              }
              if (this.isChange) {
                fn = changeCtrFiling;
                this.baseForm.id = this.$route.query.id;
              }
              fn(this.baseForm).then((res) => {
                if (res.success) {
                  this.$message.success(res.msg);
                  this.$router.go(-1);
                } else {
                  this.$message.error(res.msg);
                }
              });
            }
          });
        }
      });
    },
    cancel() {
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
    &-box {
      padding: 10px 20px;
    }
  }
  &-footer {
    display: flex;
    justify-content: center;
    padding: 10px 0px;
  }
}
.padding-l {
  padding-left: 112px;
}
::v-deep {
  .el-input,
  .el-select,
  .el-autocomplete {
    width: 100%;
  }
  .el-tag {
    margin-top: 5px;
    margin-left: 10px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
}
</style>
