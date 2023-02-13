<template>
  <div class="come-out-comps-auth">
    <el-tabs v-model="tabsActive">
      <el-tab-pane
        v-for="item in tabsList"
        :key="item.code"
        :label="item.name"
        :name="item.code"
        class="content_in"
      ></el-tab-pane>
    </el-tabs>
    <!-- <Comps :tabs-active="tabsActive" /> -->
    <Company v-if="tabsActive == 2" :tabs-active="tabsActive" />
    <Person v-if="tabsActive == 1" :tabs-active="tabsActive" />
    <Car v-if="tabsActive == 3" :tabs-active="tabsActive" />
    <Contractors v-if="tabsActive == 4" :tabs-active="tabsActive" />
  </div>
</template>

<script>
// import Comps from "./comps-auth/index.vue";
import tabActive from "@/mixin/tab-active.js";
import Company from "./comps-auth/company.vue";
import Person from "./comps-auth/person.vue";
import Car from "./comps-auth/car.vue";
import Contractors from "./comps-auth/contractors.vue";
export default {
  // components: { Comps },
  components: { Company, Person, Car, Contractors },
  mixins: [tabActive],
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
.come-out-comps-auth {
  .cl-jump {
    color: #026dff;
    cursor: pointer;
  }
  .cl-circle {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
}
</style>

<style lang="scss" scoped>
.el-tabs {
  padding: 0 30px;
}
</style>
