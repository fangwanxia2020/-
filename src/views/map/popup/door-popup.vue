<template>
  <div class="door-popup">
    <div class="door-popup-top">
      <div class="door-popup-top-title">
        <span>{{ info.title }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "door-popup",
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.door-popup {
  &-top {
    &-title {
      padding: 5px 10px;
      font-weight: bold;
    }
  }
  &-content {
    width: 400px;
    height: 250px;
  }
}
</style>
