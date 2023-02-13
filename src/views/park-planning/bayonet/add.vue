<template>
  <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px">
    <el-form-item label="名称: " prop="name">
      <el-input
        v-model="form.name"
        size="small"
        placeholder="请输入名称"
        :disabled="isCheck"
      ></el-input>
    </el-form-item>
    <el-form-item label="说明: " prop="remarks">
      <el-input
        v-model="form.remarks"
        type="textarea"
        maxlength="300"
        show-word-limit
        :rows="5"
        placeholder="请输入说明"
        :disabled="isCheck"
      ></el-input>
    </el-form-item>
    <el-form-item label="位置信息: " prop="center">
      <el-input v-model="centerStr" :disabled="true"> </el-input>
      <div class="cl-map">
        <ArcgisMap
          :id="'bayonet-add-map'"
          ref="map"
          :center="
            form.center.length
              ? form.center
              : [108.67362684779546, 21.76932300907748]
          "
          :has-search="false"
          :has-tool="false"
        />
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import dataMixin from "@/mixin/data.js";
import { save } from "@/api/park-planning";
import MapImg from "@/mixin/map-img.js";
import ArcgisMap from "@/map/index.vue";
import ArcGIS from "@/map/map/index.js";
const myMap = new ArcGIS();
export default {
  components: { ArcgisMap },
  mixins: [dataMixin, MapImg],
  props: {
    pageType: {
      type: String,
      default: "",
    },
  },
  data() {
    let validatePlace = (rule, value, callback) => {
      if (this.centerStr == "") {
        callback(new Error("请选择位置信息"));
      } else {
        callback();
      }
    };
    return {
      form: {
        ...this.data,
        center: [], // 地图坐标
      },
      rules: {
        name: {
          required: true,
          message: "名称不能为空",
        },
        center: [
          { required: true, trigger: "change", validator: validatePlace },
        ],
      },
      centerStr: "",
    };
  },
  computed: {
    isCheck() {
      return this.pageType == "check";
    },
  },
  mounted() {
    if (this.data.longitude && this.data.latitude) {
      this.form.center = [this.data.longitude, this.data.latitude];
      this.centerStr = `${this.data.longitude},${this.data.latitude}`;
      setTimeout(() => {
        myMap.Marker(
          [this.data.longitude, this.data.latitude],
          this.$refs.map.view,
        );
      }, 1000);
    }
  },
  methods: {
    async request() {
      let imageId = "";
      if (this.centerStr && this.hasChange) {
        await this.toUpload(this.base64url).then((res) => {
          imageId = res.id;
        });
      } else {
        // 编辑回显时 若没更换位置
        imageId = this.data.imageId;
      }
      let params = {
        ...this.form,
        longitude: this.form.center.length > 0 ? this.form.center[0] : null,
        latitude: this.form.center.length > 0 ? this.form.center[1] : null,
        imageId, // 位置信息截图id
      };
      delete this.form.center;
      if (this.isUpdate) {
        return save(params).then(() => {
          this.$message({
            type: "success",
            message: "修改成功",
          });
        });
      } else {
        return save(params).then(() => {
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

<style lang="scss" scoped>
.cl-map {
  width: 100%;
  height: 350px;
  margin-top: 20px;
}
</style>
