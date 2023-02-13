<template>
  <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="设备名称: " prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入设备名称"
            clearable
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="设备厂家: " prop="deviceFactory">
          <el-input
            v-model="form.deviceFactory"
            placeholder="请输入设备厂家"
            clearable
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="设备型号: " prop="model">
          <el-input
            v-model="form.model"
            placeholder="请输入设备型号"
            clearable
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="所属灯杆: " prop="lamppost">
          <el-select
            v-model="form.lamppost"
            placeholder="请选择所属灯杆"
            clearable
            filterable
          >
            <el-option
              v-for="item in lamppostList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="IP地址: " prop="ipAddress">
          <el-input
            v-model="form.ipAddress"
            placeholder="请输入IP地址"
            clearable
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="端口: " prop="port">
          <el-input
            v-model="form.port"
            placeholder="请输入端口"
            clearable
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="访问用户名: " prop="accessUsername">
          <el-input
            v-model="form.accessUsername"
            placeholder="请输入访问用户名"
            clearable
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="访问密码: " prop="accessPassword">
          <el-input
            v-model="form.accessPassword"
            placeholder="请输入访问密码"
            clearable
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="地理位置: " prop="position">
          <el-input
            v-model="form.position"
            placeholder="请输入地理位置"
            clearable
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import dataMixin from "@/mixin/data.js";
// import { addPlatform } from "@/api/infrastructure/device-platform.js";
export default {
  mixins: [dataMixin],
  data() {
    return {
      form: { ...this.data },
      rules: {
        name: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
        lamppost: [
          { required: true, message: "请选择所属灯杆", trigger: "change" },
        ],
        idAddress: [
          { required: true, message: "请输入IP地址", trigger: "blur" },
        ],
        port: [{ required: true, message: "请输入端口号", trigger: "blur" }],
        accessUsername: [
          { required: true, message: "请输入访问用户名", trigger: "blur" },
        ],
        accessPassword: [
          { required: true, message: "请输入访问密码", trigger: "blur" },
        ],
        position: [
          { required: true, message: "请选择地理位置", trigger: "blur" },
        ],
      },
      lamppostList: [
        { code: 1, name: "LED屏幕灯杆1" },
        { code: 2, name: "LED屏幕灯杆2" },
        { code: 3, name: "LED屏幕灯杆3" },
        { code: 4, name: "球机屏幕灯杆" },
        { code: 5, name: "应急广播灯杆" },
      ],
    };
  },
  created() {
    console.log(this);
  },
  methods: {
    request() {
      console.log("9999");
      // let params = {
      //   ...this.form,
      // };
      // if (this.isUpdate) {
      //   return addPlatform(params).then(() => {
      //     this.$message({
      //       type: "success",
      //       message: "修改成功",
      //     });
      //   });
      // } else {
      //   return addPlatform(params).then(() => {
      //     this.$message({
      //       type: "success",
      //       message: "新增成功",
      //     });
      //   });
      // }
    },
  },
};
</script>

<style lang="scss" scoped></style>
