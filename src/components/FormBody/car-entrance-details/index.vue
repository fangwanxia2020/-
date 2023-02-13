<template>
  <div>
    <el-form label-position="right" label-width="150px" :model="carDetailsObj">
      <el-row getter="20">
        <el-col :span="12">
          <el-form-item label="车牌号:">
            {{ carDetailsObj.vehicleNumber }}
          </el-form-item>
          <el-form-item label="驾驶人:">
            {{ carDetailsObj.carOwnerName }}
          </el-form-item>
          <el-form-item label="车辆种类:">
            {{ getNameByKey(carKindList, carDetailsObj.carType, "id") }}
          </el-form-item>
          <el-form-item label="进/出:">
            {{ carDetailsObj.inOutFlag == 0 ? "出" : "进" }}
          </el-form-item>
          <el-form-item label="设备:">
            {{ carDetailsObj.deviceName }}
          </el-form-item>
          <el-form-item label="出场时间:">
            {{ carDetailsObj.accessOutTime }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位/承包商:">
            {{ carDetailsObj.orgName }}
          </el-form-item>
          <el-form-item label="手机号码:">
            {{ carDetailsObj.phone }}
          </el-form-item>
          <el-form-item label="区域:">
            {{ carDetailsObj.areaName }}
          </el-form-item>
          <el-form-item label="卡口:">
            {{ carDetailsObj.gatewayName }}
          </el-form-item>
          <el-form-item label="入场时间:">
            {{ carDetailsObj.accessTime }}
          </el-form-item>
          <el-form-item label="停留时间:">
            {{ carDetailsObj.waitTime }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getVehicleAccessRecDto } from "@/api/flow-analysis/index.js";
import { getCarKindList } from "@/api/access-control-permission/organization-control.js";
export default {
  components: {},
  props: {
    carId: {
      type: [Number, String],
    },
  },
  data() {
    return {
      carDetailsObj: {},
      carKindList: [],
    };
  },
  computed: {},
  mounted() {
    // 车辆种类
    getCarKindList({}).then((res) => {
      this.carKindList = res.data;
    });
    getVehicleAccessRecDto(this.carId).then((res) => {
      this.carDetailsObj = res.data;
    });
  },

  methods: {},
};
</script>
<style lang="scss" scoped></style>
