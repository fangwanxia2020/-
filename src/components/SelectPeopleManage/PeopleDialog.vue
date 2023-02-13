<template>
  <ty-dialog
    :show.sync="dialogVisibel"
    :title="title"
    :width="type == 'system' ? '1100px' : '800px'"
    :on-ok="okFun"
    :append-to-body="true"
  >
    <div class="people-dialog" :class="{ radioMode: !multiple }">
      <people-view
        v-if="show && type == 'system'"
        ref="peopleView"
        :multiple="multiple"
        :car-type="carType"
        :data="data"
      ></people-view>
      <contractor-people
        v-if="show && type == 'contractor'"
        ref="peopleView"
        :contractor-id="contractorId"
        :multiple="multiple"
        :car-type="carType"
        :data="data"
      ></contractor-people>
    </div>
  </ty-dialog>
</template>
<script>
import PeopleView from "./PeopleView";
import ContractorPeople from "./ContractorPeople";
export default {
  name: "people-dialog",
  components: {
    PeopleView,
    ContractorPeople,
  },
  props: {
    show: {
      //弹出窗的显示隐藏
      type: Boolean,
      default: false,
    },
    data: {
      //选择的人员
      // type: Array,
      type: Array,
    },
    title: {
      //标题
      type: String,
      default: "选择人员",
    },
    //多选模式
    multiple: {
      type: Boolean,
      default: false,
    },
    //类型
    type: {
      type: String,
      default: "system",
    },
    //是否显示组织或者承包商
    carType: {
      type: Number,
      // default: false
    },
    //承包商id,当类型为contractor时生效
    contractorId: {
      type: [String, Number],
      default: "",
    },
  },
  data() {
    return {
      dialogVisibel: false,
    };
  },
  computed: {},
  watch: {
    //不能直接修改props的值所以要定义多一个变量
    show(val) {
      this.dialogVisibel = val;
      if (!this.show) return;
    },
    //弹出窗组件显示隐藏状态发生改变要同步触发父级元素的修改
    dialogVisibel(val) {
      this.$emit("update:show", val);
    },
    data(val) {},
  },
  created() {
    // console.log('====================================');
    // console.log(this.data);
    // console.log('====================================');
  },
  mounted() {},
  methods: {
    okFun() {
      this.dialogVisibel = false;
      const checkList = this.$refs.peopleView.getCheckList();
      this.$emit("onOk", checkList);
    },
  },
};
</script>
<style lang="scss" scoped>
.radioMode {
  ::v-deep .el-table--border th:first-child .cell .el-checkbox {
    display: none;
  }
}
</style>
