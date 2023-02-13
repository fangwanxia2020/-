<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="100px">
    <el-row>
      <el-form-item label="企业名称: " prop="name">
        <el-input
          v-if="!isCheck"
          v-model="form.name"
          placeholder="请输入企业名称"
          clearable
        ></el-input>
        <span v-else> {{ form.name }} </span>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item label="联系电话: " prop="phone">
        <el-input
          v-if="!isCheck"
          v-model="form.phone"
          placeholder="请输入联系电话"
          maxlength="11"
          clearable
        ></el-input>
        <span v-else> {{ form.phone }} </span>
      </el-form-item>
    </el-row>
  </el-form>
</template>

// 人-信息

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
    var checkPhone = (rule, value, callback) => {
      // 手机号验证
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        const reg = /^1[3456789]\d{9}$/;
        if (reg.test(value)) {
          console.log(11111);
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
    return {
      form: { ...this.formData },
      rules: {
        name: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
        // phone: [{ required: true, message: "请输入联系电话", trigger: "blur" }],
        phone: {
          required: true,
          type: "number",
          validator: checkPhone,
          message: "请输入正确的手机号",
          trigger: "blur",
        },
      },
    };
  },
  watch: {
    formData: {
      handler(val) {
        this.form = { ...val };
        this.$forceUpdate();
      },
      // 这里是关键，代表递归监听 demo 的变化
      deep: true,
    },
  },
  mounted() {
    console.log(this.form, "哈哈哈哈");
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
