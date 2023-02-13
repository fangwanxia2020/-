<template>
  <div
    v-if="Object.keys(cardData).length > 0"
    :class="cardData.cardType == 0 ? 'right-content' : 'right-content-renewal'"
  >
    <div class="content-card-type">
      <span v-if="cardData.cardType == 0">普通卡</span>
      <span v-else>防爆卡</span>
      <el-tag
        color="#fff"
        size="mini"
        :class="cardData.cardType == 0 ? 'commont-tag' : 'renewal-tag'"
      >
        {{ cardData.isOnline == 1 ? "正常" : "异常" }}
      </el-tag>
    </div>
    <div class="content-line-box">
      <div
        :class="
          cardData.cardType == 0 ? 'content-line' : 'content-line-renewal'
        "
      ></div>
    </div>
    <div class="content">
      <div class="content-row">
        <div class="content-col content-text">{{ cardData.cardNo }}</div>
        <div class="content-col content-text">
          {{ cardData.cardType == 0 ? "普通卡" : "防爆卡" }}
        </div>
      </div>
      <div class="content-row">
        <div class="content-col">定位卡号码</div>
        <div class="content-col">定位卡型号</div>
      </div>
      <div class="content-row">
        <div class="content-col content-text">{{ cardData.cardImei }}</div>
        <div class="content-col content-text">{{ cardData.cardSn }}</div>
      </div>
      <div class="content-row">
        <div class="content-col">ImEI号</div>
        <div class="content-col">SN号</div>
      </div>
      <div class="content-flex">
        <div>剩余电量</div>
        <div class="content-power">
          <div class="content-power-top">
            <el-image
              :src="imgFilter(cardData.remainingCapacity)"
              alt=""
              style="width: 10px; height: 12px; margin-right: 3px"
            />
            <span>{{ cardData.remainingCapacity }}%</span>
          </div>
          <el-progress
            :percentage="cardData.remainingCapacity"
            :color="customColors"
            :show-text="false"
          ></el-progress>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    cardData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      customColors: [
        { color: "#F44848", percentage: 10 },
        { color: "#FFB137", percentage: 20 },
        { color: "#67C23A", percentage: 50 },
      ],
    };
  },
  computed: {
    imgFilter() {
      return (num) => {
        if (num > 50) {
          return require("@/assets/images/chargeImg/greenCharge.png");
        } else if (num < 50 && num > 10) {
          return require("@/assets/images/chargeImg/yellowCharge.png");
        } else {
          return require("@/assets/images/chargeImg/redCharge.png");
        }
      };
    },
    remainingCapacityColor() {
      return (num) => {
        if (num > 50) {
          return {
            color: "rgb(90,186,45)",
          };
        } else if (num < 50 && num > 10) {
          return {
            color: "rgb(255,163,43)",
          };
        } else {
          return {
            color: "rgb(238,47,57)",
          };
        }
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.right-content-renewal {
  border-radius: 16px;
  background: linear-gradient(to left, #ffa937, #ff7201);
}
.right-content {
  border-radius: 16px;
  background: linear-gradient(to left, #44bbff, #026dff);
}
.content-card-type {
  color: #fff;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  .renewal-tag {
    color: #ff7201;
    border-radius: 2px;
  }
  .common-tag {
    color: #026dff;
    border-radius: 2px;
  }
}
.content-line-box {
  padding: 0px 20px;
}
.content-line {
  height: 2px;
  width: 100%;
  background-color: #e8e8e8;
  opacity: 0.2;
}
.content-line-renewal {
  height: 2px;
  width: 100%;
  background-color: #e8e8e8;
  opacity: 0.2;
}
.content {
  color: #fff !important;
  padding: 15px 20px;
  font-size: 12px;
  &-row {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
  }
  &-flex {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  &-power {
    width: 30%;
    margin-left: 20px;
    &-top {
      margin-bottom: 2px;
      display: flex;
      align-items: center;
    }
  }
  &-text {
    margin-top: 10px;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
