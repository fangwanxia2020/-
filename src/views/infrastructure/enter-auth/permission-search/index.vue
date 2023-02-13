<template>
  <div>
    <el-tabs v-model="tabsActive">
      <el-tab-pane
        v-for="item in tabsList"
        :key="item.code"
        :label="item.name"
        :name="item.code"
      ></el-tab-pane>
    </el-tabs>
    <Company v-if="tabsActive == 2" :fu-tabs="tabsActive" />
    <Person v-if="tabsActive == 1" :fu-tabs="tabsActive" />
    <Car v-if="tabsActive == 3" :fu-tabs="tabsActive" />
    <Contractors v-if="tabsActive == 4" :fu-tabs="tabsActive" />
  </div>
</template>

<script>
import Company from "./comps-auth/company.vue";
import Person from "./comps-auth/person.vue";
import Car from "./comps-auth/car.vue";
import Contractors from "./comps-auth/contractors.vue";
export default {
  components: { Company, Person, Car, Contractors },
  data() {
    return {
      tabsList: [
        { code: "2", name: "单位权限" },
        { code: "1", name: "人员权限" },
        { code: "3", name: "车辆权限" },
        { code: "4", name: "承包商权限" },
      ],
      tabsActive: "2",
    };
  },
};
</script>

<style lang="scss">
.permission-search-comps-auth {
  display: flex;
  .cl-circle {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  .left-box {
    height: 100%;
    width: 280px;
    padding: 5px;
    margin-left: 30px;
    // margin-right: 20px;
    background-color: #f6f7f9;
    .cl-search {
      margin-bottom: 10px;
    }
    .all-list {
      overflow-y: auto;
      @include scrollBar;
      max-height: calc(100% - 50px);
      font-size: 14px;
      .list-item {
        width: 100%;
        padding: 10px;
        background-color: #fff;
        border-radius: 5px;
        margin-bottom: 10px;
        .fl-title {
          border-bottom: 2px solid #f6f7f9;
          padding-bottom: 10px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          h4 {
            margin: 0;
          }
          .el-radio {
            display: flex;
            flex-direction: row-reverse;
            margin: 0;
          }
        }
        .fl-label {
          margin: 0;
          line-height: 1.5;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          label {
            font-weight: 400;
            color: #909399;
            display: inline-block;
            width: 70px;
            text-align: right;
          }
        }
        &:last-child {
          margin-bottom: 0px;
        }
      }
    }
  }
  .list-page {
    width: calc(100% - 310px);
  }
  .cl-jump {
    color: #026dff;
    cursor: pointer;
  }
}
</style>

<style lang="scss" scoped>
.el-tabs {
  padding: 0 30px;
}
</style>
