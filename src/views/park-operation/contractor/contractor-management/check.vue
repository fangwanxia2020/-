<template>
  <div class="edit-content">
    <div class="edit-content-top">
      <back-bar :title="title" />
      <div class="content">
        <div class="content-box">
          <div class="content-title">
            <div class="cl-hea-title">基础信息</div>
          </div>
          <el-form
            ref="baseForm"
            :model="baseForm"
            :rules="baseRules"
            class="content-form"
            label-width="100px"
          >
            <el-row>
              <el-col :span="4">
                <el-row class="cl-width100 clearfix">
                  <ImgUpload
                    :imgs-list.sync="machineImgList"
                    :limit="1"
                    :is-show="!machineImgList.length ? false : true"
                    :is-check="isCheck"
                  />
                </el-row>
              </el-col>
              <el-col :span="10">
                <el-form-item label="姓名: " prop="name">
                  <div>
                    {{ baseForm.name }}
                  </div>
                </el-form-item>
                <el-form-item label="性别: " prop="sex">
                  <el-select
                    v-if="!isCheck"
                    v-model="baseForm.sex"
                    placeholder="请选择性别"
                    clearable
                    filterable
                    style="width: 100%"
                  >
                    <el-option label="男" :value="0"></el-option>
                    <el-option label="女" :value="1"></el-option>
                  </el-select>
                  <span v-else>
                    {{ baseForm.sex == 0 ? "男" : "女" }}
                  </span>
                </el-form-item>
                <el-form-item label="手机号: " prop="phone">
                  <div>
                    {{ baseForm.phone }}
                  </div>
                </el-form-item>
                <el-form-item label="所属承包商: " prop="fillingId">
                  <el-select
                    v-if="!isCheck"
                    v-model="baseForm.fillingId"
                    placeholder="请选择承包商"
                    clearable
                    filterable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in ctrList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                  <span v-else>
                    {{ getNameByKey(ctrList, baseForm.fillingId, "id") }}
                  </span>
                </el-form-item>
                <el-form-item label="到期类型: " prop="expireType">
                  <el-select
                    v-if="!isCheck"
                    v-model="baseForm.expireType"
                    placeholder="请选择到期类型"
                    clearable
                    filterable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in dataType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <span v-else>
                    {{
                      baseForm.expireType == 0
                        ? "自动冻结"
                        : baseForm.expireType == 2
                        ? "固定期限"
                        : "永久有效"
                    }}
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="身份证号: " prop="idCard">
                  <div>
                    {{ baseForm.idCard }}
                  </div>
                </el-form-item>
                <el-form-item label="民族: " prop="nationalityId">
                  <el-select
                    v-if="!isCheck"
                    v-model="baseForm.nationalityId"
                    placeholder="请选择民族"
                    clearable
                    filterable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in nationalityList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                  <span v-else>
                    {{
                      getNameByKey(
                        nationalityList,
                        baseForm.nationalityId,
                        "id",
                      )
                    }}
                  </span>
                </el-form-item>
                <el-form-item label="人员工种: " prop="jobTypeId">
                  <el-select
                    v-if="!isCheck"
                    v-model="baseForm.jobTypeId"
                    placeholder="请选择人员工种"
                    clearable
                    filterable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in peopleList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                  <span v-else>
                    {{ getNameByKey(peopleList, baseForm.jobTypeId, "id") }}
                  </span>
                </el-form-item>
                <el-form-item label="状态: " prop="status">
                  {{ baseForm.status == 1 ? "激活" : "冻结" }}
                </el-form-item>
                <el-form-item
                  v-if="baseForm.expireType == 2"
                  label="有效期: "
                  prop="expireEndTime"
                >
                  <el-date-picker
                    v-if="!isCheck"
                    v-model="baseForm.expireEndTime"
                    :disabled="
                      baseForm.expireType == 1 || baseForm.expireType == 0
                    "
                    type="date"
                    style="width: 100%"
                    placeholder="选择日期"
                    format="yyyy-MM-dd"
                  />
                  <span v-if="isCheck">
                    {{ baseForm.expireEndTime }}
                  </span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="content-box">
          <el-tabs v-model="tabsActive" @tab-click="handleClick">
            <el-tab-pane
              v-for="item in tabsList"
              :key="item.id"
              :label="item.certificateName"
              :name="item.id"
            ></el-tab-pane>
          </el-tabs>
          <el-form
            ref="cardForm"
            style="padding-left: 16%"
            :model="cardForm"
            class="content-form"
            label-width="100px"
          >
            <el-row
              v-for="(item, idx) of cardForm.reserveList"
              :key="idx"
              :span="12"
            >
              <el-col :span="10" style="padding-top: 20px">
                <el-form-item
                  label="证件类型: "
                  :prop="'reserveList.' + idx + '.certificateName'"
                  :rules="reserveRules.certificateTypeId"
                >
                  <span>
                    {{ item.certificateName }}
                  </span>
                </el-form-item>
                <el-form-item
                  label="长期有效: "
                  :prop="'reserveList.' + idx + '.isPermanent'"
                  :rules="reserveRules.isPermanent"
                  class="switch-box"
                >
                  <span>
                    {{ item.isPermanent == 1 ? "是" : "否" }}
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="10" style="padding-top: 20px">
                <el-form-item
                  label="证件编号: "
                  :prop="'reserveList.' + idx + '.certificateNo'"
                  :rules="reserveRules.certificateNo"
                >
                  <div>{{ item.certificateNo }}</div>
                </el-form-item>
                <el-form-item
                  v-if="item.isPermanent == 0"
                  label="证件有效期: "
                  :prop="'reserveList.' + idx + '.expirationDate'"
                  :rules="reserveRules.expirationDate"
                >
                  <span
                    v-if="
                      item.expirationDate && item.expirationDate.length != 0
                    "
                    >{{ item.expirationDate[0].slice(0, 10) }} 至
                    {{ item.expirationDate[1].slice(0, 10) }}</span
                  >
                </el-form-item>
              </el-col>
              <el-col :span="20">
                <el-form-item
                  label="证件照片: "
                  :prop="'reserveList.' + idx + '.imgIdList'"
                  :rules="reserveRules.imgIdList"
                >
                  <ImgUpload
                    :imgs-list.sync="item.imgIdList"
                    :is-check="isCheck"
                  />
                  <div class="lh14" style="margin-top: 20px">
                    1.图片格式必须为：png,bmp,jpeg,jpg；
                  </div>
                  <div class="lh14">2.小于或等于2M；建议使用png格式图片；</div>
                  <div class="lh14">3.图片最多上传9张；</div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="content-box">
          <div class="content-title">
            <div class="cl-hea-title">定位卡信息</div>
          </div>
          <el-form
            ref="baseForm"
            :model="locationForm"
            :rules="locationRules"
            class="content-form"
            label-width="120px"
            style="padding-left: 16%"
          >
            <el-row>
              <el-col :span="10">
                <el-form-item label="定位卡卡号: " prop="cardNo">
                  <div>
                    {{ locationForm.cardNo }}
                  </div>
                </el-form-item>
                <el-form-item label="定位卡类型: " prop="cardType">
                  <span
                    v-if="locationForm.cardType || locationForm.cardType == 0"
                  >
                    {{ locationForm.cardType == 0 ? "普通卡" : "防爆卡" }}
                  </span>
                </el-form-item>
                <el-form-item label="SIM运营商: " prop="simOperatorsId">
                  <div>
                    {{
                      getNameByKey(simList, locationForm.simOperatorsId, "id")
                    }}
                  </div>
                </el-form-item>
                <el-form-item label="SN号: " prop="cardSn">
                  <div>
                    {{ locationForm.cardSn }}
                  </div>
                </el-form-item>
                <el-form-item label="地理位置: " prop="location">
                  <span> {{ locationForm.location }} </span>
                </el-form-item>
                <!-- <el-form-item label="卡片有效期: " prop="fillingId">
                  <span>
                    {{ getNameByKey(ctrList, baseForm.fillingId, "id") }}
                  </span>
                </el-form-item> -->
                <el-form-item label="剩余电量: " prop="remainingCapacity">
                  <div v-if="locationForm.remainingCapacity">
                    <el-progress
                      color="#13ce66"
                      type="circle"
                      :percentage="locationForm.remainingCapacity"
                    ></el-progress>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="定位卡型号: " prop="modelNo">
                  <div>
                    {{ locationForm.modelNo }}
                  </div>
                </el-form-item>
                <el-form-item label="IEMI号: " prop="cardImei">
                  <span>
                    {{
                      locationForm.cardImei,

                    }}
                  </span>
                </el-form-item>
                <el-form-item label="SIM卡ICCID: " prop="simIccid">
                  <span>
                    {{ locationForm.simIccid }}
                  </span>
                </el-form-item>
                <el-form-item label="所属平台: " prop="locPlatName">
                  <span> {{ locationForm.locPlatName }} </span>
                </el-form-item>

                <el-form-item label="运行状态: " prop="isOnline">
                  <span
                    v-if="locationForm.isOnline || locationForm.isOnline == 0"
                  >
                    {{ locationForm.isOnline == 0 ? "离线" : "正常" }}
                  </span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>
    <div class="footer">
      <el-button type="primary" @click="handleBack">编辑</el-button>
    </div>
  </div>
