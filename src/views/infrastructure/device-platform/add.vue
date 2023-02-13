<template>
  <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="协议名称: " prop="protocol">
          <el-input
            v-model="form.protocol"
            placeholder="请输入协议名称"
            clearable
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="协议类型: " prop="protocolType">
          <el-select
            v-model="form.protocolType"
            placeholder="请选择协议类型"
            clearable
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="item in protocolList"
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
            v-model.number="form.port"
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
        <el-form-item label="路径地址: " prop="url">
          <el-input
            v-model="form.url"
            placeholder="请输入路径地址"
            clearable
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="协议说明: " prop="protocolExplain">
          <el-input
            v-model="form.protocolExplain"
            placeholder="请输入协议说明"
            type="textarea"
            maxlength="100"
            show-word-limit
            :autosize="{ minRows: 4, maxRows: 10 }"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import dataMixin from "@/mixin/data.js";
import { addPlatform } from "@/api/infrastructure/device-platform.js";
export default {
  mixins: [dataMixin],
  data() {
    return {
      form: { ...this.data },
      rules: {
        protocol: [
          { required: true, message: "请输入协议名称", trigger: "blur" },
        ],
        protocolType: [
          { required: true, message: "请选择协议类型", trigger: "change" },
        ],
        port: [{ pattern: /^[0-9]*$/, message: "端口必须为数字" }],
      },
      protocolList: [
        { code: 1, name: "大华ICC" },
        { code: 2, name: "海康ISC" },
      ],
    };
  },
  methods: {
    request() {
      let params = {
        ...this.form,
      };
      if (this.isUpdate) {
        return addPlatform(params).then(() => {
          this.$message({
            type: "success",
            message: "修改成功",
          });
        });
      } else {
        return addPlatform(params).then(() => {
          this.$message({
            type: "success",
            message: "新增成功",
          });
        });
      }
    },
  },
};
</script>
