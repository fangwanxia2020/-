<template>
  <div>
    <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px">
      <el-form-item v-if="isCheck" label="通道编号: ">
        <span>{{ form.code }}</span>
      </el-form-item>
      <el-form-item label="通道名称: " prop="name">
        <el-input
          v-if="isAdd || isEdit"
          v-model="form.name"
          placeholder="请输入通道名称"
          clearable
        ></el-input>
        <span v-if="isCheck">{{ form.name }}</span>
      </el-form-item>
      <el-form-item label="关联设备: " prop="value2">
        <div class="cl-charge">
          <template v-if="isAdd || isEdit">
            <el-tag
              v-for="(item, index) in checkboxlist"
              :key="item.id"
              closable
              type="success"
              @close="handleDel(index)"
            >
              {{ item.name || item.cameraName }}
            </el-tag>
            <el-button
              type="primary"
              size="mini"
              style="margin-left: 0"
              @click="handleShow"
            >
              关联设备
            </el-button>
          </template>
          <span v-if="isCheck">
            <el-tag v-for="item in checkboxlist" :key="item.id" type="success">
              {{ item.name || item.cameraName }}
            </el-tag>
          </span>
        </div>
      </el-form-item>
      <el-form-item v-if="isCheck" label="状态: ">
        <span>
          {{ form.status == 0 ? "常关" : form.status == 1 ? "常开" : "" }}
        </span>
      </el-form-item>
      <el-form-item label="位置信息: " prop="center">
        <el-input v-model="centerStr" :disabled="true"> </el-input>
        <div class="cl-map">
          <ArcgisMap
            :id="'add-map'"
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

    <!-- 关联设备选择对话框 -->
    <FormDialog
      ref="model"
      title="关联设备"
      :append-to-body="true"
      :width="800"
    >
      <template #default="scope">
        <Device
          v-bind="scope.data"
          :checkboxlist.sync="checkboxlist"
          :tabact.sync="tabact"
        />
      </template>
    </FormDialog>
  </div>
</template>

<script>
import dataMixin from "@/mixin/data.js";
import Device from "./device.vue";
import { addPass } from "@/api/infrastructure/access-control-equipment.js";
import { deepClone } from "@/utils/tool.js";
import ArcgisMap from "@/map/index.vue";
import ArcGIS from "@/map/map/index.js";
const myMap = new ArcGIS();
import MapImg from "@/mixin/map-img.js";
export default {
  components: { Device, ArcgisMap },
  mixins: [dataMixin, MapImg],
  props: {
    pageType: {
      type: String,
      default: "",
    },
  },
  data() {
    // let validateDevice = (rule, value, callback) => {
    //   if (!this.checkboxlist.length) {
    //     callback(new Error("请选择关联设备"));
    //   } else {
    //     callback();
    //   }
    // };
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
        name: [
          { required: true, message: "请输入通道名称", trigger: "blur" },
          { max: 50, message: "通道名称最多50个字符", trigger: "blur" },
        ],
        // value2: [
        //   { required: true, trigger: "change", validator: validateDevice },
        // ],
        center: [
          { required: true, trigger: "change", validator: validatePlace },
        ],
      },
      checkboxlist: [], // 关联设备
      centerStr: "",
      tabact: "0",
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
  watch: {
    // checkboxlist(val) {
    //   if (val.length) this.$refs.ruleForm.clearValidate("value2");
    // },
    "$store.state.map.center": function (val) {
      this.form.center = val;
      this.centerStr = val.join(",");
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
    if (this.data.chanDeviceVos) {
      this.checkboxlist = deepClone(this.data.chanDeviceVos);
    }
    if (this.data.channelType || this.data.channelType == 0) {
      this.tabact = this.data.channelType;
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
        // 关联设备集合
        chanDeviceDtos: this.checkboxlist.map((item) => {
          return {
            deviceId: item.id,
            deviceName: item.name || item.cameraName,
          };
        }),
        longitude: this.form.center[0], // 经度
        latitude: this.form.center[1], // 纬度
        channelType: this.tabact,
        imageId, // 位置信息截图id
      };
      delete params.center;
      if (this.isUpdate) {
        return addPass(params).then(() => {
          this.$message({
            type: "success",
            message: "修改成功",
          });
        });
      } else {
        return addPass(params).then(() => {
          this.$message({
            type: "success",
            message: "新增成功",
          });
        });
      }
    },
    validate() {
      if (this.isCheck) {
        return Promise.resolve();
      } else {
        return new Promise((resolve, reject) => {
          this.$refs.ruleForm.validate((valid) => {
            if (valid) {
              resolve();
            } else {
              reject();
            }
          });
        });
      }
    },
    // 打开关联设备的弹窗
    handleShow() {
      this.$refs.model.openModel();
    },
    // 删除人员标签
    handleDel(index) {
      this.checkboxlist.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.cl-charge {
  .el-tag,
  .el-button {
    height: 30px;
  }
  .el-tag {
    margin-right: 5px;
  }
  .el-button {
    margin-left: 10px;
  }
}
.cl-map {
  width: 100%;
  height: 350px;
  margin-top: 20px;
}
</style>
