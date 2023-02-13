<template>
  <div>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="资质证书" prop="certificateName">
            <el-select
              v-model="ruleForm.certificateName"
              placeholder="请选择证书类型"
              style="width: 100%"
              @change="selectChange"
            >
              <el-option
                v-for="item in BctList"
                :key="item.id"
                :label="item.name"
                :value="+item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发证机构">
            <el-input
              v-model="ruleForm.issuingAuthority"
              placeholder="选择资质证书后自动填充"
              disabled=""
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="证书编号" prop="certificateNo">
            <el-input
              v-model="ruleForm.certificateNo"
              placeholder="请输入证书编号"
            ></el-input>
          </el-form-item>
          <el-form-item label="长期有效" class="isPermanent">
            <el-switch
              v-model="ruleForm.isPermanent"
              :active-value="1"
              :inactive-value="0"
              disabled
            ></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item
          v-if="ruleForm.isPermanent == '0'"
          label="证件有效期: "
          prop="expirationDate"
        >
          <el-date-picker
            v-model="ruleForm.expirationDate"
            type="daterange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%"
            :default-time="['00:00:00', '23:59:59']"
          />
        </el-form-item>
      </el-row>
      <el-row class="cl-width100">
        <el-form-item label="资质照片: " prop="CtrImgList">
          <ImgUpload :imgs-list.sync="ruleForm.CtrImgList" :tip="true" />
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import ImgUpload from "@/components/img-upload/img-upload.vue";

import { getBctList } from "@/api/contractor/contractor-car.js";
export default {
  components: { ImgUpload },
  props: {
    certificateData: {
      type: Object,
      default: () => {},
    },
    certificateDialogTable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      BctList: [], // 资质证书列表
      ruleForm: {
        issuingAuthority: null, // 发证机构
        isPermanent: 0,
        CtrImgList: [], // 资质照片
      },
      rules: {
        certificateName: [
          { required: true, message: "请选择资质证书", trigger: "change" },
        ],
        certificateNo: [
          { required: true, message: "请输入证书编号", trigger: "blur" },
        ],
        expirationDate: [
          {
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
        CtrImgList: { required: true, message: "请上传证书照片" },
      },
    };
  },

  computed: {},
  watch: {
    certificateData: {
      handler(val) {
        if (val.name) {
          this.ruleForm = val;
        }
      },
      immediate: true,
    },
  },
  mounted() {
    getBctList({ certObject: 30 }).then((res) => {
      this.BctList = res.data;
    });
  },
  methods: {
    selectChange(id) {
      this.BctList.forEach((item) => {
        if (item.id == id) {
          console.log(id + "");
          this.ruleForm = {
            ...this.ruleForm,
            ...item,
          };
          console.log(this.ruleForm, "this.ruleForm");
          this.ruleForm.issuingAuthority = item.issuingAuthority;
          this.ruleForm.isPermanent = item.isPermanent;
        }
      });
    },
    emitFormData() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.$emit("update:certificateData", this.ruleForm);
          this.$emit("update:certificateDialogTable", false);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.isPermanent {
  ::v-deep .el-switch__core::before {
    content: "否";
    position: absolute;
    font-size: 12px;
    top: -1px;
    right: 5px;
    color: #fff;
  }

  .is-checked ::v-deep .el-switch__core::before {
    content: "是";
    position: absolute;
    font-size: 12px;
    top: -1px;
    left: 5px;
    color: #fff;
  }
}
</style>
