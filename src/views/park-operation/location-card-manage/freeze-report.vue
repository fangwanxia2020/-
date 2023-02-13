<template>
  <div class="freeze">
    <div class="freeze-tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="绑定定位卡" name="first"> </el-tab-pane>
        <el-tab-pane label="冻结定位卡" name="second"> </el-tab-pane>
        <el-tab-pane label="挂失定位卡" name="third"> </el-tab-pane>
      </el-tabs>
    </div>
    <div class="freeze-content">
      <div v-if="activeName == 'first'" class="freeze-content-first">
        <template v-if="selectTabs == 1">
          <el-row class="freeze-content-row">
            <el-col :span="8" class="freeze-content-col">
              <div class="freeze-content-tabs">
                <el-radio-group v-model="selectTabs" size="small">
                  <el-radio-button label="1">批量绑定</el-radio-button>
                  <el-radio-button label="2">单张绑定</el-radio-button>
                </el-radio-group>
              </div>
              <div class="freeze-content-col-search">
                <label>申请批次：</label>
                <el-autocomplete
                  v-model="reserveNum"
                  value-key="code"
                  :fetch-suggestions="querySearchAsync"
                  :trigger-on-focus="false"
                  size="small"
                  placeholder="请输入申请批次"
                  clearable
                  @select="handleSelect"
                >
                </el-autocomplete>
              </div>
              <el-scrollbar
                style="height: 100%"
                wrap-class="freeze-scrollbar-wrapper"
              >
                <div class="freeze-content-col-card">
                  <div v-for="(item, idx) of personList" :key="idx">
                    <explosionCard
                      :info="item"
                      :show-item-details="true"
                      @changeRadio="changeRadio"
                      @applyPersonDetails="checkApplyPersonDetails"
                      @handelAuditDetails="handelAuditDetails"
                      @handelDetails="handelDetails"
                    />
                  </div>
                </div>
              </el-scrollbar>
            </el-col>
            <el-col :span="16" class="freeze-content-table">
              <el-tabs v-if="isSelect" v-model="cardTable">
                <el-tab-pane label="人卡" name="person">
                  <div class="right-title">
                    <div>
                      <span>
                        待发:
                        <span style="color: #ff7201">
                          {{ allCardNum - bindCardNum }}
                        </span>
                        /{{ allCardNum }}张
                      </span>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <span>
                        已读:<span style="color: #026dff">
                          {{ bindCardNum }}
                        </span>
                        张
                      </span>
                    </div>
                    <el-button
                      type="primary"
                      size="small"
                      @click="oneKeyBindCard"
                    >
                      一键发卡
                    </el-button>
                  </div>
                  <CtTable
                    ref="personCardTable"
                    class="table"
                    :request="getTableList"
                    row-key="id"
                    :has-search="false"
                    :is-select="false"
                    :has-btn="false"
                    :show-search-btn="false"
                  >
                    <template #table-columns>
                      <el-table-column
                        label="序号"
                        show-overflow-tooltip
                        width="70"
                      >
                        <template slot-scope="{ row, $index }">
                          {{ personCardList.length - $index }}
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="姓名"
                        show-overflow-tooltip
                        width="130"
                        prop="name"
                      ></el-table-column>
                      <el-table-column
                        label="身份证"
                        width="170"
                        show-overflow-tooltip
                        prop="idNo"
                      ></el-table-column>
                      <el-table-column label="定位卡号">
                        <template slot-scope="{ row, $index }">
                          <div
                            class="explan"
                            @click.stop="
                              changeNum(row, $index, 'editRemarkInput')
                            "
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
                      <el-table-column label="剩余电量">
                        <template slot-scope="{ row }">
                          <template v-if="row.locCardVo.remainingCapacity">
                            <el-image
                              style="
                                width: 10px;
                                height: 12px;
                                margin-right: 3px;
                              "
                              :src="imgFilter(row.locCardVo.remainingCapacity)"
                              alt=""
                            />
                            <span
                              :style="
                                remainingCapacityColor(
                                  row.locCardVo.remainingCapacity,
                                )
                              "
                              >{{ row.locCardVo.remainingCapacity + "%" }}</span>
                            <el-progress
                              :percentage="row.locCardVo.remainingCapacity"
                              :show-text="false"
                              :color="customColors"
                            ></el-progress>
                          </template>
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
                          {{ allCardNum - bindCardNum }}
                        </span>
                        /{{ allCardNum }}张
                      </span>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <span>
                        已读:<span style="color: #026dff">
                          {{ bindCardNum }}
                        </span>
                        张
                      </span>
                    </div>
                    <el-button
                      type="primary"
                      size="small"
                      @click="oneKeyBindCarCard"
                    >
                      一键发卡
                    </el-button>
                  </div>
                  <CtTable
                    ref="table"
                    class="table"
                    :request="getCarTableList"
                    row-key="id"
                    :has-search="false"
                    :is-select="false"
                    :has-btn="false"
                    :show-search-btn="false"
                  >
                    <template #table-columns>
                      <el-table-column
                        label="序号"
                        show-overflow-tooltip
                        width="70"
                      >
                        <template slot-scope="{ row, $index }">
                          {{ carCardList.length - $index }}
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="车牌号"
                        show-overflow-tooltip
                        prop="vehicleCode"
                        width="130"
                      ></el-table-column>
                      <el-table-column
                        label="联系人"
                        show-overflow-tooltip
                        prop="personName"
                      ></el-table-column>
                      <el-table-column label="定位卡号" width="170">
                        <template slot-scope="{ row, $index }">
                          <div
                            class="explan"
                            @click.stop="
                              changeCarNum(row, $index, 'editRemarkInput')
                            "
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
                      <el-table-column label="剩余电量">
                        <template slot-scope="{ row }">
                          <template v-if="row.locCardVo.remainingCapacity">
                            <el-image
                              style="
                                width: 10px;
                                height: 12px;
                                margin-right: 3px;
                              "
                              :src="imgFilter(row.locCardVo.remainingCapacity)"
                              alt=""
                            />
                            <span
                              :style="
                                remainingCapacityColor(
                                  row.locCardVo.remainingCapacity,
                                )
                              "
                              >{{ row.locCardVo.remainingCapacity + "%" }}</span>
                            <el-progress
                              :percentage="row.locCardVo.remainingCapacity"
                              :show-text="false"
                              :color="customColors"
                            ></el-progress>
                          </template>
                        </template>
                      </el-table-column>
                    </template>
                  </CtTable>
                </el-tab-pane>
              </el-tabs>
            </el-col>
          </el-row>
        </template>
        <template v-if="selectTabs == 2">
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="freeze-content-tabs">
                <el-radio-group v-model="selectTabs" size="small">
                  <el-radio-button label="1">批量绑定</el-radio-button>
                  <el-radio-button label="2">单张绑定</el-radio-button>
                </el-radio-group>
              </div>
              <el-form :model="ruleForm" :rules="rules" label-width="150px">
                <el-form-item label="" class="phone-input person">
                  <div class="person-car">
                    <span
                      :class="selectPerson ? 'select-tabs' : 'unselect-tabs'"
                      @click="selectPerson = true"
                    >
                      人卡
                    </span>
                    <span
                      :class="selectPerson ? 'unselect-tabs' : 'select-tabs'"
                      @click="selectPerson = false"
                    >
                      车卡
                    </span>
                  </div>
                  <el-autocomplete
                    v-model="ruleForm.personCarName"
                    :fetch-suggestions="querySearchPerson"
                    :trigger-on-focus="false"
                    clearable
                    :placeholder="placeholderText"
                    @select="handleSingleSelect"
                  ></el-autocomplete>
                  <el-button
                    type="primary"
                    size="small"
                    style="margin-left: 30px"
                  >
                    确定
                  </el-button>
                </el-form-item>
                <el-form-item
                  label="定位卡类型:"
                  prop="name"
                  class="phone-input"
                >
                  <el-radio
                    v-model="ruleForm.cardType"
                    :label="0"
                    @change="getIDleLocCard"
                  >
                    普通卡
                  </el-radio>
                  <el-radio
                    v-model="ruleForm.cardType"
                    :label="1"
                    @change="getIDleLocCard"
                  >
                    防爆卡
                  </el-radio>
                </el-form-item>
                <el-form-item label="定位卡号:" prop="name" class="phone-input">
                  <el-select
                    v-model="ruleForm.locCardNo"
                    placeholder="请选择"
                    @change="selectCardNo"
                  >
                    <el-option
                      v-for="item in IdleList"
                      :key="item.id"
                      :label="item.cardNo"
                      :value="item.cardNo"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="待选空闲卡:"
                  prop="name"
                  class="phone-input"
                >
                  <template v-for="(item, idx) of IdleList">
                    <el-button
                      v-if="idx < 3"
                      :key="idx"
                      :class="item.selectStatus ? 'selectCard' : ''"
                      @click="selectCard(item)"
                    >
                      {{ item.cardNo }}
                    </el-button>
                  </template>
                </el-form-item>
                <el-form-item label="长期卡:" prop="name" class="phone-input">
                  <el-switch
                    v-model="ruleForm.longTermFlag"
                    :inactive-value="false"
                    :active-value="true"
                  >
                    >
                  </el-switch>
                  <span style="color: #999999; margin-left: 25px">
                    <i class="el-icon-s-opportunity"></i>
                    <el-tooltip placement="top">
                      <div slot="content" style="color: #999999">
                        <i class="el-icon-warning-outline"></i>
                        长期卡无需维护有效期
                      </div>
                      <span>帮助提示</span>
                    </el-tooltip>
                  </span>
                </el-form-item>
                <el-form-item
                  v-if="!ruleForm.longTermFlag"
                  label="有效期:"
                  prop="name"
                  class="phone-input"
                >
                  <el-date-picker
                    v-model="ruleForm.validTime"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                  />
                </el-form-item>
              </el-form>
              <div class="left-btn">
                <el-button
                  type="primary"
                  size="small"
                  :disabled="btnDisabled"
                  @click="singleSendCard"
                >
                  发放
                </el-button>
              </div>
            </el-col>
            <el-col :span="12">
              <div v-if="Object.keys(bindCardData).length > 0" class="card">
                <div class="card-userInfo">
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
                  <div class="card-userInfo-item">
                    <span>部门:</span>
                    <span>{{ bindCardData.deptName }}</span>
                  </div>
                </div>
                <card :card-data="cardData" />
              </div>
              <div v-if="Object.keys(bindCarCardData).length > 0" class="card">
                <div class="card-userInfo">
                  <div class="card-userInfo-item">
                    <span>车牌号:</span>
                    <span>{{ bindCarCardData.vehicleCode }}</span>
                  </div>
                  <div class="card-userInfo-item">
                    <span>车辆种类:</span>
                    <span>{{ bindCarCardData.vehicleType }}</span>
                  </div>
                  <div class="card-userInfo-item">
                    <span>车辆状态:</span>
                    <span>{{
                      bindCarCardData.vehicleState == "0" ? "激活" : "冻结"
                    }}</span>
                  </div>
                  <card :card-data="cardData" />
                </div>
              </div>
            </el-col>
          </el-row>
        </template>
      </div>
      <freeze-card
        v-if="activeName == 'second'"
        :operate-type="operateType"
        class="freeze-content-wrap"
      ></freeze-card>
      <freeze-card
        v-if="activeName == 'third'"
        :operate-type="operateType"
        class="freeze-content-wrap"
      ></freeze-card>
    </div>
    <el-dialog
      v-if="personDetails"
      v-dialogDrag
      width="450px"
      :title="personDetailsTitle"
      :visible.sync="personDetails"
    >
      <personDetails :person-id="personBaseId" :is-org="true" :is-base="true" />
    </el-dialog>
  </div>
