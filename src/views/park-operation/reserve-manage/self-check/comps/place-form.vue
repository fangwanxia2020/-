<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="100px">
    <el-row>
      <el-form-item label="省市区: " prop="area">
        <el-cascader
          v-if="!isCheck"
          v-model="form.area"
          :options="options"
          :props="{ expandTrigger: 'hover' }"
          placeholder="请选择省市区"
          clearable
          style="width: 100%"
        ></el-cascader>
        <span v-else> {{ province }}{{ city }}{{ county }} </span>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item label="详细地址: " prop="address">
        <el-input
          v-if="!isCheck"
          v-model="form.address"
          type="textarea"
          maxlength="100"
          show-word-limit
          placeholder="请输入详细地址"
          clearable
        ></el-input>
        <span v-else> {{ form.address }} </span>
      </el-form-item>
    </el-row>
  </el-form>
</template>

// 地点-信息

<script>
import { regionData, CodeToText } from "element-china-area-data";
export default {
  inject: ["isCheck"],
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      form: { ...this.formData },
      rules: {
        area: [{ required: true, message: "请选择省市区", trigger: "change" }],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
      },
      options: regionData,
      province: "",
      city: "",
      county: "",
    };
  },
  watch: {
    formData: {
      handler(val) {
        this.form = { ...val };
        console.log(this.form, "123");
        this.province = CodeToText[this.form.area[0]];
        this.city = CodeToText[this.form.area[1]];
        this.county = CodeToText[this.form.area[2]];
        console.log(this.province);
        this.$forceUpdate();
      },
      // 这里是关键，代表递归监听 demo 的变化
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form-item {
  width: 80% !important;
}
.el-form .el-row {
  margin-left: 14px;
}
</style>
