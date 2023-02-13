<template>
  <div class="area-map">
    <ArcgisMap :id="'area-map'" :should-click="false" :is-area="true" />
  </div>
</template>

<script>
import ArcgisMap from "@/map/index.vue";
export default {
  components: {
    ArcgisMap,
  },
};
</script>

<style lang="scss" scoped>
.area-map {
  width: 100%;
  height: calc(100% - 54px);
}
</style>
