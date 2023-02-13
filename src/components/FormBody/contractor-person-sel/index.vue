<template>
  <div class="clearfix">
    <right-table
      :personarr.sync="personarr"
      :personobj.sync="personobj"
      :is-person-base-id="isPersonBaseId"
    ></right-table>
  </div>
</template>

<script>
import dataMixin from "../mixin/data";
import rightTable from "./right-table.vue";
export default {
  components: {
    rightTable,
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
      type: Array,
      default: () => [],
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
      personarr: [], // "复选"时的缓存数据 将从右边table选中的数据存储下来
      personobj: { ...this.data }, // "单选"时的缓存数据 将从右边table选中的数据存储下来
    };
  },
  watch: {
    personarr(arr) {
      this.$emit("update:checkboxlist", arr); // "复选"的缓存数据有变化时 及时传到父组件中
    },
    personobj(obj) {
      this.$emit("update:radiodata", obj); // "单选"的缓存数据有变化时 及时传到父组件中
    },
  },
  mounted() {
    this.personarr = this.checkboxlist; // 刷新
  },
  methods: {
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
