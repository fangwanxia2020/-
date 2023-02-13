<template>
  <div class="area-analyse">
    <div class="box">
      <div v-for="(item, index) in videoList" :key="index" class="box-item">
        <div class="img-box">
          <div class="img-box-right">
            <div class="img-box-right-box">
              <img class="item-img" :src="item.url" alt="" />
            </div>
          </div>
          <div class="img-box-left">
            <div class="img-box-left-t">{{ item.name }}</div>
            <div class="img-box-left-b">{{ item.num }}</div>
          </div>
        </div>
      </div>
    </div>
    <div ref="searchForm" class="search-content">
      <el-form
        class="search-content-form"
        :model="searchForm"
        label-width="110px"
      >
        <el-form-item label="单位/承包商: ">
          <el-input
            v-model="searchForm.orgName"
            placeholder="请输入"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item label="车辆种类">
          <el-select
            v-model="searchForm.typeId"
            placeholder="全部"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in carTypeList"
              :key="dict.id"
              :label="dict.name"
              :value="dict.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item> </el-form-item>
      </el-form>
      <div class="search-content-button">
        <el-button type="primary" @click="handleSearch"> 查询 </el-button>
        <el-button
          plain
          class="search-content-button__reset"
          @click="handleReset"
        >
          重置
        </el-button>
      </div>
    </div>
    <div class="body-content">
      <h3 ref="title" class="body-content-title">车辆进出分析</h3>
      <div class="body-content-select">
        <el-radio-group
          v-model="tabPos"
          size="mini"
          @input="radioGroupChange1"
          @change="radioGroupChange($event)"
        >
          <el-radio-button label="today">今日</el-radio-button>
          <el-radio-button label="toweek">本周</el-radio-button>
          <el-radio-button label="tomonth">本月</el-radio-button>
          <el-radio-button
            label="custom"
            @click.native.prevent="radioGroupChange2"
            >自定义
          </el-radio-button>
        </el-radio-group>
        <div class="body-content-select-timer">
          <el-date-picker
            ref="timePick"
            v-model="tabDate"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="body-content-chart" :style="{ height: echartHeight }">
        <div ref="chart" class="echart"></div>
      </div>
    </div>
  </div>
</template>

<script>
import top1 from "../../../assets/images/fileIcon/p1.png";
import top2 from "../../../assets/images/fileIcon/p2.png";
import top3 from "../../../assets/images/fileIcon/p3.png";
import top4 from "../../../assets/images/fileIcon/p4.png";

