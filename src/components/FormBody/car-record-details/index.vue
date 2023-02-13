<template>
  <div>
    <el-form label-position="right" label-width="100px" :model="carDetailsObj">
      <el-row getter="20">
        <el-form-item label="车牌号：">
          {{ carObj.vehicleNumber }}
        </el-form-item>
        <el-form-item v-if="isOrg" label="所属单位:">
          {{ carObj.orgName }}
        </el-form-item>
        <el-form-item v-if="isCtr" label="承包商:">
          {{ carObj.orgName }}
        </el-form-item>
        <el-form-item label="部门：">
          {{ carObj.representative }}
        </el-form-item>
        <el-form-item label="联系人：">
          {{ carObj.carOwnerName }}
        </el-form-item>
        <el-form-item label="手机号码：">
          {{ carObj.phone }}
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { personDetail } from "@/api/infrastructure/come-out-auth.js"; // 接口换成车辆的
export default {
  components: {},
  props: {
    carId: {
      type: [Number, String],
    },
    isCtr: {
      type: Boolean,
      default: false,
    },
    isOrg: {
      type: Boolean,
      default: false,
    },
    carObj: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      carDetailsObj: {},
    };
  },

  mounted() {},

  methods: {},
};
</script>
<style lang="scss" scoped></style>
