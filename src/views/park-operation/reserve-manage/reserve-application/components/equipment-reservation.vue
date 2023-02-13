<!-- eslint-disable vue/valid-v-bind -->
<template>
  <div>
    <el-form ref="reserveForm" :model="form" label-width="130px">
      <template>
        <div class="cl-hea-title" style="margin-left: 20px">访客信息</div>
        <el-row v-for="(item, idx) of form.reserveList" :key="idx" :gutter="20">
          <el-col :span="3">
            <el-form-item
              :required="true"
              style="margin-top: 7px"
              label="访客:"
            ></el-form-item>
          </el-col>
          <el-col :span="16" class="box-card">
            <div class="bg">
              <div class="card-top" @click="switchPrincipal(item, idx)">
                <div v-if="item.isPrincipal == 1" class="isPrincipal top-name">
                  驾驶员
                </div>
                <div v-if="item.isPrincipal == 0" class="top-name">随行人</div>
                <i class="el-icon-close" @click="delReserve(idx)"></i>
              </div>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item
                    label="姓名："
                    :prop="'reserveList.' + idx + '.name'"
                    :rules="reserveRules.name"
                  >
                    <el-input
                      v-model.trim="item.name"
                      placeholder="请输入"
                      clearable
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="性别："
                    :prop="'reserveList.' + idx + '.sex'"
                    :rules="reserveRules.sex"
                    class="visit-reason"
                  >
                    <el-select
                      v-model="item.sex"
                      placeholder="请选择性别"
                      style="width: 100%"
                    >
                      <el-option label="男" :value="0"></el-option>
                      <el-option label="女" :value="1"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="身份证："
                    :prop="'reserveList.' + idx + '.identityCard'"
                    :rules="reserveRules.identityCard"
                  >
                    <el-input
                      v-model.trim="item.identityCard"
                      maxlength="18"
                      placeholder="请输入"
                      clearable
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="手机号码："
                    :prop="'reserveList.' + idx + '.phone'"
                    :rules="reserveRules.phone"
                  >
                    <el-input
                      v-model.trim="item.phone"
                      maxlength="11"
                      placeholder="请输入"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="人脸照片："
                    :prop="'reserveList.' + idx + '.facePhotoIdList'"
                    :rules="reserveRules.facePhotoIdList"
                  >
                    <ImgUpload
                      :imgs-list.sync="item.facePhotoIdList"
                      :limit="1"
                      class="facePhotoImg"
                      action="/api/sysfile/file_info/uploadImg"
                    >
                    </ImgUpload>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">&nbsp;</el-col>
          <el-col :span="12">
            <el-button type="primary" class="addBtn" @click="addReserve">
              添加访客人员
            </el-button>
          </el-col>
        </el-row>
      </template>
      <div style="margin-top: 30px">
        <div class="cl-hea-title" style="margin-left: 20px">拜访信息</div>
        <el-row>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="20">
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="拜访单位："
                  prop="visitOrgId"
                  :rules="reserveRules.visitOrgId"
                >
                  <el-autocomplete
                    v-model="form.visitOrgId"
                    class="width-100"
                    value-key="name"
                    :trigger-on-focus="false"
                    :fetch-suggestions="querySearchOrgAsync"
                    placeholder="请搜索拜访单位"
                    suffix-icon="el-icon-search"
                    @blur="receiveOrg"
                    @select="handleSelectOrg"
                  ></el-autocomplete>
                </el-form-item>
                <el-form-item
                  label="拜访日期："
                  prop="visitTime"
                  :rules="reserveRules.visitTime"
                >
                  <el-date-picker
                    v-model="form.visitTime"
                    type="daterange"
                    class="width-100"
                    range-separator="-"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                  />
                </el-form-item>
                <el-form-item
                  label="拜访事由："
                  prop="visitReason"
                  :rules="reserveRules.visitReason"
                >
                  <el-select
                    v-model="form.visitReason"
                    class="width-100"
                    placeholder="请选择拜访事由"
                  >
                    <el-option
                      v-for="(item, idx) of visitReasonList"
                      :key="idx"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                  <div style="height: 10px"></div>
                  <el-input
                    v-model="form.visitReasonDescription"
                    type="textarea"
                    placeholder="请选择或输入其他原因"
                    maxlength="140"
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="接待人："
                  prop="receivePersonId"
                  :rules="reserveRules.receivePersonId"
                >
                  <el-autocomplete
                    v-model="form.receivePersonId"
                    value-key="name"
                    class="width-100"
                    :trigger-on-focus="false"
                    :fetch-suggestions="querySearchPersonAsync"
                    placeholder="请搜索接待人姓名"
                    suffix-icon="el-icon-search"
                    @blur="receivePerson"
                    @select="handleSelectPerson"
                  ></el-autocomplete>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 30px">
        <div class="cl-hea-title" style="margin-left: 20px">机具信息</div>
        <el-row>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="20">
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="机具名称："
                  prop="machinesName"
                  :rules="reserveRules.machinesName"
                  class="car-type"
                >
                  <el-input
                    v-model="form.machinesName"
                    class="width-100"
                    placeholder="请输入"
                    clearable
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="机具种类："
                  prop="machineKindCode"
                  :rules="reserveRules.machineKindCode"
                >
                  <el-select
                    v-model="form.machineKindCode"
                    class="width-100"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, idx) of equipmentKindList"
                      :key="idx"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="证件有效期：">
                  <el-date-picker
                    v-model="form.limitedTime"
                    class="width-100"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="机具类型："
                  prop="machinesType"
                  :rules="reserveRules.machinesType"
                >
                  <el-select
                    v-model="form.machinesType"
                    class="width-100"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, idx) of equipmentTypeList"
                      :key="idx"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="机具型号："
                  prop="machinesModel"
                  class="car-type"
                  :rules="reserveRules.machinesModel"
                >
                  <el-input
                    v-model="form.machinesModel"
                    class="width-100"
                    placeholder="请选择"
                  ></el-input>
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
                <el-form-item label="机具照片：">
                  <ImgUpload :imgs-list.sync="machineImgList" :tip="true">
                  </ImgUpload>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="三证照片：">
                  <ImgUpload :imgs-list.sync="threeImgList" :tip="true">
                  </ImgUpload>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import ImgUpload from "@/components/img-upload/img-upload.vue";
