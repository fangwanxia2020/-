<template>
  <div class="equip-list">
    <div
      v-for="(item, index) in list"
      :key="item.name"
      class="equip-list-item"
      @click="itemClick(item, index)"
    >
      <img
        :src="currentIndex == index ? item.active : item.icon"
        alt=""
        class="equip-list-item__img"
      />
      <span
        :class="[
          { 'equip-list-item__text__active': currentIndex == index },
          'equip-list-item__text',
        ]"
      >
        {{ item.name }}
      </span>
    </div>
  </div>
</template>

<script>
import video from "@/assets/images/map/video.png";
import videoActive from "@/assets/images/map/video_active.png";

import hot from "@/assets/images/map/hot.png";
import hotActive from "@/assets/images/map/hot_active.png";

import car from "@/assets/images/map/car.png";
import carActive from "@/assets/images/map/car_active.png";

import person from "@/assets/images/map/person.png";
import personActive from "@/assets/images/map/person_active.png";

import led from "@/assets/images/map/led.png";
import ledActive from "@/assets/images/map/led_active.png";

import door from "@/assets/images/map/door.png";
import doorActive from "@/assets/images/map/door_active.png";
export default {
  data() {
    return {
      list: [
        {
          icon: video,
          active: videoActive,
          name: "摄像头",
          type: "video",
        },
        {
          icon: hot,
          active: hotActive,
          name: "热力图",
        },
        {
          icon: car,
          active: carActive,
          name: "车辆定位",
        },
        {
          icon: person,
          active: personActive,
          name: "人员定位",
        },
        {
          icon: led,
          active: ledActive,
          name: "智慧灯杆",
        },
        {
          icon: door,
          active: doorActive,
          name: "门禁设备",
          type: "door",
        },
      ],
      currentIndex: null,
    };
  },
  methods: {
    itemClick(item, index) {
      this.currentIndex = index;
      this.$emit("itemClick", item);
    },
    setIndex(index) {
      this.currentIndex = index;
    },
  },
};
</script>

<style lang="scss" scoped>
.equip-list {
  position: fixed;
  top: 150px;
  left: 20px;
  background-color: #fff;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  &-item {
    display: flex;
    align-items: center;
    padding: 5px 0px;
    cursor: pointer;
    &__img {
      width: 16px;
      height: 16px;
    }
    &__text {
      margin-left: 10px;
    }
    &__text__active {
      color: #4188ef;
    }
  }
}
</style>
