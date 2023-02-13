<template>
  <el-drawer v-bind="$attrs" v-on="$listeners">
    <div class="body-wrapper">
      <slot />
    </div>
    <slot name="footer" />
  </el-drawer>
</template>

<script>
export default {
  name: "Drawer",
};
</script>

<style lang="scss" scoped>
.body-wrapper {
  padding: 0 20px;
}
</style>
