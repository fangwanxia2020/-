<template>
  <div class="reserve-card">
    <div class="reserve-card-title">
      <div>
        <span>预约单号：</span>
        <span>{{ info.visitorNo }}</span>
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
    <div class="reserve-card-line" />
    <div class="reserve-card-contnet">
      <div class="reserve-card-content-top">
        <div class="reserve-card-content-top-left">
          <div class="name">{{ info.name }}</div>
        </div>
        <div class="reserve-card-content-icon">
          <img src="@/assets/images/arrow-right.png" alt="" />
        </div>
        <div class="name">{{ info.receivePersonName }}</div>
      </div>
      <div class="reserve-card-content-person">
        <div class="reserve-card-content-tip">临时访客</div>
        <div class="reserve-card-content-tip">接待人</div>
      </div>
      <div class="reserve-card-content-visit">
        <div>
          拜访时间：{{ info.visitStartTime | splitTime }}至{{
            info.visitEndTime | splitTime
          }}
        </div>
      </div>
      <div class="reserve-card-content-reason">
        <div class="reserve-card-content-reason-text">
          <span>拜访事由: {{ checkVisitReasonName(info.visitReason) }}</span>
        </div>
        <div class="reserve-card-content-reason-btn">
          <el-button round size="mini" class="check-btn" @click="check(info)">
            查看
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "reserve-card",
  props: {
    info: {
      type: Object,
      default: () => {},
    },
    visitReasonList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      checked: false,
    };
  },
  computed: {
    checkVisitReasonName() {
      return (num) => {
        let newName;
        this.visitReasonList.forEach((item) => {
          if (item.code == num) {
            newName = item.name;
          }
        });
        return newName;
      };
    },
  },
  methods: {
    changeRadio(e, info) {
      console.log(e);
      console.log(info);
      this.$emit("changeRadio", { ...info, checked: e });
    },
    check(info) {
      this.$emit("check", info);
    },
  },
};
</script>

<style lang="scss" scoped>
.reserve-card {
  font-size: 12px;
  background: linear-gradient(to right, #026dff, #6851b6);
  padding: 20px;
  color: #fff;
  border-radius: 10px;
  margin-bottom: 10px;
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
      padding-top: 10px;
    }
    &-person {
      display: flex;
      justify-content: space-between;
      padding: 10px 0px;
      align-items: center;
    }
    &-icon {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      img {
        width: 60px;
        height: 8px;
      }
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
