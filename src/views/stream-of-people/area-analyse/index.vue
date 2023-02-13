<template>
  <div class="area-analyse">
    <div ref="searchForm" class="search-content">
      <el-form
        ref="form"
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
        <el-form-item label="区域">
          <el-select
            v-model="searchForm.areaManageId"
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
      <h3 ref="title" class="body-content-title">访客来访分析</h3>
      <div class="body-content-setting">
        <el-button type="primary" size="mini" plain @click="setting">
          统计配置
        </el-button>
      </div>
      <div class="body-content-select">
        <el-radio-group v-model="tabPos" size="mini" @change="radioGroupChange">
          <el-radio-button label="today">今日</el-radio-button>
          <el-radio-button label="toweek">本周</el-radio-button>
          <el-radio-button label="tomonth">本月</el-radio-button>
          <el-radio-button label="custom" @click.native="radioButtonClick">
            自定义
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
            @change="customTimeChange"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="body-content-chart" :style="{ height: echartHeight }">
        <div ref="chart" class="echart"></div>
      </div>
    </div>
    <el-dialog
      v-dialogDrag
      title="统计配置"
      width="35%"
      :visible.sync="showSettingDialog"
      @close="closeDialog"
    >
      <div class="setting">
        <div class="setting-top">
          <span>人员工种：</span>
          <div class="setting-top-select">
            <el-select
              v-model="workType"
              placeholder="全部"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in workTypeList"
                :key="dict.id"
                :label="dict.name"
                :value="dict.id"
              />
            </el-select>
          </div>
          <el-button type="primary" size="small" plain @click="addTag">
            添加
          </el-button>
        </div>
        <div class="setting-tag">
          <el-tag
            v-for="tag in checkedTag"
            :key="tag.id"
            closable
            @close="closeTagFun(tag)"
          >
            {{ tag.name }}
          </el-tag>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancelButton" @click="showSettingDialog = false">
          取消
        </el-button>
        <el-button class="confirmButton" type="primary" @click="confirmSetting">
          确定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { bayonetList } from "@/api/infrastructure/access-control-equipment.js";
import { getAreaList } from "@/api/park-planning/area.js";
import {
  saveJobConfig,
  getJobConfig,
  activityAreaAnalysis,
} from "@/api/stream-of-people/index.js";

