<template>
  <div class="container">
    <el-form label-width="130px">
      <div class="cl-hea-title" style="margin-left: 20px">访客信息</div>
      <el-row v-for="(item, idx) of reserveList" :key="idx" class="box">
        <el-col :span="3"> &nbsp; </el-col>
        <el-col :span="16" class="box-card">
          <div class="bg">
            <div class="card-top">
              <div
                v-if="item.isPrincipal == 1 && approvalType != 'reserve'"
                class="isPrincipal top-name"
              >
                {{ changePrincipalName() }}
              </div>
              <div v-else class="top-name">随行人</div>
            </div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="姓名：">
                  {{ item.name }}
                </el-form-item>
                <el-form-item label="性别：" class="visit-reason">
                  {{ item.sex == 0 ? "男" : "女" }}
                </el-form-item>
                <el-form-item label="身份证：" prop="date1">
                  {{ item.identityCard }}
                </el-form-item>
                <el-form-item label="手机号码：" prop="date1">
                  {{ item.phone }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="人脸照片：" prop="date1">
                  <img
                    class="car-img"
                    :src="getFileUrl(item.facePhotoId)"
                    alt=""
                    @click="
                      handlePictureCardPreview(getFileUrl(item.facePhotoId))
                    "
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <el-form label-width="130px" style="margin-top: 30px">
      <div class="cl-hea-title" style="margin-left: 20px">拜访信息</div>
      <el-row>
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="20">
          <el-row>
            <el-col :span="12">
              <el-form-item label="拜访单位：">
                {{ visitMsg.visitOrgName }}
              </el-form-item>
              <el-form-item label="拜访日期：">
                {{
                  visitMsg.visitStartTime &&
                  visitMsg.visitStartTime.split(" ")[0]
                }}至{{
                  visitMsg.visitEndTime && visitMsg.visitEndTime.split(" ")[0]
                }}
              </el-form-item>
              <el-form-item label="拜访事由：" prop="desc" class="visit-reason">
                {{ visitMsg.visitReasonDescription }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="接待人：">
                {{ visitMsg.receivePersonName }}
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <el-form
      v-if="approvalType == 'car'"
      label-width="130px"
      style="margin-top: 30px"
    >
      <div class="cl-hea-title" style="margin-left: 20px">车辆信息</div>
      <el-row>
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="20">
          <el-row>
            <el-col :span="12">
              <el-form-item label="车牌号：">
                {{ carMsg.vehicleNum }}
              </el-form-item>
              <el-form-item label="车辆照片：">
                <template v-if="carImgList.length">
                  <img
                    v-for="(item, idx) of carImgList"
                    :key="idx"
                    class="car-img"
                    :src="item"
                    alt=""
                    @click="handlePictureCardPreview(item)"
                  />
                </template>
                <span v-else>暂无图片</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="车辆种类：">
                {{ checkCarCode(carMsg.vehicleType) }}
              </el-form-item>
              <el-form-item label="车辆颜色：" class="car-type">
                {{ carMsg.vehicleColor }}
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <el-form
      v-if="approvalType == 'equipment'"
      label-width="130px"
      style="margin-top: 30px"
    >
      <div class="cl-hea-title" style="margin-left: 20px">机具信息</div>
      <el-row>
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="20">
          <el-row>
            <el-col :span="12">
              <el-form-item label="机具名称：">
                {{ equipmentMsg.machinesName }}
              </el-form-item>
              <el-form-item label="机具种类：">
                {{ changeKind(equipmentMsg.machineKindCode) }}
              </el-form-item>

              <el-form-item label="证件有效期：">
                <template v-if="equipmentMsg.validStartTime">
                  {{ equipmentMsg.validStartTime.split(" ")[0] }}至{{
                    equipmentMsg.validEndTime.split(" ")[0]
                  }}
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="机具类型：">
                {{ changeType(equipmentMsg.machinesType) }}
              </el-form-item>
              <el-form-item label="机具型号：" class="car-type">
                {{ equipmentMsg.machinesModel }}
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="20">
          <el-row>
            <el-col :span="12">
              <el-form-item label="机具照片:">
                <template v-if="equipmentImgList.length">
                  <img
                    v-for="(item, idx) of equipmentImgList"
                    :key="idx"
                    class="car-img"
                    :src="item"
                    alt=""
                    @click="handlePictureCardPreview(item)"
                  />
                </template>
                <span v-else>暂无图片</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="三证照片:">
                <template v-if="threeImgList.length">
                  <img
                    v-for="(item, idx) of threeImgList"
                    :key="idx"
                    class="car-img"
                    :src="item"
                    alt=""
                    @click="handlePictureCardPreview(item)"
                  />
                </template>
                <span v-else>暂无图片</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>

    <ViewImage
      v-if="dialogVisible"
      style="width: 100%; height: 100%"
      :on-close="handleCloseViewer"
      :url-list="[dialogImageUrl]"
    >
    </ViewImage>
  </div>
</template>

<script>
import ViewImage from "@/components/viewImage/index.vue";
import {
  getVisitorDetails,
  getCarDetails,
  getEquipmentDetails,
  getCarKind,
} from "@/api/reserve-manage/index.js";
export default {
  components: { ViewImage },
  props: {
    businessId: {
      type: [String, Number],
      default: "",
    },
    approvalType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: "",
      reserveList: [], // 行人信息
      carImgList: [], // 车辆图片
      equipmentImgList: [], // 机具图片
      threeImgList: [], // 机具三证图片
      equipmentTypeList: [], // 机具类型列表
      allMachineKindList: [], // 机具种类列表
      carTypeList: [], // 车辆种类列表
      visitMsg: {}, // 拜访信息
      carMsg: {}, // 车辆信息
      equipmentMsg: {}, // 机具信息
    };
  },
  computed: {
    changePrincipalName() {
      return (approvalType) => {
        let principalName;
        switch (approvalType) {
          case "car":
            principalName = "驾驶人";
            break;
          case "reserve":
            principalName = "接待人";
            break;
          default:
            principalName = "负责人";
            break;
        }
        return principalName;
      };
    },
    changeKind() {
      return (data) => {
        let name;
        this.allMachineKindList.forEach((item) => {
          if (item.code == data) {
            name = item.name;
          }
        });
        return name;
      };
    },
    checkCarCode() {
      return (code) => {
        let carTypeName;
        this.carTypeList.forEach((item) => {
          if (item.id == code) carTypeName = item.name;
        });
        return carTypeName;
      };
    },
    changeType() {
      return (data) => {
        let name;
        this.equipmentTypeList.forEach((item) => {
          if (item.code == data) {
            name = item.name;
          }
        });
        return name;
      };
    },
  },
  mounted() {
    if (this.approvalType == "reserve") {
      this.getVisitorDetail();
    } else if (this.approvalType == "car") {
      this.getCarDetails(this.businessId);
      // 人车详情
    } else if (this.approvalType == "equipment") {
      // 机具详情
      this.getEquipmentDetails(this.businessId);
      this.$getTypeCode("gatedpark_machine_type").then((res) => {
        this.equipmentTypeList = res.data;
      });
      // 全部机具种类
      this.$getTypeCode("gatedpark_machine_kind").then((res) => {
        this.allMachineKindList = res.data;
      });
    }
  },
  methods: {
    // 获取行人预约详情
    async getVisitorDetail() {
      let res = await getVisitorDetails(this.businessId);
      this.reserveList = res.data.reserveVisitorExDto;
      this.visitMsg = res.data.reserveInfoDto;
    },
    // 获取人车预约详情
    getCarDetails(id) {
      getCarDetails(id).then(async (res) => {
        this.reserveList = res.data.reserveVisitorExDto;
        this.visitMsg = res.data.reserveInfoDto;
        this.carMsg = res.data.reserveVehicleExDto;
        if (this.carMsg.vehiclePhotoId) {
          this.carImgList = this.carMsg.vehiclePhotoId.split(",").map((id) => {
            return this.getFileUrl(id);
          });
        }
      });
      let params = {
        pageNum: 1,
        pageSize: 9999,
        expr: [],
        name: "",
        typeCode: "",
        order: "createTime",
        sort: "DESC",
      };
      getCarKind(params).then((res) => {
        this.carTypeList = res.data.list;
      });
    },
    // 获取机具预约详情
    getEquipmentDetails(id) {
      getEquipmentDetails(id).then(async (res) => {
        this.reserveList = res.data.reserveVisitorExDto;
        this.visitMsg = res.data.reserveInfoDto;
        this.equipmentMsg = res.data.reserveMachineExDto;
        if (this.equipmentMsg.machinesPhotoId) {
          this.equipmentImgList = this.equipmentMsg.machinesPhotoId
            .split(",")
            .map((id) => {
              return this.getFileUrl(id);
            });
        }
        if (this.equipmentMsg.machinesFileIds) {
          this.threeImgList = this.equipmentMsg.machinesFileIds
            .split(",")
            .map((id) => {
              return this.getFileUrl(id);
            });
        }
      });
    },
    // 查看图片
    handlePictureCardPreview(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    // 人脸照片 - 关闭预览
    handleCloseViewer() {
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 70vh;
  .container-content {
    height: calc(100vh - 300px);
    overflow-y: auto;
  }
}
.box {
  display: flex;
  align-items: center;
  flex-direction: column;
  .box-card {
    margin-top: 10px;
    width: 820px;
    background: #f5f7fa;
    border-radius: 12px;
    .card-top {
      border-top-left-radius: 12px;
      position: relative;
      line-height: 56px;
      height: 75px;
      padding-bottom: 19px;
      overflow: hidden;
      .top-name {
        top: -5px;
        left: -59px;
        position: absolute;
        background: #cdcdcf;
        color: #feff;
        width: 159px;
        height: 50px;
        text-align: center;
        transform: rotate(-45deg);
      }
      .isPrincipal {
        background: #006fff;
      }
    }
    /deep/ .el-divider--horizontal {
      margin: 0;
    }
    .el-icon-close {
      cursor: pointer;
    }
  }
}
.car-img {
  width: 100px;
  height: 100px;
  margin: 0 10px;
}
</style>
