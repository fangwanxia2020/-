<template>
  <div>
    <el-form ref="reserveForm" :model="form" label-width="130px">
      <template>
        <div class="cl-hea-title" style="margin-left: 20px">访客信息</div>
        <el-row v-for="(item, idx) of form.reserveList" :key="idx" :gutter="20">
          <el-col :span="3">
            <el-form-item
              style="margin-top: 7px"
              label="访客:"
              :required="true"
            ></el-form-item>
          </el-col>
          <el-col :span="16" class="box-card">
            <div class="bg">
              <div class="card-top">
                <div class="top-name">随行人</div>
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
                    <!-- <el-autocomplete
                      v-model="item.name"
                      :fetch-suggestions="querySearchAsync"
                      placeholder="请输入或者搜索选择访客"
                      suffix-icon="el-icon-search"
                      @select="handleSelect"
                    ></el-autocomplete> -->
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
                      placeholder="请输入"
                      maxlength="11"
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
                    :trigger-on-focus="false"
                    value-key="name"
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
                    :fetch-suggestions="querySearchPersonAsync"
                    placeholder="请搜索接待人姓名"
                    suffix-icon="el-icon-search"
                    :trigger-on-focus="false"
                    @blur="receivePerson"
                    @select="handleSelectPerson"
                  ></el-autocomplete>
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
import { saveVisitor } from "@/api/reserve-manage/index.js";
import { getVisitorDetails } from "@/api/reserve-manage/index.js";
import {
  getOrgtree,
  getPersonList,
} from "@/api/access-control-permission/organization-control.js";
export default {
  name: "pedestrian-reserve",
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
      PersonId: "", // 接待人ID
      radio: "2", // 单选框
      visitReasonList: [], // 访问事由列表
      timeout: null,
      personId: "",
      form: {
        reserveList: [
          // 行人信息
          {
            isPrincipal: 1,
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
  },
  created() {
    if (this.$route.query.id && this.$route.query.type == "reserve") {
      this.getVisitDetails(this.$route.query.id);
    }
  },
  mounted() {
    this.$getTypeCode("gatedpack_visit_reason").then((res) => {
      this.visitReasonList = res.data;
    });
  },

  methods: {
    // 详情接口
    getVisitDetails(id) {
      getVisitorDetails(id).then((res) => {
        this.OrgId = res.data.reserveInfoDto.visitOrgId;
        this.personId = res.data.reserveInfoDto.receivePersonId;
        this.form = {
          reserveList: res.data.reserveVisitorExDto,
          ...res.data.reserveInfoDto,
        };
        this.$set(this.form, "visitTime", []);
        this.$set(this.form, "visitTime", [
          this.form["visitStartTime"],
          this.form["visitEndTime"],
        ]);
        this.form["visitOrgId"] = this.form["visitOrgName"];
        this.form["receivePersonId"] = this.form["receivePersonName"];
        this.visitReasonList.forEach((item) => {
          if (item.code == this.form["visitReason"]) {
            this.form["visitReason"] = item.name;
          }
        });
        //
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
    save() {
      this.$refs["reserveForm"].validate((valid) => {
        if (valid) {
          let reserveInfoDto = {}; // 拜访信息
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
          reserveInfoDto["reserveType"] = 0; // 业务类型 （0-行人预约、1-人车预约，2-机具预约）
          reserveInfoDto["visitStartTime"] = this.form.visitTime[0];
          reserveInfoDto["visitEndTime"] = this.form.visitTime[1];
          reserveInfoDto["visitOrgId"] = this.OrgId;
          reserveInfoDto["receivePersonId"] = this.personId;
          reserveInfoDto["visitReasonDescription"] =
            this.form.visitReasonDescription;
          this.form.reserveList.forEach((item) => {
            let obj = {};
            obj["isPrincipal"] = item.isPrincipal;
            obj["name"] = item.name;
            obj["phone"] = item.phone;
            obj["identityCard"] = item.identityCard;
            obj["sex"] = item.sex;
            obj["facePhotoId"] = item.facePhotoIdList[0].response.data.id;
            reserveVisitorExDto.push(obj);
          });
          resData["reserveInfoDto"] = reserveInfoDto;
          resData["reserveVisitorExDto"] = reserveVisitorExDto;
          saveVisitor(resData).then(() => {
            if (this.$route.query.id) {
              this.$msgSuccess("修改成功");
            } else {
              this.$msgSuccess("新增成功");
            }
            this.$refs.reserveForm.resetFields();
            this.$router.push({
              path: "/gatedpark/park-operation/reserve-manage/reserve-record",
              query: {
                type: "reserve",
              },
            });
          });
        } else {
          return false;
        }
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
          pageSize: 99999,
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
    // 搜索过滤
    createStateFilter(queryString) {
      return (state) => {
        console.log(state.name, "state");
        return state.name.indexOf(queryString) === 0;
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
    getName(code, arr, id, name) {
      let newName;
      arr.forEach((item) => {
        console.log(item[id], item, "item");
        console.log(code, "code");
        if (item[id] == code) {
          newName = item[name];
        }
      });

      return newName;
    },
    // 增加人员信息
    addReserve() {
      this.form.reserveList.push({
        isPrincipal: 0,
        name: "",
        sex: "",
        identityCard: "",
        phone: "",
        facePhotoIdList: [],
      });
    },
    // 删除人员信息
    delReserve(idx) {
      this.form.reserveList.splice(idx, 1);
    },
    // 接待人输入框失去焦点
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
