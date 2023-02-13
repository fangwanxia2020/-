<template>
  <div class="reserve-container">
    <el-row class="reserve-container-row">
      <el-col :span="8" class="reserve-container-left">
        <el-scrollbar
          style="height: 100%"
          wrap-class="reserve-scrollbar-wrapper"
        >
          <el-form class="padding-20">
            <el-form-item label="预约单号:">
              <el-autocomplete
                v-model="reserveNum"
                value-key="visitorNo"
                :fetch-suggestions="querySearchAsync"
                :trigger-on-focus="false"
                clearable
                placeholder="请搜索预约单号"
              >
                <el-button
                  slot="append"
                  class="search-btn"
                  @click="searchReserve"
                >
                  搜索
                </el-button>
              </el-autocomplete>
            </el-form-item>
          </el-form>
          <div
            v-infinite-scroll="load"
            :infinite-scroll-delay="500"
            class="left-body padding-20"
          >
            <div v-for="item of personList" :key="item.id" class="content">
              <reserveCard
                :info="item"
                :visit-reason-list="visitReasonList"
                @changeRadio="changeRadio"
                @check="check"
              />
            </div>
          </div>
        </el-scrollbar>
      </el-col>
      <el-col ref="rightCol" :span="16" class="reserve-container-right">
        <template v-if="isSelect">
          <div class="reserve-container-rightbtn">
            <el-button type="primary" size="small" @click="oneKeyBindCard">
              一键发卡
            </el-button>
          </div>
          <div v-if="isCarType" ref="carInfo" class="car-card">
            <div>
              <div>车牌号：{{ vehicleCardDto.vehicleNum }}</div>
              <div>车辆种类：{{ vehicleCardDto.vehicleTypeName }}</div>
              <div>
                联系人：{{ vehicleCardDto.driverName }} ({{
                  vehicleCardDto.driverPhone
                }})
              </div>
            </div>
            <div>
              <div>车卡</div>
              <div v-if="vehicleCardDto.locCardVo">
                <el-input
                  v-model="vehicleCardDto.locCardVo.cardNo"
                  placeholder="请输入车卡"
                  :class="[{ error: carStatus }]"
                  @blur="carInputBlur()"
                ></el-input>
              </div>
            </div>
          </div>
          <el-table :data="tableData" :height="tableHeight" style="width: 100%">
            <el-table-column type="index" width="50" label="序号">
            </el-table-column>
            <el-table-column prop="name" label="姓名"> </el-table-column>
            <el-table-column
              prop="identityCard"
              label="身份证"
              :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column prop="address" label="定位卡号" width="180">
              <template slot-scope="{ row, $index }">
                <div
                  class="explan"
                  @click.stop="changeNum(row, $index, 'editRemarkInput')"
                >
                  <el-input
                    v-if="editable[$index] || !(row && row.cardNo)"
                    v-model="row.cardNo"
                    placeholder="请输入内容"
                    :class="[{ error: row.cardStatusCode }, 'editRemarkInput']"
                    size="small"
                    @blur="cardNoBlur(row, row.cardNo, $index)"
                  ></el-input>
                  <span v-else>{{ row.cardNo }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-col>
    </el-row>
    <!-- 查看预约单详情 -->
    <el-dialog
      v-dialogDrag
      :title="msgTitle"
      :visible.sync="detailDialog"
      width="35%"
      append-to-body
      @close="cancel"
    >
      <div>
        <el-tabs v-model="tabIndex">
          <el-tab-pane label="基础信息" name="0">
            <List :visitor-list="visitorList" />
          </el-tab-pane>
          <el-tab-pane label="拜访信息" name="1">
            <el-form ref="ruleForm" :model="reserveInfo" label-width="100px">
              <el-form-item label="拜访单位：">
                {{ reserveInfo.visitOrgName }}
              </el-form-item>
              <el-form-item label="接待人：">
                <el-tag>{{ reserveInfo.receivePersonName }}</el-tag>
              </el-form-item>
              <el-form-item label="拜访日期：">
                {{ reserveInfo.visitStartTime | splitTime }}至{{
                  reserveInfo.visitEndTime | splitTime
                }}
              </el-form-item>
              <el-form-item label="拜访事由：" prop="desc" class="visit-reason">
                {{ checkVisitReasonName(reserveInfo.visitReason) }}
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer">
        <div></div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPageVisitorInfo,
  getReserveInfo,
  getVisitorBindCardInfoById,
  checkCardNo,
  reserveSendCard,
  getBindCardNum,
} from "@/api/location-card-management/index.js";
import { fileBatchDetail } from "@/api/system/file.js";
import { getVisitorDetails } from "@/api/reserve-manage/index.js";
import reserveCard from "@/components/card/reserve-card";

