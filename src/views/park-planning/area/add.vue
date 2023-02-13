<template>
  <el-form ref="ruleForm" :model="form" :rules="rules" label-width="110px">
    <el-form-item label="区域名称: " prop="name">
      <el-input
        v-model="form.name"
        placeholder="请输入区域名称"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="是否为防爆区: " prop="isExZone">
      <el-radio-group v-model="form.isExZone">
        <el-radio label="1">是</el-radio>
        <el-radio label="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="地图信息: ">
      <div class="add-map">
        <ArcgisMap
          :id="'area-add-map'"
          ref="map"
          :should-click="false"
          :is-area="true"
          @getDrawType="getDrawType"
        />
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import dataMixin from "@/mixin/data.js";
import { addArea, editArea } from "@/api/park-planning/area.js";
import ArcgisMap from "@/map/index.vue";
import {
  createPolygonByPoint,
  createCircleByPoint,
} from "@/map/map/modules/drawActiveByself";
import MapImg from "@/mixin/map-img.js";
export default {
  components: {
    ArcgisMap,
  },
  mixins: [dataMixin, MapImg],
  data() {
    return {
      form: { ...this.data },
      rules: {
        name: [
          { required: true, message: "请输入区域名称", trigger: "blur" },
          { max: 50, message: "区域名称最多50个字符", trigger: "blur" },
        ],
        isExZone: [
          { required: true, message: "请选择是否为防爆区", trigger: "change" },
        ],
      },
      circle: {}, // 圆的数据
      polygon: {}, // 多边形的数据
      shapeType: null, // 圆还是多边形
    };
  },
  watch: {
    "$store.state.map.circle": function (val) {
      this.circle = val;
    },
    "$store.state.map.polygon": function (val) {
      this.polygon = val;
    },
  },
  mounted() {
    if (this.isUpdate) {
      this.shapeType = this.data.shapeType;
      // 圆
      if (this.data.roundArray && this.data.radius) {
        this.$set(this.circle, "center", this.data.roundArray);
        this.$set(this.circle, "dis", this.data.radius);
        this.$nextTick(() => {
          setTimeout(() => {
            createCircleByPoint(
              this.data.roundArray,
              this.data.radius,
              this.$refs.map.view,
            );
          }, 1000);
        });
      }
      // 多边形
      if (this.data.polygonArray) {
        this.$set(this.polygon, "vertices", this.data.polygonArray);
        this.$nextTick(() => {
          setTimeout(() => {
            createPolygonByPoint(this.data.polygonArray, this.$refs.map.view);
          }, 1000);
        });
      }
    }
  },
  methods: {
    async request() {
      let params;
      // 圆
      if (this.shapeType == 0) {
        params = {
          ...this.form,
          shapeType: this.shapeType,
          roundArray: this.circle.center,
          radius: this.circle.dis,
        };
      }
      // 多边形
      if (this.shapeType == 1) {
        params = {
          ...this.form,
          shapeType: this.shapeType,
          polygonArray: this.polygon.vertices,
        };
      }
      if (this.shapeType != 0 && this.shapeType != 1) {
        params = {
          ...this.form,
          roundArray: [569599.6618099667, 2408556.8753500096],
          shapeType: "0",
          radius: "71.43577713326188",
        };
      }
      if (this.hasChange) {
        await this.toUpload(this.base64url).then((res) => {
          params.picUrl = res.id;
        });
      } else {
        // 编辑回显时 若没更换位置
        if (this.isUpdate && this.data.picUrl) params.picUrl = this.data.picUrl;
      }
      if (this.isUpdate) {
        return editArea(params).then(() => {
          this.$emit("update:sucbol", true);
          this.$message({
            type: "success",
            message: "修改成功",
          });
        });
      } else {
        return addArea(params).then(() => {
          this.$message({
            type: "success",
            message: "新增成功",
          });
        });
      }
    },
    getDrawType(type) {
      if (type == "circle") this.shapeType = 0;
      if (type == "polygon") this.shapeType = 1;
    },
  },
};
</script>

<style lang="scss" scoped>
.add-map {
  width: 100%;
  height: 350px;
}
</style>
