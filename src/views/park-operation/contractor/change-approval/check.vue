<template>
  <div class="edit-content">
    <div class="edit-content-top">
      <back-bar v-if="!businessId" :title="title" />
    </div>
    <div class="edit-content-body">
      <div class="content-box">
        <el-row>
          <el-col :span="10">
            <div class="tab-title padding-l">
              <div class="cl-hea-title">变更事由</div>
            </div>
            <el-form
              :model="reasonForm"
              label-width="150px"
              class="reason_form"
            >
              <el-row>
                <el-col>
                  <el-form-item label="服务企业:" :required="true">
                    <template
                      v-for="tag in orgTagList.filter((org) => org.orgName)"
                    >
                      <el-badge
                        v-if="tag.changeType == 0"
                        :key="tag.orgId"
                        value="新"
                      >
                        <el-tag class="success-tab-border">
                          {{ tag.orgName }}
                        </el-tag>
                      </el-badge>
                      <el-tag v-else :key="tag.orgId">
                        {{ tag.orgName }}
                      </el-tag>
                    </template>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="变更事由:" :required="true">
                    <div>
                      <span>{{ reasonForm.remark }}</span>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
          <el-col :span="14">
            <el-tabs tab-position="left" style="height: 350px">
              <el-tab-pane
                v-for="item in bctChangeTagList"
                :key="item.id"
                :label="item.certificateName"
              >
                <el-form>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="单位名称: ">
                        <span>{{ item.orgName }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="资质类型: ">
                        <span>{{ item.certificateName }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="资质编号: ">
                        <span>{{ item.certificateNo }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="发证机构: ">
                        <span>{{ item.issuingAuthority }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="长期有效: ">
                        <span>{{ item.isPermanent == 0 ? "否" : "是" }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="有效期: ">
                        <span>
                          {{ item.issuanceDate | splitTime }}
                          至
                          {{ item.expirationDate | splitTime }}
                        </span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="附件: ">
                        <el-image
                          v-for="id in item.fileIdList"
                          :key="id"
                          style="width: 100px; height: 100px"
                          :src="getFileUrl(id)"
                          :preview-src-list="
                            item.fileIdList.map((item) => getFileUrl(item))
                          "
                        >
                        </el-image>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center" align="center" class="change-tab">
          <el-col :span="6" class="flex-center">
            <div class="tab-title">
              <div class="cl-hea-title">变更前</div>
            </div>
          </el-col>
          <el-col :span="6" class="flex-center">
            <div style="color: #dfc280">>>>>>>>>>>></div>
          </el-col>
          <el-col :span="6" class="flex-center">
            <div class="tab-title">
              <div class="cl-hea-title">变更后</div>
            </div>
          </el-col>
        </el-row>
        <div class="baseInfo">
          <el-form :model="baseForm" label-width="150px" class="baseInfo-form">
            <el-row>
              <el-col :span="12">
                <el-form-item
                  v-if="showBctRow"
                  label="相关资质"
                  :required="true"
                >
                  <template v-for="tag in bctTagList">
                    <el-badge
                      v-if="tag.changeType == 1"
                      :key="tag.id"
                      value="退"
                      type="warning"
                    >
                      <el-tag class="warning-tab-border">
                        {{ tag.certificateName }}
                      </el-tag>
                    </el-badge>
                    <el-tag v-else :key="tag.id">
                      {{ tag.certificateName }}
                    </el-tag>
                  </template>
                </el-form-item>
                <el-form-item
                  v-for="item in beforChangeData"
                  :key="item.key"
                  :label="`${item.name}:`"
                  :required="getRed(item.key)"
                >
                  <span>{{ item.value }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  v-if="showBctRow"
                  label="相关资质"
                  :required="true"
                >
                  <template v-for="tag in bctChangeTagList">
                    <el-badge
                      v-if="tag.changeType == 0"
                      :key="tag.id"
                      value="新"
                    >
                      <el-tag class="success-tab-border">
                        {{ tag.certificateName }}
                      </el-tag>
                    </el-badge>
                    <el-tag v-else :key="tag.id">
                      {{ tag.certificateName }}
                    </el-tag>
                  </template>
                </el-form-item>
                <el-form-item
                  v-for="item in afterChangeData"
                  :key="item.key"
                  :label="`${item.name}:`"
                  :required="getRed(item.key)"
                >
                  <span class="red">
                    {{ item.value }}
                  </span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="baseForm-noChange">
          <div class="baseForm-noChange-tab" @click="showFormFn">
            <div class="baseForm-noChange-tab-warp">
              <span class="baseForm-noChange-text">{{
                showForm ? "向上收起" : "未变更部分"
              }}</span>
              <i
                :class="[showForm ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"
              >
              </i>
            </div>
          </div>
          <div class="baseForm-noChange-content">
            <el-form v-if="showForm" label-width="150px">
              <el-row>
                <el-col v-for="item in noChangeData" :key="item.key" :span="12">
                  <el-form-item
                    :label="`${item.name}:`"
                    :required="getRed(item.key)"
                  >
                    <span>{{ item.value }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getChangeCtrFiling } from "@/api/contractor/index.js";
export default {
  name: "registration-check",
  props: {
    businessId: {
      type: String,
    },
  },
  data() {
    return {
      title: "重庆安装有限公司— 查看",
      tabs: "1",
      isCheck: false,
      isApproval: false,
      baseForm: {},
      reasonForm: {},
      orgTagList: [],
      bctTagList: [],
      formLabelAlign: {},
      stepList: [], // 审批历史
      approvalRadio: 3,
      industryOptions: [],
      companyTypeOptions: [],
      baseFormKey: [
        { key: "name", name: "承包商名称" },
        { key: "representative", name: "法定代表人" },
        { key: "unitiedIdentifier", name: "统一社会信用代码" },
        { key: "registrationNo", name: "工商注册号" },
        { key: "establishDate", name: "成立日期" },
        { key: "businessTerm", name: "营业期限" },
        { key: "enterpriseTypeId", name: "企业类型" },
        { key: "industryId", name: "行业" },
        { key: "contacts", name: "联系人" },
        { key: "phone", name: "手机号码" },
        { key: "staffScale", name: "人员规模" },
        { key: "region", name: "所在省市区" },
        { key: "address", name: "详细地址" },
        { key: "registerAddress", name: "注册地址" },
        { key: "businessScope", name: "经营范围" },
      ],
      afterChangeData: [],
      beforChangeData: [],
      noChangeData: [],
      showForm: false,
      bctChangeTagList: [],
      showBctRow: true,
    };
  },
  computed: {
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
    //是否必填
    getRed() {
      return (key) => {
        console.log(key);
        const requiredArr = [
          "region",
          "registerAddress",
          "staffScale",
          "address",
          "businessScope",
        ];
        if (requiredArr.includes(key)) {
          return false;
        } else {
          return true;
        }
      };
    },
  },
  created() {
    //企业类型
    this.$getTypeCode("gatedpark_company_type").then((res) => {
      this.companyTypeOptions = res.data;
    });
    //行业
    this.$getTypeCode("hse_rm_risk_industry_involved").then((res) => {
      this.industryOptions = res.data;
    });
    if (this.$route.query.id || this.businessId) {
      this.isCheck = true;
      const id = this.$route.query.id || this.businessId;
      this.getDetails(id);
    }
  },
  methods: {
    // 获取详情
    async getDetails(id) {
      const { data } = await getChangeCtrFiling(id);
      this.title = `信息变更— 查看— ${data.name}`;
      this.reasonForm = {
        remark: data.ctrChangeApply.reason,
      };
      this.baseForm = data;
      // 获取服务企业数据
      this.orgTagList = data.orgExVoList;
      if (data.ctrOrgChangeExList && data.ctrOrgChangeExList.length > 0) {
        data.ctrOrgChangeExList.forEach((item) => {
          if (item.changeType == 0) {
            this.orgTagList.push(item);
          } else {
            const index = this.orgTagList.findIndex(
              (tag) => tag.orgId == item.changeOrgId,
            );
            this.orgTagList.splice(index, 1);
          }
        });
      }
      this.bctTagList = JSON.parse(JSON.stringify(data.baseCertificateDtoList));
      this.bctChangeTagList = data.baseCertificateDtoList;
      // 获取资质数据
      if (data.ctrCertChangeExList && data.ctrCertChangeExList.length > 0) {
        data.ctrCertChangeExList.forEach((item) => {
          if (item.changeType == 0) {
            const obj = { ...item.baseCertificateDto };
            this.bctChangeTagList.push(Object.assign(item, obj));
          } else {
            // 刪除
            const index = this.bctChangeTagList.findIndex(
              (tag) => tag.id == item.baseCertificateDto.id,
            );
            this.bctChangeTagList.splice(index, 1);
            //给变更前的数据标记已删除
            const beforeIndex = this.bctTagList.findIndex(
              (tag) => tag.id == item.baseCertificateDto.id,
            );
            this.bctTagList[beforeIndex].changeType = 1;
          }
        });
      } else {
        this.showBctRow = false;
      }
      // 获取变更数据
      this.baseFormKey.forEach((item) => {
        data.changeDetailList.forEach((list) => {
          //变更
          if (item.key == list.propName) {
            let afterValue = list.afterVal;
            let beforeValue = list.beforeVal;
            if (item.key == "industryId") {
              const afterIndex = this.industryOptions.findIndex((option) => {
                return option.id == afterValue;
              });
              const beforeIndex = this.industryOptions.findIndex((option) => {
                return option.id == beforeValue;
              });
              afterValue = this.industryOptions[afterIndex].dictLabel;
              beforeValue = this.industryOptions[beforeIndex].dictLabel;
            }
            if (item.key == "enterpriseTypeId") {
              const afterIndex = this.companyTypeOptions.findIndex((option) => {
                return option.id == afterValue;
              });
              const beforeIndex = this.companyTypeOptions.findIndex(
                (option) => {
                  return option.id == beforeValue;
                },
              );
              afterValue = this.companyTypeOptions[afterIndex].dictLabel;
              beforeValue = this.companyTypeOptions[beforeIndex].dictLabel;
            }
            this.afterChangeData.push({
              ...item,
              value: afterValue,
            });
            this.beforChangeData.push({
              ...item,
              value: beforeValue,
            });
          }
        });
      });
      const keysArr = data.changeDetailList.map((list) => list.propName);
      this.baseFormKey.forEach((item) => {
        if (!keysArr.includes(item.key)) {
          let value = data[item.key];
          if (item.key == "industryId") {
            const index = this.industryOptions.findIndex((option) => {
              return option.id == data[item.key];
            });
            value = this.industryOptions[index].dictLabel;
          }
          if (item.key == "enterpriseTypeId") {
            const index = this.companyTypeOptions.findIndex((option) => {
              return option.id == data[item.key];
            });
            value = this.companyTypeOptions[index].dictLabel;
          }
          this.noChangeData.push({
            ...item,
            value: value,
          });
        }
      });
    },
    showFormFn() {
      this.showForm = !this.showForm;
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
    }
  }
  &-footer {
    display: flex;
    justify-content: center;
    padding: 10px 0px;
  }
}
.change-tab {
  margin-top: 40px;
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.baseForm-noChange {
  &-tab {
    display: flex;
    align-items: center;
    justify-content: center;
    &-warp {
      display: flex;
      align-items: center;
    }
  }
  &-content {
    min-height: 200px;
  }
  &-text {
    color: var(--primaryColor);
    font-size: 12px;
  }
  i {
    color: var(--primaryColor);
  }
}
.approval-btn {
  text-align: center;
}
.red {
  color: red;
}
/deep/ .search-content {
  border-bottom: 0 !important;
}
::v-deep {
  .el-tabs__content {
    overflow: auto !important;
    height: 100%;
  }
  .el-image + .el-image {
    margin-left: 10px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .el-badge {
    margin: 0px 10px;
  }
  .el-badge__content {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.success-tab-border {
  border: 1px solid red;
}
.warning-tab-border {
  border: 1px dashed #ff9900;
}
</style>