import List from "./components/list.vue";
export default {
  components: {
    List,
    reserveCard,
  },
  filters: {
    splitTime(val) {
      const date = val ? val.split(" ")[0] : "-";
      return date;
    },
  },
  data() {
    return {
      isCarType: false,
      isSelect: false,
      timeout: null,
      carCard: "", // 车卡
      reserveNum: "",
      personList: [],
      tableData: [],
      editable: [],
      msgTitle: null,
      detailDialog: false,
      tabIndex: "0", //预约详情tabs
      visitorList: [], //行人数据
      reserveInfo: {},
      visitReasonList: [], //事由数据
      vehicleCardDto: {}, //车辆信息
      carStatus: false,
      tableHeight: null,
      visitorNo: null, //预约单号
      params: {
        pageNum: 0,
        pageSize: 10,
      },
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
  created() {
    this.$getTypeCode("gatedpack_visit_reason").then((res) => {
      this.visitReasonList = res.data;
    });
  },
  mounted() {
    this.$nextTick(() => {
      console.log(this.$refs);
    });
  },
  methods: {
    load() {
      console.log("0000000");
      this.params.pageNum += 1;
      let reserveData = {
        pageNum: this.params.pageNum,
        pageSize: this.params.pageSize,
        query: {
          visitorNo: this.reserveNum,
        },
      };
      getPageVisitorInfo(reserveData).then((res) => {
        res.data.list.forEach((item) => {
          item.checked = false;
        });
        this.personList = this.personList.concat(res.data.list);
      });
    },
    querySearchAsync(queryString, cb) {
      if (queryString) {
        let reserveData = {
          visitorNo: queryString,
        };
        getReserveInfo(reserveData).then((res) => {
          cb(res.data);
        });
      }
    },
    searchReserve() {
      this.params.pageNum = 1;
      let reserveData = {
        pageNum: this.params.pageNum,
        pageSize: this.params.pageSize,
        query: {
          visitorNo: this.reserveNum,
        },
      };
      getPageVisitorInfo(reserveData).then((res) => {
        res.data.list.forEach((item) => {
          item.checked = false;
        });
        this.personList = res.data.list;
      });
    },
    changeRadio(row) {
      this.visitorNo = row.visitorNo;
      this.visitOrgId = row.visitOrgId;
      this.isSelect = true;
      this.$nextTick(() => {
        const carInfoHeight = this.$refs.carInfo
          ? this.$refs.carInfo.clientHeight
          : 0;
        const colHeight = this.$refs.rightCol.$el.clientHeight;
        this.tableHeight = colHeight - carInfoHeight - 82;
      });
      this.personList.forEach((item) => {
        this.$set(item, "checked", false);
      });
      const index = this.personList.findIndex((item) => item.id == row.id);
      this.personList.splice(index, 1, row);
      console.log(this.personList);
      //表格输入框status清空
      this.editable = [];
      if (row.reserveType) {
        this.isCarType = true;
        getVisitorBindCardInfoById(row.id).then(async (res) => {
          //车辆信息
          this.vehicleCardDto = res.data.vehicleCardDto;
          if (!this.vehicleCardDto.locCardVo) {
            this.$set(this.vehicleCardDto, "locCardVo", {});
            this.$set(this.vehicleCardDto.locCardVo, "cardNo", null);
          }
          //表格
          const personBaseIds = res.data.visitorCardDto.map(
            (item) => item.personBaseId,
          );
          personBaseIds.push(res.data.vehicleCardDto.vehicleId);
          const { data } = await getBindCardNum(personBaseIds);
          const cardList = data.filter((item) => item != null);
          console.log(cardList);
          cardList.forEach((item) => {
            if (item.bindId == res.data.vehicleCardDto.vehicleId) {
              this.$set(this.vehicleCardDto.locCardVo, "cardNo", item.cardNo);
            }
          });
          res.data.visitorCardDto.forEach((item) => {
            item.editStatus = false;
            cardList.forEach((card) => {
              if (item.personBaseId == card.bindId) {
                item.cardNo = card.cardNo;
              }
            });
          });
          this.tableData = res.data.visitorCardDto;
          // console.log(res, "人车列表");
        });
      } else {
        this.isCarType = false;
        getVisitorBindCardInfoById(row.id).then(async (res) => {
          console.log(res);
          // console.log(res, "访客列表");
          const paersonBaseIds = res.data.visitorCardDto.map(
            (item) => item.personBaseId,
          );
          const { data } = await getBindCardNum(paersonBaseIds);
          const cardList = data.filter((item) => item != null);
          console.log(cardList);
          res.data.visitorCardDto.forEach((item) => {
            item.editStatus = false;
            cardList.forEach((card) => {
              if (item.personBaseId == card.bindId) {
                item.cardNo = card.cardNo;
              }
            });
          });
          console.log(res.data.visitorCardDto);
          this.tableData = res.data.visitorCardDto;
        });
      }
    },
    //校验卡号
    cardNoBlur(row, inpVal, index) {
      if (!row.cardNo) return (this.editable = []);
      checkCardNo(row.cardNo).then((res) => {
        console.log(res);
        if (res.code != 200) return;
        if (res.data.cardStatusCode != "01") {
          const msg = this.$checkStatus(res.data.cardStatusCode);
          this.$notify({
            title: "卡号" + msg,
            message: `该卡片${msg},请重新选择卡片`,
            type: "warning",
          });
          this.$set(row, "cardStatusCode", true);
        } else {
          if (this.tableData.length > 1) {
            for (let i = 0; i < this.tableData.length; i++) {
              if (
                inpVal &&
                index !== i &&
                this.tableData[i].cardNo === inpVal
              ) {
                this.$notify({
                  title: "重复提示",
                  message: `卡号不能重复`,
                  type: "warning",
                });
                this.$set(row, "cardStatusCode", true);
                return;
              }
            }
          }
          this.$set(row, "cardStatusCode", false);
          row.editStatus = true;
          this.editable = [];
        }
      });
    },
    //表格单元格点击
    changeNum(row, index, className) {
      if (row.cardNo) return;
      this.editable = new Array(this.tableData.length);
      this.editable[index] = true;
      this.$set(this.editable, index, true);
      this.$nextTick(() => {
        var editInputList = document.getElementsByClassName(className);
        editInputList[0].children[0].focus();
      });
    },
    //车卡input 失去焦点
    carInputBlur() {
      console.log(this.vehicleCardDto);
      const { cardNo } = this.vehicleCardDto.locCardVo;
      if (!cardNo) return;
      checkCardNo(cardNo).then((res) => {
        console.log(res);
        if (res.code != 200) return;
        if (res.data.cardStatusCode != "01") {
          this.carStatus = true;
          const msg = this.$checkStatus(res.data.cardStatusCode);
          this.$notify({
            title: "卡号" + msg,
            message: `该卡片${msg},请重新选择卡片`,
            type: "warning",
          });
        } else {
          this.carStatus = false;
        }
      });
    },
    //一键绑卡方法
    oneKeyBindCard() {
      const postData = this.tableData
        .filter((item) => item.editStatus)
        .map((list) => {
          return {
            bindId: list.personBaseId,
            bindType: 0,
            cardNo: list.cardNo,
          };
        });
      //车卡
      if (this.isCarType && !this.carStatus) {
        postData.push({
          bindId: this.vehicleCardDto.vehicleId,
          bindType: 1,
          cardNo: this.vehicleCardDto.locCardVo.cardNo,
        });
      }
      if (postData.length == 0) return this.$message.error("请绑定有效卡号");
      const postObj = {
        cardInfoDto: postData,
        visitNo: this.visitorNo,
        visitOrgId: this.visitOrgId,
        type: 1,
      };
      if (this.isCarType) {
        postObj.vehicleTypeId = this.vehicleCardDto.vehicleType;
      }
      reserveSendCard(postObj).then((res) => {
        if (res.code != 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
      });
    },
    //查看预约单
    async check(item) {
      console.log(item);
      this.msgTitle = `预约单详情— 查看— ${item.visitorNo}`;
      this.detailDialog = true;
      const { data } = await getVisitorDetails(item.id);
      console.log(data);
      const healthCodeIds = data.reserveVisitorExDto.map(
        (item) => item.healthCodeId,
      );
      const travelCodeId = data.reserveVisitorExDto.map(
        (item) => item.travelCodeId,
      );
      const { data: healthData } = await fileBatchDetail(healthCodeIds);
      const { data: travelData } = await fileBatchDetail(travelCodeId);
      healthData.forEach((imgItem) => {
        data.reserveVisitorExDto.forEach((item) => {
          if (imgItem.id == item.healthCodeId) {
            item.healthUrl = imgItem.downloadUrl;
          }
        });
      });
      travelData.forEach((imgItem) => {
        data.reserveVisitorExDto.forEach((item) => {
          if (imgItem.id == item.travelCodeId) {
            item.travelUrl = imgItem.downloadUrl;
          }
        });
      });
      this.visitorList = data.reserveVisitorExDto;
      this.reserveInfo = data.reserveInfoDto;
    },
    cancel() {
      this.detailDialog = false;
      this.visitorList = [];
    },
  },
};
</script>
<style lang="scss" scoped>
.reserve-container {
  height: 100%;
  &-row {
    height: 100%;
  }
  &-left {
    height: 100%;
    border-right: 10px solid #eee;
    padding-top: 15px;
  }
  &-rightbtn {
    display: flex;
    justify-content: flex-end;
    padding: 15px 0px;
  }
  &-right {
    height: 100%;
    padding: 0px 30px;
  }
}
.car-card {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  line-height: 1.5;
  background-color: #eee;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}
.padding-20 {
  padding: 0px 20px;
}
.margin-l10 {
  margin-left: 10px;
}
::v-deep {
  .el-input-group__append {
    background-color: #026dff !important;
    border-color: #026dff !important;
    color: #fff !important;
  }
  .error .el-input__inner {
    border: 1px solid red;
  }
  .el-dialog__body {
    height: calc(100vh - 300px);
    overflow: auto;
  }
  .reserve-scrollbar-wrapper {
    overflow-x: hidden !important;
  }
}
.container {
  padding: 15px 30px;
}
</style>
