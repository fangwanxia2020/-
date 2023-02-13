<template>
  <div v-if="visitorList.length > 0" class="list">
    <div v-for="(item, index) in visitorList" :key="item.id" class="list-item">
      <div class="list-item-dot">
        <span>{{ index + 1 }}</span>
      </div>
      <div class="list-item-top">
        <div class="list-item-top-radius">
          <span>访</span>
        </div>
        <div class="list-item-top-info">
          <span>{{ item.name }}-{{ item.phone }}</span>
          <span>{{ item.identityCard }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "list",
  props: {
    visitorList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    //是否可编辑
    edit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    //编辑按钮
    editClick(item) {
      this.$emit("editClick", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.list {
  &-item {
    position: relative;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 10px;
    margin-bottom: 20px;
    &-dot {
      position: absolute;
      left: 1px;
      top: 1px;
      border-top-left-radius: 5px;
      width: 25px;
      height: 25px;
      font-size: 12px;
      background: linear-gradient(
        to bottom right,
        #f5f5f5 0%,
        #f5f5f5 50%,
        transparent 50%,
        transparent 100%
      );
      span {
        position: absolute;
        left: 5px;
      }
    }
    &-top {
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 0px 40px;
      &-radius {
        width: 40px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        background-color: var(--primaryColor);
        border-radius: 50%;
        margin-right: 40px;
        color: #fff;
      }
      &-info {
        display: flex;
        flex-direction: column;
        line-height: 1.7;
      }
    }
    &-visitor {
      display: flex;
      justify-content: flex-end;
      padding-top: 10px;
      padding-bottom: 10px;
    }
    &-upload {
      border-top: 2px solid #eee;
      margin-top: 15px;
      display: flex;
      &-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        &-span {
          font-weight: bold;
          padding: 20px 0px;
        }
        &-img {
          width: 240px;
          height: 240px;
        }
      }
    }
  }
}
::v-deep {
  .u-upload {
    flex: 0;
  }
}
</style>
