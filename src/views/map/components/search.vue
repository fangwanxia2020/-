<template>
  <div class="search">
    <el-input
      v-model="input"
      placeholder="输入人员/车牌号/设备名称查询"
      class="input"
      size="small"
    >
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="searchVal"
      ></el-button>
    </el-input>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: "",
    };
  },
  methods: {
    searchVal() {
      if (this.input) {
        this.$emit("searchVal", this.input);
      } else {
        this.$message.error("请输入内容");
      }
    },
  },
};
</script>

<style scoped>
.search {
  position: fixed;
  z-index: 99999;
  top: 75px;
  left: 20px;
  width: 280px;
}
</style>
