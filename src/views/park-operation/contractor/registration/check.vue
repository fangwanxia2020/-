<template>
  <div class="edit-content">
    <div v-if="!businessId" class="edit-content-top">
      <back-bar :title="title" />
    </div>
    <div class="edit-content-body">
      <div class="content-box">
        <el-row>
          <el-col :span="10">
            <div class="tab-title padding-l">
              <div class="cl-hea-title">入驻事由</div>
            </div>
            <el-form
              :model="reasonForm"
              label-width="100px"
              class="reason_form"
            >
              <el-row>
                <el-col :offset="1">
                  <el-form-item label="服务企业:" :required="true">
                    <el-tag
                      v-for="tag in orgTagList.filter((org) => org.orgName)"
                      :key="tag.orgId"
                    >
                      {{ tag.orgName }}
                    </el-tag>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :offset="1">
                  <el-form-item label="入驻事由:" :required="true">
                    <div>
                      <span>{{ baseForm.fillingReason }}</span>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
          <el-col :span="14">
            <el-tabs tab-position="left" style="height: 350px">
              <el-tab-pane
                v-for="item in bctTagList"
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
        <div class="tab-title padding-l">
          <div class="cl-hea-title">基础信息</div>
        </div>
        <div class="baseInfo">
          <el-form :model="baseForm" label-width="150px" class="baseInfo-form">
            <el-row>
              <el-col :span="9">
                <el-form-item label="承包商名称:" :required="true">
                  <span>{{ baseForm.name }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="9" :offset="3">
                <el-form-item label="法定代表人:" :required="true">
                  <span>{{ baseForm.representative }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="统一社会信用代码:" :required="true">
                  <span>{{ baseForm.unitiedIdentifier }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="9" :offset="3">
                <el-form-item label="工商注册号:" :required="true">
                  <span>{{ baseForm.registrationNo }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="成立日期:" :required="true">
                  <span>{{ baseForm.establishDate | splitTime }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="9" :offset="3">
                <el-form-item label="营业期限:" :required="true">
                  <span>{{ baseForm.businessTerm }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="企业类型:" :required="true">
                  <span>
                    {{
                      getNameByKey(
                        companyTypeOptions,
                        baseForm.enterpriseTypeId,
                        "id",
                      )
                    }}
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="9" :offset="3">
                <el-form-item label="行业:" :required="true">
                  <span>
                    {{
                      getNameByKey(industryOptions, baseForm.industryId, "id")
                    }}
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="联系人:" :required="true">
                  <span>{{ baseForm.contacts }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="9" :offset="3">
                <el-form-item label="手机号码:" :required="true">
                  <span>{{ baseForm.phone }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="9">
                <el-form-item label="人员规模:">
                  <span>{{ baseForm.staffScale }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="9" :offset="3">
                <el-form-item label="所在省市区:">
                  <span>{{ baseForm.region }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="18">
                <el-form-item label="详细地址:">
                  <span>{{ baseForm.address }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="18">
                <el-form-item label="注册地址:">
                  <span>{{ baseForm.registerAddress }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="18">
                <el-form-item label="经营范围:">
                  <span>{{ baseForm.businessScope }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>
    <div v-if="!businessId && canMotify" class="edit-content-footer">
      <el-button type="primary" @click="edit"> 编辑 </el-button>
    </div>
  </div>
</template>

<script>
import { getCtrFilingDetail } from "@/api/contractor/index.js";
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
      canMotify: true,
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
      this.title = null;
      const id = this.$route.query.id || this.businessId;
      this.getDetails(id);
    }
  },
  methods: {
    // 获取详情
    async getDetails(id) {
      const { data } = await getCtrFilingDetail(id);
      this.title = `入驻备案— 查看— ${data.name}`;
      this.canMotify = data.status == 1;
      this.reasonForm = {
        remark: data.fillingReason,
      };
      this.baseForm = data;
      this.orgTagList = data.orgExVoList;
      // this.bctTagList = data.baseCertificateDtoList;
      this.bctTagList = data.baseCertificateDtoList;
      console.log(this.bctTagList);
    },
    edit() {
      this.$router.push({
        path: "/gatedpark/park-operation/contractor/registration/add",
        query: {
          id: this.$route.query.id,
        },
      });
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
.approval-btn {
  text-align: center;
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
}
</style>
