<template>
  <div class="page-wrapper">
    <el-tabs v-if="showTab" v-model="activeName">
      <el-tab-pane label="访客" name="first"> </el-tab-pane>
      <el-tab-pane label="人车" name="second"> </el-tab-pane>
      <el-tab-pane label="机具" name="third"> </el-tab-pane>
    </el-tabs>
    <div class="page-wrapper-content">
      <reserve-table v-if="activeName == 'first'" :tree-list="treeList">
      </reserve-table>
      <car-table
        v-if="activeName == 'second'"
        :tree-list="treeList"
      ></car-table>
      <equipment-table
        v-if="activeName == 'third'"
        :tree-list="treeList"
      ></equipment-table>
    </div>
  </div>
</template>
<script>
const reserveTable = () => import("./components/reserve-table.vue");
const carTable = () => import("./components/car-table.vue");
const equipmentTable = () => import("./components/equipment-table.vue");
export default {
  components: { reserveTable, carTable, equipmentTable },
  props: {
    theAct: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      activeName: "first",
      treeList: [],
      showTab: true,
    };
  },
  computed: {},
  watch: {
    theAct: {
      handler: function (val) {
        if (val) {
          this.showTab = false;
          this.activeName = val;
        }
      },
      immediate: true,
    },
  },
  mounted() {
    if (this.$route.query.type) {
      switch (this.$route.query.type) {
        case "reserve":
          this.activeName = "first";
          break;
        case "car":
          this.activeName = "second";
          break;
        case "qeuiment":
          this.activeName = "third";
          break;
        default:
          this.activeName = "first";
          break;
      }
    }
  },
  created() {
    // 获取树
    this.getOrgList().then((res) => {
      this.treeList = JSON.parse(JSON.stringify(res.data));
    });
  },

  methods: {},
};
</script>
<style lang="scss" scoped></style>
