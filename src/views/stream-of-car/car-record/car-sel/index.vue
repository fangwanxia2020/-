<template>
  <div class="clearfix">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="园区车辆" name="first"
        ><left-table
          :personarr-left.sync="personarrLeft"
          :personobj-left.sync="personobjLeft"
        ></left-table
      ></el-tab-pane>
      <el-tab-pane label="承包商车辆" name="second"
        ><right-table
          :personarr.sync="personarr"
          :personobj.sync="personobj"
        ></right-table
      ></el-tab-pane>
    </el-tabs>
    <el-row :gutter="20">
      <el-col :span="3" :xs="24">
        <div style="text-align: right; line-height: 30px">已选车辆</div>
      </el-col>
      <el-col :span="21" :xs="24">
        <template v-if="obj && obj.personarrLeft[0]">
          <el-tag
            v-for="(item, index) in obj.personarrLeft"
            :key="index"
            style="margin-right: 10px; margin-bottom: 5px"
            closable
            class="nick-name"
            @close="handleClose4(item)"
          >
            {{ item.vehicleCode }}
          </el-tag>
        </template>
        <template v-if="obj && obj.personarr[0]">
          <el-tag
            v-for="(item, index1) in obj.personarr"
            :key="index1"
            style="margin-right: 10px; margin-bottom: 5px"
            closable
            class="nick-name"
            @close="handleClose5(item)"
          >
            {{ item.vehicleCode }}
          </el-tag>
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import dataMixin from "@/mixin/data";
import rightTable from "./right-table.vue";
import leftTable from "./left-table.vue";
export default {
  components: {
    rightTable,
    leftTable,
  },
  mixins: [dataMixin],
  props: {
    // 复选
    isSelect: {
      type: Boolean,
      default: false,
    },
    // 复选时选中的数据
    checkboxlist: {
      type: Object,
      Array,
      default: () => {},
    },
    // 单选
    isRadio: {
      type: Boolean,
      default: false,
    },
    // 单选时选中的数据
    radiodata: {
      type: Object,
      default: () => {},
    },
    isPersonBaseId: {
      type: Boolean,
      default: true,
    },
  },
  provide() {
    return {
      isSelect: this.isSelect,
      isRadio: this.isRadio,
    };
  },
  data() {
    return {
      leftSelDataArr: [], //被选中的组织/人员
      activeName: "first", //被选中的组织/人员
      personarr: [], // "复选"时的缓存数据 将从右边table选中的数据存储下来
      personarrLeft: [], // "复选"时的缓存数据 将从左边table选中的数据存储下来
      personobj: { ...this.data }, // "单选"时的缓存数据 将从右边table选中的数据存储下来
      personobjLeft: { ...this.data }, // "单选"时的缓存数据 将从左边边table选中的数据存储下来
      obj: {
        personarr: [],
        personarrLeft: [],
      }, // "单选"时的缓存数据 将从左边边table选中的数据存储下来
    };
  },
  watch: {
    personarr(arr) {
      console.log(arr, "6666666");
      this.obj.personarr = arr;
      this.$emit("update:checkboxlist", this.obj); // "复选"的缓存数据有变化时 及时传到父组件中
    },
    personarrLeft(arr) {
      console.log(arr, "777777");
      this.obj.personarrLeft = arr;
      this.$emit("update:checkboxlist", this.obj); // "复选"的缓存数据有变化时 及时传到父组件中
    },
    personobj(obj) {
      this.$emit("update:radiodata", obj); // "单选"的缓存数据有变化时 及时传到父组件中
    },
  },
  mounted() {
    console.log(this.checkboxlist, "hghghghggh");
    this.personarr = this.checkboxlist.personarr; // 刷新
    this.personarrLeft = this.checkboxlist.personarrLeft; // 刷新
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    request() {
      return;
    },
    validate() {
      // 使用了封装的el-dialog 而该封装组件默认有表单验证 重写表单默认的验证方法即可
      return Promise.resolve();
    },
  },
};
</script>

<style lang="scss" scoped></style>
