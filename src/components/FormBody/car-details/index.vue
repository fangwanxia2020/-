<template>
  <div>
    <el-form label-position="right" label-width="100px" :model="carDetailsObj">
      <el-row getter="20">
        <el-form-item label="车牌号：">
          {{ carObj.vehicleCode }}
          <!-- {{ carDetailsObj.parentName }} -->
        </el-form-item>
        <el-form-item label="所属承包商：">
          {{ carObj.sealedCtrName }}
          <!-- {{ carDetailsObj.contacts }} -->
        </el-form-item>
        <el-form-item label="车牌颜色：">
          {{ getNameByKey(carColorList, carObj.vehicleColorId, "id") }}
          <!-- {{ carDetailsObj.representative }} -->
        </el-form-item>
        <el-form-item label="车辆种类：">
          {{ carObj.vehicleTypeName }}
          <!-- {{ carDetailsObj.orgTypeName }} -->
        </el-form-item>
        <el-form-item label="状态：">
          {{ carObj.vehicleState == "1" ? "冻结" : "激活" }}
          <!-- {{ carDetailsObj.orgTypeName }} -->
        </el-form-item>
        <!-- @click="handlePictureCardPreview(item.url)" -->
        <el-form-item label="车辆照片：">
          <span v-if="!carObj.machineImgList.length"> 暂无照片 </span>
          <img
            v-for="(item, idx) of carObj.machineImgList"
            v-else
            :key="idx"
            class="car-img"
            :src="item.url"
            alt=""
          />
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getCarColor } from "@/api/contractor/contractor-car.js";
export default {
  components: {},
  props: {
    carId: {
      type: [Number, String],
    },
    carObj: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      carDetailsObj: {},
      carColorList: [], // 车辆颜色
    };
  },
  created() {
    getCarColor().then((res) => {
      this.carColorList = res.data;
    });
  },
  mounted() {},

  methods: {},
};
</script>
<style lang="scss" scoped>
.car-img {
  width: 100px;
  height: 100px;
  margin: 0 10px;
}
</style>
