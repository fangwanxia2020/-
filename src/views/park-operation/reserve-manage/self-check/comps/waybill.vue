<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="100px">
    <el-row>
      <el-form-item label="运单编号: " prop="waybillCode">
        <el-input
          v-if="!isCheck"
          v-model="form.waybillCode"
          :disabled="false"
          placeholder="运单编号自动生成"
          clearable
        ></el-input>
        <span v-else> {{ form.waybillCode }} </span>
      </el-form-item>
      <el-form-item label="起运日期: " prop="shipmentDate">
        <el-date-picker
          v-if="!isCheck"
          v-model="form.shipmentDate"
          type="date"
          placeholder="请选择起运日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 100%"
        />
        <span v-else> {{ form.shipmentDate }} </span>
      </el-form-item>
      <el-form-item label="城市配送: " prop="shipMethod">
        <el-radio-group v-if="!isCheck" v-model="form.shipMethod">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="2">否</el-radio>
        </el-radio-group>
        <span v-else> {{ form.shipMethod ? "是" : "否" }} </span>
      </el-form-item>
    </el-row>
  </el-form>
</template>

// 运单

<script>
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
        waybillCode: [
          { required: true, message: "请输入运单编号", trigger: "blur" },
        ],
        shipMethod: [
          { required: true, message: "请选择城市配送", trigger: "change" },
        ],
        shipmentDate: [
          { required: true, message: "请选择起运日期", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    formData: {
      handler(val) {
        console.log(val, "哈哈共和国");
        this.form = { ...val };
        console.log(this.form, "哈哈共和国");
        this.$forceUpdate();
      },
      // 这里是关键，代表递归监听 demo 的变化
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form .el-row {
  margin-left: 14px;
}
</style>
