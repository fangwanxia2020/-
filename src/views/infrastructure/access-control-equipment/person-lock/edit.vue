<template>
  <hqit-content-page
    :title="`门禁设备— ${isCheck ? '查看' : '修改'}— ${baseForm.name}`"
  >
    <template slot="content">
      <div class="cl-second">
        <div class="cl-second-content">
          <div class="content-item clearfix">
            <div class="cl-hea-title">基础信息</div>
            <el-form
              ref="baseForm"
              :model="baseForm"
              :rules="baseRules"
              label-width="100px"
            >
              <el-row>
                <el-form-item label="设备名称: " prop="name">
                  <el-input
                    v-if="!isCheck"
                    v-model="baseForm.name"
                    placeholder="请输入设备名称"
                    clearable
                  ></el-input>
                  <span v-else>{{ baseForm.name }}</span>
                </el-form-item>
                <el-form-item label="品牌: " prop="brand">
                  <el-select
                    v-if="!isCheck"
                    v-model="baseForm.brand"
                    placeholder="请选择品牌"
                    clearable
                    filterable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in dictObj.base_camera_brand"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                  <span v-else>
                    {{
                      getNameByKey(dictObj.base_camera_brand, baseForm.brand)
                    }}
                  </span>
                </el-form-item>
                <el-form-item label="设备型号: " prop="modelNumber">
                  <el-input
                    v-if="!isCheck"
                    v-model="baseForm.modelNumber"
                    placeholder="请输入设备型号"
                    clearable
                  ></el-input>
                  <span v-else>{{ baseForm.modelNumber }}</span>
                </el-form-item>
              </el-row>
              <div class="cl-hea-title">技术参数</div>
              <el-row>
                <el-form-item label="所属平台: " prop="edgePlatId">
                  <el-select
                    v-if="!isCheck"
                    v-model="baseForm.edgePlatId"
                    placeholder="请选择所属平台"
                    clearable
                    filterable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in platformList"
                      :key="item.id"
                      :label="item.protocol"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  <span v-else>
                    {{
                      getNameByKey(
                        platformList,
                        baseForm.edgePlatId,
                        "id",
                        "protocol",
                      )
                    }}
                  </span>
                </el-form-item>
                <el-form-item label="所属卡口: " prop="gatewayId">
                  <el-select
                    v-if="!isCheck"
                    v-model="baseForm.gatewayId"
                    placeholder="请选择所属卡口"
                    clearable
                    filterable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in bayonetList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  <span v-else>
                    {{ getNameByKey(bayonetList, baseForm.gatewayId, "id") }}
                  </span>
                </el-form-item>
                <el-form-item label="IP地址: " prop="ip">
                  <el-input
                    v-if="!isCheck"
                    v-model="baseForm.ip"
                    placeholder="请输入IP地址"
                    clearable
                  ></el-input>
                  <span v-else>{{ baseForm.ip }}</span>
                </el-form-item>
                <el-form-item label="端口: " prop="port">
                  <el-input
                    v-if="!isCheck"
                    v-model.number="baseForm.port"
                    placeholder="请输入端口"
                    clearable
                  ></el-input>
                  <span v-else>{{ baseForm.port }}</span>
                </el-form-item>
                <el-form-item label="访问用户名: " prop="accessUsername">
                  <el-input
                    v-if="!isCheck"
                    v-model="baseForm.accessUsername"
                    placeholder="请输入访问用户名"
                    clearable
                  ></el-input>
                  <span v-else>{{ baseForm.accessUsername }}</span>
                </el-form-item>
                <el-form-item label="访问密码: " prop="accessPassword">
                  <el-input
                    v-if="!isCheck"
                    v-model="baseForm.accessPassword"
                    placeholder="请输入访问密码"
                    clearable
                  ></el-input>
                  <span v-else>{{ baseForm.accessPassword }}</span>
                </el-form-item>
                <el-form-item label="位置信息: " prop="center">
                  <el-input v-model="centerStr" :disabled="true"> </el-input>
                  <div class="cl-map">
                    <ArcgisMap
                      :id="'edit-map'"
                      ref="map"
                      :center="
                        baseForm.center.length
                          ? baseForm.center
                          : [108.67362684779546, 21.76932300907748]
                      "
                      :has-search="false"
                      :has-tool="false"
                    />
                  </div>
                </el-form-item>
              </el-row>
            </el-form>
          </div>
        </div>
        <div class="cl-second-footer">
          <el-button
            type="primary"
            @click="isCheck ? handleToEdit() : handleSave()"
          >
            {{ isCheck ? "编辑" : "保存" }}
          </el-button>
        </div>
      </div>
    </template>
  </hqit-content-page>
