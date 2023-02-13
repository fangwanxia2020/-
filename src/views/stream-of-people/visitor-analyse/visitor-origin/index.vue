<template>
  <div class="cl-item-content">
    <div class="item-tab">
      <el-radio-group v-model="tabPos" size="mini">
        <el-radio-button label="1">今日</el-radio-button>
        <el-radio-button label="2">本周</el-radio-button>
        <el-radio-button label="3">本月</el-radio-button>
        <el-radio-button label="4" class="cl_hide_input">
          自定义
          <el-date-picker
            v-model="tabDate"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="{
              disabledDate: (time) => {
                return time.getTime() > new Date().getTime();
              },
            }"
          >
          </el-date-picker>
        </el-radio-button>
      </el-radio-group>
    </div>
    <Province
      v-if="num == 1"
      :tab-pos="tabPos"
      :tab-date="tabDate"
      :org-id="orgId"
      :to-req2.sync="toReq2"
      :car-type-id="carTypeId"
      @getNum="getNum"
      @getData="getCityData"
    />
    <City
      v-if="num == 2"
      :province-en-name="provinceEnName"
      :province-cn-name="provinceCnName"
      :city-name="cityName"
      :tab-pos="tabPos"
      :tab-date="tabDate"
      :org-id="orgId"
      :to-req2.sync="toReq2"
      :car-type-id="carTypeId"
      @getNum="getNum"
      @getData="getAreaData"
    />
    <!-- <Area
      v-if="num == 3"
      :province-en-name="provinceEnName"
      :province-cn-name="provinceCnName"
      :city-name="cityName"
      @getNum="getNum"
      @getData="getCityData"
    /> -->
  </div>
</template>

<script>
import Province from "./map/province.vue";
import City from "./map/city.vue";
// import Area from "./map/area.vue";
export default {
  components: { Province, City },
  props: {
    orgId: {
      type: Array,
      default: () => [],
    },
    toReq: {
      type: Boolean,
      default: false,
    },
    carTypeId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      tabPos: "1",
      tabDate: [],
      num: 1,
      provinceEnName: "",
      provinceCnName: "",
      cityName: "",
      toReq2: false,
    };
  },
  watch: {
    toReq(bol) {
      this.toReq2 = bol;
    },
    toReq2(bol) {
      this.$emit("update:toReq", bol);
    },
  },
  methods: {
    getNum(num) {
      this.num = num;
    },
    getCityData(data) {
      this.provinceEnName = data.provinceEnName;
      this.provinceCnName = data.provinceCnName;
    },
    getAreaData(data) {
      this.cityName = data.cityName;
    },
  },
};
</script>

<style lang="scss" scoped>
.item-tab {
  width: 100%;
  height: 54px;
}
</style>
