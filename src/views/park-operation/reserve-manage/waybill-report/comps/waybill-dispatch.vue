<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="110px">
    <!-- <el-row>
      <el-form-item label="是否启动调度: " prop="value1">
        <el-switch
          v-if="!isCheck"
          v-model="form.value1"
          :active-value="1"
          :inactive-value="0"
        ></el-switch>
        <span v-else> {{ form.value1 ? "是" : "否" }} </span>
      </el-form-item>
    </el-row> -->
    <el-row>
      <el-form-item label="车辆车牌: " prop="vehicleLicense">
        <el-input
          v-if="!isCheck"
          v-model="form.vehicleLicense"
          placeholder="请输入车辆车牌"
          clearable
        ></el-input>
        <span v-else> {{ form.vehicleLicense }} </span>
      </el-form-item>
      <el-form-item label="挂车车牌: " prop="trailerLicense">
        <el-input
          v-if="!isCheck"
          v-model="form.trailerLicense"
          placeholder="请输入挂车车牌"
          clearable
        ></el-input>
        <span v-else> {{ form.trailerLicense }} </span>
      </el-form-item>
      <el-form-item label="驾驶员: " prop="driverName">
        <el-input
          v-if="!isCheck"
          v-model="form.driverName"
          placeholder="请输入驾驶员名字"
          clearable
        ></el-input>
        <span v-else> {{ form.driverName }} </span>
      </el-form-item>
      <el-form-item label="手机号: " prop="driverPhone">
        <el-input
          v-if="!isCheck"
          v-model="form.driverPhone"
          placeholder="请输入驾驶员电话"
          clearable
        ></el-input>
        <span v-else> {{ form.driverPhone }} </span>
      </el-form-item>
      <el-form-item label="押运员: " prop="escortName">
        <el-input
          v-if="!isCheck"
          v-model="form.escortName"
          placeholder="请输入押运员名字"
          clearable
        ></el-input>
        <span v-else> {{ form.escortName }} </span>
      </el-form-item>
      <el-form-item label="罐体编号: " prop="tankCode">
        <el-input
          v-if="!isCheck"
          v-model="form.tankCode"
          placeholder="请输入罐体编号"
          clearable
        ></el-input>
        <span v-else> {{ form.tankCode }} </span>
      </el-form-item>
      <el-form-item label="备注: " prop="remark">
        <el-input
          v-if="!isCheck"
          v-model="form.remark"
          type="textarea"
          maxlength="500"
          show-word-limit
          placeholder="请输入备注"
          clearable
        ></el-input>
        <span v-else> {{ form.remark }} </span>
      </el-form-item>
      <el-form-item label="罐体容积(m³): " prop="tankVolume">
        <el-input
          v-if="!isCheck"
          v-model="form.tankVolume"
          placeholder="请输入罐体容积(m³)"
          clearable
        ></el-input>
        <span v-else> {{ form.tankVolume }} </span>
      </el-form-item>
    </el-row>
    <!-- <el-row>
      <el-form-item label="备注: " prop="remark">
        <el-input
          v-if="!isCheck"
          v-model="form.remark"
          type="textarea"
          maxlength="500"
          show-word-limit
          placeholder="请输入备注"
          clearable
        ></el-input>
        <span v-else> {{ form.remark }} </span>
      </el-form-item>
    </el-row> -->
  </el-form>
</template>

// 运单调度

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
        vehicleLicense: [
          { required: true, message: "请输入车辆车牌", trigger: "blur" },
        ],
        driverName: [
          { required: true, message: "请输入驾驶员", trigger: "blur" },
        ],
        driverPhone: {
          required: true,
          type: "number",
          validator: checkPhone,
          message: "请输入正确的手机号",
          trigger: "blur",
        },
        escortName: [
          { required: true, message: "请输入押运员", trigger: "blur" },
        ],
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
};
</script>

<style lang="scss" scoped>
.el-form .el-row {
  margin-left: 31px;
}
</style>
