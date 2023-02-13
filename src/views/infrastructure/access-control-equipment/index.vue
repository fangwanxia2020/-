<template>
  <div>
    <el-tabs v-model="tabsActive">
      <el-tab-pane
        v-for="item in tabsList"
        :key="item.code"
        :label="item.name"
        :name="item.code"
        class="content_in"
      ></el-tab-pane>
    </el-tabs>
    <Pass v-if="tabsActive == 1" />
    <PersonLock v-if="tabsActive == 2" />
    <CarLock v-if="tabsActive == 3" />
  </div>
</template>

<script>
import Pass from "./pass/index.vue";
import PersonLock from "./person-lock/index.vue";
import CarLock from "./car-lock/index.vue";
import tabActive from "@/mixin/tab-active.js";
export default {
  components: { Pass, PersonLock, CarLock },
  mixins: [tabActive],
  data() {
    return {
      tabsList: [
        { code: "1", name: "通道" },
        { code: "2", name: "人闸" },
        { code: "3", name: "车闸" },
      ],
      tabsActive: "1",
    };
  },
  provide() {
    return {
      tabsActive: () => this.tabsActive,
    };
  },
};
</script>

<style lang="scss" scoped>
.el-tabs {
  padding: 0 30px;
}
</style>
