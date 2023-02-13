<template>
  <div>
    <el-form
      label-position="right"
      label-width="150px"
      :model="contractorDetailsObj"
    >
      <el-row getter="20">
        <el-col :span="12">
          <el-form-item label="承包商名称:">
            {{ contractorDetailsObj.name ? contractorDetailsObj.name : "-" }}
          </el-form-item>
          <el-form-item label="统一社会信用代码:">
            {{
              contractorDetailsObj.unitiedIdentifier
                ? contractorDetailsObj.unitiedIdentifier
                : "-"
            }}
          </el-form-item>
          <el-form-item label="成立日期:">
            {{
              contractorDetailsObj.createTime &&
              contractorDetailsObj.createTime.split(" ")[0]
            }}
          </el-form-item>
          <el-form-item label="企业类型:">
            {{
              getNameByKey(
                companyTypeOptions,
                contractorDetailsObj.enterpriseTypeId,
                "code",
              )
            }}
          </el-form-item>
          <el-form-item label="联系人:">
            {{
              contractorDetailsObj.representative
                ? contractorDetailsObj.representative
                : "-"
            }}
          </el-form-item>
          <el-form-item label="人员规模:">
            {{
              contractorDetailsObj.staffScale
                ? contractorDetailsObj.staffScale
                : "-"
            }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="法定代表人:">
            {{
              contractorDetailsObj.contacts
                ? contractorDetailsObj.contacts
                : "-"
            }}
          </el-form-item>
          <el-form-item label="工商注册号:">
            {{
              contractorDetailsObj.registrationNo
                ? contractorDetailsObj.registrationNo
                : "-"
            }}
          </el-form-item>
          <el-form-item label="营业期限:">
            {{
              contractorDetailsObj.businessTerm
                ? contractorDetailsObj.businessTerm
                : "-"
            }}
          </el-form-item>
          <el-form-item label="行业:">
            {{
              getNameByKey(
                industryOptions,
                contractorDetailsObj.industryId,
                "code",
              )
            }}
            <!-- {{ contractorDetailsObj.industryName }} -->
          </el-form-item>
          <el-form-item label="手机号码:">
            {{ contractorDetailsObj.phone ? contractorDetailsObj.phone : "-" }}
          </el-form-item>
          <el-form-item label="所在省市区:">
            {{
              contractorDetailsObj.region ? contractorDetailsObj.region : "-"
            }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="详细地址:">
          {{
            contractorDetailsObj.address ? contractorDetailsObj.address : "-"
          }}
        </el-form-item>
        <el-form-item label="注册地址:">
          {{
            contractorDetailsObj.registerAddress
              ? contractorDetailsObj.registerAddress
              : "-"
          }}
        </el-form-item>
        <el-form-item label="经营范围:">
          {{
            contractorDetailsObj.businessScope
              ? contractorDetailsObj.businessScope
              : "-"
          }}
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { contractorDetail } from "@/api/access-control-permission/organization-control.js";
export default {
  components: {},
  props: {
    contractorId: {
      type: [Number, String],
    },
  },
  data() {
    return {
      contractorDetailsObj: {},
      companyTypeOptions: [],
      industryOptions: [],
    };
  },
  computed: {},
  mounted() {
    // 企业类型
    this.$getTypeCode("gatedpark_company_type").then((res) => {
      this.companyTypeOptions = res.data;
    });
    // 行业
    this.$getTypeCode("hse_rm_risk_industry_involved").then((res) => {
      this.industryOptions = res.data;
    });
    contractorDetail(this.contractorId).then((res) => {
      this.contractorDetailsObj = res.data;
    });
  },

  methods: {},
};
</script>
<style lang="scss" scoped></style>
