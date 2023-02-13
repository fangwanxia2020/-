<template>
  <div class="edit-content">
    <div class="edit-content-top">
      <back-bar :title="title" />
      <div class="content">
        <div class="content-box">
          <div class="content-title">
            <span class="title-bg"></span>
            <span class="title-text">基础信息</span>
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
                  <el-input
                    v-model="baseForm.name"
                    placeholder="请输入姓名"
                    clearable
                  ></el-input>
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
                    {{
                      getNameByKey(
                        machineFilesList,
                        baseForm.machinesType,
                        "id",
                      )
                    }}
                  </span>
                </el-form-item>
                <el-form-item label="手机号: " prop="phone">
                  <el-input
                    v-model="baseForm.phone"
                    placeholder="请输入手机号"
                    clearable
                  ></el-input>
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
                    {{
                      getNameByKey(
                        machineFilesList,
                        baseForm.machinesType,
                        "id",
                      )
                    }}
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
                      getNameByKey(
                        machineFilesList,
                        baseForm.machinesType,
                        "id",
                      )
                    }}
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="身份证号: " prop="idCard">
                  <el-input
                    v-model="baseForm.idCard"
                    placeholder="请输入身份证号"
                    clearable
                  ></el-input>
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
                  <el-switch
                    v-model="baseForm.status"
                    :width="50"
                    :inactive-value="2"
                    :active-value="1"
                  >
                  </el-switch>
                </el-form-item>
                <el-form-item label="有效期: " prop="expireEndTime">
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
          <div class="content-title">
            <span class="title-bg"></span>
            <span class="title-text">特种作业</span>
          </div>
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
              style="border: 1px solid #ccc; margin-bottom: 20px"
              :span="12"
            >
              <div class="card-top">
                <el-button
                  class="button-del"
                  type="danger"
                  icon="el-icon-delete"
                  @click="delReserve(idx)"
                ></el-button>
              </div>
              <el-col :span="10" style="padding-top: 20px">
                <el-form-item
                  label="证件类型: "
                  :prop="'reserveList.' + idx + '.certificateTypeId'"
                  :rules="reserveRules.certificateTypeId"
                >
                  <el-select
                    v-if="!isCheck"
                    v-model="item.certificateTypeId"
                    placeholder="请选择证件类型"
                    clearable
                    filterable
                    style="width: 100%"
                    @change="selectTypeId(item, $event)"
                  >
                    <el-option
                      v-for="item1 in idList"
                      :key="item1.id"
                      :label="item1.name"
                      :value="item1.id"
                    />
                  </el-select>
                  <span v-else>
                    {{
                      getNameByKey(
                        machineFilesList,
                        cardForm.machinesType,
                        "id",
                      )
                    }}
                  </span>
                </el-form-item>
                <el-form-item
                  label="长期有效: "
                  :prop="'reserveList.' + idx + '.isPermanent'"
                  :rules="reserveRules.isPermanent"
                  class="switch-box"
                >
                  <el-switch
                    v-model="item.isPermanent"
                    disabled
                    class="switch"
                    :width="50"
                    :inactive-value="0"
                    :active-value="1"
                  >
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="10" style="padding-top: 20px">
                <el-form-item
                  label="证件编号: "
                  :prop="'reserveList.' + idx + '.certificateNo'"
                  :rules="reserveRules.certificateNo"
                >
                  <el-input
                    v-model="item.certificateNo"
                    placeholder="请输入证件编号"
                    clearable
                  ></el-input>
                </el-form-item>
                <el-form-item
                  v-if="item.isPermanent == 0"
                  label="证件有效期: "
                  :prop="'reserveList.' + idx + '.expirationDate'"
                  :rules="reserveRules.expirationDate"
                >
                  <el-date-picker
                    v-model="item.expirationDate"
                    :disabled="item.isPermanent == 1"
                    type="daterange"
                    style="width: 100%"
                    range-separator="-"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd HH:mm"
                    :default-time="['00:00:00', '23:59:59']"
                  />
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
          <el-button
            type="primary"
            class="addBtn"
            style="margin-left: 18%"
            @click="addReserve"
          >
            添加特种作业
          </el-button>
        </div>
      </div>
    </div>
    <div class="footer">
      <el-button v-if="!isCheck" type="primary" @click="save">保存</el-button>
      <el-button @click="handleBack">取消</el-button>
    </div>
  </div>
</template>

