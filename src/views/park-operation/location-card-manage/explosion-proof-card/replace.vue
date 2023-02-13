<template>
  <div class="edit-content">
    <div class="edit-content-body">
      <el-row>
        <el-col :span="10" :offset="2">
          <div class="tab-title">
            <div class="cl-hea-title">现持卡</div>
          </div>
          <div class="edit-content-body-box">
            <el-form>
              <el-form-item label="卡号/手机号/姓名:">
                <el-autocomplete
                  v-model="searchValue"
                  :fetch-suggestions="bindCardQuerySearchAsync"
                  :trigger-on-focus="false"
                  clearable
                  size="small"
                  placeholder="请输入卡号/手机号/姓名"
                  @select="handleSelect"
                >
                  <i slot="suffix" class="el-icon-search el-input__icon"> </i>
                </el-autocomplete>
              </el-form-item>
            </el-form>
            <div v-if="Object.keys(bindCardData).length > 0" class="card">
              <div v-if="bindCardData.bindType == 0" class="card-userInfo">
                <div class="card-userInfo-item">
                  <span>姓名:</span>
                  <span>{{ bindCardData.name }}</span>
                </div>
                <div class="card-userInfo-item">
                  <span>身份证号:</span>
                  <span>{{ bindCardData.idNo }}</span>
                </div>
                <div class="card-userInfo-item">
                  <span>手机号:</span>
                  <span>{{ bindCardData.phone }}</span>
                </div>
                <div class="card-userInfo-item">
                  <span>单位:</span>
                  <span>{{ bindCardData.orgName }}</span>
                </div>
                <!-- <div class="card-userInfo-item">
                  <span>部门:</span>
                  <span>{{ bindCardData.name }}</span>
                </div> -->
              </div>
              <div v-else class="card-userInfo">
                <div class="card-userInfo-item">
                  <span>车牌号：</span>
                  <span>{{ bindCardData.vehicleCode }}</span>
                </div>
              </div>
              <Card :card-data="bindCardData" />
            </div>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="tab-title">
            <div class="cl-hea-title">待绑卡</div>
          </div>
          <div class="edit-content-body-box">
            <el-form label-width="100px" label-position="left">
              <el-form-item label="卡号:">
                <el-autocomplete
                  v-model="cardSearchValue"
                  :fetch-suggestions="cardQuerySearchAsync"
                  :trigger-on-focus="false"
                  clearable
                  size="small"
                  placeholder="请输入关键字搜索或读卡"
                  @select="handlCardeSelect"
                >
                  <i slot="suffix" class="el-icon-search el-input__icon"> </i>
                </el-autocomplete>
              </el-form-item>
              <div v-if="Object.keys(cardData).length > 0" class="card-wrapper">
                <Card :card-data="cardData" />
              </div>
              <el-form-item
                v-if="Object.keys(cardData).length > 0"
                label="换卡原因:"
              >
                <el-select
                  v-model="cardForm.reasonId"
                  placeholder="请选择换卡原因"
                  size="small"
                  @change="replaceReasonChange"
                >
                  <el-option
                    v-for="(item, idx) in replaceReasonList"
                    :key="idx"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
                <div style="height: 10px"></div>
                <el-input
                  v-model="cardForm.remark"
                  type="textarea"
                  placeholder="请选择或输入其他原因"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="edit-content-footer">
      <el-button type="primary" :disabled="btnDisabled" @click="replaceCard">
        一键换卡
      </el-button>
    </div>
  </div>
</template>

