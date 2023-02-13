<template>
  <el-form ref="ruleForm" :model="form" :rules="rules" label-width="120px">
    <el-form-item label="流程角色名称: " prop="roleName">
      <el-input
        v-model="form.roleName"
        placeholder="请输入"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="审批流程: " prop="domainId">
      <el-select
        v-model="form.domainId"
        placeholder="全部"
        clearable
        filterable
      >
        <el-option
          v-for="item in list"
          :key="item.domainId"
          :label="item.domainName"
          :value="item.domainId"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="显示排序: " prop="sort">
      <el-input-number
        v-model="form.sort"
        controls-position="right"
        :min="1"
        placeholder="请输入排序"
        style="width: 100%"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="状态: " prop="status">
      <el-radio v-model="form.status" :label="1">正常</el-radio>
      <el-radio v-model="form.status" :label="0">停用</el-radio>
    </el-form-item>
    <el-form-item label="备注: " prop="remark">
      <el-input
        v-model="form.remark"
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
      >
      </el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import dataMixin from "../mixin/data";
import { addRole } from "@/api/approval/role-setting.js";
export default {
  name: "add-role",
  mixins: [dataMixin],
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      form: { ...this.data },
      rules: {
        roleName: [{ required: true, message: "请输入名称", trigger: "blur" }],
        domainId: [
          { required: true, message: "请选择审批流程", trigger: "change" },
        ],
        sort: [{ required: true, message: "请输入排序", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
    };
  },
  methods: {
    request() {
      console.log(111);
      let params = {
        ...this.form,
      };
      this.list.forEach((item) => {
        if (item.domainId == params.domainId)
          params["domainName"] = item.domainName;
      });
      return addRole(params).then(() => {
        this.$msgSuccess("新增成功");
        this.$emit("update:successBool", true);
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