import {
  getPerVehicleAccessTimeNowCount,
  getPerVehicleAccessTimeWeekCount,
  getPerVehicleAccessTimeMonthCount,
  getPerVehicleAccessTimeCustomCount,
  getVehicleInOut4TypeCout,
} from "@/api/flow-analysis/index.js";
import { getCarKindList } from "@/api/access-control-permission/organization-control.js";
const handlerPhone = function (newValue) {
  return newValue.toLocaleString();
};
export default {
  components: {},
  data() {
    return {
      carTypeList: [],
      searchForm: {
        orgName: "",
        typeId: null,
        beginTime: "",
        endTime: "",
      },
      tabDate: "",
      tabPos: "today",
      checkedTag: [],
      chart: null,
      echartHeight: 0,
      xList: [],
      seriesList: [],
      seriesList1: [],
      seriesList2: [],
      videoList: [
        {
          num: 0,
          url: top1,
          name: "车辆总数（辆）",
        },
        { num: 0, url: top2, name: "今日园内车数（辆）" },
        { num: 0, url: top3, name: "今日实时车数（辆）" },
        { num: 0, url: top4, name: "今日来访车数（辆)" },
      ],
    };
  },
  watch: {
    tabDate(timeRang) {
      if (timeRang && timeRang.length > 0) {
        this.searchForm.beginTime = timeRang[0];
        this.searchForm.endTime = timeRang[1];
        this.getDetail();
      }
      console.log(timeRang);
    },
  },
  created() {
    this.getPeopleCountAll();
    this.getCarKindList();
    this.getDetail();
  },
  mounted() {
    this.$nextTick(() => {
      const height =
        this.$refs.searchForm.clientHeight + this.$refs.title.offsetHeight + 55;
      this.echartHeight = `calc(100% - ${height}px)`;
      setTimeout(() => {}, 300);
      window.addEventListener("resize", this.resize);
    });
  },
  methods: {
    getPeopleCountAll() {
      getVehicleInOut4TypeCout().then((res) => {
        console.log(res, "hghg个个给华哥");
        let totalNum = res.data.totalNum;
        let todayNum = res.data.todayNum;
        let todayLiveNum = res.data.todayLiveNum;
        let todayVisitNum = res.data.todayVisitNum;
        this.videoList[0].num = handlerPhone(totalNum);
        this.videoList[1].num = handlerPhone(todayNum);
        this.videoList[2].num = handlerPhone(todayLiveNum);
        this.videoList[3].num = handlerPhone(todayVisitNum);
        console.log(this.videoList);
      });
    },
    // 车辆种类列表，直接传进去
    getCarKindList() {
      getCarKindList({}).then((res) => {
        console.log(res, "ggjgjjh");
        this.carTypeList = res.data;
      });
    },
    //日期切换
    radioGroupChange(e, row) {
      console.log(e, row);
      if (e != "custom") {
        this.searchForm.beginTime = "";
        this.searchForm.endTime = "";
        this.tabDate = "";
        this.getDetail();
      }
    },
    radioGroupChange1(e) {
      console.log(e);
    },
    radioGroupChange2() {
      this.tabPos = "custom";
      this.$refs.timePick.reference.children[1].focus();
    },
    getDetail() {
      console.log(this.searchForm);
      let fn = getPerVehicleAccessTimeNowCount;
      if (this.tabPos == "today") {
        fn = getPerVehicleAccessTimeNowCount;
      } else if (this.tabPos == "toweek") {
        fn = getPerVehicleAccessTimeWeekCount;
      } else if (this.tabPos == "tomonth") {
        fn = getPerVehicleAccessTimeMonthCount;
      } else if (this.tabPos == "custom") {
        fn = getPerVehicleAccessTimeCustomCount;
      }
      this.searchForm.accType = 2;
      fn(this.searchForm).then((res) => {
        console.log(res.data, "太尴尬加个价格");
        this.xList = [];
        this.seriesList = [];
        this.seriesList1 = [];
        this.seriesList2 = [];
        let data = res.data;
        for (let i = 0; i < data.length; i++) {
          let daysList = data[i].time;
          this.xList.push(daysList);
          let seriesItem = data[i].inNum;
          this.seriesList.push(seriesItem);
          let seriesItem1 = data[i].outNum;
          this.seriesList1.push(seriesItem1);
          let seriesItem2 = data[i].insideNum;
          this.seriesList2.push(seriesItem2);
        }
        this.drawLine();
      });
    },
    drawLine() {
      this.chart && this.$echarts.dispose(this.chart);
      // 基于准备好的dom，初始化echarts实例
      this.chart = this.$echarts.init(this.$refs.chart);
      // 绘制图表
      const chartOption = {
        color: ["#80b2df", "#f19d63", "#bababa"],
        legend: {
          icon: "rect",
          top: "3%",
          left: "center",
          itemWidth: 25,
          itemHeight: 4,
          itemGap: 10,
        },
        tooltip: {
          show: true,
          trigger: "axis",
        },
        grid: {
          left: "4%",
          right: 0,
        },
        xAxis: {
          type: "category",
          data: this.xList,
          axisTick: {
            //y轴刻度线
            show: false,
          },
          axisLine: {
            //轴线
            show: true,
            lineStyle: {
              color: "#eee",
            },
          },
          axisLabel: {
            //轴上的字 字体、样式
            textStyle: {
              color: "#000",
              fontSize: "10",
              itemSize: "",
            },
          },
        },
        yAxis: {
          type: "value",
          axisTick: {
            //y轴刻度线
            show: false,
          },
          splitLine: {
            //网格线
            show: true,
          },
          axisLine: {
            //轴线
            show: false,
            lineStyle: {
              color: "#576a8f",
            },
          },
          axisLabel: {
            //轴上的字 字体、样式
            textStyle: {
              color: "#000",
              fontSize: "10",
              itemSize: "",
            },
          },
        },
        series: [
          {
            name: "入园车流量",
            type: "line",
            showSymbol: false,
            data: this.seriesList,
          },
          {
            name: "出园车流量",
            type: "line",
            showSymbol: false,
            data: this.seriesList1,
          },
          {
            name: "园内车辆",
            type: "line",
            showSymbol: false,
            data: this.seriesList2,
          },
        ],
      };
      console.log(chartOption);
      this.chart.setOption(chartOption, true);
    },
    // resize
    resize() {
      this.chart && this.chart.resize();
    },
    // 查询
    handleSearch() {
      this.getDetail();
    },
    // 重置
    handleReset() {
      this.searchForm.orgName = "";
      this.searchForm.typeId = null;
      this.getDetail();
    },
  },
};
</script>

