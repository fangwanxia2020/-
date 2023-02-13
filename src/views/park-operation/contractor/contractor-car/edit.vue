<template>
  <hqit-content-page :title="title">
    <template slot="content">
      <div class="cl-second">
        <div class="cl-second-content">
          <div class="content-item clearfix">
            <div class="cl-hea-title">基础信息</div>
            <el-form
              ref="baseForm"
              :model="baseForm"
              :rules="baseRules"
              label-width="100px"
            >
              <el-row>
                <el-form-item label="车牌号: " prop="vehicleCode">
                  <el-input
                    v-if="!isCheck"
                    v-model="baseForm.vehicleCode"
                    placeholder="请输入"
                    clearable
                  ></el-input>
                  <span v-else>{{ baseForm.vehicleCode }}</span>
                </el-form-item>
                <el-form-item label="所属承包商: " prop="sealedCtrId">
                  <el-select
                    v-if="!isCheck"
                    v-model="baseForm.sealedCtrId"
                    placeholder="请选择"
                    clearable
                    filterable
                    style="width: 100%"
                    @change="changeCtrId"
                  >
                    <el-option
                      v-for="item in contractorList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                  <span v-else>{{ baseForm.sealedCtrName }}</span>
                </el-form-item>
                <el-form-item label="责任人: " prop="personName">
                  <el-autocomplete
                    v-if="!isCheck"
                    v-model="baseForm.personName"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入内容"
                    clearable
                    @select="handlePersonSelect"
                  ></el-autocomplete>
                  <span v-else>{{ baseForm.personName }}</span>
                </el-form-item>
                <el-form-item label="手机号码: " prop="personPhone">
                  <el-input
                    v-if="!isCheck"
                    v-model="baseForm.personPhone"
                    placeholder="选择责任人自动填充"
                    clearable
                    disabled
                  ></el-input>
                  <span v-else>
                    {{ baseForm.personPhone }}
                  </span>
                </el-form-item>
                <el-form-item label="状态: " prop="vehicleState">
                  <el-radio-group
                    v-if="!isCheck"
                    v-model="baseForm.vehicleState"
                  >
                    <el-switch
                      v-model="baseForm.vehicleState"
                      :active-value="0"
                      :width="50"
                      :inactive-value="1"
                    >
                    </el-switch>
                  </el-radio-group>
                  <span v-else>
                    {{ baseForm.vehicleState == "1" ? "冻结" : "激活" }}
                  </span>
                </el-form-item>
                <el-form-item label="车辆颜色: ">
                  <el-select
                    v-if="!isCheck"
                    v-model="baseForm.vehicleColorId"
                    placeholder="请选择"
                    clearable
                    filterable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in carColorList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                  <span v-else>
                    {{
                      getNameByKey(carColorList, baseForm.vehicleColorId, "id")
                    }}
                  </span>
                </el-form-item>
                <el-form-item label="有效期类型: " prop="validityType">
                  <el-select
                    v-if="!isCheck"
                    v-model="baseForm.validityType"
                    placeholder="请选择有效期类型"
                    clearable
                    filterable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in validTypeList"
                      :key="item.code"
                      :label="item.name"
                      :value="+item.code"
                    />
                  </el-select>
                  <span v-else>
                    {{
                      getNameByKey(validTypeList, baseForm.validityType, "code")
                    }}
                  </span>
                </el-form-item>
                <el-form-item label="时间范围: ">
                  <el-date-picker
                    v-model="baseForm.expireTime"
                    type="datetimerange"
                    placeholder="请选择时间范围"
                    range-separator="-"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :disabled="
                      (!isCheck && baseForm.validityType != 3) || isCheck
                    "
                    style="width: 100%"
                    :default-time="['00:00:00', '23:59:59']"
                  />
                </el-form-item>
                <el-form-item label="车辆种类: ">
                  <el-select
                    v-if="!isCheck"
                    v-model="baseForm.vehicleTypeId"
                    placeholder="请选择"
                    clearable
                    filterable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in carKindList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                  <span v-else>
                    {{
                      getNameByKey(carKindList, baseForm.vehicleTypeId, "id")
                    }}
                  </span>
                </el-form-item>
              </el-row>
              <el-row class="cl-width100 clearfix">
                <el-form-item label="经营范围: ">
                  <el-input
                    v-if="!isCheck"
                    v-model="baseForm.scopeBusiness"
                    type="textarea"
                    maxlength="140"
                    placeholder="内容(选填)"
                    show-word-limit
                  >
                  </el-input>
                  <span v-else>
                    {{ baseForm.scopeBusiness }}
                  </span>
                </el-form-item>
              </el-row>
              <el-row class="cl-width100 clearfix">
                <el-form-item label="车辆照片: ">
                  <template v-if="isCheck">
                    <span v-if="!machineImgList.length"> 暂无照片 </span>
                    <img
                      v-for="(item, idx) of machineImgList"
                      v-else
                      :key="idx"
                      class="car-img"
                      :src="item.url"
                      alt=""
                      @click="handlePictureCardPreview(item.url)"
                    />
                  </template>

                  <ImgUpload
                    v-else
                    :imgs-list.sync="machineImgList"
                    :is-check="isCheck"
                    :tip="true"
                  />
                </el-form-item>
              </el-row>
            </el-form>
            <div class="cl-hea-title">资质证书</div>
            <div class="addFicateBtn">
              <el-button
                v-if="!isCheck"
                size="small"
                type="primary"
                plain
                style="float: right"
                @click="handleAdd"
              >
                添加
              </el-button>
            </div>
            <el-form label-width="100px">
              <el-row class="cl-width100">
                <el-form-item label="">
                  <el-table :data="allCertificateData" style="width: 100%">
                    <el-table-column
                      label="证书类型"
                      show-overflow-tooltip
                      prop="name"
                    ></el-table-column>
                    <el-table-column
                      label="证书编号"
                      show-overflow-tooltip
                      prop="certificateNo"
                    ></el-table-column>
                    <el-table-column
                      label="发证机构"
                      show-overflow-tooltip
                      prop="issuingAuthority"
                    ></el-table-column>
                    <el-table-column
                      label="长期有效"
                      show-overflow-tooltip
                      prop="isPermanent"
                    >
                      <template slot-scope="scope">
                        {{ scope.row.isPermanent == "1" ? "是" : "否" }}
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="有效期"
                      show-overflow-tooltip
                      width="300"
                      prop="expirationDate"
                    >
                      <template slot-scope="scope">
                        <span v-if="scope.row.expirationDate">
                          {{ awaySecond(scope.row.expirationDate[0]) }}至{{
                            awaySecond(scope.row.expirationDate[1])
                          }}
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="操作"
                      align="right"
                      width="150"
                      show-overflow-tooltip
                      class-name="small-padding fixed-width"
                    >
                      <template slot-scope="scope">
                        <el-button type="text" @click="handleCheck(scope.row)">
                          查看
                        </el-button>
                        <el-button
                          v-show="!isCheck"
                          type="text"
                          @click="handleEdit(scope.row)"
                        >
                          修改
                        </el-button>
                        <el-button
                          v-show="!isCheck"
                          type="text"
                          @click="handleDel(scope.$index)"
                        >
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-row>
            </el-form>
          </div>
        </div>
        <div class="footer">
          <el-button
            type="primary"
            @click="isCheck ? handleToEdit() : handleSave()"
          >
            {{ isCheck ? "编辑" : "保存" }}
          </el-button>
        </div>
        <el-dialog
          v-if="CertificateDialogTable"
          title="资质证书— 新增"
          :visible.sync="CertificateDialogTable"
        >
          <addCertificate
            ref="addCertificate"
            :certificate-dialog-table.sync="CertificateDialogTable"
            :certificate-data.sync="certificateData"
          />
          <div slot="footer" style="text-align: right">
            <el-button
              type="default"
              class="cancelButton"
              @click="CertificateDialogTable = false"
            >
              取 消
            </el-button>
            <el-button
              type="primary"
              class="confirmButton"
              @click="btnAddCertificate"
            >
              确定
            </el-button>
          </div>
        </el-dialog>
        <el-dialog
          v-if="CheckCertificateDialogTable"
          :title="certificateTitle"
          :visible.sync="CheckCertificateDialogTable"
        >
          <checkCertificate
            ref="checkCertificate"
            :certificate-dialog-table.sync="CheckCertificateDialogTable"
            :certificate-data.sync="certificateData"
          />
          <div slot="footer" style="text-align: right"></div>
        </el-dialog>
      </div>
      <ViewImage
        v-if="dialogVisible"
        style="width: 100%; height: 100%"
        :on-close="handleCloseViewer"
        :url-list="[dialogImageUrl]"
      >
      </ViewImage>
    </template>
  </hqit-content-page>
