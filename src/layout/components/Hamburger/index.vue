<template>
  <div class="hamburgerBox" @click="toggleClick">
    <span v-if="isActive" style="margin-right: 50px">收起/展开</span>
    <ty-icon
      type="hamburger"
      class="hamburger"
      :class="{ 'is-active': isActive }"
    ></ty-icon>
  </div>
</template>
<script>
export default {
  name: "hamburger",
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toggleClick() {
      this.$emit("toggleClick");
    },
  },
};
</script>
<style scoped lang="scss">
.hamburgerBox {
  font-size: 14px;
  padding: 0 10px;
  line-height: 50px;
  color: #161616;
  text-align: center;
  position: relative;

  .hamburger {
    cursor: pointer;
    font-size: 24px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 0 !important;
  }

  .hamburger.is-active {
    position: absolute;
    right: 20px;
    top: 0;
    transform: rotate(180deg);
  }
}
</style>
