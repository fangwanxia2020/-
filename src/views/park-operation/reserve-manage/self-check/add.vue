<template>
  <div>
    <back-bar :title="`${pageTitle}`" />
    <div class="cl-second">
      <div class="cl-second-content">
        <div class="content-item clearfix">
          <div class="mb20">
            <div class="cl-hea-title">运单</div>
            <!-- {{ listItem.baseForm }} -->
            <Waybill ref="baseForm" :form-data="listItem.baseForm" />
          </div>
          <div class="mb20">
            <div class="cl-hea-title">货物明细</div>
            <GoodsDetail ref="goods" :form-data="listItem.goods" />
          </div>
          <div class="cl-send-receive mb20">
            <div class="cl-send-receive-l">
              <div class="mb20">
                <div class="cl-hea-title">托运人</div>
                <PersonForm ref="shipper" :form-data="listItem.shipper" />
              </div>
              <div class="mb20">
                <div class="cl-hea-title">装货人</div>
                <PersonForm ref="expediter" :form-data="listItem.expediter" />
              </div>
              <div class="mb20">
                <div class="cl-hea-title">起运地</div>
                <PlaceForm ref="origin" :form-data="listItem.origin" />
              </div>
            </div>
            <div class="cl-send-receive-r">
              <div class="mb20">
                <div class="cl-hea-title">承运人</div>
                <PersonForm ref="haulier" :form-data="listItem.haulier" />
              </div>
              <div class="mb20">
                <div class="cl-hea-title">收货人</div>
                <PersonForm ref="consignee" :form-data="listItem.consignee" />
              </div>
              <div class="mb20">
                <div class="cl-hea-title">目的地</div>
                <PlaceForm
                  ref="destination"
                  :form-data="listItem.destination"
                />
              </div>
            </div>
          </div>
          <div class="mb20">
            <div class="cl-hea-title">运单调度</div>
            <WaybillDispatch ref="dispatch" :form-data="listItem.dispatch" />
          </div>
        </div>
      </div>
      <div class="footer">
        <el-button
          style="width: 100px"
          type="primary"
          @click="isCheck ? handleToEdit() : handleSave()"
        >
          {{ isCheck ? "编辑" : "保存" }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Waybill from "./comps/waybill.vue";
import GoodsDetail from "./comps/goods-detail.vue";
import PersonForm from "./comps/person-form.vue";
import PlaceForm from "./comps/place-form.vue";
import WaybillDispatch from "./comps/waybill-dispatch.vue";
import { CodeToText, TextToCode } from "element-china-area-data";
import {
  saveWaybillAndDetail,
  getWaybillByWaybillCode,
} from "@/api/reserve-manage/waybill.js";

export default {
  components: {
    Waybill,
    GoodsDetail,
    PersonForm,
    PlaceForm,
    WaybillDispatch,
  },
  data() {
    return {
      pageType: null, // 当前页面是?
      pageTitle: "",
      listItem: {},
      formData: {},
      id: null,
    };
  },
  provide() {
    return {
      isCheck: this.isCheck,
    };
  },
  computed: {
    isAdd() {
      return this.pageType == "self-check-add";
    },
    isCheck() {
      return this.pageType == "self-check-check";
    },
  },
  watch: {
    $route: {
      handler: function (val) {
        this.pageType = val.name;
      },
      immediate: true,
    },
  },
  // mounted() {

  // },
  mounted() {
    let { id, title, who } = this.$route.query;

    console.log(this.id);
    if (id) {
      this.getDetail();
    }
    if (!who) this.pageTitle = "危化品电子运单报备— 新增";
    if (who && title) {
      if (who == 1) {
        this.pageTitle = this.isCheck
          ? `两客一危自助校验— 查看— ${title}`
          : `两客一危自助校验— 修改— ${title}`;
      }
      if (who == 2) {
        this.pageTitle = this.isCheck
          ? `危化品电子运单报备— 查看— ${title}`
          : `危化品电子运单报备— 修改— ${title}`;
      }
    }
    this.id = this.$route.query.id;
  },
  methods: {
    // 获取单条详情
    getDetail() {
      let that = this;
      getWaybillByWaybillCode(this.$route.query.id).then((res) => {
        // console.log(res.data)
        // let res = getWaybillInfo(this.$route.query.id);
        console.log(res, "77777");
        // this.formData = res.data;
        this.$nextTick(() => {
          // this.listItem.baseForm = res.data;
          that.$set(this.listItem, "baseForm", res.data);
          that.$set(
            this.listItem,
            "goods",
            res.data.hcplmTransWaybillDetailDto,
          );
          // 托运人
          let shipper = {};
          shipper.name = res.data.shipperName;
          shipper.phone = res.data.shipperPhone;
          that.$set(this.listItem, "shipper", shipper);
          // 承运人
          let haulier = {};
          haulier.name = res.data.transName;
          haulier.phone = res.data.transPhone;
          that.$set(this.listItem, "haulier", haulier);
          //装货人
          let expediter = {};
          expediter.name = res.data.loadName;
          expediter.phone = res.data.loadPhone;
          that.$set(this.listItem, "expediter", expediter);
          // 收货人
          let consignee = {};
          consignee.name = res.data.receiverName;
          consignee.phone = res.data.receiverPhone;
          that.$set(this.listItem, "consignee", shipper);

          // 运单调度
          let dispatch = {
            vehicleLicense: res.data.vehicleLicense, //车牌号
            trailerLicense: res.data.trailerLicense, //挂车号
            driverName: res.data.driverName, //驾驶员
            driverPhone: res.data.driverPhone, //驾驶员电话
            escortName: res.data.escortName, //押运员
            tankCode: res.data.tankCode, //罐体编号
            tankVolume: res.data.tankVolume, //罐体容积
            remark: res.data.remark, //备注
          };

          that.$set(this.listItem, "dispatch", dispatch);
          let arr = [];
          let arr1 = [];

          if (res.data.shipmentProvince) {
            let shipment = TextToCode[res.data.shipmentProvince].code;

            let city1 = "";
            if (
              res.data.shipmentCity == "北京市" ||
              res.data.shipmentCity == "重庆市" ||
              res.data.shipmentCity == "天津市" ||
              res.data.shipmentCity == "上海市"
            ) {
              city1 = "市辖区";
            } else {
              city1 = res.data.shipmentCity;
            }
            let shipment1 = TextToCode[res.data.shipmentProvince][city1].code;
            let shipment2 =
              TextToCode[res.data.shipmentProvince][city1][
                res.data.shipmentCounty
              ].code;
            console.log(shipment, shipment1, shipment2, "哈哈哈嗝");

            arr = [shipment, shipment1, shipment2];
          }
          if (res.data.destinationProvince) {
            let city2 = "";
            if (
              res.data.destinationCity == "北京市" ||
              res.data.destinationCity == "重庆市" ||
              res.data.destinationCity == "天津市" ||
              res.data.destinationCity == "上海市"
            ) {
              city2 = "市辖区";
            } else {
              city2 = res.data.shipmentCity;
            }
            let destination1 = TextToCode[res.data.destinationProvince].code;
            let destination2 =
              TextToCode[res.data.destinationProvince][city2].code;
            let destination3 =
              TextToCode[res.data.destinationProvince][city2][
                res.data.destinationCounty
              ].code;

            arr1 = [destination1, destination2, destination3];
          }
          let origin = {};
          let destination = {};
          //起运地
          origin.area = arr;
          origin.address = res.data.shipmentPlace;
          that.$set(this.listItem, "origin", origin);
          // 目的地
          destination.area = arr1;
          destination.address = res.data.destination;
          that.$set(this.listItem, "destination", destination);

          console.log(that.listItem, "1234");
          this.$forceUpdate();
        });
      });
    },
    // 保存
    handleSave() {
      return;
      let refArr = [
        "baseForm", // 运单
        "goods", // 货物明细
        "shipper", // 托运人
        "expediter", // 装货人
        "origin", // 起运地
        "haulier", // 承运人
        "consignee", // 收货人
        "destination", // 目的地
        "dispatch", // 运单调度
      ];
      let validResArr = refArr.map((item) => {
        return this.handleCheckForm(item);
      });
      Promise.all(validResArr).then(() => {
        let params = {
          id: this.id, //运单编号
          waybillCode: this.$refs["baseForm"].form.waybillCode, //运单编号
          shipperName: this.$refs["shipper"].form.name, // 托运人
          shipperPhone: this.$refs["shipper"].form.phone, // 托运人
          transName: this.$refs["haulier"].form.name, // 承运人
          transPhone: this.$refs["haulier"].form.phone, // 承运人
          loadName: this.$refs["expediter"].form.name, // 装货人
          loadPhone: this.$refs["expediter"].form.phone, // 装货人
          receiverName: this.$refs["consignee"].form.name, // 收货人
          receiverPhone: this.$refs["consignee"].form.phone, // 收货人
          shipmentDate: this.$refs["baseForm"].form.shipmentDate, // 起送日期
          shipMethod: this.$refs["baseForm"].form.shipMethod, // 城市配送
          // waybillCode: "23324434", // 城市配送

          shipmentProvince: CodeToText[this.$refs["origin"].form.area[0]],
          shipmentCity: CodeToText[this.$refs["origin"].form.area[1]],
          shipmentCounty: CodeToText[this.$refs["origin"].form.area[2]],
          destinationProvince:
            CodeToText[this.$refs["destination"].form.area[0]],
          destinationCity: CodeToText[this.$refs["destination"].form.area[1]],
          destinationCounty: CodeToText[this.$refs["destination"].form.area[2]],
          shipmentPlace: this.$refs["origin"].form.address,
          destination: this.$refs["destination"].form.address,
          ...this.$refs["dispatch"].form,
        };
        params.hcplmTransWaybillDetailDto = {
          ...this.$refs["baseForm"].form,
          ...this.$refs["goods"].form.tableData[0],
        };
        console.log(params);
        // return;
        // if (this.isAdd) {
        saveWaybillAndDetail(params).then(() => {
          if (this.$route.query.id) {
            this.$msgSuccess("修改成功");
          } else {
            this.$msgSuccess("新增成功");
          }
          this.$router.go(-1);
        });
        // this.handleTips();
        // }
      });
    },
    // 多表单验证
    handleCheckForm(refName) {
      let refType = this.$refs[refName].$refs["form"];
      return new Promise((resolve, reject) => {
        refType.validate((valid) => {
          if (valid) {
            resolve();
          } else {
            reject();
          }
        });
      });
    },
    // 编辑
    handleToEdit() {
      this.$router.push({
        path: "/gatedpark/park-operation/reserve-manage/waybill-report/edit",
        query: { id: this.$route.query.id },
      });
    },
    handleBack() {
      this.$router.push({
        path: "/gatedpark/park-operation/reserve-manage/waybill-report",
      });
    },
  },
};
</script>

<style lang="scss">
.cl-send-receive {
  display: flex;
  .cl-send-receive-l {
    width: 50%;
    border-right: 2px dashed #e6ebf5;
  }
  .cl-send-receive-r {
    width: 50%;
    margin-left: 8%;
  }
}

.mb20 {
  margin-bottom: 20px;
}
.footer {
  position: fixed;
  text-align: center;
  background: #fff;
  width: calc(100vw - 240px);
  bottom: 10px;
  padding: 10px 0;
  z-index: 100;
  /deep/ .el-button--primary {
    width: 100px !important;
    font-size: 14px;
    height: 36px !important;
    border-radius: 4px !important;
  }
}
</style>
<style lang="scss" scoped>
.footer {
  position: fixed;
  text-align: center;
  background: #fff;
  width: calc(100vw - 240px);
  bottom: 10px;
  padding: 10px 0;
  z-index: 100;
}
/deep/ .el-button--primary {
  width: 100px !important;
  font-size: 14px;
  height: 36px !important;
  border-radius: 4px !important;
}
</style>
