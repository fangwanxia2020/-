<template>
  <!-- $store.state.settings.tagsView -->
  <el-header v-if="!$store.state.settings.tagsView" class="titleHeader">
    <el-page-header :content="title" @back="back"> </el-page-header>
  </el-header>
  <el-header v-else>
    <div class="detail_title">{{ title }}</div>
  </el-header>
</template>

<script>
import store from "@/store";
export default {
  name: "page-title",
  props: {
    title: {
      type: String,
    },
    // isShowBack:{
    //   type: Boolean,
    //   default: store.state.settings.tagsView
    // }
  },
  methods: {
    back() {
      this.$emit("back");
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.el-page-header__content {
  font-size: 18px !important;
  color: #303133 !important;
  font-weight: 500 !important;
}
</style>
