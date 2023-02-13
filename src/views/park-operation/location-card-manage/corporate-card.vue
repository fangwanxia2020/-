<template>
  <div class="reserve-container">
    <el-row class="reserve-container-row">
      <el-col :span="8" class="reserve-container-left">
        <el-scrollbar
          style="height: 100%"
          wrap-class="reserve-scrollbar-wrapper"
        >
          <el-form class="padding-20">
            <el-form-item label="单位名称:">
              <el-autocomplete
                v-model="orgNameSearch"
                value-key="name"
                :fetch-suggestions="querySearchAsync"
                placeholder="请搜索单位名称"
                clearable
                @select="handleSelect"
              >
              </el-autocomplete>
            </el-form-item>
          </el-form>
          <div class="left-body padding-20">
            <div v-for="(item, idx) of personList" :key="idx" class="content">
              <companyCard
                :info="item"
                @changeRadio="changeRadio"
              ></companyCard>
            </div>
          </div>
        </el-scrollbar>
      </el-col>
      <el-col ref="rightCol" :span="16" class="reserve-container-right">
        <template v-if="changeApplyCardType == 0">
          <el-tabs v-if="isSelect" v-model="cardTable">
            <el-tab-pane label="人卡" name="first">
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
                    已读:<span style="color: #026dff">{{ bindCardNum }} </span>
                    张
                  </span>
                </div>
                <el-button type="primary" size="small" @click="oneKeyBindCard">
                  一键发卡
                </el-button>
              </div>
              <el-table
                :data="personTableList"
                :height="tableHeight"
                style="width: 100%"
              >
                <el-table-column type="index" width="80" label="序号">
                </el-table-column>
                <el-table-column prop="address" label="定位卡号" width="280">
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
                        placeholder="请输入内容"
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
                <el-table-column label="电量">
                  <template slot-scope="{ row }">
                    <template v-if="row.locCardVo.remainingCapacity">
                      <el-image
                        style="width: 10px; height: 12px; margin-right: 3px"
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
                <el-table-column label="操作" align="right">
                  <template slot-scope="{ row, $index }">
                    <el-button type="text" @click="delPersonCard($index)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                class="pagination"
                :page-sizes="[5, 10]"
                :page-size="personPageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="personCardList.length"
                @current-change="personCurrentChange"
              >
              </el-pagination>
            </el-tab-pane>
            <el-tab-pane label="车卡" name="second">
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
                    已读:<span style="color: #026dff">{{ bindCardNum }}</span>
                    张
                  </span>
                </div>
                <el-button type="primary" size="small" @click="oneKeyBindCard">
                  一键发卡
                </el-button>
              </div>
              <el-table
                :data="carTableList"
                :height="tableHeight"
                style="width: 100%"
              >
                <el-table-column
                  type="index"
                  width="80"
                  label="序号"
                ></el-table-column>
                <el-table-column prop="address" label="定位卡号" width="280">
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
                        placeholder="请输入内容"
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
                <el-table-column label="电量">
                  <template slot-scope="{ row }">
                    <template v-if="row.locCardVo.remainingCapacity">
                      <el-image
                        style="width: 10px; height: 12px; margin-right: 3px"
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
                <el-table-column label="操作" align="right">
                  <template slot-scope="{ row, $index }">
                    <el-button type="text" @click="delCarCard($index)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                class="pagination"
                :page-sizes="[5, 10]"
                :page-size="carPageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="carCardList.length"
                @current-change="carCurrentChange"
              >
              </el-pagination>
            </el-tab-pane>
          </el-tabs>
        </template>
        <template v-if="changeApplyCardType == 1">
          <corporate-table
            :id="applyId"
            :all-card-num="allCardNum"
            :table-height="tableHeight"
            :apply-org-id="applyOrgId"
          />
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import companyCard from "@/components/card/company-card";
import corporateTable from "./components/corporate-table.vue";
import {
  pageSendCardByExpr,
  checkCardNo,
  saveOrgCar,
  getCarByApplyId,
} from "@/api/location-card-management/index.js";
import { getOrgList } from "@/api/reserve-manage/index.js";
export default {
  components: { companyCard, corporateTable },
  data() {
    return {
      isSelect: false,
      timeout: null,
      orgId: null, // 单位id
      carCard: "", // 车卡
      personPageSize: 10, // 人卡列表页条数
      carPageSize: 10, // 车卡列表页条数
      changeApplyCardType: null, // 选择企业的卡片类型
      tableHeight: null,
      orgNameSearch: "", // 单位名称搜索
      applyOrgId: "", // 申请单位Id
      applyId: "", // 申请id
      cardTable: "first",
      personList: [], // 卡列表
      editable: [],
      treeList: [], // 单位列表
      personCardList: [], // 人卡列表
      carCardList: [], // 车卡列表
      cardNoList: [], // 输入卡号列表
      carTableList: [],
      personTableList: [],
      allCardNum: 0, // 某单位下需要绑定卡的总数
      bindCardNum: 0, // 绑定卡数量

      customColors: [
        // 电量颜色
        { color: "#F44848", percentage: 10 },
        { color: "#FFB137", percentage: 20 },
        { color: "#67C23A", percentage: 50 },
      ],
      reserveData: {
        // 单位搜索基本条件
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
          orgType: 1,
          applyType: 1,
        },
      },
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
  mounted() {
    this.getOrg(); // 获取单位列表
    pageSendCardByExpr(this.reserveData).then((res) => {
      res.data.list.forEach((item) => {
        item.checked = false;
      });
      this.personList = res.data.list;
    });
  },
  methods: {
    getOrg() {
      let data = [
        {
          expression: "LIKE",
          key: "name",
          value: "",
        },
      ];
      getOrgList(data).then((res) => {
        this.treeList = res.data;
      });
    },
    // 输入单位筛选条件
    querySearchAsync(queryString, cb) {
      this.orgId = null;
      var restaurants = this.treeList;
      var results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
      return (state) => {
        return (
          state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelect(item) {
      this.orgId = item.id;
      let reserveData = {
        ...this.reserveData,
        expr: [
          {
            expression: "LIKE",
            key: "applyOrgId",
            value: item.id,
          },
          {
            expression: "IN",
            key: "approvalStatus",
            value: [3],
          },
        ],
      };
      pageSendCardByExpr(reserveData).then((res) => {
        res.data.list.forEach((item) => {
          item.checked = false;
        });
        this.personList = res.data.list;
      });
    },
    changeRadio(row) {
      this.changeApplyCardType = row.applyCardType;
      this.cardNoList = [];
      this.isSelect = true;
      this.$nextTick(() => {
        const colHeight = this.$refs.rightCol.$el.clientHeight;
        this.tableHeight = colHeight - 152;
      });
      this.personList.forEach((item) => {
        this.$set(item, "checked", false);
      });
      const index = this.personList.findIndex((item) => item.id == row.id);
      this.personList.splice(index, 1, row);
      this.resetTable();
      this.applyOrgId = row.applyOrgId;
      this.applyId = row.id;
      this.allCardNum = row.applyNum;
      if (!row.applyCardType) {
        this.bindCardNum = 0;
        row.applyPersonNum &&
          this.getdataLength(row.applyPersonNum, this.personCardList);
        row.applyVehicleNum &&
          this.getdataLength(row.applyVehicleNum, this.carCardList);
        this.getCardByAppliedId(row.id);
        this.getPaginationPage(
          this.personCardList,
          "person",
          this.personPageSize,
        );
        this.getPaginationPage(this.carCardList, "car", this.carPageSize);
      }
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
    //校验卡号
    cardNoBlur(row) {
      if (!row.locCardVo.cardNo) {
        this.editable = [];
        this.$set(row, "cardStatusCode", true);
        return;
      }
      if (this.cardNoList.length) {
        console.log(this.cardNoList, row.locCardVo.cardNo, "this.cardNoList");
        if (this.cardNoList.indexOf(row.locCardVo.cardNo) != "-1") {
          this.$notify({
            title: "卡号重复输入",
            message: `该卡号重复输入,请重新选择卡号`,
            type: "warning",
          });
          return;
        }
      }
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
            this.$set(row, "cardId", res.data.id);
            this.cardNoList.push(row.locCardVo.cardNo);
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
      const personData = this.personCardList
        .filter((item) => item.editStatus)
        .map((list) => {
          return {
            cardId: list.cardId,
            provideType: 0,
            cardNo: list.locCardVo.cardNo,
          };
        });
      const carData = this.carCardList
        .filter((item) => item.editStatus)
        .map((list) => {
          return {
            cardId: list.cardId,
            provideType: 1,
            cardNo: list.locCardVo.cardNo,
          };
        });
      if (personData.length + carData.length > this.allCardNum) {
        return this.$msgWarning("绑卡数量超过总数量");
      }

      let data = {
        applyId: this.applyId,
        applyOrgId: this.applyOrgId,
        cardDto: [...personData, ...carData],
      };
      // return;
      saveOrgCar(data).then((res) => {
        if (res.code != 200) return this.$messgae.error(res.msg);
        this.$msgSuccess("绑卡成功");
        this.getCardByAppliedId();
      });
    },
    getCardByAppliedId() {
      getCarByApplyId(this.applyId).then((res) => {
        if (!res.data.length) return;
        res.data.forEach((item, idx) => {
          if (item.provideType) {
            this.carCardList.splice(idx, 1, {
              cardId: item.cardId,
              editStatus: false,
              cardStatusCode: false,
              locCardVo: {
                ...item.locCardDto,
              },
            });
            this.cardNoList.push(item.cardNo);
          } else {
            this.personCardList.splice(idx, 1, {
              cardId: item.cardId,
              editStatus: false,
              cardStatusCode: false,
              locCardVo: {
                ...item.locCardDto,
              },
            });
            this.cardNoList.push(item.cardNo);
          }
        });
        this.getPaginationPage(
          this.personCardList,
          "person",
          this.personPageSize,
        );
        this.getPaginationPage(this.carCardList, "car", this.carPageSize);
        this.bindCardNum = res.data.length;
      });
    },
    // 重新选择单位右边table重置
    resetTable() {
      this.editable = [];
      this.carEditable = [];
      this.carCardList = [];
      this.personCardList = [];
      this.personTableList = [];
      this.carTableList = [];
    },
    // 获取选择的单位里有多少人卡和车卡
    getdataLength(num, arr) {
      for (let i = 0; i < num; i++) {
        arr.push({
          cardId: "",
          editStatus: false,
          cardStatusCode: false,
          locCardVo: {},
        });
      }
    },
    // table分页，list拆分
    getPaginationPage(allArr, type, pagrSize, pageNum = 1) {
      if (allArr.length > pagrSize) {
        type == "person"
          ? (this.personTableList = allArr.slice(
              (pageNum - 1) * pagrSize,
              pagrSize * pageNum,
            ))
          : (this.carTableList = allArr.slice(
              (pageNum - 1) * pagrSize,
              pagrSize * pageNum,
            ));
      } else {
        type == "person"
          ? (this.personTableList = allArr.slice(
              (pageNum - 1) * pagrSize,
              pagrSize * pageNum,
            ))
          : (this.carTableList = allArr.slice(
              (pageNum - 1) * pagrSize,
              pagrSize * pageNum,
            ));
      }
    },
    // 人卡下一页
    personCurrentChange(val) {
      this.getPaginationPage(
        this.personCardList,
        "person",
        this.personPageSize,
        val,
      );
    },
    carCurrentChange(val) {
      this.getPaginationPage(this.carCardList, "car", this.carPageSize, val);
    },
    delPersonCard(index) {
      this.personCardList.splice(index, 1);
    },
    delCarCard(index) {
      this.carCardList.splice(index, 1);
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
.content {
  .el-divider {
    margin: 0 !important;
  }
  .content-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 24px;
    font-size: 14px;
    span {
      padding: 0 6px;
    }
  }
  .content-body {
    .content-name {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin: 10px;
      .content-tip {
        font-size: 12px;
        color: #333333;
      }
    }
    .content-visit {
      margin: 0 24px;
      font-size: 14px;
      color: #999999;
    }
    .content-btn {
      display: flex;
      flex-direction: row-reverse;
      margin: 5px 24px;
    }
  }
}
.pagination {
  margin-top: 5px;
  text-align: center;
}

.right-btn {
  display: flex;
  flex-direction: row-reverse;
  align-content: flex-end;
}
.car-card {
  border-radius: 8px;
  padding: 8px;
  background: #f2f2f2;
  display: flex;
  justify-content: space-between;
}

.explan {
  min-width: 160px;
  height: 38px;
  line-height: 38px;
}
.right-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px 20px;
}
</style>
