<template>
  <div class="info">
    <div
      v-for="(item, index) in list"
      :key="index"
      :class="[{ 'info-item-active': currentIndex == index }, 'info-item']"
      @click="toolBarClick(item.type, index)"
    >
      <img v-if="item.url" :src="item.url" />
      <i v-else :class="item.icon"></i>
      <span class="info-item-text">{{ item.name }}</span>
    </div>
  </div>
</template>

<script>
import circle from "@/assets/images/map/circle.png";
import polygon from "@/assets/images/map/polygon.png";
import rectangle from "@/assets/images/map/rectangle.png";
export default {
  name: "tool-bar",
  data() {
    return {
      list: [
        // { type: "polyline", name: "线", icon: "el-icon-delete" },
        { type: "Circle", name: "圆选", url: circle },
        {
          type: "Rectangle",
          name: "矩形",
          url: rectangle,
        },
        {
          type: "Polygon",
          name: "多边形",
          url: polygon,
        },
        { type: "Distance", name: "测距", icon: "el-icon-notebook-2" },
        { type: "Clear", name: "清除", icon: "el-icon-delete" },
      ],
      currentIndex: null,
    };
  },
  methods: {
    toolBarClick(type, index) {
      if (index == this.list.length - 1) {
        console.log(index);
        this.currentIndex = null;
      } else {
        this.currentIndex = index;
      }
      this.$emit("toolBarClick", type);
    },
    setIndex(index) {
      this.currentIndex = index;
    },
  },
};
</script>

<style lang="scss" scoped>
.info {
  top: 75px;
  color: #444;
  height: auto;
  font-family: arial;
  right: 20px;
  position: fixed;
  z-index: 40;
  border: solid 1px var(--primaryColor);
  border-radius: 4px;
  background-color: #fff;
  display: flex;
  font-size: 12px;

  &-item {
    display: flex;
    align-items: center;
    border-right: 1px dashed #eee;
    padding: 8px 10px;
    cursor: pointer;
    &-text {
      margin-left: 5px;
    }
    img {
      width: 12px;
      height: 12px;
    }
  }
  &-item-active {
    color: var(--primaryColor);
  }
}
</style>
