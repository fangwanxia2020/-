<template>
  <div>
    <el-form label-position="right" label-width="90px" :model="orgDetailsObj">
      <el-row getter="20">
        <el-form-item label="姓名:">
          {{ orgDetailsObj.name }}
        </el-form-item>
        <el-form-item v-if="isOrg" label="所属单位:">
          {{ orgDetailsObj.orgName }}
        </el-form-item>
        <el-form-item v-if="isCtr" label="承包商:">
          {{ ctrName }}
        </el-form-item>
        <el-form-item label="职位:">
          {{ orgDetailsObj.jobTypeName }}
        </el-form-item>
        <el-form-item label="身份证:">
          {{ orgDetailsObj.idNo }}
        </el-form-item>
        <el-form-item label="手机号码:">
          {{ orgDetailsObj.phone }}
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {
  personDetail,
  getByPersonBaseId,
} from "@/api/infrastructure/come-out-auth.js";
export default {
  components: {},
  props: {
    isCtr: {
      type: Boolean,
      default: false,
    },
    ctrName: {
      type: String,
      default: "",
    },
    isOrg: {
      type: Boolean,
      default: false,
    },
    isBase: {
      type: Boolean,
      default: false,
    },
    personId: {
      type: [String, Number],
    },
  },
  data() {
    return {
      orgDetailsObj: {},
    };
  },
  computed: {},
  mounted() {
    if (this.isBase) {
      getByPersonBaseId(this.personId).then((res) => {
        this.orgDetailsObj = res.data;
      });
    } else {
      personDetail(this.personId).then((res) => {
        this.orgDetailsObj = res.data;
      });
    }
    // personDetail(this.personId).then((res) => {
    //   this.orgDetailsObj = res.data;
    // });
  },

  methods: {},
};
</script>
<style lang="scss" scoped></style>