<script>
import {
  getBindInfo,
  getLocCardList,
  reBindingCard,
} from "@/api/location-card-management/index.js";
import Card from "@/components/card/index.vue";
export default {
  name: "replace-card",
  components: {
    Card,
  },
  data() {
    return {
      searchValue: null,
      cardSearchValue: null,
      cardForm: {
        reasonId: null,
        reason: null,
        remark: null,
      },
      bindCardData: {},
      cardData: {},
      replaceReasonList: [], //换卡原因
      emptyCardId: null,
      flag: false,
    };
  },
  computed: {
    btnDisabled() {
      return (
        Object.keys(this.bindCardData).length == 0 ||
        Object.keys(this.cardData).length == 0
      );
    },
  },
  created() {
    this.$getTypeCode("gatedpark_replace_card_reason").then((res) => {
      this.replaceReasonList = res.data;
    });
    this.$getTypeCode("loc_card_status").then((res) => {
      const arr = res.data.filter((item) => item.name.indexOf("空闲") != -1);
      if (arr.length > 0) {
        this.emptyCardId = arr[0].id;
      } else {
        this.$message.warnning("缺少定位卡状态自定义码");
      }
    });
  },
  methods: {
    //模糊搜索事件
    bindCardQuerySearchAsync(queryString, cb) {
      const query = {
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
        pageSize: 10,
      };
      getBindInfo(query).then((res) => {
        if (res.data && res.data.list.length > 0) {
          const arr = res.data.list.map((item) => {
            const value =
              item.bindType == 0
                ? item.name + "-" + item.cardNo
                : item.bindObject + "-" + item.cardNo;
            return {
              value,
              ...item,
            };
          });
          cb(arr);
        } else {
          cb([]);
        }
      });
    },
    //定位卡搜索
    cardQuerySearchAsync(queryString, cb) {
      const query = {
        order: "createTime",
        sort: "DESC",
        pageNum: 1,
        pageSize: 10,
        query: [
          {
            expression: "LIKE",
            key: "cardNo",
            value: queryString,
          },
          {
            expression: "IN",
            key: "cardStatusId",
            value: [this.emptyCardId],
          },
        ],
      };
      getLocCardList(query).then((res) => {
        console.log(res);
        if (res.data && res.data.list.length > 0) {
          const arr = res.data.list.map((item) => {
            return {
              value: item.cardNo,
              ...item,
            };
          });
          cb(arr);
        } else {
          cb([]);
        }
      });
    },
    //已绑卡选择
    handleSelect(item) {
      console.log(item);
      this.bindCardData = item;
    },
    //卡选择
    handlCardeSelect(item) {
      this.cardData = item;
    },
    //换卡原因
    replaceReasonChange(e) {
      const index = this.replaceReasonList.findIndex((item) => item.code == e);
      const name = this.replaceReasonList[index].name;
      if (name == "其他") {
        this.cardForm.remark = "";
      } else {
        this.cardForm.remark = this.replaceReasonList[index].name;
      }
    },
    //一键换卡
    replaceCard() {
      if (this.flag) return;
      this.flag = true;
      const postData = {
        bindId: this.bindCardData.bindId,
        bindType: this.bindCardData.bindType,
      };
      if (this.bindCardData.cardType == this.cardData.cardType) {
        this.flag = false;
        return this.$message.error("不同类型的卡片才能替换，请更换卡片类型");
      }
      //普通卡
      if (this.bindCardData.cardType == 0) {
        postData.exchangeReason = this.cardForm.remark;
        postData.cardId = this.bindCardData.id;
        postData.exCardId = this.cardData.id;
      } else {
        postData.resumeResaon = this.cardForm.remark;
        postData.cardId = this.cardData.id;
        postData.exCardId = this.bindCardData.id;
      }
      reBindingCard(postData).then((res) => {
        this.flag = false;
        if (res.success) {
          this.bindCardData = {};
          this.cardData = {};
          this.cardForm = {
            reasonId: null,
            reason: null,
            remark: null,
          };
          this.searchValue = null;
          this.cardSearchValue = null;
          this.$message.success("换绑成功");
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.edit-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  &-body {
    flex: 1;
    overflow-y: auto;
    &-box {
      padding-right: 20%;
    }
  }
  &-footer {
    display: flex;
    justify-content: center;
    padding: 10px 0px;
  }
}
.card {
  margin-top: 10px;
  border: 2px solid #f5f5f5;
  border-radius: 5px;
  padding: 10px;
  &-userInfo {
    margin-bottom: 10px;
    &-item {
      padding-top: 5px;
    }
  }
}
.card-wrapper {
  margin: 10px 0px;
}
</style>
