<template>
  <div class="reserve-container">
    <el-row class="reserve-container-row">
      <el-col :span="8" class="reserve-container-left">
        <el-scrollbar
          style="height: 100%"
          wrap-class="reserve-scrollbar-wrapper"
        >
          <el-form class="padding-20">
            <el-form-item label="申请批次：">
              <el-autocomplete
                v-model="reserveNum"
                value-key="code"
                clearable
                :fetch-suggestions="querySearchAsync"
                :trigger-on-focus="false"
                placeholder="请输入申请批次"
                @select="handleSelect"
              >
                <el-button slot="append" class="search-btn" @click="searchCode">
                  确定
                </el-button>
              </el-autocomplete>
            </el-form-item>
            <div class="content-flow">
              <div
                v-for="(item, idx) of personList"
                :key="idx"
                class="form-content"
              >
                <contractorCard :info="item" @changeRadio="changeRadio" />
              </div>
            </div>
          </el-form>
        </el-scrollbar>
      </el-col>
      <el-col ref="rightCol" :span="16" class="reserve-container-right">
        <el-tabs v-if="isSelect" v-model="cardTable" class="111">
          <el-tab-pane label="人卡" name="person" class="222">
            <div class="right-title">
              <div>
                <span>
                  待发:
                  <span style="color: #ff7201">
                    {{ allCardNum - bindCardNum }}</span
                  >/{{ allCardNum }}张
                </span>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span>
                  已读:<span style="color: #026dff">{{ bindCardNum }}</span>张
                </span>
              </div>
              <el-button type="primary" size="small" @click="oneKeyBindCard">
                一键发卡
              </el-button>
            </div>
            <CtTable
              ref="personCardTable"
              :table-height="tableHeight"
              class="content-flow"
              :request="getTableList"
              row-key="id"
              :has-search="false"
              :is-select="false"
              :has-btn="false"
              :show-search-btn="false"
            >
              <template #table-columns>
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
                <el-table-column label="定位卡号">
                  <template slot-scope="{ row, $index }">
                    <div
                      class="explan"
                      @click.stop="changeNum(row, $index, 'editRemarkInput')"
                    >
                      <el-input
                        v-if="
                          editable[$index] ||
                          !(row.locCardVo && row.locCardVo.cardNo)
                        "
                        v-model="row.locCardVo.cardNo"
                        placeholder="请输入卡号"
                        :class="[
                          { error: row.cardStatusCode },
                          'editRemarkInput',
                        ]"
                        size="small"
                        @blur="cardNoBlur(row)"
                      ></el-input>
                      <span v-else>{{ row.locCardVo.cardNo }}</span>
                    </div>
                  </template>
                </el-table-column>
              </template>
            </CtTable>
          </el-tab-pane>
          <el-tab-pane label="车卡" name="car">
            <div class="right-title">
              <div>
                <span>
                  待发:
                  <span style="color: #ff7201">
                    {{ allCardNum - bindCardNum }}</span
                  >/{{ allCardNum }}张
                </span>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span>
                  已读:<span style="color: #026dff">{{ bindCardNum }}</span>张
                </span>
              </div>
              <el-button type="primary" size="small" @click="oneKeyBindCarCard">
                一键发卡
              </el-button>
            </div>
            <CtTable
              ref="table"
              :table-height="tableHeight"
              class="content-flow"
              :request="getCarTableList"
              row-key="id"
              :has-search="false"
              :is-select="false"
              :has-btn="false"
              :show-search-btn="false"
            >
              <template #table-columns>
                <el-table-column
                  label="车牌号"
                  show-overflow-tooltip
                  prop="vehicleCode"
                ></el-table-column>
                <el-table-column
                  label="联系人"
                  show-overflow-tooltip
                  prop="personName"
                ></el-table-column>
                <el-table-column label="定位卡号">
                  <template slot-scope="{ row, $index }">
                    <div
                      class="explan"
                      @click.stop="changeCarNum(row, $index, 'editRemarkInput')"
                    >
                      <el-input
                        v-if="
                          editable[$index] ||
                          !(row.locCardVo && row.locCardVo.cardNo)
                        "
                        v-model="row.locCardVo.cardNo"
                        placeholder="请输入卡号"
                        :class="[
                          { error: row.cardStatusCode },
                          'editRemarkInput',
                        ]"
                        size="small"
                        @blur="carCardNoBlur(row)"
                      ></el-input>
                      <span v-else>{{ row.locCardVo.cardNo }}</span>
                    </div>
                  </template>
                </el-table-column>
              </template>
            </CtTable>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import contractorCard from "@/components/card/contractor-card";
