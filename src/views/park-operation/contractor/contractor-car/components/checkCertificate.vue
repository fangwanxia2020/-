<template>
  <div>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="资质证书">
            <!-- <el-select
              v-model="ruleForm.certificateName"
              placeholder="请选择证书类型"
              style="width: 100%"
              disabled
            >
              <el-option
                v-for="item in BctList"
                :key="item.id"
                :label="item.name"
                :value="+item.id"
              />
            </el-select> -->
            {{ ruleForm.certificateName }}
          </el-form-item>
          <el-form-item label="发证机构">
            <!-- <el-input
              v-model="ruleForm.issuingAuthority"
              placeholder="选择资质证书后自动填充"
              disabled
            ></el-input> -->
            {{ ruleForm.issuingAuthority }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="证书编号">
            <!-- <el-input
              v-model="ruleForm.certificateNo"
              placeholder="请输入证书编号"
              disabled
            ></el-input> -->
            {{ ruleForm.certificateNo }}
          </el-form-item>
          <el-form-item label="长期有效" class="isPermanent">
            <!-- <el-switch
              v-model="ruleForm.isPermanent"
              :active-value="1"
              :inactive-value="0"
              disabled
            ></el-switch> -->
            {{ ruleForm.isPermanent == 1 ? "是" : "否" }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="证件有效期: ">
          <!-- <el-date-picker
            v-model="ruleForm.expirationDate"
            type="daterange"
            range-separator="-"
            disabled
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%"
            :default-time="['00:00:00', '23:59:59']"
          /> -->
          <template v-if="ruleForm.expirationDate">
            {{ awaySecond(ruleForm.expirationDate[0]) }}至
            {{ awaySecond(ruleForm.expirationDate[1]) }}
          </template>
        </el-form-item>
      </el-row>
      <el-row class="cl-width100">
        <el-form-item label="资质照片: " prop="CtrImgList">
          <img
            v-for="(item, idx) of ruleForm.CtrImgList"
            :key="idx"
            class="car-img"
            :src="item.url"
            alt=""
            @click="handlePictureCardPreview(item.url)"
          />
        </el-form-item>
      </el-row>
    </el-form>
    <ViewImage
      v-if="dialogVisible"
      style="width: 100%; height: 100%"
      :on-close="handleCloseViewer"
      :url-list="[dialogImageUrl]"
    >
    </ViewImage>
  </div>
</template>

<script>
import ViewImage from "@/components/viewImage/index.vue";
import { getBctList } from "@/api/contractor/contractor-car.js";
export default {
  components: { ViewImage },
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
      dialogVisible: false,
      dialogImageUrl: "",
      BctList: [], // 资质证书列表
      ruleForm: {
        issuingAuthority: null, // 发证机构
        isPermanent: 0,
        CtrImgList: [], // 资质照片
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
    // 查看图片
    handlePictureCardPreview(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    // 人脸照片 - 关闭预览
    handleCloseViewer() {
      this.dialogVisible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.car-img {
  width: 100px;
  height: 100px;
}
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