<style lang="scss" scoped>
.area-analyse {
  height: 100%;
  padding: 15px 30px 20px;
  display: flex;
  flex-direction: column;
  .search-content {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgba(211, 219, 234, 0.5) !important;
    ::v-deep {
      .el-button {
        height: 36px;
        width: 100px;
        padding: 0;
      }
      .el-select {
        width: 100%;
      }
      .el-form-item {
        margin-bottom: 9px;
        flex: 33.3% 1 0;
      }
      .el-form-item__label {
        color: #909399;
      }
    }
    &-form {
      display: flex;
      flex: 1;
    }
    &-button {
      margin-left: 20px;
      &__reset {
        color: #026dff;
        border: 1px solid #026dff;
        &:hover {
          background-color: #e6f0ff !important;
        }
      }
    }
  }
  .body-content {
    flex: 1;
    &-title {
      text-align: center;
    }
    &-setting,
    &-select {
      display: flex;
      justify-content: flex-end;
    }
    &-select {
      position: relative;
      &-timer {
        position: absolute;
        right: 0;
        z-index: -10;
      }
    }
    &-setting {
      margin-bottom: 15px;
    }
    &-chart {
      height: 300px;
      .echart {
        height: 100%;
      }
    }
  }
  .setting {
    &-top {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px 0px;
      &-select {
        margin: 0px 10px;
      }
    }
  }
  ::v-deep {
    .el-date-editor {
      opacity: 0;
    }
    .el-tabs__nav-wrap::after {
      background-color: transparent;
    }
    .el-tag {
      margin: 0 10px 10px 0;
    }
  }
}
.box {
  padding: 0px 10px;
  display: flex;
  flex-flow: wrap;
  background: #fff;
  justify-content: flex-start;
}
.box-item {
  width: calc(25% - 15px);
  height: 150px;
  text-align: center;
  background: #f5f5f5;
  margin-bottom: 40px;
  margin-right: 20px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid #eee;
  box-shadow: 2px 2px 1px #eee;
  .img-box {
    width: 100%;
    height: 150px;
    display: flex;
    flex-flow: wrap;
    align-items: center;
    .img-box-left {
      flex: 2;
      text-align: left;
      margin-left: 30px;
      .img-box-left-t {
        color: #666666;
        margin-bottom: 10px;
      }
      .img-box-left-b {
        color: #000;
        margin-top: 10px;
        font-size: 30px;
        font-weight: bold;
      }
    }
    .img-box-right {
      flex: 1;
      margin-left: 20px;
      .img-box-right-box {
        display: flex;
        align-items: center;
        width: 80px;
        height: 80px;
        .item-img {
          width: 80px;
          height: 80px;
        }
      }
    }
  }
}
.box-item:nth-child(4n) {
  margin-right: 0px;
}
</style>