import {
  getOrgtree,
  getPersonList,
} from "@/api/access-control-permission/organization-control.js";
import {
  saveMachine,
  getEquipmentDetails,
} from "@/api/reserve-manage/index.js";
import { fileBatchDetail } from "@/api/system/file.js";
import { getListByParentId } from "@/api/system/custom-code.js";
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
        const reg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
        if (reg.test(value)) {
          console.log(11111);
          callback();
        } else {
          return callback(new Error("请输入正确的身份证号"));
        }
      }
    };
    return {
      OrgId: "", // 单位ID
      personId: "", // 接待人ID
      radio: "1", // 单选框
      visitReasonList: [], // 访问事由列表
      equipmentTypeList: [], // 机具类型列表
      equipmentKindList: [], // 机具种类列表（用于下拉框）
      allMachineKindList: [], // 全部机具种类列表（用于编辑保存时）
      machineImgList: [], // 机具照片
      threeImgList: [], // 三证照片
      form: {
        reserveList: [
          // 行人信息
          {
            isPrincipal: 1, //
            name: "", // 姓名
            sex: "", // 性别
            identityCard: "", // 身份证
            phone: "", // 手机号码
            facePhotoIdList: [], // 人脸照片
          },
        ],
        // 拜访信息
        visitOrgId: "",
        receivePersonId: "",
        visitTime: "",
        visitReason: "",
        visitReasonDescription: "",
        // 机具信息
        machinesName: "", //机具名称
        machineKindCode: "", // 机具种类
        limitedTime: [], // 有效时间
        machinesType: "", // 机具类型
        machinesModel: "", // 机具型号
      },

      reserveRules: {
        name: { required: true, message: "请输入姓名", trigger: "blur" },
        sex: { required: true, message: "请选择性别", trigger: "change" },
        identityCard: {
          required: true,
          validator: checkIdNo,
          message: "请输入身份证号",
          trigger: "blur",
        },
        phone: {
          required: true,
          type: "number",
          validator: checkPhone,
          message: "请输入正确的手机号",
          trigger: "blur",
        },
        facePhotoIdList: { required: true, message: "请上传人脸照片" },
        visitOrgId: [
          { required: true, message: "请输入单位", trigger: "change" },
        ],
        receivePersonId: [
          { required: true, message: "请输入接待人名称", trigger: "change" },
        ],
        visitTime: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        visitReason: [
          { required: true, message: "请选择拜访事由", trigger: "change" },
        ],
        machinesName: [
          { required: true, message: "请输入机具名称", trigger: "blur" },
        ],
        machineKindCode: [
          { required: true, message: "请选择机具种类", trigger: "change" },
        ],
        machinesType: [
          { required: true, message: "请选择机具类型", trigger: "change" },
        ],
      },
    };
  },
  computed: {},
  watch: {
    "form.visitReason": {
      handler(val) {
        this.visitReasonList.forEach((item) => {
          if (item.code == val && item.code != 5) {
            this.form.visitReasonDescription = item.name;
          } else if (item.code == val && item.code == 5) {
            this.form.visitReasonDescription = "";
          }
        });
      },
    },
    // 机具类型
    "form.machinesType": {
      handler(id) {
        if (!id) {
          this.equipmentKindList = [];
          this.form.machineKindCode = null;
          return;
        }
        this.form.machineKindCode = null;
        this.equipmentTypeList.forEach((item) => {
          if (item.code == id) this.getSecondCodeList(item.id);
        });
      },
      immediate: true,
    },
  },
  mounted() {
    this.$getTypeCode("gatedpack_visit_reason").then((res) => {
      this.visitReasonList = res.data;
    });
    // 机具类型
    this.$getTypeCode("gatedpark_machine_type").then((res) => {
      this.equipmentTypeList = res.data;
    });
    // 全部机具种类
    this.$getTypeCode("gatedpark_machine_kind").then((res) => {
      this.allMachineKindList = res.data;
    });
    if (this.$route.query.id && this.$route.query.type == "equipment") {
      this.getEquipmentDetails(this.$route.query.id);
    }
  },
  methods: {
    save() {
      this.$refs["reserveForm"].validate((valid) => {
        if (valid) {
          let reserveInfoDto = {}; // 拜访信息
          let reserveMachineExDto = {}; // 机具信息
          let reserveVisitorExDto = []; // 访客信息
          let resData = {};
          if (this.$route.query.id) {
            reserveInfoDto.id = this.form.id;
          }
          reserveInfoDto["visitReason"] = this.form.visitReason;
          if (reserveInfoDto["visitReason"].length > 1) {
            this.visitReasonList.forEach((item) => {
              if (item.name == this.form["visitReason"]) {
                reserveInfoDto["visitReason"] = item.code;
              }
            });
          }
          reserveInfoDto["reserveType"] = 2; // 业务类型 （0-行人预约、1-人车预约，2-机具预约）
          reserveInfoDto["visitStartTime"] = this.form.visitTime[0];
          reserveInfoDto["visitEndTime"] = this.form.visitTime[1];
          reserveInfoDto["visitOrgId"] = this.OrgId;
          reserveInfoDto["receivePersonId"] = this.personId;
          reserveInfoDto["visitReasonDescription"] =
            this.form.visitReasonDescription;
          this.form.reserveList.forEach((item) => {
            let obj = {};
            obj["name"] = item.name;
            obj["isPrincipal"] = item.isPrincipal; // 1为负责人，0为随行人（暂时写死）
            obj["phone"] = item.phone;
            obj["identityCard"] = item.identityCard;
            obj["sex"] = item.sex;
            obj["facePhotoId"] = item.facePhotoIdList[0].response.data.id;

            reserveVisitorExDto.push(obj);
          });
          //机具信息
          reserveMachineExDto["machinesType"] = this.form.machinesType;
          if (reserveMachineExDto["machinesType"].length > 1) {
            this.equipmentTypeList.forEach((item) => {
              if (item.name == reserveMachineExDto["machinesType"]) {
                reserveMachineExDto["machinesType"] = item.code;
              }
            });
          }
          reserveMachineExDto["machineKindCode"] = this.form.machineKindCode;
          if (reserveMachineExDto["machineKindCode"].length > 1) {
            this.allMachineKindList.forEach((item) => {
              if (item.name == reserveMachineExDto["machineKindCode"]) {
                reserveMachineExDto["machineKindCode"] = item.code;
                reserveMachineExDto["machineKindId"] = item.id;
              }
            });
          }
          reserveMachineExDto["machinesName"] = this.form.machinesName;
          reserveMachineExDto["machinesModel"] = this.form.machinesModel;
          if (this.form.limitedTime) {
            reserveMachineExDto["validStartTime"] = this.form.limitedTime[0];
            reserveMachineExDto["validEndTime"] = this.form.limitedTime[1];
          }
          (reserveMachineExDto["machinesPhotoId"] = this.$getIdStr(
            this.machineImgList,
          )),
            (reserveMachineExDto["machinesFileIds"] = this.$getIdStr(
              this.threeImgList,
            )),
            (resData["reserveInfoDto"] = reserveInfoDto);
          resData["reserveVisitorExDto"] = reserveVisitorExDto;
          resData["reserveMachineExDto"] = reserveMachineExDto;
          // return;
          saveMachine(resData).then(() => {
            if (this.$route.query.id) {
              this.$msgSuccess("修改成功");
            } else {
              this.$msgSuccess("新增成功");
            }
            this.$refs.reserveForm.resetFields();
            this.$router.push({
              path: "/gatedpark/park-operation/reserve-manage/reserve-record",
              query: {
                type: "qeuiment",
              },
            });
          });
        }
      });
    },
    // 机具详情
    getEquipmentDetails(id) {
      getEquipmentDetails(id).then(async (res) => {
        this.OrgId = res.data.reserveInfoDto.visitOrgId;
        this.personId = res.data.reserveInfoDto.receivePersonId;
        this.form = {
          reserveList: res.data.reserveVisitorExDto,
          ...res.data.reserveInfoDto,
          ...res.data.reserveMachineExDto,
        };
        this.$set(this.form, "limitedTime", []);
        if (this.form.validStartTime) {
          this.$set(this.form, "limitedTime", [
            this.form.validStartTime,
            this.form.validEndTime,
          ]);
        }
        this.equipmentTypeList.forEach((item) => {
          if (item.code == this.form["machinesType"]) {
            this.form["machinesType"] = item.name;
          }
        });
        this.allMachineKindList.forEach((item) => {
          if (item.code == this.form["machineKindCode"]) {
            this.form["machineKindCode"] = item.name;
          }
        });
        if (this.form.machinesPhotoId) {
          this.machineImgList = this.form.machinesPhotoId
            .split(",")
            .map((id) => {
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
        if (this.form.machinesFileIds) {
          this.threeImgList = this.form.machinesFileIds.split(",").map((id) => {
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
        this.$set(this.form, "visitTime", []);
        this.$set(this.form, "visitTime", [
          this.form["visitStartTime"],
          this.form["visitEndTime"],
        ]);
        console.log(this.form, "this.form.reserveList");
        this.visitReasonList.forEach((item) => {
          if (item.code == this.form["visitReason"]) {
            this.form["visitReason"] = item.name;
          }
        });
        this.form["visitOrgId"] = this.form["visitOrgName"];
        this.form["receivePersonId"] = this.form["receivePersonName"];
        this.form.reserveList.forEach((item) => {
          this.$set(item, "facePhotoIdList", [
            {
              url: this.getFileUrl(item.facePhotoId),
              response: {
                data: {
                  id: item.facePhotoId,
                },
              },
            },
          ]);
        });
      });
    },
    getSecondCodeList(id) {
      getListByParentId(id, {}).then((res) => {
        this.equipmentKindList = res.data.list;
      });
    },
    // 单位搜索查询
    querySearchOrgAsync(queryString, cb) {
      if (queryString) {
        let data = {
          name: queryString,
        };

        getOrgtree(data).then((res) => {
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            cb(res.data);
          }, 3000 * Math.random());
        });
      }
    },
    // 接待人搜索查询
    querySearchPersonAsync(queryString, cb) {
      if (queryString) {
        let params = {
          pageNum: 1,
          pageSize: 999,
          query: {
            hasOrg: true,
            name: queryString,
          },
        };
        getPersonList(params).then((res) => {
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            cb(res.data.list);
          }, 3000 * Math.random());
        });
      }
    },
    createStateFilter(queryString) {
      return (state) => {
        return (
          state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    // 远程组织搜索框选择
    handleSelectOrg(item) {
      this.OrgId = item.id;
    },
    // 远程接待人搜索框选择
    handleSelectPerson(item) {
      this.personId = item.personId;
    },
    // 更改负责人
    switchPrincipal(obj, num) {
      obj.isPrincipal = 1;
      this.form.reserveList.forEach((item, idx) => {
        if (num != idx) item.isPrincipal = 0;
      });
    },
    // 增加人员信息
    addReserve() {
      this.form.reserveList.push({
        isPrincipal: 0, //
        name: "", // 姓名
        sex: "", // 性别
        identityCard: "", // 身份证
        phone: "", // 手机号码
        facePhotoIdList: [], // 人脸照片
      });
    },
    // 删除人员信息
    delReserve(idx) {
      this.form.reserveList.splice(idx, 1);
    },
    receivePerson() {
      if (this.personId == "") {
        this.form.receivePersonId = "";
      }
    },
    receiveOrg() {
      if (this.OrgId == "") {
        this.form.visitOrgId = "";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.box-card {
  margin-top: 10px;
  .bg {
    background: #f5f7fa;
    border-radius: 12px;
  }
  .card-top {
    border-top-left-radius: 12px;
    position: relative;
    line-height: 62px;
    overflow: hidden;
    .top-name {
      top: -8px;
      left: -63px;
      position: absolute;
      background: #cdcdcf;
      color: #feff;
      width: 158px;
      height: 46px;
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
    margin-left: 94%;
  }
}

.addBtn {
  margin-top: 20px;
}
.width-100 {
  width: 100%;
}

.visit-reason {
  width: 100%;
}
.facePhotoImg {
  /deep/ .uploader {
    width: 100px;
    height: 100px;
    overflow: hidden;
    .el-upload-list--picture-card {
      display: block;
    }
  }
}
</style>
