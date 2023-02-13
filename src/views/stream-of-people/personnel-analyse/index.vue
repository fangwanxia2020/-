<template>
  <div class="area-analyse">
    <div ref="searchForm" class="search-content">
      <el-form
        class="search-content-form"
        :model="searchForm"
        label-width="110px"
      >
        <el-form-item label="区域">
          <el-select
            v-model="searchForm.areaId"
            placeholder="全部"
            clearable
            size="small"
            style="width: 100%"
          >
            <el-option
              v-for="dict in areaList"
              :key="dict.id"
              :label="dict.name"
              :value="dict.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="卡口">
          <el-select
            v-model="searchForm.gatewayId"
            placeholder="全部"
            clearable
            size="small"
            style="width: 100%"
          >
            <el-option
              v-for="dict in bayonetList"
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
      <h3 ref="title" class="body-content-title">人员入园趋势</h3>
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
import { bayonetList } from "@/api/infrastructure/access-control-equipment.js";
import { getAreaList } from "@/api/park-planning/area.js";
import {
  getPersonNowCount,
  getPersonWeekCount,
  getPersonMonthCount,
  getPersonCustomCount,
} from "@/api/flow-analysis/index.js";

export default {
  components: {},
  data() {
    return {
      bayonetList: [],
      areaList: [],
      searchForm: {
        areaId: null,
        gatewayId: null,
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
    this.getBayonetList();
    this.getAreaList();
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
    // 卡口下拉
    getBayonetList() {
      let params = {
        order: "updateTime",
        sort: "DESC",
        pageNum: 1,
        pageSize: 9999999,
        query: [],
      };
      bayonetList(params).then((res) => {
        this.bayonetList = res.data.list;
      });
    },
    //区域
    getAreaList() {
      let resParams = {
        order: "createTime",
        sort: "DESC",
        pageNum: 1,
        pageSize: 9999999,
        query: {},
        expr: [],
      };
      getAreaList(resParams).then((res) => {
        this.areaList = res.data.list;
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
      let fn = getPersonNowCount;
      if (this.tabPos == "today") {
        fn = getPersonNowCount;
      } else if (this.tabPos == "toweek") {
        fn = getPersonWeekCount;
      } else if (this.tabPos == "tomonth") {
        fn = getPersonMonthCount;
      } else if (this.tabPos == "custom") {
        fn = getPersonCustomCount;
      }
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
          let seriesItem = data[i].visitorNum;
          this.seriesList.push(seriesItem);
          let seriesItem1 = data[i].filingNum;
          this.seriesList1.push(seriesItem1);
          let seriesItem2 = data[i].sealedNum;
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
            name: "访客",
            type: "line",
            showSymbol: false,
            data: this.seriesList,
            markPoint: {
              data: [
                { type: "max", name: "Max" },
                { type: "min", name: "Min" },
              ],
              label: {
                color: "#fff",
              },
            },
          },
          {
            name: "外来承包商",
            type: "line",
            showSymbol: false,
            data: this.seriesList1,
            markPoint: {
              data: [
                { type: "max", name: "Max" },
                { type: "min", name: "Min" },
              ],
              label: {
                color: "#fff",
              },
            },
          },
          {
            name: "辖区员工",
            type: "line",
            showSymbol: false,
            data: this.seriesList2,
            markPoint: {
              data: [
                { type: "max", name: "Max" },
                { type: "min", name: "Min" },
              ],
              label: {
                color: "#fff",
              },
            },
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
      this.searchForm.areaId = null;
      this.searchForm.gatewayId = null;
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
</style>
