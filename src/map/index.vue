<template>
  <div :id="id" class="map-view">
    <!-- <SearchInput v-if="hasSearch" @searchVal="searchVal" /> -->
    <p v-show="showTips" class="opts-tips">{{ tipsText }}</p>
    <ToolBar v-if="hasTool" @setDropByself="setDropByself" />
  </div>
</template>

<script>
import ArcGIS from "@/map/map/index.js";
const Map = new ArcGIS();
import ToolBar from "@/map/components/ToolBar.vue";
// import SearchInput from "@/map/components/SearchInput.vue";
export default {
  components: {
    ToolBar,
    // SearchInput,
  },
  props: {
    // 是否显示搜索组件
    hasSearch: {
      type: Boolean,
      default: true,
    },
    // 是否显示描绘组件
    hasTool: {
      type: Boolean,
      default: true,
    },
    // 显示位置
    center: {
      type: Array,
      default: () => [108.67362684779546, 21.76932300907748],
    },
    // id
    id: {
      type: String,
      default: "map-id",
    },
    // 是否可以锚点
    shouldClick: {
      type: Boolean,
      default: true,
    },
    // 区域管理使用地图绘制时要提示绘制的使用方式
    isArea: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      map: null,
      view: null,
      showTips: false,
      tipsText: "",
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    // 初始化地图
    initMap() {
      Map.init(this.id, this.center, this.shouldClick).then((res) => {
        this.map = res.map;
        this.view = res.view;
      });
    },
    // 标绘（手动）
    setDropByself(type) {
      if (type == "clear") {
        this.view.graphics.removeAll();
        this.$store.commit("map/SET_SCREENSHOT", "");
      } else {
        Map.drawActiveByself(type);
        this.$emit("getDrawType", type);
        if (this.isArea) {
          this.showTips = true;
          // 多边形 polygon
          if (type == "polygon") {
            this.tipsText = "左键单击开始绘制，左键双击结束绘制";
          }
          // 圆 circle
          if (type == "circle") {
            this.tipsText = "左键单击后滑动，左键单击完成绘制";
          }
          setTimeout(() => {
            this.showTips = false;
          }, 6000);
        }
      }
    },
    // 查询
    searchVal(val) {
      console.log(val);
      // var geocoder = new AMap.Geocoder();
      // geocoder.getLocation(val, (status, result) => {
      //   console.log(status, result);
      //   if (status === "complete" && result.geocodes.length) {
      //     const lngLat = result.geocodes[0].location;
      //     const point = gcj02towgs84(lngLat.lng, lngLat.lat); //标准经纬度
      //     // console.log("🚀 ~ file: App.vue ~ line 208 ~ geocoder.getLocation ~ point", point)
      //     // wgs84_To_epsg4545(point[0],point[1])
      //     // console.log("🚀 ~ file: App.vue ~ line 207 ~ geocoder.getLocation ~ lngLat",   wgs84_To_epsg4545(point[0],point[1]))
      //     this.view.center = point;
      //     this.view.zoom = 6;
      //   } else {
      //     this.$message.error("获取失败");
      //   }
      // });
    },
  },
};
</script>

<style lang="scss" scoped>
.map-view {
  width: 100%;
  height: 100%;
  position: relative;
  .search {
    left: 0;
  }
  .opts-tips {
    padding: 0 5px;
    height: 25px;
    line-height: 25px;
    font-size: 12px;
    background-color: #fff;
    color: #000;
    position: absolute;
    border-radius: 5px;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