export default {
  components: {},
  data() {
    return {
      bayonetList: [],
      areaList: [],
      workTypeList: [],
      searchForm: {
        orgName: null,
        areaManageId: null,
        gatewayId: null,
      },
      workType: null,
      tabDate: "",
      tabPos: "today",
      showSettingDialog: false,
      checkedTag: [],
      chart: null,
      echartHeight: 0,
      chartOption: {
        color: ["#80b2df", "#f19d63", "#bababa", "#ffcf3e"],
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
          data: [],
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
        series: [],
      },
    };
  },
  created() {
    this.getBayonetList();
    this.getAreaList();
    this.$getTypeCode("sys_job_type").then((res) => {
      this.workTypeList = res.data;
    });
  },
  mounted() {
    this.$nextTick(() => {
      const height =
        this.$refs.searchForm.clientHeight + this.$refs.title.offsetHeight + 55;
      this.echartHeight = `calc(100% - ${height}px)`;
      setTimeout(() => {
        this.getList();
      }, 300);
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
    // 获取曲线数据
    getList(params) {
      const searchData = {
        areaId: this.searchForm.areaManageId,
        gatewayId: this.searchForm.gatewayId,
        orgName: this.searchForm.orgName,
        ...params,
      };
      activityAreaAnalysis(searchData).then((res) => {
        const seriesData = [];
        let xData = [];
        res.data.forEach((item) => {
          const index = this.workTypeList.findIndex(
            (list) => list.id == item.jobTypeId,
          );
          xData = item.activityAreaDetailVos.map((item) => item.time);
          const yData = item.activityAreaDetailVos.map((item) => item.todayNum);
          seriesData.push({
            name: this.workTypeList[index].name,
            type: "line",
            showSymbol: false,
            data: yData,
          });
        });
        this.chartOption.xAxis.data = xData;
        this.chartOption.series = seriesData;
        this.initECharts();
      });
    },
    //日期切换
    radioGroupChange(e) {
      console.log(e);
      let query;
      if (e == "today") {
        query = {
          timeType: 1,
        };
      } else if (e == "toweek") {
        query = {
          timeType: 2,
          beginTime: this.getDates()[0],
          endTime: this.getDates()[1],
        };
      } else if (e == "tomonth") {
        query = {
          timeType: 2,
          beginTime: this.getMonth()[0],
          endTime: this.getMonth()[1],
        };
      }
      if (e != "custom") {
        this.getList(query);
      }
    },
    //自定义按钮点击事件
    radioButtonClick() {
      this.$refs.timePick.reference.children[1].focus();
    },
    customTimeChange(e) {
      console.log(e);
      let query = {
        timeType: 2,
        beginTime: e[0],
        endTime: e[1],
      };
      this.getList(query);
    },
    //统计设置
    setting() {
      this.showSettingDialog = true;
      getJobConfig().then((res) => {
        this.checkedTag = res.data.map((item) => {
          return {
            id: item.jobTypeId,
            name: item.name,
          };
        });
      });
    },
    //保存配置
    confirmSetting() {
      const postData = this.checkedTag.map((item) => item.id);
      saveJobConfig(postData).then((res) => {
        if (res.code != 200) return this.$message.error(res.msg);
        this.$message.success("保存成功");
        this.showSettingDialog = false;
        this.checkedTag = [];
      });
    },
    //关闭
    closeDialog() {
      this.showSettingDialog = false;
    },
    //移除tag
    closeTagFun(tag) {
      const index = this.checkedTag.findIndex((item) => item.id == tag.id);
      this.checkedTag.splice(index, 1);
    },
    //添加tag
    addTag() {
      if (this.workType) {
        const ids = this.checkedTag.map((item) => item.id);
        if (!ids.includes(this.workType)) {
          const index = this.workTypeList.findIndex(
            (item) => item.id == this.workType,
          );
          this.checkedTag.push(this.workTypeList[index]);
        }
      }
    },
    // 初始化图表
    initECharts() {
      // 销毁
      this.chart && this.$echarts.dispose(this.chart);
      // 基于准备好的dom，初始化echarts实例
      this.chart = this.$echarts.init(this.$refs.chart);
      this.chart.setOption(this.chartOption, true);
    },
    // resize
    resize() {
      this.chart && this.chart.resize();
    },
    // 查询
    handleSearch() {
      let query;
      if (this.tabPos == "today") {
        query = {
          timeType: 1,
        };
      } else if (this.tabPos == "toweek") {
        query = {
          timeType: 2,
          beginTime: this.getDates()[0],
          endTime: this.getDates()[1],
        };
      } else if (this.tabPos == "tomonth") {
        query = {
          timeType: 2,
          beginTime: this.getMonth()[0],
          endTime: this.getMonth()[1],
        };
      }
      this.getList(query);
    },
    // 重置
    handleReset() {
      this.searchForm = {
        orgName: null,
        areaManageId: null,
        gatewayId: null,
      };
      this.tabPos = "today";
      this.getList();
    },
    getDates() {
      const timeStamp = new Date().getTime();
      const currentDay = new Date().getDay();
      const monday = new Date(
        timeStamp - (currentDay - 1) * 60 * 60 * 24 * 1000,
      )
        .toLocaleDateString()
        .replace(/\//g, "-");
      const sunday = new Date(
        timeStamp + (7 - currentDay) * 60 * 60 * 24 * 1000,
      )
        .toLocaleDateString()
        .replace(/\//g, "-");
      return [monday + " 00:00:00", sunday + " 23:59:59"];
    },
    getMonth() {
      let curDate = new Date();
      let y = curDate.getFullYear();
      let m = curDate.getMonth() + 1; //本身就得+1才等于当前月份，然而我要计算下一个月，所以直接+2
      if (m > 12) {
        m = 1;
        y++;
      }
      let monthLastDay = new Date(y, m, 0).getDate();
      const first = y + "-" + (m < 10 ? "0" + m : m) + "-" + "01";
      const end =
        y +
        "-" +
        (m < 10 ? "0" + m : m) +
        "-" +
        (monthLastDay < 10 ? "0" + monthLastDay : monthLastDay);
      return [first + " 00:00:00", end + " 23:59:59"];
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
