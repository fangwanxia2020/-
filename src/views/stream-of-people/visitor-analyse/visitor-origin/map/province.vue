<template>
  <div class="cl-province">
    <div id="map"></div>
    <div id="chart">
      <div v-if="resData.length" style="text-align: center">省份排行top10</div>
      <div id="my-chart"></div>
    </div>
  </div>
</template>

<script>
const chinaJson = require("./dataJson/china.json");
import {
  sourceCount,
  vehicleSourceCount,
} from "@/api/stream-of-people/visitor-analyse.js";
export default {
  props: {
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
      dataList: [
        { name: "南海诸岛" },
        { ename: "beijing", name: "北京" },
        { ename: "tianjin", name: "天津" },
        { ename: "shanghai", name: "上海" },
        { ename: "chongqing", name: "重庆" },
        { ename: "hebei", name: "河北" },
        { ename: "henan", name: "河南" },
        { ename: "yunnan", name: "云南" },
        { ename: "liaoning", name: "辽宁" },
        { ename: "heilongjiang", name: "黑龙江" },
        { ename: "hunan", name: "湖南" },
        { ename: "anhui", name: "安徽" },
        { ename: "shandong", name: "山东" },
        { ename: "xinjiang", name: "新疆" },
        { ename: "jiangsu", name: "江苏" },
        { ename: "zhejiang", name: "浙江" },
        { ename: "jiangxi", name: "江西" },
        { ename: "hubei", name: "湖北" },
        { ename: "guangxi", name: "广西" },
        { ename: "gansu", name: "甘肃" },
        { ename: "shanxi", name: "山西" },
        { ename: "neimenggu", name: "内蒙古" },
        { ename: "shanxi1", name: "陕西" },
        { ename: "jilin", name: "吉林" },
        { ename: "fujian", name: "福建" },
        { ename: "guizhou", name: "贵州" },
        { ename: "guangdong", name: "广东" },
        { ename: "qinghai", name: "青海" },
        { ename: "xizang", name: "西藏" },
        { ename: "sichuan", name: "四川" },
        { ename: "ningxia", name: "宁夏" },
        { ename: "hainan", name: "海南" },
        { ename: "taiwan", name: "台湾" },
        { ename: "xianggang", name: "香港" },
        { ename: "aomen", name: "澳门" },
      ],
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
      let params = {
        areaType: 1, // 区域类型（1-省，2-市，3-区县）
        dateType: this.tabPos, // 1-今日，2-本周，3-本月，4-自定义
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
        this.handleInitMap(res.data);
        if (res.data.length) this.handleInitChart(res.data);
        this.handleResize();
      });
    },
    handleInitMap(arr) {
      this.dataList.forEach((ditem) => {
        this.$set(ditem, "value", 0);
        arr.forEach((ritem) => {
          if (ditem.name == ritem.name) this.$set(ditem, "value", ritem.count);
        });
      });
      this.echartMap = this.$echarts.init(document.getElementById("map"));
      this.$echarts.registerMap("china", chinaJson);

      let option = {
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
          map: "china", // 引入地图数据
          roam: false, // 不开启缩放和平移
          zoom: 1, // 视角缩放比例
          label: {
            normal: {
              show: true,
              fontSize: "10",
              color: "rgba(0,0,0,0.7)",
            },
          },
          itemStyle: {
            normal: {
              borderColor: "rgba(0, 0, 0, 0.2)",
            },
            emphasis: {
              // 高亮的显示设置
              areaColor: "skyblue", // 鼠标选择区域颜色
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20,
              borderWidth: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
        // 鼠标悬浮提示框
        series: [
          {
            type: "map",
            geoIndex: 0,
            data: this.dataList,
          },
        ],
      };
      this.echartMap.setOption(option);

      let _this = this;
      this.echartMap.on("click", function (params) {
        if (!params.data.ename) {
          return;
        }
        _this.$emit("getNum", 2);
        _this.$emit("getData", {
          provinceEnName: params.data.ename,
          provinceCnName: params.name,
        });
      });
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
  },
};
</script>

<style lang="scss" scoped>
.cl-province {
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
