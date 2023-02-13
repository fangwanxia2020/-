<template>
  <div class="cl-item-content">
    <div class="item-tab">
      <el-radio-group v-model="tabPos" size="mini">
        <el-radio-button label="1">今日</el-radio-button>
        <el-radio-button label="4" class="cl_hide_input">
          自定义
          <el-date-picker
            v-model="tabDate"
            type="date"
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
    <div v-if="showTips" class="cl-null-tips">暂无数据</div>
    <div v-else id="my-chart"></div>
  </div>
</template>

<script>
import { visitTimeCount } from "@/api/stream-of-people/visitor-analyse.js";
export default {
  props: {
    carTypeId: {
      type: String,
      default: "",
    },
    orgId: {
      type: Array,
      default: () => [],
    },
    toReq: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tabPos: "1",
      tabDate: "",
      echartObj: null,
      showTips: true,
    };
  },
  computed: {
    moreWat() {
      let { tabPos, tabDate } = this;
      return { tabPos, tabDate };
    },
  },
  watch: {
    tabPos(val) {
      this.showTips = true;
      if (this.echartObj) this.echartObj.dispose(); // 销毁echarts图
      if (val == 1) this.getData();
    },
    moreWat(obj) {
      this.showTips = true;
      if (this.echartObj) this.echartObj.dispose(); // 销毁echarts图
      if (obj.tabPos == 4 && obj.tabDate) this.getData();
    },
    toReq(bol) {
      if (bol) {
        this.getData();
        this.$emit("update:toReq", false);
      }
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      let params = {
        countType: this.$route.name == "visitor-analyse" ? 0 : 1, // 类型（0-访客，1-车辆）
        dateType: this.tabPos, // 1=今日，2=本周，3=本月，4=自定义
      };
      if (this.tabPos == 4 && this.tabDate) {
        params.startTime = this.tabDate + " 00:00:00"; // 自定义开始时间
        params.endTime = this.tabDate + " 23:59:59"; // 自定义结束时间
      }
      if (this.orgId.length) params.visitOrgId = this.orgId; // 访问单位id
      if (this.carTypeId && this.$route.name == "car-analyse") {
        params.vehicleTypeId = this.carTypeId; // 车辆类型id
      }
      visitTimeCount(params).then((res) => {
        if (res.data.length) {
          this.showTips = false;
          setTimeout(() => {
            this.handleInitChart(res.data);
            this.handleResize();
          }, 100);
        }
      });
    },
    handleInitChart(arr) {
      this.echartObj = this.$echarts.init(document.getElementById("my-chart"));
      let option = {
        xAxis: {
          type: "category",
          data: arr.map((item) => item.time),
          axisLabel: {
            rotate: 45, //值>0向右倾斜，值<0则向左倾斜
          },
        },
        yAxis: {
          type: "value",
        },
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            return (
              params.name +
              "：" +
              "<span style='font-weight: bold'>" +
              params.value +
              "</span>"
            );
          },
        },
        series: [
          {
            data: arr.map((item) => item.count),
            type: "line",
            smooth: true,
            itemStyle: {
              color: "#739ffa",
            },
            barWidth: "20px",
            markPoint: {
              data: [{ type: "max", name: "Max" }],
            },
          },
        ],
      };
      this.echartObj.setOption(option);
    },
    handleResize() {
      window.addEventListener("resize", () => {
        if (this.echartObj && this.echartObj.resize) {
          this.echartObj.resize();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
#my-chart {
  width: 100%;
  height: 450px;
}
</style>
