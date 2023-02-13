<template>
  <div
    :class="[
      { 'explosion-card-explosion': info.applyCardType == 1 },
      { 'explosion-card-common': info.applyCardType == 0 },
      'explosion-card',
    ]"
  >
    <div class="explosion-card-title">
      <div>
        <span>申请批次：</span>
        <span class="explosion-card-underline">{{ info.code }}</span>
      </div>
      <!-- <el-radio v-model="info.radio" label="1" @change="changeRadio(info)">
        {{ "" }}
      </el-radio> -->
      <el-checkbox
        v-model="info.checked"
        :disabled="info.checked"
        @change="changeRadio($event, info)"
      ></el-checkbox>
    </div>
    <div class="explosion-card-line" />
    <div class="explosion-card-contnet">
      <div class="explosion-card-content-top">
        <div class="explosion-card-content-top-left">
          <div class="name explosion-card-underline">
            {{ info.applyOrgName }}
          </div>
        </div>
        <div class="name explosion-card-underline">
          {{ info.applyPersonName }}
        </div>
      </div>
      <div class="explosion-card-content-person">
        <div class="explosion-card-content-tip">承包商名称</div>
        <div class="explosion-card-content-tip">申请人</div>
      </div>
      <div class="explosion-card-content-top">
        <div class="explosion-card-content-top-left">
          <div class="name">
            {{ info.applyCardType == 0 ? "普通卡" : "防爆卡" }}
          </div>
        </div>
        <div class="name">{{ info.applyNum }}</div>
      </div>
      <div class="explosion-card-content-person">
        <div class="explosion-card-content-tip">卡片类型</div>
        <div class="explosion-card-content-tip">数量 (张)</div>
      </div>
      <div class="explosion-card-content-visit">
        <div>
          <span>申请时间：</span>
          <span>{{ info.createTime }}</span>
        </div>
        <div class="explosion-card-content-visit-item">
          <span>有效期：</span>
          <span>
            {{ info.validBeginTime | splitTime }} 至
            {{ info.validEndTime | splitTime }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "explosion-card",
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      checked: false,
    };
  },
  methods: {
    changeRadio(e, info) {
      this.$emit("changeRadio", { ...info, checked: e });
    },
    check(info) {
      this.$emit("check", info);
    },
  },
};
</script>

<style lang="scss" scoped>
.explosion-card {
  font-size: 12px;
  padding: 20px;
  color: #fff;
  border-radius: 10px;
  margin-bottom: 10px;
  &-underline {
    border-bottom: 2px solid #fff;
  }
  &-explosion {
    background: linear-gradient(to left, #ffa937, #ff7201);
  }
  &-common {
    background: linear-gradient(to left, #44bbff, #026dff);
  }
  &-title {
    display: flex;
    justify-content: space-between;
  }
  &-line {
    height: 1px;
    width: 100%;
    background-color: #e8e8e8;
    opacity: 0.2;
    margin: 15px 0px;
  }
  &-content {
    &-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      .name {
        font-size: 22px;
        font-weight: 500;
      }
    }
    &-visit {
      &-item {
        padding-top: 10px;
      }
    }
    &-person {
      display: flex;
      justify-content: space-between;
      padding: 5px 0px;
      align-items: center;
      padding-bottom: 20px;
    }
    &-reason {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 10px;
      &-text {
        flex: 3;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      &-btn {
        flex: 2;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
.check-btn {
  color: #6851b6;
}
::v-deep {
  .el-checkbox__inner {
    border-radius: 50% !important;
  }
  .el-checkbox__input.is-disabled .el-checkbox__inner {
    background-color: #fff !important;
    border-color: #fff !important;
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
    border-color: #6851b6;
  }
}
</style>
