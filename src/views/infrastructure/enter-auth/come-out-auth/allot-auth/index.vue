<template>
  <div class="allot-auth">
    <el-tabs v-model="tabsActive">
      <el-tab-pane
        v-for="item in tabsList"
        :key="item.code"
        :label="item.name"
        :name="item.code"
      ></el-tab-pane>
    </el-tabs>
    <Area v-if="tabsActive == 3" @selections="getSelections" />
    <Bayonet v-if="tabsActive == 2" @selections="getSelections" />
    <Device
      v-if="tabsActive == 1"
      :resource-type="data.resourceType"
      @selections="getSelections"
    />
  </div>
</template>

<script>
import Area from "./area.vue";
import Bayonet from "./bayonet.vue";
import Device from "./device.vue";
import { authSave } from "@/api/infrastructure/come-out-auth.js";
import dataMixin from "@/mixin/data.js";
export default {
  components: {
    Area,
    Bayonet,
    Device,
  },
  mixins: [dataMixin],
  data() {
    return {
      tabsList: [
        { code: "3", name: "区域" },
        { code: "2", name: "卡口" },
        { code: "1", name: "设备" },
      ],
      tabsActive: "3",
      selections: [],
    };
  },
  methods: {
    getSelections(data) {
      this.selections = data;
    },
    request() {
      if (!this.selections.length) return;
      let arr = this.selections.map((item) => {
        if (this.tabsActive == 2 || this.tabsActive == 3) {
          return {
            resourceId: this.data.resourceId,
            resourceType: this.data.resourceType,
            objectId: item.id,
            objectType: this.tabsActive,
          };
        }
        if (this.tabsActive == 1) {
          return {
            resourceId: this.data.resourceId,
            resourceType: this.data.resourceType,
            objectId: item.id,
            objectType: this.tabsActive,
            deviceType: item.deviceType,
          };
        }
      });
      authSave(arr).then(() => {
        this.$message({
          type: "success",
          message: "授权成功",
        });
      });
    },
    validate() {
      // 使用了封装的el-dialog 而该封装组件默认有表单验证 重写表单默认的验证方法即可
      return Promise.resolve();
    },
  },
};
</script>

<style lang="scss" scoped></style>
