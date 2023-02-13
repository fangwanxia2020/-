<template>
  <div>
    <el-form label-position="right" label-width="150px" :model="orgDetailsObj">
      <el-row getter="20">
        <el-col :span="12">
          <el-form-item label="上级单位:">
            {{ orgDetailsObj.parentName ? orgDetailsObj.parentName : "-" }}
          </el-form-item>
          <el-form-item label="法定代表人:">
            {{ orgDetailsObj.contacts ? orgDetailsObj.contacts : "-" }}
          </el-form-item>
          <el-form-item label="工商注册号:">
            {{
              orgDetailsObj.registrationNo ? orgDetailsObj.registrationNo : "-"
            }}
          </el-form-item>
          <el-form-item label="联系人:">
            {{
              orgDetailsObj.representative ? orgDetailsObj.representative : "-"
            }}
          </el-form-item>
          <el-form-item label="单位类型:">
            {{ orgDetailsObj.orgTypeName ? orgDetailsObj.orgTypeName : "-" }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位名称:">
            {{ orgDetailsObj.name ? orgDetailsObj.name : "-" }}
          </el-form-item>
          <el-form-item label="统一社会信用代码:">
            {{
              orgDetailsObj.unitiedIdentifier
                ? orgDetailsObj.unitiedIdentifier
                : "-"
            }}
          </el-form-item>
          <el-form-item label="成立日期:">
            {{
              orgDetailsObj.establishDate ? orgDetailsObj.establishDate : "-"
            }}
          </el-form-item>
          <el-form-item label="手机号码:">
            {{ orgDetailsObj.phone ? orgDetailsObj.phone : "-" }}
          </el-form-item>
          <el-form-item label="行业:">
            {{ orgDetailsObj.industryName ? orgDetailsObj.industryName : "-" }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="详细地址:">
          {{ orgDetailsObj.address ? orgDetailsObj.address : "-" }}
        </el-form-item>
        <el-form-item label="经营范围:">
          {{
            orgDetailsObj.registerAddress ? orgDetailsObj.registerAddress : "-"
          }}
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getOrgDetails } from "@/api/access-control-permission/organization-control.js";
export default {
  components: {},
  props: {
    orgId: {
      type: Number,
    },
  },
  data() {
    return {
      orgDetailsObj: {},
    };
  },
  computed: {},
  mounted() {
    getOrgDetails(this.orgId).then((res) => {
      this.orgDetailsObj = res.data;
    });
  },

  methods: {},
};
</script>
<style lang="scss" scoped></style>