</template>

<script>
import { fileBatchDetail } from "@/api/system/file.js";
import {
  listByExpr,
  listBct,
  getFilingPerson,
} from "@/api/contractor/contractor-management.js";

import ImgUpload from "@/components/img-upload/img-upload.vue";
export default {
  components: { ImgUpload },
  data() {
    var checkPhone = (rule, value, callback) => {
      // 手机号验证
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        const reg = /^1[3456789]\d{9}$/;
        if (reg.test(value)) {
          console.log(11111);
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
    var checkIdNo = (rule, value, callback) => {
      // 手机号验证
      if (!value) {
        return callback(new Error("身份证号不能为空"));
      } else {
        // eslint-disable-next-line prettier/prettier
        const reg =
          /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
        if (reg.test(value)) {
          console.log(11111);
          callback();
        } else {
          return callback(new Error("请输入正确的身份证号"));
        }
      }
    };
    return {
      tabsList: [],
      tabsActive: "1",
      title: "查看—人员基础信息",
      isCheck: false,
      reserveList: [], //工种数据
      machineImgList: [],
      nationalityList: [], //民族编号
      peopleList: [], //人员工种
      simList: [], //运营商
      idList: [], //证件类型
      ctrList: [], //承包商列表
      cardImgList: [],
      locationForm: {
        cardNo: "",
        modelNo: "",
        cardType: null,
        cardImei: "",
        simOperatorsId: "",
        simIccid: "",
        locPlatName: "",
        cardSn: "",
        remainingCapacity: null,
        isOnline: null,
        location: "",
      },
      locationRules: {
        cardNo: [
          { required: true, message: "定位卡卡号不能为空", trigger: "blur" },
        ],
        modelNo: [
          { required: true, message: "定位卡型号不能为空", trigger: "blur" },
        ],
        cardImei: [
          { required: true, message: "IEMI号不能为空", trigger: "blur" },
        ],
        // simIccid: [
        //   { required: true, message: "SIM卡ICCID不能为空", trigger: "blur" },
        // ],
        locPlatName: [
          { required: true, message: "所属平台不能为空", trigger: "blur" },
        ],
        location: [
          { required: true, message: "地理位置不能为空", trigger: "blur" },
        ],
        cardType: [
          { required: true, message: "定位卡类型不能为空", trigger: "blur" },
        ],
        simOperatorsId: [
          { required: true, message: "运营商不能为空", trigger: "blur" },
        ],
        isOnline: [
          { required: true, message: "运行状态不能为空", trigger: "blur" },
        ],
        cardSn: [{ required: true, message: "SN不能为空", trigger: "blur" }],
      },
      baseForm: {
        status: 2,
        expireType: 0,
        sex: 0,
        expireEndTime: "",
      },
      dataType: [
        {
          value: 3,
          label: "自动冻结",
        },
        {
          value: 1,
          label: "永久有效",
        },
        {
          value: 2,
          label: "固定期限",
        },
      ],
      cardForm: {
        reserveList: [
          {
            certificateTypeId: "", //证件类型
            certificateName: "", //证件类型名称
            certificateNo: "", //证件编号
            expirationDate: [], // 证件有效期时间范围
            isPermanent: "", // 长期有效
            imgIdList: [], // 特种照片
          },
        ],
      },
      baseRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        phone: {
          required: true,
          type: "number",
          validator: checkPhone,
          message: "请输入正确的手机号",
          trigger: "blur",
        },
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
        idCard: {
          required: true,
          validator: checkIdNo,
          message: "请输入身份证号",
          trigger: "blur",
        },
        fillingId: [
          { required: true, message: "请输入选择承包商", trigger: "blur" },
        ],
      },
      reserveRules: {
        certificateTypeId: {
          required: true,
          message: "请选择证件类型",
          trigger: "change",
        },
        certificateNo: {
          required: true,
          message: "请输入证件编号",
          trigger: "blur",
        },
        isPermanent: {
          required: true,
          message: "请选择是否长期有效",
          trigger: "change",
        },
        imgIdList: { required: true, message: "请上传证件照片" },
        expirationDate: [
          {
            type: "array",
            required: true,
            message: "请选择日期",
          },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.getListByExpr();
    this.getListBct();
    this.$getTypeCode("sys_nationality_code").then((res) => {
      this.nationalityList = res.data;
    });
    this.$getTypeCode("sys_job_type").then((res) => {
      this.peopleList = res.data;
    });
    this.$getTypeCode("loc_sim_operators").then((res) => {
      this.simList = res.data;
    });
    if (this.$route.query.id) {
      this.isCheck = true;
      this.getDetails(this.$route.query.id);
    }
  },

  methods: {
    handleClick() {
      console.log(this.tabsActive, "1234");
      this.cardForm.reserveList = [];
      this.reserveList.forEach((item) => {
        if (item.id == this.tabsActive) {
          console.log(item, "哈哈哈哈哈");
          this.cardForm.reserveList.push(item);
        }
      });
    },
    // 获取详情
    getDetails(id) {
      getFilingPerson(id).then(async (res) => {
        console.log(res.data, "详情");
        let that = this;
        this.baseForm = res.data;
        this.baseForm.expireEndTime = this.baseForm.expireEndTime
          ? this.baseForm.expireEndTime.slice(0, 10)
          : "";
        if (that.baseForm.picId) {
          const arr1 = this.baseForm.picId.split(",").map((id) => {
            return this.getFileUrl(id);
          });
          this.machineImgList = this.getImgArr1(arr1, that.baseForm.picId);
        }
        // let res1 = await fileBatchDetail(this.baseForm.picId.split(","));
        // this.machineImgList = this.$getImgArr(res1.data);
        this.title = "查看—人员基础信息" + "—" + this.baseForm.name;
        let array = [];
        if (res.data.certificateDtoList && res.data.certificateDtoList.length) {
          let tabsList = res.data.certificateDtoList;
          this.reserveList = res.data.certificateDtoList;
          that.cardForm.reserveList = [];
          that.reserveList.forEach(async (item) => {
            if (item.isPermanent == 0) {
              item.expirationDate = [item.issuanceDate, item.expirationDate];
            }
            // let res2 = await fileBatchDetail(item.fileIdList);
            // this.$set(item, "imgIdList", this.$getImgArr(res2.data));
            const arr3 = item.fileIdList.map((id) => {
              return that.getFileUrl(id);
            });
            let arrList = [];
            arr3.map((item) => {
              console.log(item);
              let id = this.getUrlKey(item, "id");
              let item1 = this.getImgArr2(item, id);
              arrList.push(item1);
            });

            this.$set(item, "imgIdList", arrList);
          });
          for (let i = 0; i < tabsList.length; i++) {
            const element = tabsList[i];
            array.push({
              certificateName: element.certificateName,
              id: element.id,
            });
          }
          that.cardForm.reserveList.push(res.data.certificateDtoList[0]);
          this.tabsActive = res.data.certificateDtoList[0].id;
          this.tabsList = array;
        }
        if (res.data.locCardDto) {
          this.locationForm = res.data.locCardDto;
        }
        // this.locationForm.cardType = 0;
        // that.cardForm.reserveList.push(res.data.certificateDtoList[0]);
        // this.tabsActive = res.data.certificateDtoList[0].id;
        // this.tabsList = array;
      });
    },
    // 处理回显图片
    getImgArr1(data, id) {
      return data.map((item) => {
        return {
          url: item,
          response: {
            data: {
              id: id,
            },
          },
        };
      });
    },
    // 处理回显图片
    getImgArr2(item, id) {
      return {
        url: item,
        response: {
          data: {
            id: id,
          },
        },
      };
    },
    getUrlKey(item, name) {
      return (
        decodeURIComponent(
          (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
            item,
          ) || [, ""])[1].replace(/\+/g, "%20"),
        ) || null
      );
    },
    // 承包商列表
    getListByExpr() {
      let expr = [];
      expr.push(this.handleExpression("EQ", "status", 3));
      listByExpr(expr).then((res) => {
        console.log(res.data, "详情");
        this.ctrList = res.data;
      });
    },
    // 承包商列表
    getListBct() {
      let resParams = {
        order: "createTime",
        sort: "DESC",
        pageNum: 1, // 页码
        pageSize: 9999, // 显示数量
        query: {
          certObject: 20,
        },
        expr: [],
      };
      listBct(resParams).then((res) => {
        console.log(res.data, "3忽高忽低哈哈嗝");
        this.idList = res.data.list;
      });
    },
    // 编辑
    handleBack() {
      this.$router.push({
        path: "/gatedpark/park-operation/contractor/contractor-management/edit",
        query: {
          id: this.$route.query.id,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.edit-content {
  .edit-content-top {
    .content {
      overflow: hidden;
      height: calc(100vh - 200px);
      overflow-y: auto;
      .content-box {
        padding: 0px 118px 20px;
        .content-title {
          margin: 20px 0px;
          display: flex;
          align-items: center;
          .title-bg {
            display: inline-block;
            height: 18px;
            background: #00a1e9;
            width: 3px;
            margin-right: 7px;
          }
        }
        .content-form {
          margin: 20px;
        }
        .content-file {
          padding: 20px 30px;
          .file-tip {
            display: flex;
            line-height: 28px;
            .tip {
              display: inline-block;
              margin-left: 8px;
              font-size: 14px;
              color: #999999;
            }
          }
        }
      }
    }
  }
  .edit-tabs {
    margin: 20px 50px;
    display: inline-block;
    border-radius: 25%;

    span {
      padding: 10px;
    }
    :nth-child(1) {
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
    }
    :nth-child(2) {
      border-top-right-radius: 20px;
      border-bottom-right-radius: 20px;
    }
    .select-tabs {
      background: #0089ff;
      color: white;
    }
    .unselect-tabs {
      background: #e7eaef;
    }
  }

  .input-unit {
    margin-left: 10px;
    display: inline-block;
    height: 40px;
    width: 25px;
    line-height: 40px;
    color: #999999;
  }
  .visit {
    display: flex;
    /deep/ .el-form-item__content {
      width: 55%;
    }
  }
  .time-tabs {
    display: inline-block;
    margin-right: 20px;
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
  .footer {
    position: fixed;
    text-align: center;
    background: #fff;
    width: calc(100vw - 240px);
    bottom: 10px;
    padding: 10px 0;
    /deep/ .el-button--primary {
      width: 100px !important;
      font-size: 14px;
      height: 36px !important;
      border-radius: 4px !important;
    }
  }
}
/deep/ .search-content {
  border-bottom: 0 !important;
}
.img-tip {
  font-size: 14px;
  line-height: 20px;
}
/deep/ .cl-width100 .el-upload--picture-card {
  width: 150px;
  height: 200px !important;
  line-height: 200px !important;
}
/deep/ .cl-width100 .el-upload-list--picture-card .el-upload-list__item {
  width: 150px !important;
  height: 200px !important;
}
.lh14 {
  line-height: 16px;
}
/* switch按钮样式 */
::v-deep .el-switch__core::before {
  content: "冻结";
  position: absolute;
  font-size: 12px;
  top: -1px;
  right: 5px;
  color: #fff;
}

.is-checked ::v-deep .el-switch__core::before {
  content: "激活";
  position: absolute;
  font-size: 12px;
  top: -1px;
  left: 5px;
  color: #fff;
}
::v-deep .el-progress-circle {
  width: 40px !important;
  height: 40px !important;
}
::v-deep .el-progress__text {
  font-size: 12px !important;
}
::v-deep .switch .el-switch__core::before {
  content: "否";
  position: absolute;
  font-size: 12px;
  top: -1px;
  right: 5px;
  color: #fff;
}

.switch-box .is-checked ::v-deep .el-switch__core::before {
  content: "是";
  position: absolute;
  font-size: 12px;
  top: -1px;
  left: 5px;
  color: #fff;
}
.button-del {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
