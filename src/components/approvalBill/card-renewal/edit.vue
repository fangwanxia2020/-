<template>
  <div class="content-box">
    <div class="content-title">
      <span class="title-bg"></span>
      <span class="title-text">基础信息</span>
    </div>
    <el-form ref="baseForm" :model="baseForm" class="content-form">
      <el-row>
        <el-col :span="8">
          <el-form-item label="申领人: " prop="applyPersonId">
            <div class="cl-charge">
              <el-tag type="success" style="margin-right: 10px">
                {{ radioPersonData.name }}
              </el-tag>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item v-if="baseForm.orgType == 1" label="单位: ">
            {{ radioPersonData.orgName ? radioPersonData.orgName : "" }}
          </el-form-item>
          <el-form-item v-if="baseForm.orgType == 2" label="承包商: ">
            {{ radioPersonData.orgName ? radioPersonData.orgName : "" }}
          </el-form-item>
        </el-col>
        <el-col v-if="baseForm.orgType == 1" :span="8">
          <el-form-item label="部门: ">
            {{ radioPersonData.deptName ? radioPersonData.deptName : "" }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item
            label="有效期: "
            :prop="isDetailsShow ? 'num' : 'validTime'"
          >
            <div class="edit-tabs">
              <span
                v-if="isDetailsShow"
                :class="customize ? 'Customize-tabs' : 'unCustomize-tabs'"
                @click="customize = true"
              >
                延长
              </span>
              <span
                v-if="isDetailsShowInt"
                :class="customize ? 'unCustomize-tabs' : 'Customize-tabs'"
                @click="customize = false"
              >
                自定义
              </span>
            </div>
            <span v-if="isDetailsShow"> {{ baseForm.num }}天 </span>
            <span v-if="isDetailsShowInt">
              {{ baseForm.validTime && awaySecond(baseForm.validTime) }}
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="续期事由: " prop="applyReason" class="visit">
            <span>
              {{ baseForm.applyReason }}
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16"> </el-col>
        <el-col :span="8">
          <el-form-item label="续期数量: " prop="applyNum">
            <span>{{ baseForm.applyNum }}</span>
            <span class="input-unit">张</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-tabs v-model="renewalType">
      <el-tab-pane
        v-if="renewalType == 'first'"
        label="按申请批次"
        name="first"
      ></el-tab-pane>
      <el-tab-pane
        v-if="renewalType == 'second'"
        label="按个人"
        name="second"
      ></el-tab-pane>
      <el-tab-pane
        v-if="renewalType == 'third'"
        label="按车辆"
        name="third"
      ></el-tab-pane>
    </el-tabs>
    <template v-if="renewalType == 'first'">
      <CtTable
        ref="FirstTable"
        :request="getFirstList"
        row-key="id"
        :has-search="false"
        :is-select="false"
        :has-btn="false"
        :show-search-btn="false"
        :radio-obj.sync="radioObj"
        :page-sizes="[5, 10, 15, 20]"
        :default-page-size="5"
      >
        <template #table-columns>
          <template>
            <!-- <el-table-column
              label="部门"
              prop="applyDeptName"
              show-overflow-tooltip
            >
            </el-table-column> -->
            <el-table-column
              label="申请批次"
              prop="code"
              show-overflow-tooltip
              width="180"
            >
            </el-table-column>
            <el-table-column
              label="申请人"
              prop="applyPersonName"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              label="申请时间"
              prop="createTime"
              sortable
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="有效期" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip placement="top">
                  <div slot="content">
                    {{ scope.row.validBeginTime }} 至{{
                      scope.row.validEndTime
                    }}
                  </div>
                  <span>
                    {{
                      scope.row.validBeginTime &&
                      scope.row.validBeginTime.split(" ")[0]
                    }}
                  </span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              label="数量（张）"
              prop="applyNum"
              sortable
              show-overflow-tooltip
            >
            </el-table-column>
          </template>
        </template>
      </CtTable>
    </template>
    <template v-if="renewalType == 'second'">
      <!-- <div class="cl-charge" style="margin-bottom: 10px">
        <el-button
          v-if="!isCheck"
          type="primary"
          @click="handleShowPerson"
        >
          选择人员
        </el-button>
      </div> -->
      <el-table :data="PersonDataList" style="width: 100%">
        <el-table-column label="工号" prop="code"> </el-table-column>
        <el-table-column label="姓名" prop="name"> </el-table-column>
        <el-table-column label="性别" prop="genderName" show-overflow-tooltip>
          <template slot-scope="scope">
            {{
              scope.row.sysPersonBaseDto &&
              scope.row.sysPersonBaseDto.genderName
            }}
          </template>
        </el-table-column>
        <el-table-column label="身份证号" prop="idNo" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="手机号" prop="phone" show-overflow-tooltip>
        </el-table-column>
        <!-- <el-table-column label="操作"
align="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              v-if="!isCheck"
              type="text"
              @click="handlePersonDel(scope.$index)"
            >
              删除
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <el-pagination
        class="pagination"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="PersonDataList.length"
      >
      </el-pagination>
    </template>
    <template v-if="renewalType == 'third'">
      <!-- <div class="cl-charge" style="margin-bottom: 10px">
        <el-button
          v-if="!isCheck"
          type="primary"
          @click="handleShowCar"
        >
          选择车辆
        </el-button>
      </div> -->
      <el-table :data="radioCarList" style="width: 100%">
        <el-table-column
          label="车辆号"
          prop="vehicleCode"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          v-if="baseForm.orgType == 1"
          label="车辆种类"
          prop="vehicleType"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{
              scope.row.baseVehicleDto && scope.row.baseVehicleDto.vehicleType
            }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="baseForm.orgType == 2"
          label="车辆种类"
          prop="vehicleTypeName"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="卡号"
          prop="cardNo"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="联系人" prop="personName" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="手机号"
          prop="personPhone"
          show-overflow-tooltip
        >
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="PersonDataList.length"
      >
      </el-pagination>
    </template>
    <div class="content-title">
      <span class="title-bg"></span>
      <span class="title-text">附件信息</span>
    </div>
    <div class="content-file">
      <div class="file-tip">
        <span>附件材料：</span>
        <span class="tip">
          支持格式:pdf、jpg、png、doc、rar、zip等文件,单个文件不能超过10MB
        </span>
      </div>

      <CtTable
        ref="fileTable"
        :request="getFileTableList"
        row-key="id"
        :has-search="false"
        :is-select="false"
        :has-btn="false"
        :show-search-btn="false"
        :has-page="false"
      >
        <template #table-columns>
          <el-table-column
            label="上传文件名称"
            show-overflow-tooltip
            prop="name"
          ></el-table-column>
          <el-table-column
            label="上传人"
            width="150"
            show-overflow-tooltip
            prop="createName"
          ></el-table-column>
          <el-table-column
            label="上传时间"
            width="180"
            prop="createTime"
          ></el-table-column>
          <el-table-column
            label="操作"
            align="right"
            width="100"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="handleDownload(scope.row)">
                下载
              </el-button>
              <el-button type="text" @click="handlePreviewFile(scope.row)">
                预览
              </el-button>
            </template>
          </el-table-column>
        </template>
      </CtTable>
    </div>
  </div>
</template>

<script>
import { getCardRenew } from "@/api/location-card-management/index.js";
import { fileFlow } from "@/api/system/file.js";
export default {
  props: {
    businessId: {
      type: [String, Number],
      default: "",
    },
  },
  data() {
    return {
      isDetailsShow: true,
      isDetailsShowInt: true,
      personDialogTable: false,
      carDialogTable: false,
      customize: true,
      renewalType: "first",
      machineFilesList: [], // 文件信息
      batchList: [], // 批次信息（用于回显）
      PersonDataList: [], // 人员信息
      radioCarList: [], // 车辆信息
      radioPersonData: {}, // 申领人
      radioObj: {}, // 按审批批次
      baseForm: {},
    };
  },
  watch: {
    renewalType(val) {
      switch (val) {
        case "first":
          this.baseForm.applyNum = this.radioObj.applyNum;
          break;
        case "second":
          this.baseForm.applyNum = this.PersonDataList.length;
          break;
        case "third":
          this.baseForm.applyNum = this.radioCarList.length;
          break;
        default:
          break;
      }
    },
    // PersonDataList(val) {
    //   this.baseForm.applyNum = val.length;
    // },
    // radioCarList(val) {
    //   this.baseForm.applyNum = val.length;
    // },
    machineFilesList() {
      this.$refs.fileTable.reload();
    },
  },
  mounted() {
    this.getDetails(this.businessId);
  },

  methods: {
    getFirstList() {
      return Promise.resolve({
        list: this.batchList,
      });
    },
    getFileTableList() {
      return Promise.resolve({
        list: this.machineFilesList,
      });
    },
    // 详情
    getDetails(id) {
      getCardRenew(id).then((res) => {
        console.log(res);
        this.radioPersonData = {
          name: res.data.applyPersonName,
          orgName: res.data.applyOrgName,
          deptName: res.data.applyDeptName,
          orgId: res.data.applyOrgId,
          deptId: res.data.applyDeptId,
          personBaseId: res.data.applyPersonId,
          ...res.data,
        };
        this.baseForm = {
          applyNum: res.data.applyNum,
          applyReason: res.data.applyReason,
          orgType: res.data.orgType,
          validTime: res.data.validEndTime,
        };
        if (res.data.extendTime) {
          this.baseForm.num = res.data.extendTime;
          this.isDetailsShowInt = false;
        } else {
          this.isDetailsShow = false;
        }
        if (res.data.cardApplyDetailVos.length) {
          res.data.cardApplyDetailVos.forEach((item) => {
            if (item.applyObjectType == "1") {
              console.log("车辆");
              if (res.data.orgType == 2) {
                this.radioCarList.push(item.ctrVehicleDto);
              } else {
                this.radioCarList.push(item.baseVehicleDto);
              }
              // this.radioCarList.push(item.baseVehicleDto);
              this.renewalType = "third";
            } else {
              this.renewalType = "second";
              item.personBaseDto["code"] = item.personCode;
              item.personBaseDto["bindId"] = item.personId;
              this.PersonDataList.push(item.personBaseDto);
              // this.PersonDataList[idx].code = item.personCode;
            }
          });
        } else {
          this.batchList.push(res.data.cardApplyDtos);
        }
        if (res.data.fileDtos.length) {
          this.machineFilesList = res.data.fileDtos;
        }
      });
    },
    // 文件下载
    async handleDownload(row) {
      let res = await fileFlow({ id: row.id }); // 获取文件流
      let csvData = new Blob([res.data], { type: res.data.type });
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // IE
        window.navigator.msSaveOrOpenBlob(csvData, row.name);
      } else {
        let url = window.URL.createObjectURL(csvData);
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = row.name;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    },
    // 文件预览
    handlePreviewFile(row) {
      this.previewFile(this.getFileUrl(row.id) + "&fullfilename=" + row.name);
    },
  },
};
</script>
<style lang="scss" scoped>
.content-box {
  padding: 0px 8% 0px;
  .edit-tabs {
    display: inline-block;
    margin-right: 10px;
    span {
      padding: 10px;
    }
    :nth-child(1) {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    :nth-child(2) {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
    .Customize-tabs {
      background: #0089ff;
      color: white;
    }
    .unCustomize-tabs {
      background: #e7eaef;
    }
  }
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
  .input-unit {
    margin-left: 10px;
    display: inline-block;
    height: 40px;
    width: 25px;
    line-height: 40px;
    color: #999999;
  }
  .pagination {
    margin-top: 5px;
    text-align: center;
  }
  .visit {
    display: flex;
    /deep/ .el-form-item__content {
      width: 55%;
    }
  }
}
</style>