</template>

<script>
import personDetails from "@/components/FormBody/person-details/index.vue";
import card from "@/components/card/index.vue";
import explosionCard from "@/components/card/explosion-card";
import freezeCard from "./components/freeze-card.vue";
import {
  pageSendCardByExpr,
  getSendApplyCardInfo,
  checkCardNo,
  reserveSendCard,
  getBindCardNum,
  getIDleLocCardList,
  singleSendCard,
} from "@/api/location-card-management/index.js";
import {
  getPersonListByQuery,
  getCarListByQuery,
} from "@/api/access-control-permission/organization-control.js";
export default {
  components: { card, explosionCard, personDetails, freezeCard },
  data() {
    return {
      personDetails: false,
      btnDisabled: true,
      selectTabs: "1",
      selectPerson: true,
      isSelect: false,
      isCarType: false,
      personBaseId: "",
      personDetailsTitle: "",
      allCardNum: 0,
      bindCardNum: 0,
      operateType: "",
      applyCardType: "",
      cardStatusId: "", // 空闲卡类型ID（自定义码）
      validEndTime: "", // 发卡的时候需要传给后端的有效期结束时间
      placeholderText: "请输入姓名/手机号",
      radio: "1",
      textarea: "",
      reserveNum: "",
      activeName: "first",
      cardTable: "person",
      ruleForm: {
        cardType: 0,
        locCardNo: "",
        longTermFlag: false,
        personCarName: "",
      },
      rules: {},
      bindCardData: {},
      bindCarCardData: {},
      cardData: {},
      personList: [],
      editable: [],
      carEditable: [],
      personCardList: [], // 人卡
      carCardList: [], // 车卡
      IdleList: [], // 空闲卡
      customColors: [
        // 电量颜色
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
  watch: {
    selectPerson(bool) {
      if (bool) {
        this.placeholderText = "请输入姓名/手机号";
      } else {
        this.placeholderText = "请输入姓名/车牌号";
      }
    },
    ruleForm: {
      deep: true,
      handler: function (val) {
        if (val.locCardNo != "" && val.personCarName != "") {
          this.btnDisabled = false;
        } else if (val.personCarName == "") {
          this.btnDisabled = true;
          this.bindCardData = {};
          this.bindCarCardData = {};
          this.cardData = {};
        } else {
          this.btnDisabled = true;
        }
      },
    },
  },
  mounted() {
    this.$getTypeCode("loc_card_status").then((res) => {
      res.data.forEach((item) => {
        if (item.code == "01") {
          this.cardStatusId = item.id;
          this.getIDleLocCard();
        }
      });
    });
    let reserveData = {
      expr: [
        {
          expression: "IN",
          key: "approvalStatus",
          value: [3],
        },
      ],
      order: "updateTime",
      sort: "DESC",
      pageNum: 1,
      pageSize: 9999,
      query: {
        applyType: 1,
        orgType: 1,
        applyCardType: 0,
      },
    };
    pageSendCardByExpr(reserveData).then((res) => {
      res.data.list.forEach((item) => {
        item.checked = false;
      });
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
            {
              expression: "IN",
              key: "approvalStatus",
              value: [3],
            },
          ],
          order: "updateTime",
          sort: "DESC",
          pageNum: 1,
          pageSize: 9999,
          query: {},
        };
        pageSendCardByExpr(reserveData).then((res) => {
          res.data.list.forEach((item) => {
            item.checked = false;
          });
          this.personList = res.data.list;
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            cb(res.data.list);
          }, 3000 * Math.random());
        });
      }
    },
    // 单张绑卡模糊搜索
    querySearchPerson(queryString, cb) {
      if (queryString) {
        if (this.selectPerson) {
          let reserveData = {
            key: queryString,
            hasOrg: true,
          };
          getPersonListByQuery(reserveData).then((res) => {
            if (res.data && res.data.length > 0) {
              const arr = res.data.map((item) => {
                return {
                  value: item.name + "-" + item.phone,
                  ...item,
                };
              });
              cb(arr);
            } else {
              cb([]);
            }
          });
        } else {
          getCarListByQuery(queryString).then((res) => {
            if (res.data && res.data.length > 0) {
              const arr = res.data.map((item) => {
                return {
                  // value: item.name + "-" + item.phone,
                  value: item.vehicleCode,
                  ...item,
                };
              });
              cb(arr);
            } else {
              cb([]);
            }
          });
        }
      }
    },
    changeRadio(row) {
      this.applyCardType = row.applyCardType;
      this.allCardNum = row.applyNum;
      this.validEndTime = row.validEndTime;
      this.isSelect = true;
      // 设置选中状态
      this.personList.forEach((item) => {
        this.$set(item, "checked", false);
      });
      const index = this.personList.findIndex((item) => item.id == row.id);
      this.personList.splice(index, 1, row);
      this.editable = [];
      this.carEditable = [];
      this.personCardList = [];
      this.carCardList = [];
      getSendApplyCardInfo(row.id).then(({ data }) => {
        this.bindCardNum = 0;
        let isBandCarCard = [];
        let isBandPersonCard = [];
        if (data.vehicleVos.length) {
          data.vehicleVos.forEach((item) => {
            let obj = {
              ...item,
              editStatus: false,
              personId: item.vehicleId, // 车id
              locCardVo: {
                cardNo: null,
              },
            };
            this.carCardList.push(obj);
            isBandCarCard.push(item.vehicleId);
          });
        }
        if (data.personVos.length) {
          data.personVos.forEach((item) => {
            let obj = {
              ...item,
              editStatus: false,
              personIds: item.personId,
              personId: item.personBaseId,
              locCardVo: {
                cardNo: null,
              },
            };
            this.personCardList.push(obj);
            isBandPersonCard.push(item.personBaseId);
          });
          this.$refs.personCardTable.reload();
          this.$refs.table.reload(); // 车卡列表
        }
        isBandCarCard.length &&
          getBindCardNum(isBandCarCard).then((res) => {
            res.data.forEach((item) => {
              if (item != null) {
                this.bindCardNum++;
                this.carCardList.forEach((items) => {
                  if (items.personId == item.bindId) {
                    items.locCardVo.cardNo = item.cardNo;
                    items.locCardVo.remainingCapacity = item.remainingCapacity;
                  }
                });
              }
            });
          });
        isBandPersonCard.length &&
          getBindCardNum(isBandPersonCard).then((res) => {
            res.data.forEach((item) => {
              if (item != null) {
                this.bindCardNum++;
                this.personCardList.forEach((items) => {
                  if (items.personId == item.bindId) {
                    items.locCardVo.cardNo = item.cardNo;
                    items.locCardVo.remainingCapacity = item.remainingCapacity;
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
        editInputList[index].children[0].focus();
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
          if (res.data.cardType == this.applyCardType) {
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
      if (row.cardNo) return;
      this.carEditable = new Array(this.carEditable.length);
      this.carEditable[index] = true;
      this.$set(this.carEditable, index, true);
      // console.log(this.carEditable, "this.carEditable");
      this.$nextTick(() => {
        var editInputList = document.getElementsByClassName(className);
        editInputList[0].children[0].focus();
      });
    },
    // 校验车卡号
    carCardNoBlur(row) {
      console.log(row, "row");
      if (!row.locCardVo.cardNo) return (this.carEditable = []);
      checkCardNo(row.locCardVo.cardNo).then((res) => {
        console.log(res, "校验卡号");
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
          if (res.data.cardType == this.applyCardType) {
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
    //一键绑卡方法
    oneKeyBindCard() {
      console.log(this.carCardList, "this.carCardList");

      const postData = this.personCardList
        .filter((item) => item.editStatus)
        .map((list) => {
          console.log(list, "绑卡对象");
          return {
            bindId: list.personId,
            bindType: this.cardTable == "car" ? 1 : 0,
            cardNo: list.locCardVo.cardNo,
            personIds: list.personIds,
          };
        });
      // return;
      let params = {
        cardInfoDto: postData,
        type: 2,
        expireEndTime: this.validEndTime,
      };
      reserveSendCard(params).then((res) => {
        if (res.code != 200) return this.$messgae.error(res.msg);
        this.$msgSuccess("绑卡成功");
      });
    },
    // 单张发卡
    singleSendCard() {
      this.IdleList.forEach((item) => {
        if (item.cardNo == this.ruleForm.locCardNo) {
          this.cardData = {
            ...item,
          };
        }
      });
      let postData = {
        bindType: this.selectPerson ? 0 : 1,
        cardNo: this.cardData.cardNo,
        longTermFlag: this.ruleForm.longTermFlag ? 0 : 1,
      };
      if (this.selectPerson) {
        postData["bindId"] = this.bindCardData.personBaseId;
      } else {
        postData["bindId"] = this.bindCarCardData.id;
      }
      if (!this.ruleForm.longTermFlag) {
        postData["validStartTime"] = this.ruleForm.validTime[0];
        postData["validEndTime"] = this.ruleForm.validTime[1];
      }
      singleSendCard(postData).then((res) => {
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
      let params = {
        cardInfoDto: postData,
        type: 2,
        expireEndTime: this.validEndTime,
      };
      reserveSendCard(params).then((res) => {
        console.log(res);
        if (res.code != 200) return this.$messgae.error(res.msg);
        this.$msgSuccess("绑卡成功");
      });
    },
    getTableList(params) {
      let arr = [];
      if (this.personCardList.length > params.pageSize) {
        arr = this.personCardList.slice(
          (params.pageNum - 1) * params.pageSize,
          params.pageNum * params.pageSize,
        );
      } else {
        arr = this.personCardList;
      }
      return Promise.resolve({
        list: arr,
        total: this.personCardList.length,
      });
    },
    getCarTableList(params) {
      let arr = [];
      if (this.carCardList.length > params.pageSize) {
        arr = this.carCardList.slice(
          (params.pageNum - 1) * params.pageSize,
          params.pageNum * params.pageSize,
        );
      } else {
        arr = this.carCardList;
      }
      return Promise.resolve({
        list: arr,
        total: this.carCardList.length,
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
          {
            expression: "IN",
            key: "approvalStatus",
            value: [3],
          },
        ],
        order: "updateTime",
        sort: "DESC",
        pageNum: 1,
        pageSize: 9999,
        query: {},
      };
      pageSendCardByExpr(reserveData).then((res) => {
        this.personList = res.data.list;
      });
    },
    handleSingleSelect(item) {
      console.log(item, "item");
      this.bindCardData = {};
      this.bindCarCardData = {};
      if (this.selectPerson) {
        this.bindCardData = item;
      } else {
        this.bindCarCardData = item;
      }
    },
    getIDleLocCard() {
      this.ruleForm.locCardNo = "";
      let resData = [
        {
          expression: "EQ",
          key: "cardStatusId",
          value: this.cardStatusId,
        },
        {
          expression: "EQ",
          key: "cardType",
          value: this.ruleForm.cardType,
        },
      ];
      getIDleLocCardList(resData).then((res) => {
        this.IdleList = res.data;
        this.IdleList.forEach((item) => {
          item.selectStatus = false;
        });
      });
    },
    selectCard(row) {
      this.ruleForm.locCardNo = row.cardNo;
      this.IdleList.forEach((item) => {
        if (item.cardNo == row.cardNo) {
          this.$set(item, "selectStatus", true);
        } else {
          this.$set(item, "selectStatus", false);
        }
      });
    },
    selectCardNo(code) {
      this.IdleList.forEach((item) => {
        if (item.cardNo == code) {
          this.$set(item, "selectStatus", true);
        } else {
          this.$set(item, "selectStatus", false);
        }
      });
    },
    handleClick() {
      if (this.activeName == "second") {
        this.operateType = "freeze";
      } else if (this.activeName == "third") {
        this.operateType = "report";
      }
    },
    // 查看申请人详情
    checkApplyPersonDetails(item) {
      this.personDetails = true;
      this.personBaseId = item.applyPersonId;
      this.personDetailsTitle = `申请人— 查看— ${item.applyPersonName}`;
    },
    // 查看审批人相认
    handelAuditDetails(item) {
      this.personDetails = true;
      this.personBaseId = item.auditPersonVo.personBaseId;
      this.personDetailsTitle = `申请人— 查看— ${item.auditPersonVo.name}`;
    },
    handelDetails(item) {
      console.log(item);
      this.$router.push({
        path: "/gatedpark/park-operation/location-manage/edit",
        query: {
          id: item.id,
          tabsActive: 1,
          isCheck: true,
          code: item.code,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.freeze {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
  padding-top: 15px;
  &-content {
    flex: 1;
    overflow: hidden;
    &-tabs {
      padding: 15px 30px;
    }
    &-row {
      height: 100%;
    }
    &-first {
      height: 100%;
    }
    &-col {
      height: 100%;
      border-right: 10px solid #eee;
      display: flex;
      flex-direction: column;
      &-card {
        padding: 0px 20px;
      }
      &-search {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        padding: 0px 30px;
        .el-autocomplete {
          flex: 1;
        }
      }
    }
    &-table {
      padding: 20px;
      height: 100%;
      .table {
        height: calc(100% - 42px);
      }
    }
    &-wrap {
      padding: 20px;
    }
  }
  &-tabs {
    padding: 0px 30px;
  }
}
.person {
  /deep/ .el-form-item__content {
    margin-left: 54px !important;
  }
}
.person-car {
  display: inline-block;
  margin-right: 10px;
  span {
    padding: 10px;
  }
  :nth-child(1) {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }
  :nth-child(2) {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  .select-tabs {
    background: #0089ff;
    color: white;
  }
  .unselect-tabs {
    background: #e7eaef;
  }
}
.phone-input {
  .item-input {
    width: 33%;
  }
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
  line-height: 31px;
}
.card {
  margin: 10px 15%;
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
.left-btn {
  margin-top: 30px;
  margin-left: 32%;
}
.selectCard {
  background-color: #409eff;
}
.container {
  padding: 15px 30px;
}
::v-deep {
  .el-input-group__append {
    background-color: #026dff !important;
    border-color: #026dff !important;
    color: #fff !important;
  }
  .freeze-scrollbar-wrapper {
    overflow-x: hidden !important;
  }
  .el-scrollbar {
    flex: 1;
  }
  .el-tabs__header {
    margin: 0 !important;
  }
  .el-tabs,
  .el-tab-pane {
    height: 100%;
  }
  .el-tabs__content {
    height: calc(100% - 40px);
  }
}
</style>