</template>

<script>
import ViewImage from "@/components/viewImage/index.vue";
import ImgUpload from "@/components/img-upload/img-upload.vue";
import addCertificate from "./components/addCertificate.vue";
import checkCertificate from "./components/checkCertificate.vue";
import {
  saveCtrCar,
  getCarColor,
  getCtrPersonList,
  getCtrCarDetails,
} from "@/api/contractor/contractor-car.js";
import { getCtrAllList } from "@/api/contractor";
import {
  getOrgList,
  getCarKindList,
} from "@/api/access-control-permission/organization-control.js";
export default {
  components: { ImgUpload, addCertificate, checkCertificate, ViewImage },

  data() {
    return {
      CertificateDialogTable: false,
      CheckCertificateDialogTable: false, // 查看
      isCheck: false,
      dialogVisible: false,
      dialogImageUrl: "",
      certificateTitle: "资质证书— 查看",
      title: "车辆信息— 新增",
      baseForm: {
        vehicleCode: null, // 车辆编号
        personName: "",
        personPhone: null, // 暂时写死
        machinesKind: null, // 车辆类型
        validityType: null, // 有效期类型
        expireTime: null, // 有效期类型时间范围
        vehicleState: 1,
      },
      baseRules: {
        vehicleCode: [
          { required: true, message: "请输入车辆编号", trigger: "blur" },
        ],
        personName: [{ required: true, message: "请输入责任人" }],
        personPhone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
        ],
        machinesKind: [
          { required: true, message: "请选择车辆种类", trigger: "change" },
        ],
        sealedCtrId: [
          { required: true, message: "请选择所属承包商", trigger: "change" },
        ],
        vehicleState: [{ required: true, message: "请选择车辆状态" }],
      },
      validTypeList: [], // 有效期类型列表
      treeList: [], // 树列表
      carKindList: [], // 车辆种类
      carColorList: [], // 车辆颜色
      contractorList: [], // 承包商列表
      allCertificateData: [], // 全部证书数据
      certificateData: {}, // 新增、修改的证书数据
      props: {
        expandTrigger: "hover",
        checkStrictly: true,
        label: "name",
        value: "id",
        children: "children",
      },
      machineImgList: [], // 车辆照片
      machineKindList: [], // 车辆种类列表
      personList: [], // 负责人列表
      vehicleCode: "", // 车牌号
    };
  },
  computed: {},
  watch: {
    // 有效期类型
    "baseForm.validityType": {
      handler(val) {
        if (val != 3) this.baseForm.expireTime = null;
      },
      immediate: true,
    },
    certificateData(val) {
      if (val.name) {
        if (!this.allCertificateData.length) {
          this.allCertificateData.push(val);
        } else {
          let bool = false;
          let num;
          this.allCertificateData.forEach((item, idx) => {
            if (item.id == val.id) {
              bool = true;
              num = idx;
            }
          });
          if (bool) {
            this.allCertificateData[num] = val;
          } else {
            this.allCertificateData.push(val);
          }
        }
      }
    },
  },
  created() {
    this.getOrgList();
    this.getCtrAllList();
    this.$getTypeCode("gatedpark_valid_type").then((res) => {
      this.validTypeList = res.data;
    });
    getCarKindList({}).then((res) => {
      this.carKindList = res.data;
    });
    getCarColor().then((res) => {
      this.carColorList = res.data;
    });
    if (this.$route.query.vehicleCode) {
      this.vehicleCode = this.$route.query.vehicleCode;
    }
    if (this.$route.query.id) this.getDetail();
  },
  methods: {
    // 获取树
    getOrgList() {
      getOrgList().then((res) => {
        this.treeList = res.data;
      });
    },
    // 获取承包商列表
    getCtrAllList() {
      let params = [
        {
          expression: "EQ",
          key: "status",
          value: 3,
        },
      ];
      getCtrAllList(params).then((res) => {
        this.contractorList = res.data;
      });
    },
    // 获取单条详情
    getDetail() {
      // this.title = "车辆信息- 查看";
      this.title = "车辆信息— 查看" + "—" + this.vehicleCode;
      if (this.$route.query.isCheck) {
        this.isCheck = true;
      }
      getCtrCarDetails(this.$route.query.id).then(async (res) => {
        this.baseForm = res.data;
        // 避免改值为空导致无法选择时间范围
        this.$set(this.baseForm, "expireTime", []);
        // 有效期类型时间范围
        if (res.data.expireStartTime && res.data.expireEndTime) {
          this.$set(this.baseForm, "expireTime", [
            res.data.expireStartTime,
            res.data.expireEndTime,
          ]);
        }
        console.log(this.baseForm, "this.baseForm");
        // 车辆照片
        if (res.data.vehiclePhotoId) {
          this.machineImgList = res.data.vehiclePhotoId.split(",").map((id) => {
            return {
              url: this.getFileUrl(id),
              response: {
                data: {
                  id,
                },
              },
            };
          });
        }
        if (res.data.certificateAddDtos) {
          this.allCertificateData = res.data.certificateAddDtos;
          this.allCertificateData.forEach(async (item) => {
            // let res2 = await fileBatchDetail(item.fileIdList);
            item["name"] = item.certificateName;
            item["CtrImgList"] = item.fileIdList.map((id) => {
              return {
                url: this.getFileUrl(id),
                response: {
                  data: {
                    id,
                  },
                },
              };
            });
            item.isPermanent == "0" &&
              (item["expirationDate"] = [
                item.issuanceDate,
                item.expirationDate,
              ]);
          });
        }
      });
    },
    // 车辆文件删除
    handleDel(index) {
      this.$confirm("确定删除该数据？", "警告", {
        confirmButtonText: "删除",
        confirmButtonClass: "el-button--danger",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.allCertificateData.splice(index, 1);
          this.$msgSuccess("删除成功");
        })
        .catch(() => {
          this.$message({
            message: "删除取消",
          });
        });
    },
    // 保存
    handleSave() {
      this.$refs["baseForm"].validate((valid) => {
        if (valid) {
          // console.log(this.baseForm, "baseForm");
          // return;
          let { expireTime } = this.baseForm;
          let params = {
            ...this.baseForm,
            vehiclePhotoId: this.$getIdStr(this.machineImgList), // 车辆照片
            expireStartTime: expireTime ? expireTime[0] : "", // 有效期 产品说不要秒 但是后端又说他没法做 所以前端这么做 是的
            expireEndTime: expireTime ? expireTime[1] : "", // 有效期
            certificateAddDtos: [],
          };
          if (this.allCertificateData.length) {
            this.allCertificateData.forEach((item) => {
              params.certificateAddDtos.push({
                issuanceDate:
                  item.isPermanent == "1" ? "" : item.expirationDate[0],
                expirationDate:
                  item.isPermanent == "1" ? "" : item.expirationDate[1],
                certificateNo: item.certificateNo,
                certificateTypeId: item.id,
                validTime: item.validTime,
                issuingAuthority: item.issuingAuthority,
                isPermanent: item.isPermanent,
                fileIdList: item.CtrImgList
                  ? this.$getIdStr(item.CtrImgList).split(",")
                  : item.fileIdList,
              });
            });
          }
          console.log(params, "params");
          // return;
          params.personName = this.baseForm.personName.split("-")[0];
          delete params.expireTime;
          saveCtrCar(
            this.$route.query.id
              ? Object.assign({ id: this.$route.query.id }, params)
              : params,
          ).then(() => {
            this.$msgSuccess(this.$route.query.id ? "修改成功" : "新增成功");
            this.handleBack();
          });
        }
      });
    },
    // 承包商选择后要查询承包商下面的人员列表
    changeCtrId(id) {
      this.baseForm.personPhone = "";
      this.baseForm.personName = "";
      this.baseForm.personId = "";
      let params = [
        {
          expression: "EQ",
          key: "fillingId",
          value: id,
        },
      ];
      getCtrPersonList(params).then((res) => {
        this.personList = res.data;
      });
    },
    //负责人搜索
    querySearchAsync(queryString, cb) {
      var results = queryString
        ? this.personList
            .filter(this.createStateFilter(queryString))
            .map((person) => {
              return {
                value: `${person.name}-${person.phone}`,
                name: person.name,
                ...person,
              };
            })
        : this.personList.map((person) => {
            return {
              value: `${person.name}-${person.phone}`,
              name: person.name,
              ...person,
            };
          });
      cb(results);
    },
    //申请人过滤
    createStateFilter(queryString) {
      return (person) => {
        return (
          person.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handlePersonSelect(item) {
      this.baseForm.personPhone = item.value.split("-")[1];
      this.baseForm.personId = item.personBaseId;
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
    // 新增资质证书
    handleAdd() {
      this.certificateData = {};
      this.CertificateDialogTable = true;
    },
    // 查看资质证书
    handleCheck(row) {
      this.certificateData = row;
      (this.certificateTitle = `资质证书— 查看- ${row.certificateName}`),
        (this.CheckCertificateDialogTable = true);
    },
    // 修改资质证书
    handleEdit(row) {
      this.certificateData = row;
      this.CertificateDialogTable = true;
    },
    // 把资质证书从弹框拿到改组件
    btnAddCertificate() {
      this.$refs.addCertificate.emitFormData();
    },
    // 编辑
    handleToEdit() {
      // this.title = "车辆信息- 编辑";
      this.title = "车辆信息— 编辑" + "—" + this.vehicleCode;
      this.isCheck = false;
    },
    handleBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.cl-second {
  .cl-second-content {
    margin: 20px 60px 60px 0px;
    .content-item {
      margin-top: 20px;
      .el-form-item {
        width: 45%;
      }
    }
  }
  ::v-deep .el-table .el-table__cell {
    padding: 3.5px 0;
  }
}
.cl-charge {
  .el-tag,
  .el-button {
    height: 30px;
  }
  .el-button {
    margin-left: 10px;
  }
}
.cl-width100 {
  .el-form-item {
    width: 100% !important;
  }
}
.cl-width66 {
  .el-form-item {
    width: 66% !important;
  }
}
.el-tag {
  height: 28px;
  line-height: 26px;
  margin-left: 10px;
}
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
.addFicateBtn {
  overflow: hidden;
  margin-bottom: 15px;
}
.car-img {
  width: 100px;
  height: 100px;
  margin: 0 10px;
}
/deep/ .el-autocomplete {
  width: 100%;
}
/deep/ .el-button {
  margin-left: 5px;
}
.footer {
  position: fixed;
  text-align: center;
  background: #fff;
  left: 50%;
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
