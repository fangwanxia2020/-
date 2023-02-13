<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="cl-hea-title">工作班组</div>
        <div
          v-for="(item, idx) of list"
          :key="idx"
          class="left-content"
          :class="num == idx ? 'selected' : ''"
          @click="handelClick(idx)"
        >
          <span style="float: left">{{ item.lable }}</span>
          <span style="float: right">{{ item.value }}</span>
        </div>
      </el-col>
      <el-col :span="20">
        <el-calendar
          v-model="value"
          :first-day-of-week="7"
          class="calendar_class"
        >
          <template slot="dateCell" slot-scope="{ data }">
            <span> {{ data.day.split("-")[2] }}</span>
            <div
              v-if="
                (data.day.split('-')[2] < 8 && num == 0) ||
                (data.day.split('-')[2] < 8 && num == 1)
              "
              class="groud jia"
            >
              甲班组（白班）
            </div>
            <div
              v-if="
                (data.day.split('-')[2] < 8 && num == 0) ||
                (data.day.split('-')[2] < 8 && num == 2)
              "
              class="groud yi"
            >
              乙班组（晚班）
            </div>
            <div
              v-if="
                (data.day.split('-')[2] < 8 && num == 0) ||
                (data.day.split('-')[2] < 8 && num == 3)
              "
              class="groud bing"
            >
              丙班组（休息）
            </div>
          </template>
        </el-calendar>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      num: 0,
      value: new Date(),
      list: [
        {
          lable: "全部班组",
          value: "94人",
        },
        {
          lable: "甲组",
          value: "18人",
        },
        {
          lable: "乙组",
          value: "28人",
        },
        {
          lable: "丙组",
          value: "13人",
        },
        {
          lable: "丁组",
          value: "22人",
        },
        {
          lable: "茂组",
          value: "13人",
        },
      ],
    };
  },
  methods: {
    handelClick(idx) {
      this.num = idx;
    },
  },
};
</script>
<style lang="scss" scoped>
.left-content {
  margin: 10px 0;
  height: 60px;
  line-height: 60px;
  background-color: #e3e3e3c8;
  border-radius: 8px;
  padding: 0 5px;
}
.selected {
  background-color: #4578fcc8;
}
.groud {
  font-size: 14px;
  margin-bottom: 3px;
}
.jia {
  background-color: #4578fcc8;
}
.yi {
  background-color: #e2a814c8;
}
.bing {
  background-color: #e166dfc8;
}
.calendar_class >>> .el-calendar-table:not(.is-range) td.next {
  /*隐藏下个月的日期*/
  visibility: hidden;
}
.container {
  padding: 15px 30px;
}
</style>