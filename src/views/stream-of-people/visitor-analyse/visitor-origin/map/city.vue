<template>
  <div class="cl-city">
    <div id="map">
      <el-button icon="el-icon-back" size="mini" @click="handleGoBack()">
        返回
      </el-button>
      <div :id="id" class="city-chart"></div>
    </div>
    <div id="chart">
      <div v-if="resData.length" style="text-align: center">地级市top10</div>
      <div id="my-chart"></div>
    </div>
  </div>
</template>

<script>
import {
  sourceCount,
  vehicleSourceCount,
} from "@/api/stream-of-people/visitor-analyse.js";
export default {
  props: {
    provinceEnName: {
      type: String,
      default: "",
    },
    provinceCnName: {
      type: String,
      default: "",
    },
    cityName: {
      type: String,
      default: "",
    },
    tabPos: {
      type: String,
      default: "",
    },
    tabDate: {
      type: Array,
      default: () => [],
    },
    orgId: {
      type: Array,
      default: () => [],
    },
    toReq2: {
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
      id: "echarts_" + new Date().getTime() + Math.floor(Math.random() * 1000),
      echartMap: null,
      echartLine: null,
      resData: [],
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
      this.resData = [];
      if (this.echartMap) this.echartMap.dispose(); // 销毁echarts图
      if (this.echartLine) this.echartLine.dispose(); // 销毁echarts图
      if (val == 1 || val == 2 || val == 3) this.getData();
    },
    moreWat(obj) {
      if (obj.tabPos == 4 && obj.tabDate.length) this.getData();
    },
    toReq2(bol) {
      if (bol) {
        this.getData();
        this.$emit("update:toReq2", false);
      }
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      let provinceJSON = require("./dataJson/province/" + this.provinceEnName);
      let params = {
        areaType: 2, // 区域类型（1-省，2-市，3-区县）
        dateType: this.tabPos, // 1-今日，2-本周，3-本月，4-自定义
        areaDto:
          this.$route.name == "visitor-analyse"
            ? provinceJSON.features.map((item) => {
                return {
                  areaCode: item.properties.adcode,
                  areaName: item.properties.name,
                };
              })
            : [{ areaName: this.provinceCnName }],
      };
      if (this.tabPos == 4 && this.tabDate.length) {
        params.startTime = this.tabDate[0] + " 00:00:00"; // 自定义开始时间
        params.endTime = this.tabDate[1] + " 23:59:59"; // 自定义结束时间
      }
      if (this.orgId.length) params.visitOrgId = this.orgId; // 访问单位id
      if (this.carTypeId && this.$route.name == "car-analyse") {
        params.vehicleTypeId = this.carTypeId; // 车辆类型id
      }
      let reqApi =
        this.$route.name == "visitor-analyse"
          ? sourceCount
          : vehicleSourceCount;
      reqApi(params).then((res) => {
        this.resData = res.data;
        this.handleInitMap(res.data, provinceJSON);
        if (res.data.length) this.handleInitChart(res.data);
        this.handleResize();
      });
    },
    handleInitMap(arr, provinceJSON) {
      this.echartMap = this.$echarts.init(document.getElementById(this.id));
      this.$echarts.registerMap(this.provinceCnName, provinceJSON);

      let option = {
        title: {
          text: this.provinceCnName,
          top: "8%",
          left: "8%",
          textStyle: {
            fontSize: 14,
            fontWeight: 300,
            color: "#000",
          },
        },
        tooltip: {
          formatter: function (params) {
            return params.name + "<br />" + "人数：" + params.value;
          },
        },
        visualMap: {
          min: 0,
          max: arr.length ? arr[0].count : 2000,
          left: "center",
          top: "bottom",
          text: [arr.length ? arr[0].count : 2000, "0"], // 取值范围的文字
          inRange: {
            color: ["#c4eaff", "#0151b4"], // 取值范围的颜色
          },
          show: true, // 图注
          orient: "horizontal", // 水平放置
        },
        geo: {
          map: this.provinceCnName,
          roam: false, // 不开启缩放和平移
          zoom: 0.6, // 视角缩放比例
          label: {
            normal: {
              show: true,
              fontSize: 10,
              color: "#000",
            },
            emphasis: {
              show: true,
              color: "blue",
            },
          },
          itemStyle: {
            normal: {
              borderColor: "rgba(0, 0, 0, 0.2)",
            },
            emphasis: {
              areaColor: "skyblue", // 鼠标选择区域颜色
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20,
              borderWidth: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          left: "5%",
          right: "5%",
          top: "5%",
          bottom: "5%",
        },
        series: [
          {
            type: "map",
            geoIndex: 0, // 不可缺少，否则无tooltip 指示效果
            data: arr.map((item) => {
              return {
                name: item.name,
                value: item.count,
              };
            }),
          },
        ],
      };
      this.echartMap.setOption(option);

      // this.echartMap.on("click", (params) => {
      //   this.$emit("getNum", 3);
      //   this.$emit("getData", {
      //     cityName: params.name,
      //   });
      // });
    },
    handleInitChart(arr) {
      this.echartLine = this.$echarts.init(document.getElementById("my-chart"));
      let option = {
        tooltip: {
          formatter: function (params) {
            return params.name + "<br />" + "人数：" + params.value;
          },
        },
        xAxis: {
          type: "value",
          minInterval: 1,
          axisLine: { show: true },
        },
        yAxis: {
          type: "category",
          data: arr
            .slice(0, 10)
            .map((item) => item.name)
            .reverse(),
        },
        series: [
          {
            data: arr
              .slice(0, 10)
              .map((item) => item.count)
              .reverse(),
            type: "bar",
            label: {
              show: true,
              position: "insideLeft",
              color: "#fff",
            },
            itemStyle: {
              color: "#739ffa",
            },
            barWidth: "20px",
          },
        ],
      };
      this.echartLine.setOption(option);
    },
    handleResize() {
      window.addEventListener("resize", () => {
        if (this.echartMap && this.echartMap.resize) {
          this.echartMap.resize();
        }
        if (this.echartLine && this.echartLine.resize) {
          this.echartLine.resize();
        }
      });
    },
    handleGoBack() {
      this.$emit("getNum", 1);
    },
  },
};
</script>

<style lang="scss">
.city-chart {
  height: 400px;
  width: 600px;
  margin: auto;
}
.cl-city {
  #map,
  #chart {
    width: 50%;
    height: 450px;
    float: left;
    #my-chart {
      width: 100%;
      height: 450px;
    }
  }
}
</style>
