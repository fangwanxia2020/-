<template>
  <el-form ref="form" :model="form" class="message-dialog" label-width="130px">
    <template v-if="(title || '').indexOf('单位信息') != -1">
      <el-form-item label="上级单位: ">
        <span class="cl-col">{{ form.parentName }}</span>
      </el-form-item>
      <el-form-item label="单位名称: ">
        <span class="cl-col">{{ form.name }}</span>
      </el-form-item>
      <el-form-item label="法定代表人: ">
        <span class="cl-col">{{ form.representative }}</span>
      </el-form-item>
      <el-form-item label="统一社会信用代码: ">
        <span class="cl-col">{{ form.unitiedIdentifier }}</span>
      </el-form-item>
      <el-form-item label="工商注册号: ">
        <span class="cl-col">{{ form.icId }}</span>
      </el-form-item>
      <el-form-item label="成立日期: ">
        <span class="cl-col">{{ form.establishDate }}</span>
      </el-form-item>
      <el-form-item label="联系人: ">
        <span class="cl-col">{{ form.contacts }}</span>
      </el-form-item>
      <el-form-item label="手机号码: ">
        <span class="cl-col">{{ form.phone }}</span>
      </el-form-item>
      <el-form-item label="单位类型: ">
        <span class="cl-col">{{ form.orgTypeName }}</span>
      </el-form-item>
      <el-form-item label="行业: ">
        <span class="cl-col">{{ form.industryName }}</span>
      </el-form-item>
      <el-form-item label="详细地址: ">
        <span class="cl-col">{{ form.address }}</span>
      </el-form-item>
      <el-form-item label="经营范围: ">
        <span class="cl-col">{{ form.businessScope }}</span>
      </el-form-item>
    </template>
    <template v-if="(title || '').indexOf('人员信息') != -1">
      <el-form-item label="姓名: ">
        <span class="cl-col">{{ form.name }}</span>
      </el-form-item>
      <el-form-item label="所属单位: ">
        <span class="cl-col">{{ form.orgName }}</span>
      </el-form-item>
      <el-form-item label="职位: ">
        <span class="cl-col">{{ form.professionTitle }}</span>
      </el-form-item>
      <el-form-item label="身份证: ">
        <span class="cl-col">{{ form.idNo }}</span>
      </el-form-item>
      <el-form-item label="手机号码: ">
        <span class="cl-col">{{ form.phone }}</span>
      </el-form-item>
    </template>
    <template v-if="(title || '').indexOf('车牌信息') != -1">
      <el-form-item label="车牌号: ">
        <span class="cl-col">{{ form.vehicleCode }}</span>
      </el-form-item>
      <el-form-item label="所属企业: ">
        <span class="cl-col">{{ form.orgName }}</span>
      </el-form-item>
      <el-form-item label="车牌颜色: ">
        <span class="cl-col">{{ form.vehicleColor }}</span>
      </el-form-item>
      <el-form-item label="车辆种类: ">
        <span class="cl-col">{{ form.vehicleType }}</span>
      </el-form-item>
      <el-form-item label="状态: ">
        <span class="cl-col">{{
          form.vehicleState == 0 ? "正常" : form.vehicleState == 1 ? "冻结" : ""
        }}</span>
      </el-form-item>
    </template>
    <template v-if="(title || '').indexOf('承包商信息') != -1">
      <el-form-item label="承包商名称: ">
        <span class="cl-col">{{ form.name }}</span>
      </el-form-item>
      <el-form-item label="法定代表人: ">
        <span class="cl-col">{{ form.representative }}</span>
      </el-form-item>
      <el-form-item label="统一社会信用代码: ">
        <span class="cl-col">{{ form.unitiedIdentifier }}</span>
      </el-form-item>
      <el-form-item label="工商注册号: ">
        <span class="cl-col">{{ form.registrationNo }}</span>
      </el-form-item>
      <el-form-item label="成立日期: ">
        <span class="cl-col">{{ form.establishDate }}</span>
      </el-form-item>
      <el-form-item label="营业期限: ">
        <span class="cl-col">{{ form.businessTerm }}</span>
      </el-form-item>
      <el-form-item label="企业类型: ">
        <span class="cl-col">
          {{ getNameByKey(companyTypeOptions, form.enterpriseTypeId, "id") }}
        </span>
      </el-form-item>
      <el-form-item label="行业: ">
        <span class="cl-col">
          {{ getNameByKey(industryOptions, form.industryId, "id") }}
        </span>
      </el-form-item>
      <el-form-item label="联系人: ">
        <span class="cl-col">{{ form.contacts }}</span>
      </el-form-item>
      <el-form-item label="手机号码: ">
        <span class="cl-col">{{ form.phone }}</span>
      </el-form-item>
      <el-form-item label="详细地址: ">
        <span class="cl-col">{{ form.address }}</span>
      </el-form-item>
      <el-form-item label="经营范围: ">
        <span class="cl-col">{{ form.businessScope }}</span>
      </el-form-item>
    </template>
  </el-form>
</template>

<script>
import dataMixin from "@/mixin/data.js";
export default {
  mixins: [dataMixin],
  props: {
    title: String,
  },
  data() {
    return {
      form: { ...this.data },
      companyTypeOptions: [],
      industryOptions: [],
    };
  },
  created() {
    // 企业类型
    this.$getTypeCode("gatedpark_company_type").then((res) => {
      this.companyTypeOptions = res.data;
    });
    // 行业
    this.$getTypeCode("hse_rm_risk_industry_involved").then((res) => {
      this.industryOptions = res.data;
    });
  },
};
</script>

<style lang="scss" scoped>
.el-form {
  .el-form-item {
    float: left;
    width: 50%;
    ::v-deep .el-form-item__label {
      color: #000;
    }
  }
}
</style>
