<template>
  <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px">
    <el-form-item label="灯杆名称: " prop="name">
      <span v-if="isCheck">{{ form.name }}</span>
      <el-input
        v-if="isEdit || isAdd"
        v-model="form.name"
        placeholder="请输入灯杆名称"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="灯杆型号: " prop="modelNumber">
      <span v-if="isCheck">{{ form.name }}</span>
      <el-input
        v-if="isEdit || isAdd"
        v-model="form.modelNumber"
        placeholder="请输入灯杆型号"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="坐标位置: " prop="position">
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
  </el-form>
</template>

<script>
import dataMixin from "@/mixin/data.js";
import { addOrUpdateLamp } from "@/api/infrastructure/smart-lamppost.js";
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
        lamppostName: [
          { required: true, message: "请输入灯杆名称", trigger: "blur" },
        ],
        brand: [{ required: true, message: "请选择品牌", trigger: "blur" }],
        area: [{ required: true, message: "请选择区域", trigger: "blur" }],
        protocol: [{ required: true, message: "请选择协议", trigger: "blur" }],
        ipAddress: [
          { required: true, message: "请输入IP地址", trigger: "blur" },
          {
            validator: validIp,
            trigger: "change",
          },
        ],
        port: [
          { required: true, message: "请输入端口", trigger: "blur" },
          {
            validator: validPort,
            trigger: "blur",
          },
        ],
        accessUsername: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        accessPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
        ],
        position: [
          { required: true, message: "请选择地理位置", trigger: "blur" },
        ],
      },
      brandList: [
        { code: 1, name: "大华" },
        { code: 2, name: "海康" },
      ],
      areaList: [
        { code: 1, name: "A区" },
        { code: 2, name: "B区" },
        { code: 3, name: "C区" },
        { code: 4, name: "D区" },
      ],
      protocolList: [
        { code: 1, name: "大华ICC平台" },
        { code: 2, name: "海康协议-新" },
        { code: 3, name: "海康协议-旧" },
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
    console.log(this.isAdd, this.isCheck, this.isEdit);
  },
  methods: {
    request() {
      console.log(this.form, "xxx");
      let params = {
        ...this.form,
      };
      if (this.isUpdate) {
        return addOrUpdateLamp(params).then(() => {
          this.$message({
            type: "success",
            message: "修改成功",
          });
        });
      } else {
        return addOrUpdateLamp(params).then(() => {
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
