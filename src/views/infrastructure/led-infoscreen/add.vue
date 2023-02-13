<template>
  <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="设备名称: " prop="name">
          <el-input
            v-if="isEdit || isAdd"
            v-model="form.name"
            placeholder="请输入设备名称"
            clearable
          ></el-input>
          <span v-if="isCheck">{{ form.name }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="设备厂家: " prop="deviceFactory">
          <el-input
            v-if="isEdit || isAdd"
            v-model="form.deviceFactory"
            placeholder="请输入设备厂家"
            clearable
          ></el-input>
          <span v-if="isCheck">{{ form.deviceFactory }}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="设备型号: " prop="modelNumber">
          <el-input
            v-if="isEdit || isAdd"
            v-model="form.modelNumber"
            placeholder="请输入设备型号"
            clearable
          ></el-input>
          <span v-if="isCheck">{{ form.modelNumber }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="所属灯杆: " prop="lampId">
          <el-select
            v-if="isEdit || isAdd"
            v-model="form.lampId"
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
          <span v-if="isCheck">{{ form.lampId }}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="IP地址: " prop="ip">
          <el-input
            v-if="isEdit || isAdd"
            v-model="form.ip"
            placeholder="请输入IP地址"
            clearable
          ></el-input>
          <span v-if="isCheck">{{ form.ip }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="端口: " prop="port">
          <el-input
            v-if="isEdit || isAdd"
            v-model="form.port"
            placeholder="请输入端口"
            clearable
          ></el-input>
          <span v-if="isCheck">{{ form.port }}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="访问用户名: " prop="accessUsername">
          <el-input
            v-if="isEdit || isAdd"
            v-model="form.accessUsername"
            placeholder="请输入访问用户名"
            clearable
          ></el-input>
          <span v-if="isCheck">{{ form.accessUsername }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="访问密码: " prop="accessPassword">
          <el-input
            v-if="isEdit || isAdd"
            v-model="form.accessPassword"
            placeholder="请输入访问密码"
            clearable
          ></el-input>
          <span v-if="isCheck">{{ form.accessPassword }}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="地理位置: " prop="position">
          <div v-if="isEdit || isAdd" style="display: flex">
            <el-input
              v-model="form.position"
              placeholder="请输入地理位置"
              style="padding-right: 10px"
              clearable
            ></el-input>
            <el-button type="primary" size="mini" round>定位</el-button>
          </div>
          <span v-if="isCheck">{{ form.position }}</span>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import dataMixin from "@/mixin/data.js";
import { addOrUpdateLedScreen } from "@/api/infrastructure/led-infoscreen.js";
export default {
  mixins: [dataMixin],
  props: {
    pageType: {
      type: String,
      default: "",
    },
  },
  data() {
    const validIp = (rule, value, cb) => {
      const regIp =
        /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/;
      if (!regIp.test(value)) return cb(new Error("请输入正确IP地址"));
      cb();
    };
    const validPort = (rule, value, cb) => {
      const regPort = /^[1-9]\d{0,4}$/;
      if (!regPort.test(value)) return cb(new Error("请输入正确端口号"));
      cb();
    };
    return {
      form: { ...this.data },
      rules: {
        name: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
        lampId: [
          { required: true, message: "请选择所属灯杆", trigger: "change" },
        ],
        ip: [
          { required: true, message: "请输入IP地址", trigger: "blur" },
          {
            validator: validIp,
            trigger: "change",
          },
        ],
        port: [
          { required: true, message: "请输入端口号", trigger: "blur" },
          {
            validator: validPort,
            trigger: "blur",
          },
        ],
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
  computed: {
    isAdd() {
      return this.pageType == "add";
    },
    isCheck() {
      return this.pageType == "check";
    },
    isEdit() {
      return this.pageType == "edit";
    },
  },
  created() {
    console.log(this);
  },
  methods: {
    request() {
      console.log(this.form, "xxx");
      let params = {
        ...this.form,
      };
      if (this.isUpdate) {
        return addOrUpdateLedScreen(params).then(() => {
          this.$message({
            type: "success",
            message: "修改成功",
          });
        });
      } else {
        return addOrUpdateLedScreen(params).then(() => {
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

<style lang="scss" scoped></style>
