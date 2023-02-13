<template>
  <div style="margin-top: 40px">
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
    <el-table :data="cardData" :height="tableHeight" style="width: 100%">
      <el-table-column width="80" label="序号" prop="index"> </el-table-column>
      <el-table-column prop="address" label="定位卡号" width="280">
        <template slot-scope="{ row, $index }">
          <div
            class="explan"
            @click.stop="changeNum(row, $index, 'editRemarkInput')"
          >
            <el-input
              v-if="
                editable[$index] || !(row.locCardVo && row.locCardVo.cardNo)
              "
              v-model="row.locCardVo.cardNo"
              placeholder="请输入内容"
              :class="[{ error: row.cardStatusCode }, 'editRemarkInput']"
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
              :style="remainingCapacityColor(row.locCardVo.remainingCapacity)"
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
          <!-- @click="delPersonCard($index)" -->
          <el-button type="text"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      :page-sizes="[5, 10]"
      :page-size="personPageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="allData.length"
      @current-change="personCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import {
  getCarByApplyId,
  saveOrgCar,
  checkCardNo,
} from "@/api/location-card-management/index.js";
export default {
  props: {
    // 申请id
    id: {
      type: String,
      default: "",
    },
    applyOrgId: {
      type: [String, Number],
      default: "",
    },
    // 总卡数量
    allCardNum: {
      type: Number,
      default: 0,
    },
    tableHeight: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      bindCardNum: 0,
      personPageSize: 10,
      customColors: [
        { color: "#F44848", percentage: 10 },
        { color: "#FFB137", percentage: 20 },
        { color: "#67C23A", percentage: 50 },
      ],
      allData: [],
      cardData: [],
      editable: [],
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
  created() {
    this.getCardByAppliedId();
  },
  methods: {
    getCardByAppliedId() {
      for (let i = 0; i < this.allCardNum; i++) {
        this.allData.push({
          index: i + 1,
          cardId: "",
          editStatus: false,
          cardStatusCode: false,
          locCardVo: {},
        });
      }
      if (this.allData.length > this.personPageSize) {
        this.cardData = this.allData.slice(0, this.personPageSize);
      } else {
        this.cardData = this.allData;
      }

      getCarByApplyId(this.id).then((res) => {
        if (!res.data.length) return;
        res.data.forEach((item, idx) => {
          this.allData.splice(idx, 1, {
            index: idx + 1,
            cardId: item.cardId,
            editStatus: false,
            cardStatusCode: false,
            locCardVo: {
              ...item.locCardDto,
            },
          });
        });
        if (this.allData.length > this.personPageSize) {
          this.cardData = this.allData.slice(0, this.personPageSize);
        } else {
          this.cardData = this.allData;
        }
        this.bindCardNum = res.data.length;
      });
    },
    // 发卡
    oneKeyBindCard() {
      const personData = this.allData
        .filter((item) => item.editStatus)
        .map((list) => {
          return {
            cardId: list.cardId,
            cardNo: list.locCardVo.cardNo,
          };
        });
      let data = {
        applyId: this.id,
        applyOrgId: this.applyOrgId,
        cardDto: personData,
      };

      saveOrgCar(data).then((res) => {
        if (res.code != 200) return this.$messgae.error(res.msg);
        this.$msgSuccess("绑卡成功");
        this.getCardByAppliedId();
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
    //校验卡号
    cardNoBlur(row) {
      if (!row.locCardVo.cardNo) {
        this.editable = [];
        this.$set(row, "cardStatusCode", true);
        return;
      }
      // if (this.cardNoList.length) {
      //   console.log(this.cardNoList, row.locCardVo.cardNo, "this.cardNoList");
      //   if (this.cardNoList.indexOf(row.locCardVo.cardNo) != "-1") {
      //     this.$notify({
      //       title: "卡号重复输入",
      //       message: `该卡号重复输入,请重新选择卡号`,
      //       type: "warning",
      //     });
      //     return;
      //   }
      // }
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
          if (res.data.cardType == 1) {
            this.$set(row, "cardStatusCode", false);
            this.$set(row, "cardId", res.data.id);
            // this.cardNoList.push(row.locCardVo.cardNo);
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
    personCurrentChange(val) {
      console.log(val, "11");
      this.cardData = this.allData.slice(
        (val - 1) * this.personPageSize,
        val * this.personPageSize,
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.right-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px 20px;
}
</style>
