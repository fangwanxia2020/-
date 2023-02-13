<template>
  <el-form ref="form" :model="form" class="message-dialog" label-width="130px">
    <el-form-item label="设备名称: ">
      <span v-if="form.tab == '2'">{{ form.name }}</span>
      <span v-else>{{ form.cameraName }}</span>
    </el-form-item>
    <el-form-item label="品牌: ">
      <span v-if="form.tab == '2'">
        {{ getNameByKey(dictObj.base_camera_brand, form.brand) }}
      </span>
      <span v-else>
        {{ getNameByKey(dictObj.base_camera_brand, form.cameraBrandId) }}
      </span>
    </el-form-item>
    <el-form-item label="设备型号: ">
      <span v-if="form.tab == '2'">{{ form.modelNumber }}</span>
      <span v-else>
        {{ getNameByKey(dictObj.base_camera_brand, form.cameraModel) }}
      </span>
    </el-form-item>
    <el-form-item label="所属平台: ">
      <span>
        {{ getNameByKey(platformList, form.edgePlatId, "id", "protocol") }}
      </span>
    </el-form-item>
    <el-form-item label="所属卡口: ">
      <span>
        {{ getNameByKey(bayonetList, form.gatewayId, "id") }}
      </span>
    </el-form-item>
    <el-form-item label="IP地址: ">
      <span v-if="form.tab == '2'">{{ form.ip }}</span>
      <span v-else>{{ form.ipV4 }} </span>
    </el-form-item>
    <el-form-item label="端口: ">
      <span>{{ form.port }}</span>
    </el-form-item>
    <el-form-item label="访问用户名: ">
      <span v-if="form.tab == '2'">
        {{ form.accessUsername }}
      </span>
      <span v-else>
        {{ form.username }}
      </span>
    </el-form-item>
    <el-form-item label="访问密码: ">
      <span v-if="form.tab == '2'">
        {{ form.accessPassword }}
      </span>
      <span v-else>
        {{ form.password }}
      </span>
    </el-form-item>
    <el-form-item label="位置信息: ">
      <span v-if="form.tab == '2'"></span>
      <span v-else></span>
    </el-form-item>
  </el-form>
</template>

<script>
import dataMixin from "@/mixin/data.js";
import getSelMixins from "@/views/infrastructure/access-control-equipment/getSelMixins.js";
export default {
  mixins: [dataMixin, getSelMixins],
  props: {
    title: String,
  },
  data() {
    return {
      form: { ...this.data },
    };
  },
};
</script>

<style lang="scss" scoped>
.el-form {
  .el-form-item {
    float: left;
    width: 50%;
    ::v-deep .el-form-item__label {
      color: #000;
    }
  }
}
</style>