</template>

<script>
import {
  personLockDetail,
  editPersonLock,
} from "@/api/infrastructure/access-control-equipment.js";
import getSelMixins from "../getSelMixins.js";
import ArcgisMap from "@/map/index.vue";
import ArcGIS from "@/map/map/index.js";
const myMap = new ArcGIS();
import MapImg from "@/mixin/map-img.js";
export default {
  components: { ArcgisMap },
  mixins: [getSelMixins, MapImg],
  data() {
    let validatePlace = (rule, value, callback) => {
      if (this.centerStr == "") {
        callback(new Error("请选择位置信息"));
      } else {
        callback();
      }
    };
    return {
      baseForm: {
        center: [],
      },
      baseRules: {
        name: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
        brand: [{ required: true, message: "请选择品牌", trigger: "change" }],
        edgePlatId: [
          { required: true, message: "请选择所属平台", trigger: "change" },
        ],
        // gatewayId: [
        //   { required: true, message: "请选择所属卡口", trigger: "change" },
        // ],
        ip: [{ required: true, message: "请输入IP地址", trigger: "blur" }],
        port: [
          { required: true, message: "请输入端口", trigger: "blur" },
          { pattern: /^[0-9]*$/, message: "端口必须为数字" },
        ],
        accessUsername: [
          { required: true, message: "请输入访问用户名", trigger: "blur" },
        ],
        accessPassword: [
          { required: true, message: "请输入访问密码", trigger: "blur" },
        ],
        center: [
          { required: true, validator: validatePlace, trigger: "change" },
        ],
      },
      pageType: null, // 当前页面是?
      centerStr: "",
    };
  },
  computed: {
    isCheck() {
      return this.pageType == "person-lock-check";
    },
  },
  watch: {
    $route: {
      handler: function (val) {
        this.pageType = val.name;
      },
      immediate: true,
    },
    "$store.state.map.center": function (val) {
      this.baseForm.center = val;
      this.centerStr = val.join(",");
    },
  },
  mounted() {
    if (this.$route.query.id) this.getDetail();
  },
  methods: {
    // 获取详情
    async getDetail() {
      let res = await personLockDetail(this.$route.query.id);
      this.baseForm = res.data;
      if (res.data.longitude && res.data.latitude) {
        this.baseForm.center = [res.data.longitude, res.data.latitude];
        this.centerStr = `${res.data.longitude},${res.data.latitude}`;
      } else {
        this.baseForm.center = [];
        this.centerStr = "";
      }
      setTimeout(() => {
        myMap.Marker(
          [res.data.longitude, res.data.latitude],
          this.$refs.map.view,
        );
      }, 1000);
    },
    // 保存
    handleSave() {
      this.$refs["baseForm"].validate(async (valid) => {
        if (valid) {
          let imageId = "";
          if (this.centerStr && this.hasChange) {
            await this.toUpload(this.base64url).then((res) => {
              imageId = res.id;
            });
          } else {
            // 编辑回显时 若没更换位置
            imageId = this.baseForm.imageId;
          }
          let params = {
            ...this.baseForm,
            longitude: this.baseForm.center[0], // 经度
            latitude: this.baseForm.center[1], // 纬度
            imageId, // 位置信息截图id
          };
          delete params.center;
          editPersonLock(params).then(() => {
            this.$message({
              type: "success",
              message: "修改成功",
            });
            this.handleBack();
          });
        }
      });
    },
    // 编辑
    handleToEdit() {
      this.$router.push({
        path: "/gatedpark/infrastructure/access-control-equipment/person-lock-edit",
        query: { id: this.$route.query.id },
      });
    },
    handleBack() {
      this.$router.push({
        path: "/gatedpark/infrastructure/access-control-equipment",
      });
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
.el-form .el-row {
  margin-left: 28px;
}
.cl-second-content {
  margin: 0;
}
</style>
