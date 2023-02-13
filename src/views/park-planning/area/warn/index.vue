<template>
  <div class="area-warn">
    <div class="left-box">
      <div class="cl-hea-title">规则配置</div>
      <div class="cl-check">
        <el-checkbox-group v-model="checkList">
          <div class="cl-flex">
            <el-checkbox :label="1">接近告警</el-checkbox>
            <div>
              <span class="cl-text cl-fl">距离</span>
              <el-input
                v-model.number="value1"
                clearable
                size="mini"
                onkeyup="value = value.replace(/[^\d]/g, '')"
              ></el-input>
              <span class="cl-text cl-fr">米</span>
            </div>
          </div>
          <el-checkbox :label="2">进入告警</el-checkbox>
          <el-checkbox :label="3">离开提示</el-checkbox>
          <div class="cl-flex">
            <el-checkbox :label="4">滞留告警</el-checkbox>
            <div>
              <span class="cl-text cl-fl">滞留限时</span>
              <el-input
                v-model.number="value2"
                clearable
                size="mini"
                onkeyup="value = value.replace(/[^\d]/g, '')"
              ></el-input>
              <span class="cl-text cl-fr">分钟</span>
            </div>
          </div>
          <el-checkbox :label="5">禁行告警</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div class="right-box">
      <div class="cl-hea-title">有效时间</div>
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="每周: " prop="checkList">
          <el-checkbox-group v-model="form.checkList">
            <el-checkbox :label="1">周一</el-checkbox>
            <el-checkbox :label="2">周二</el-checkbox>
            <el-checkbox :label="3">周三</el-checkbox>
            <el-checkbox :label="4">周四</el-checkbox>
            <br />
            <el-checkbox :label="5">周五</el-checkbox>
            <el-checkbox :label="6">周六</el-checkbox>
            <el-checkbox :label="7">周日</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="有效时段: " prop="time">
          <el-time-picker
            v-model="form.time"
            is-range
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            format="HH:mm"
            value-format="HH:mm"
            size="mini"
          >
          </el-time-picker>
        </el-form-item>
        <el-form-item label="长期有效: " prop="radio">
          <el-radio-group v-model="form.radio">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="有效日期: " prop="date">
          <el-date-picker
            v-model="form.date"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm"
            :default-time="['00:00:00', '23:59:59']"
            size="mini"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkList: [],
      form: {
        checkList: [],
        time: null,
        radio: null,
        date: null,
      },
      rules: {
        checkList: [
          { required: true, message: "请选择每周", trigger: "change" },
        ],
        radio: [
          { required: true, message: "请选择长期有效", trigger: "change" },
        ],
        date: [
          { required: true, message: "请选择有效日期", trigger: "change" },
        ],
      },
      value1: "",
      value2: "",
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.area-warn {
  height: calc(100% - 54px);
  display: flex;
  .left-box {
    width: 50%;
    height: 100%;
    .cl-check {
      .el-checkbox {
        display: block;
        margin-bottom: 30px;
      }
    }
    .cl-flex {
      display: flex;
      .el-input {
        width: 80px;
        margin-top: -5px;
      }
      ::v-deep .el-input--mini .el-input__inner {
        height: 28px !important;
        line-height: 28px !important;
      }
      ::v-deep .el-input--mini .el-input__icon {
        margin-top: -4px;
      }
      .cl-text {
        text-align: right;
        vertical-align: middle;
        font-size: 14px;
        color: #606266;
        padding-right: 12px;
        box-sizing: border-box;
      }
      .cl-fl {
        float: left;
        margin-left: 50px;
        width: 100px;
      }
      .cl-fr {
        float: right;
        padding-left: 12px;
      }
    }
  }
  .right-box {
    width: 50%;
    height: 100%;
  }
}
</style>
