<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form :model="ruleForm" :rules="rules" label-width="150px">
          <el-form-item label="卡号/手机号/姓名" prop="name">
            <el-autocomplete
              v-model="reserveNum"
              popper-class="free-card-autocomplete"
              :fetch-suggestions="querySearchAsync"
              :trigger-on-focus="false"
              clearable
              size="small"
              placeholder="请输入卡号/手机号/姓名"
              @select="handleSelect"
              @blur="autocompleteBlur"
            >
              <i slot="suffix" class="el-icon-search el-input__icon"> </i>
            </el-autocomplete>
            <el-button type="primary" style="margin-left: 30px">
              确定
            </el-button>
          </el-form-item>
          <el-form-item label="原因：" prop="region">
            <el-select
              v-model="ruleForm.reason"
              placeholder="请选择"
              @change="selectCardNo"
            >
              <el-option
                v-for="item in freezeReasonList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              >
              </el-option>
            </el-select>
            <div style="height: 10px"></div>
            <el-input
              v-model="textarea"
              type="textarea"
              placeholder="请输入内容"
              maxlength="300"
              show-word-limit
            >
            </el-input>
          </el-form-item>
          <div style="padding-left: 150px">
            <Card :card-data="bindCardData" />
          </div>
        </el-form>
      </el-col>
      <el-col :span="12">
        <div class="right-title">
          <span>
            <!-- 已读:5张 -->
          </span>
          <div>
            <el-button
              v-if="operateType == 'freeze'"
              type="primary"
              :disabled="btnDisabled"
              @click="freezeLoss"
            >
              一键冻结
            </el-button>
            <el-button
              v-if="operateType == 'freeze'"
              type="primary"
              :disabled="btnDisabled"
              @click="thawLoss"
            >
              一键解冻
            </el-button>
          </div>
          <el-button
            v-if="operateType == 'report'"
            type="primary"
            :disabled="btnDisabled"
            @click="reportLoss"
          >
            一键挂失
          </el-button>
        </div>
        <el-table :data="personCardList" style="width: 100%">
          <el-table-column
            label="姓名"
            show-overflow-tooltip
            prop="name"
          ></el-table-column>
          <el-table-column
            label="身份证"
            show-overflow-tooltip
            prop="idNo"
          ></el-table-column>
          <el-table-column label="卡号" prop="cardNo"></el-table-column>
          <el-table-column
            label="操作"
            align="right"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="handleDel(scope.$index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getBindInfo,
  cardLoseRec,
  freezeCard,
  getCardInfo,
} from "@/api/location-card-management/index.js";
import Card from "@/components/card/index.vue";
export default {
  components: { Card },
  props: {
    operateType: {
      type: String,
      default: "first",
    },
  },
  data() {
    return {
      btnDisabled: true,
      reserveNum: "",
      textarea: "",
      thawStatusId: "", // 解冻状态id
      freezeStatusId: "", // 冻结状态id
      ruleForm: {},
      bindCardData: {},
      rules: {},
      personCardList: [],
      freezeReasonList: [],
    };
  },
  computed: {},
  watch: {
    operateType() {
      this.init();
    },
    personCardList(val) {
      if (val.length) {
        this.btnDisabled = false;
      } else {
        this.btnDisabled = true;
      }
    },
    // reserveNum(val) {
    //   if (val == "") {
    //     this.btnDisabled = true;
    //   }
    // },
  },
  mounted() {
    this.$getTypeCode("gatedpark_freeze_card_reason").then((res) => {
      this.freezeReasonList = res.data;
    });
    this.$getTypeCode("loc_card_status").then((res) => {
      res.data.forEach((item) => {
        // 解冻
        if (item.code == "01") {
          this.thawStatusId = item.id;
        }
        // 冻结
        if (item.code == "05") {
          this.freezeStatusId = item.id;
        }
      });
    });
  },
  methods: {
    querySearchAsync(queryString, cb) {
      if (queryString) {
        let reserveData = {
          expr: [
            {
              expression: "LIKE",
              key: "cardNo",
              value: queryString,
            },
            {
              expression: "OR",
              key: "objectType",
              value: [
                {
                  expression: "LIKE",
                  key: "name",
                  value: queryString,
                },
                {
                  expression: "OR",
                  key: "id",
                  value: {
                    expression: "LIKE",
                    key: "phone",
                    value: queryString,
                  },
                },
              ],
            },
          ],
          pageNum: 1,
          pageSize: 20,
        };
        let fn;
        this.operateType == "freeze" ? (fn = getCardInfo) : (fn = getBindInfo);
        fn(reserveData).then((res) => {
          if (res.data && res.data.list.length > 0) {
            const arr = res.data.list.map((item) => {
              return {
                value: item.bindObject + "-" + item.cardNo,
                ...item,
              };
            });
            cb(arr);
          } else {
            cb([{}]);
          }
        });
      }
      // }
    },
    // 搜索框失去焦点
    autocompleteBlur() {
      this.reserveNum = "";
    },
    // 挂失
    reportLoss() {
      let resData = [];
      this.personCardList.forEach((item) => {
        resData.push({
          bindId: "1588013619336007682", // 暂时写死
          bindObjectType: 0, // 暂时写死
          cardId: item.id,
          cardNo: item.cardNo,
          dutyOrgId: item.orgId,
          dutyOrgType: 1, // 暂时写死
          reportPersonId: "1588013619336007682",
        });
      });
      cardLoseRec(resData).then((res) => {
        if (res.code != 200) return this.$messgae.error(res.msg);
        this.$msgSuccess("挂失成功");
      });
    },
    // 冻结
    freezeLoss() {
      let resData = [];
      this.personCardList.forEach((item) => {
        resData.push({
          cardStatusId: this.freezeStatusId,
          cardNo: item.cardNo,
        });
      });
      freezeCard(resData).then((res) => {
        if (res.code != 200) return this.$messgae.error(res.msg);
        this.$msgSuccess("冻结成功");
      });
    },
    // 解冻
    thawLoss() {
      let resData = [];
      this.personCardList.forEach((item) => {
        resData.push({
          cardStatusId: this.thawStatusId,
          cardNo: item.cardNo,
        });
      });
      freezeCard(resData).then((res) => {
        if (res.code != 200) return this.$messgae.error(res.msg);
        this.$msgSuccess("解冻成功");
        // this.init();
      });
    },
    //卡选择
    handleSelect(item) {
      this.btnDisabled = false;
      this.bindCardData = item;
      if (this.personCardList.length) {
        let bool = false;
        this.personCardList.forEach((items) => {
          if (items.id == item.id) {
            bool = true;
          }
        });
        if (!bool) {
          this.personCardList.push(item);
        }
      } else {
        this.personCardList.push(item);
      }

      this.ruleForm = {};
      this.textarea = "";
    },
    // 删除
    handleDel(index) {
      this.personCardList.splice(index, 1);
    },
    // 初始化
    init() {
      this.reserveNum = "";
      this.textarea = "";
      this.ruleForm = {};
      this.bindCardData = {};
      this.rules = {};
      this.personCardList = [];
    },
    selectCardNo() {
      if (this.ruleForm.reason == "4") {
        this.textarea = "";
        return;
      }
      this.freezeReasonList.forEach((item) => {
        if (item.code == this.ruleForm.reason) {
          this.textarea = item.name;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.phone-input {
  /deep/ .el-input {
    width: 33%;
  }
}
.right-title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
</style>
<style lang="scss">
.free-card-autocomplete {
  .el-scrollbar__wrap {
    min-height: 50px !important;
  }
}
</style>
