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
    <div v-if="showTips" class="cl-null-tips">暂无数据</div>
    <div v-else id="my-chart"></div>
  </div>
</template>

<script>
import { reasonCount } from "@/api/stream-of-people/visitor-analyse.js";
export default {
  props: {
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
      tabDate: [],
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
      if (val == 1 || val == 2 || val == 3) this.getData();
    },
    moreWat(obj) {
      if (obj.tabPos == 4 && obj.tabDate.length) this.getData();
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
        dateType: this.tabPos, // 1=今日，2=本周，3=本月，4=自定义
      };
      if (this.tabPos == 4 && this.tabDate.length) {
        params.startTime = this.tabDate[0] + " 00:00:00"; //自定义开始时间
        params.endTime = this.tabDate[1] + " 23:59:59"; //自定义结束时间
      }
      if (this.orgId.length) params.visitOrgId = this.orgId; //访问单位id
      reasonCount(params).then((res) => {
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
      let data = arr.map((item) => {
        return { value: item.count, name: item.name };
      });
      this.echartObj = this.$echarts.init(document.getElementById("my-chart"));
      let option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "horizontal",
          left: "center",
          top: "bottom",
        },
        series: [
          {
            type: "pie",
            radius: "50%",
            data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            hoverAnimation: false,
            label: {
              formatter: function (params) {
                return params.value;
              },
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