import {
  getCardApplyList,
  getVisitor,
  checkCardNo,
  reserveSendCard,
  getBindCardNum,
} from "@/api/location-card-management/index.js";
// import {
//   getPersonListByQuery,
//   getCarListByQuery,
// } from "@/api/access-control-permission/organization-control.js";
export default {
  components: { contractorCard },
  data() {
    return {
      tableHeight: null,
      selectTabs: true,
      isSelect: false,
      isCarType: false,
      operateType: "",
      changeApplyCardType: "",
      cardStatusId: "", // 空闲卡类型ID（自定义码）
      placeholderText: "请输入姓名/手机号",
      radio: "1",
      textarea: "",
      reserveNum: "",
      personCarName: "",
      activeName: "first",
      cardTable: "person",
      expireEndTime: "",
      personList: [],
      editable: [],
      carEditable: [],
      personCardList: [], // 人卡
      carCardList: [], // 车卡
      allCardNum: 0,
      bindCardNum: 0, // 绑卡数量
    };
  },
  computed: {},
  mounted() {
    let reserveData = {
      expr: [],
      order: "updateTime",
      sort: "DESC",
      pageNum: 1,
      pageSize: 9999,
      query: {
        applyType: 1,
        applyCardType: 0,
        orgType: 2,
      },
    };
    getCardApplyList(reserveData).then((res) => {
      this.personList = res.data.list;
    });
  },
  methods: {
    querySearchAsync(queryString, cb) {
      if (queryString) {
        let reserveData = {
          expr: [
            {
              expression: "LIKE",
              key: "code",
              value: queryString,
            },
          ],
          order: "updateTime",
          sort: "DESC",
          pageNum: 1,
          pageSize: 9999,
          query: {
            orgType: 2,
          },
        };
        getCardApplyList(reserveData).then((res) => {
          this.personList = res.data.list;
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            cb(res.data.list);
          }, 3000 * Math.random());
        });
      }
    },
    changeRadio(row) {
      this.changeApplyCardType = row.applyCardType;
      this.isSelect = true;
      this.$nextTick(() => {
        const colHeight = this.$refs.rightCol.$el.clientHeight;
        this.tableHeight = colHeight - 152 + "";
        console.log("tableHeight", this.tableHeight);
      });
      this.personList.forEach((item) => {
        this.$set(item, "checked", false);
      });
      const index = this.personList.findIndex((item) => item.id == row.id);
      this.personList.splice(index, 1, row);
      this.editable = [];
      this.carEditable = [];
      this.personCardList = [];
      this.carCardList = [];
      getVisitor(row.id).then((res) => {
        // console.log(res.data.validEndTime, "shghghghghgh");
        this.expireEndTime = res.data.validEndTime;
        let isBandCarCard = [];
        let isBandPersonCard = [];
        this.bindCardNum = 0;
        this.allCardNum = row.applyNum;
        if (res.data.cardApplyDetailVos.length) {
          res.data.cardApplyDetailVos.forEach((item) => {
            if (item.applyObjectType) {
              let obj = {
                ...item.ctrVehicleDto,
                editStatus: false,
                personId: item.vehicleId, // 车id
                locCardVo: {
                  cardNo: null,
                },
              };
              this.carCardList.push(obj);
              isBandCarCard.push(item.vehicleId);
            } else {
              let obj = {
                ...item.personBaseDto,
                editStatus: false,
                personId: item.personId,
                locCardVo: {
                  cardNo: null,
                },
              };
              this.personCardList.push(obj);
              isBandPersonCard.push(item.personId);
            }
          });
          this.$refs.personCardTable.reload();
          this.$refs.table.reload(); // 车卡列表
        }
        isBandCarCard.length &&
          getBindCardNum(isBandCarCard).then((res) => {
            res.data.forEach((item) => {
              if (item != null) {
                this.carCardList.forEach((items) => {
                  if (items.personId == item.bindId) {
                    items.locCardVo.cardNo = item.cardNo;
                    this.bindCardNum++;
                  }
                });
              }
            });
          });
        isBandPersonCard.length &&
          getBindCardNum(isBandPersonCard).then((res) => {
            res.data.forEach((item) => {
              if (item != null) {
                this.personCardList.forEach((items) => {
                  if (items.personId == item.bindId) {
                    items.locCardVo.cardNo = item.cardNo;
                    this.bindCardNum++;
                  }
                });
              }
            });
          });
      });
    },
    //人卡表格单元格点击
    changeNum(row, index, className) {
      if (row.cardNo) return;
      this.editable = new Array(this.editable.length);
      this.editable[index] = true;
      this.$set(this.editable, index, true);
      this.$nextTick(() => {
        var editInputList = document.getElementsByClassName(className);
        editInputList[0].children[0].focus();
      });
    },
    //校验人卡号
    cardNoBlur(row) {
      if (!row.locCardVo.cardNo) return (this.editable = []);
      checkCardNo(row.locCardVo.cardNo).then((res) => {
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
          // 判断卡片类型是否与企业发卡类型一致
          if (res.data.cardType == this.changeApplyCardType) {
            this.$set(row, "cardStatusCode", false);
            row.editStatus = true;
            this.editable = [];
          } else {
            this.$notify({
              title: "卡片类型错误",
              message: `请填写正确的卡片类型`,
              type: "warning",
            });
            this.$set(row, "cardStatusCode", true);
          }
        }
      });
    },
    //车卡表格单元格点击
    changeCarNum(row, index, className) {
      console.log(row);
      console.log(index);
      console.log(className);
      if (row.cardNo) return;
      this.carEditable = new Array(this.carEditable.length);
      this.carEditable[index] = true;
      console.log(this.carEditable);
      this.$set(this.carEditable, index, true);
      this.$nextTick(() => {
        var editInputList = document.getElementsByClassName(className);
        console.log(editInputList);
        editInputList[0].children[0].focus();
      });
    },
    // 校验车卡号
    carCardNoBlur(row) {
      console.log(row, "row");
      if (!row.locCardVo.cardNo) return (this.carEditable = []);
      checkCardNo(row.locCardVo.cardNo).then((res) => {
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
          // 判断卡片类型是否与企业发卡类型一致
          if (res.data.cardType == this.changeApplyCardType) {
            this.$set(row, "cardStatusCode", false);
            row.editStatus = true;
            this.carEditable = [];
          } else {
            this.$notify({
              title: "卡片类型错误",
              message: `请填写正确的卡片类型`,
              type: "warning",
            });
            this.$set(row, "cardStatusCode", true);
          }
        }
      });
    },
    //一键绑卡方法
    oneKeyBindCard() {
      console.log(this.personCardList, "this.personCardList");
      const postData = this.personCardList
        .filter((item) => item.editStatus)
        .map((list) => {
          console.log(list, "绑卡对象");
          return {
            bindId: list.personId,
            bindType: this.cardTable == "car" ? 1 : 0,
            cardNo: list.locCardVo.cardNo,
          };
        });
      let data = {
        type: 3,
        expireEndTime: this.expireEndTime,
        cardInfoDto: [...postData],
      };
      reserveSendCard(data).then((res) => {
        console.log(res);
        if (res.code != 200) return this.$messgae.error(res.msg);
        this.$msgSuccess("绑卡成功");
      });
    },
    // 发车卡
    oneKeyBindCarCard() {
      const postData = this.carCardList
        .filter((item) => item.editStatus)
        .map((list) => {
          return {
            bindId: list.personId,
            bindType: 1,
            cardNo: list.locCardVo.cardNo,
          };
        });
      let data = {
        type: 3,
        expireEndTime: this.expireEndTime,
        cardInfoDto: [...postData],
      };
      reserveSendCard(data).then((res) => {
        console.log(res);
        if (res.code != 200) return this.$messgae.error(res.msg);
        this.$msgSuccess("绑卡成功");
      });
    },
    getTableList() {
      return Promise.resolve({
        list: this.personCardList,
      });
    },
    getCarTableList() {
      return Promise.resolve({
        list: this.carCardList,
      });
    },
    handleSelect(item) {
      let reserveData = {
        expr: [
          {
            expression: "LIKE",
            key: "code",
            value: item.code,
          },
        ],
        order: "updateTime",
        sort: "DESC",
        pageNum: 1,
        pageSize: 9999,
        query: {
          orgType: 2,
        },
      };
      getCardApplyList(reserveData).then((res) => {
        this.personList = res.data.list;
      });
    },
    searchCode() {
      let reserveData = {
        expr: [
          {
            expression: "LIKE",
            key: "code",
            value: this.reserveNum,
          },
        ],
        order: "updateTime",
        sort: "DESC",
        pageNum: 1,
        pageSize: 9999,
        query: {
          orgType: 2,
        },
      };
      getCardApplyList(reserveData).then((res) => {
        this.personList = res.data.list;
      });
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
.padding-20 {
  padding: 0px 20px;
}
.margin-l10 {
  margin-left: 10px;
}

.right-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px 20px;
}
.explan {
  min-width: 160px;
  height: 36px;
  line-height: 36px;
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
</style>
