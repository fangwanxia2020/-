<template>
  <div class="cl-container">
    <div v-if="theNum" class="cl-num">机具编号: {{ theNum }}</div>
    <div class="cl-code"></div>
    <div class="cl-btn">
      <el-button type="text" @click="handlePrint">点击打印</el-button>
      <el-button type="text" @click="handleDownload">点击下载</el-button>
    </div>
  </div>
</template>

<script>
/**
 * 二维码展示
 * 由于基础数据下的模块都使用到 所以单独出来
 */
import dataMixin from "../../mixin/data";
export default {
  mixins: [dataMixin],
  props: {
    theNum: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      form: {},
    };
  },
  methods: {
    // 打印
    handlePrint() {},
    // 下载
    handleDownload() {
      // document.location.href = xxxx;
    },
  },
};
</script>

<style lang="scss" scoped>
.cl-container {
  .cl-num {
    text-align: center;
    margin-bottom: 20px;
    color: #539afe;
  }
  .cl-code {
    width: 150px;
    height: 150px;
    background-color: deeppink;
    margin: 0 auto;
    margin-bottom: 20px;
  }
  .cl-btn {
    width: 150px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    ::v-deep .el-button {
      color: #539afe;
    }
  }
}
</style>
