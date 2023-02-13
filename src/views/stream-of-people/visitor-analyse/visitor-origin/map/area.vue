<template>
  <div class="cl-area">
    <div id="map">
      <el-button icon="el-icon-back" size="mini" @click="handleGoBack()">
        返回
      </el-button>
      <div :id="id" class="area-chart"></div>
    </div>
    <div id="chart">
      <div style="text-align: center">区级分布</div>
      <div id="my-chart"></div>
    </div>
  </div>
</template>

<script>
import { cityMap } from "./dataJson/area/china-main-city-map.js";
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
  },
  data() {
    return {
      id: "echarts_" + new Date().getTime() + Math.floor(Math.random() * 1000),
      echartObj: null,
      dataList: [],
    };
  },
  mounted() {
    this.handleInitMap();
    this.handleResize();
    this.handleInitChart();
  },
  methods: {
    handleInitMap() {
      let cityJSON = require("./dataJson/area/" +
        cityMap[this.cityName] +
        ".json");
      this.dataList = cityJSON.features.map((item) => {
        return {
          name: item.properties.name,
          value: Math.ceil(Math.random() * 1000 - 1),
        };
      });
      this.echartObj = this.$echarts.init(document.getElementById(this.id));
      this.$echarts.registerMap(this.cityName, cityJSON);

      let option = {
        title: {
          text: this.cityName,
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
          max: 1000,
          left: "center",
          top: "bottom",
          text: ["2k", "0"], // 取值范围的文字
          inRange: {
            color: ["#c4eaff", "#0151b4"], // 取值范围的颜色
          },
          show: true, // 图注
          orient: "horizontal", // 水平放置
        },
        geo: {
          map: this.cityName,
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
            data: this.dataList,
          },
        ],
      };
      this.echartObj.setOption(option);
    },
    handleInitChart() {
      let myChart = this.$echarts.init(document.getElementById("my-chart"));
      let option = {
        tooltip: {
          formatter: function (params) {
            return params.name + "<br />" + "人数：" + params.value;
          },
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
          data: this.handleSort(this.dataList)
            .slice(0, 10)
            .map((item) => item.name)
            .reverse(),
        },
        series: [
          {
            data: this.handleSort(this.dataList)
              .slice(0, 10)
              .map((item) => item.value)
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
      myChart.setOption(option);
    },
    handleResize() {
      window.addEventListener("resize", () => {
        if (this.echartObj && this.echartObj.resize) {
          this.echartObj.resize();
        }
      });
    },
    handleGoBack() {
      this.$emit("getNum", 2);
      this.$emit("getData", {
        provinceEnName: this.provinceEnName,
        provinceCnName: this.provinceCnName,
      });
    },
    handleSort(data) {
      for (let i = 0; i < data.length - 1; i += 1) {
        for (let j = 0; j < data.length - 1 - i; j += 1) {
          if (data[j].value < data[j + 1].value) {
            const temp = data[j].value;
            data[j].value = data[j + 1].value;
            data[j + 1].value = temp;
          }
        }
      }
      return data;
    },
  },
};
</script>

<style lang="scss">
.area-chart {
  height: 400px;
  width: 600px;
  margin: auto;
}
.cl-area {
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
