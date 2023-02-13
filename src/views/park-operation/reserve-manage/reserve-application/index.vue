<template>
  <div class="container">
    <div class="container-top">
      <el-radio v-model="radio" label="1">行人预约</el-radio>
      <el-radio v-model="radio" label="2">人车预约</el-radio>
      <el-radio v-model="radio" label="3">机具预约</el-radio>
    </div>
    <div class="container-content">
      <div v-if="radio == '1'" class="container-reserve">
        <pedestrian-reserve ref="pedestrianReserve"> </pedestrian-reserve>
      </div>
      <div v-if="radio == '2'" class="container-reserve">
        <car-reservation ref="pedestrianReserve"> </car-reservation>
      </div>
      <div v-if="radio == '3'" class="container-reserve">
        <equipment-reservation ref="pedestrianReserve"> </equipment-reservation>
      </div>
    </div>
    <div class="container-bottom">
      <el-button type="primary" @click="saveApplication"> 保存 </el-button>
      <el-button class="bottom-cancel" @click="goBack"> 取消</el-button>
    </div>
  </div>
</template>

<script>
const pedestrianReserve = () => import("./components/pedestrian-reserve.vue"); // 行人预约组件
const carReservation = () => import("./components/car-reservation.vue"); // 人车预约组件
const equipmentReservation = () =>
  import("./components/equipment-reservation.vue"); // 机具预约组件
export default {
  components: { pedestrianReserve, carReservation, equipmentReservation },
  data() {
    return {
      checkSuccess: false,
      checkCarSuccess: false,
      radio: "1",
    };
  },
  watch: {},
  created() {
    if (this.$route.query.id) {
      switch (this.$route.query.type) {
        case "reserve":
          this.radio = "1";
          break;
        case "car":
          this.radio = "2";
          break;
        default:
          this.radio = "3";
          break;
      }
    }
  },
  methods: {
    saveApplication() {
      this.$refs["pedestrianReserve"].save();
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  .container-top {
    height: 50px;
    line-height: 50px;
    padding-left: 50px;
  }
  .container-content {
    height: calc(90vh - 120px);
    overflow-y: auto;
    .container-reserve {
      margin: 20px 50px;
    }
  }

  .container-bottom {
    position: fixed;
    bottom: 10px;
    left: 55%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    .bottom-cancel {
      color: #66b1ff;
    }
  }
}
</style>