<script>
import { fileBatchDetail } from "@/api/system/file.js";
import {
  listByExpr,
  listBct,
  getFilingPerson,
  addFilingPerson,
  editFilingPerson,
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
      title: "新增-人员基础信息",
      isCheck: false,
      isShow: true,
      selectTabs: true,
      selectTimeTabs: true,
      treeList: [],
      machineFilesList: [],
      machineImgList: [],
      nationalityList: [], //民族编号
      peopleList: [], //人员工种
      idList: [], //证件类型
      ctrList: [], //承包商列表
      cardImgList: [],
      baseForm: {
        status: 2,
        expireType: 0,
        sex: 0,
        expireEndTime: "",
      },
      dataType: [
        {
          value: 0,
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
    if (this.$route.query.id) {
      this.getDetails(this.$route.query.id);
      this.title = "修改-人员基础信息";
    }
  },

  methods: {
    //服务单位change
    selectTypeId(item, e) {
      this.idList.map((item1) => {
        if (item1.id == e) {
          item.isPermanent = item1.isPermanent;
        }
      });
    },
    // 增加人员信息
    addReserve() {
      this.cardForm.reserveList.push({
        certificateTypeId: "", //证件类型
        certificateNo: "", //证件编号
        expirationDate: [], // 证件有效期时间范围
        isPermanent: "", // 长期有效
        imgIdList: [], // 特种照片
      });
    },
    save(type) {
      this.$refs["baseForm"].validate((valid) => {
        if (valid) {
          if (this.machineImgList.length == 0) {
            this.$message.warning("头像不能为空");
            return;
          }
          this.$refs["cardForm"].validate((valid) => {
            if (valid) {
              console.log("1234");
              let certificateDtoList = [];
              let resData = {
                ...this.baseForm,
                picId: this.machineImgList[0].response.data.id,
              };
              if (this.$route.query.id) {
                resData.id = this.$route.query.id;
              }
              resData.expireEndTime = this.$toDateUtil.formatDateTime(
                this.baseForm.expireEndTime,
                "yyyy-MM-dd 23:59:59",
              );
              console.log(resData);
              if (resData.expireType == 1 || resData.expireType == 0) {
                delete resData.expireEndTime;
              }
              this.cardForm.reserveList.forEach((item) => {
                console.log(item);
                let obj = {};
                obj["certificateTypeId"] = item.certificateTypeId;
                obj["id"] = item.id;
                obj["certificateName"] = this.getCertificateName(
                  item.certificateTypeId,
                );
                obj["certificateNo"] = item.certificateNo;
                obj["issuanceDate"] =
                  item.isPermanent == 0 ? item.expirationDate[0] + ":00" : "";
                obj["expirationDate"] =
                  item.isPermanent == 0 ? item.expirationDate[1] + ":00" : "";
                obj["isPermanent"] = item.isPermanent;
                obj["fileIdList"] = this.setPeopleInfo(item.imgIdList);
                certificateDtoList.push(obj);
              });
              resData.certificateDtoList = certificateDtoList;
              console.log(certificateDtoList);
              console.log(resData);
              // return;
              let fn = addFilingPerson;
              if (this.$route.query.id) {
                fn = editFilingPerson;
              }
              fn(resData).then(() => {
                if (this.$route.query.id) {
                  this.$msgSuccess("修改成功");
                } else {
                  this.$msgSuccess("新增成功");
                }
                if (type == "continue") {
                  this.cardForm.reserveList = {
                    certificateTypeId: "", //证件类型
                    certificateNo: "", //证件编号
                    expirationDate: [], // 证件有效期时间范围
                    isPermanent: "", // 长期有效
                    imgIdList: [], // 特种照片
                  };
                } else {
                  this.$router.go(-1);
                }
                // this.$router.go(-1);
              });
            }
          });
        }
      });
    },
    setPeopleInfo(list) {
      console.log(list);
      let mediaFiles = [];
      list.map((item) => {
        console.log(item);
        mediaFiles.push(item.response.data.id);
      });

      return mediaFiles;
    },
    getCertificateName(certificateTypeId) {
      console.log(certificateTypeId);
      let certificateName = "";
      this.idList.map((item) => {
        if (item.id == certificateTypeId) {
          certificateName = item.name;
        }
      });
      return certificateName;
    },
    // 获取详情
    getDetails(id) {
      getFilingPerson(id).then(async (res) => {
        let that = this;
        console.log(res.data, "详情");
        this.baseForm = res.data;
        let res1 = await fileBatchDetail(this.baseForm.picId.split(","));
        this.machineImgList = this.$getImgArr(res1.data);
        console.log(res1);
        this.cardForm.reserveList = res.data.certificateDtoList;
        console.log(that.cardForm.reserveList);
        that.cardForm.reserveList.forEach(async (item) => {
          if (item.isPermanent == 0) {
            item.expirationDate = [item.issuanceDate, item.expirationDate];
          }
          let res2 = await fileBatchDetail(item.fileIdList);
          this.$set(item, "imgIdList", this.$getImgArr(res2.data));
        });
        console.log(this.cardForm.reserveList, "详情1234");
      });
    },
    // 承包商列表
    getListByExpr() {
      listByExpr().then((res) => {
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
    // 删除人员信息
    delReserve(idx) {
      if (this.cardForm.reserveList.length == 1) {
        this.$message.warning("最少要上传一条数据");
        return;
      }
      this.cardForm.reserveList.splice(idx, 1);
    },
    handleBack() {
      this.$router.go(-1);
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
        padding: 0px 8% 0px;
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
    bottom: 30px;
    left: 55%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
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
