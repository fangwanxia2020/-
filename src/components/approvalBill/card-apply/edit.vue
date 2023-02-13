<template>
  <div>
    <div class="content">
      <div v-if="selectTabs" class="content-box">
        <div class="content-title">
          <span class="title-bg"></span>
          <span class="title-text">基础信息</span>
        </div>
        <el-form ref="baseForm" :model="baseForm" class="content-form">
          <el-row>
            <el-col :span="8">
              <el-form-item label="申领人: ">
                <div class="cl-charge">
                  <el-tag
                    v-if="radioPersonData.name"
                    type="success"
                    style="margin-right: 10px"
                  >
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
                {{
                  radioPersonData.applyOrgName
                    ? radioPersonData.applyOrgName
                    : ""
                }}
              </el-form-item>
            </el-col>
            <el-col v-if="baseForm.orgType == 1" :span="8">
              <el-form-item label="部门: ">
                {{ radioPersonData.deptName ? radioPersonData.deptName : "" }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="申领数量:">
                <span>{{ baseForm.applyNum }}</span>
                <span class="input-unit">张</span>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="有效期: ">
                {{ awaySecond(baseForm.validTime[0]) }} -
                {{ awaySecond(baseForm.validTime[1]) }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="访问事由: " prop="applyReason" class="visit">
                {{ baseForm.applyReason }}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="content-title">
          <span class="title-bg"></span>
          <span class="title-text">花名册</span>
        </div>
        <CtTable
          ref="personTable"
          :request="getList"
          row-key="id"
          :is-select="false"
          :show-search="false"
          :has-search="false"
          :show-search-btn="false"
          :has-batch-btn="false"
          :page-sizes="[5, 10, 15, 20]"
          :default-page-size="5"
        >
          <template #table-columns>
            <el-table-column label="工号" prop="code"> </el-table-column>
            <el-table-column label="姓名" prop="name"> </el-table-column>
            <el-table-column
              label="性别"
              prop="genderName"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column label="身份证号" prop="idNo" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="手机号" prop="phone" show-overflow-tooltip>
            </el-table-column>
          </template>
        </CtTable>
        <CtTable
          ref="carTable"
          :request="getCarList"
          row-key="id"
          :is-select="false"
          :show-search="false"
          :has-search="false"
          :show-search-btn="false"
          :has-batch-btn="false"
          :page-sizes="[5, 10, 15, 20]"
          :default-page-size="5"
        >
          <template #table-columns>
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
            </el-table-column>
            <el-table-column
              v-if="baseForm.orgType == 2"
              label="车辆种类"
              prop="vehicleTypeName"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              label="联系人"
              prop="personName"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              label="手机号"
              prop="personPhone"
              show-overflow-tooltip
            >
            </el-table-column>
          </template>
        </CtTable>
        <div class="content-title">
          <span class="title-bg"></span>
          <span class="title-text">附件信息</span>
        </div>
        <div class="content-file">
          <div class="file-tip">
            <span>附件材料：</span>
            <!-- <span class="tip">
            支持格式:pdf、jpg、png、doc、rar、zip等文件,单个文件不能超过10MB
          </span> -->
          </div>

          <CtTable
            ref="fileTable"
            :request="getTableList"
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
                class-name="small-padding"
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
    </div>
  </div>
</template>
<script>
import { getCardApply } from "@/api/location-card-management/index.js";
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
      selectTabs: true,
      baseForm: {},
      radioPersonData: {},
      PersonDataList: [], // 花名册
      radioCarList: [], // 车辆
      machineFilesList: [], // 附件信息
    };
  },
  mounted() {
    this.getDetails();
  },
  methods: {
    // 获取详情
    getDetails() {
      getCardApply(this.businessId).then((res) => {
        this.radioPersonData = {
          name: res.data.applyPersonName,
          orgName: res.data.applyOrgName,
          applyOrgName: res.data.applyOrgName,
          deptName: res.data.applyDeptName,
          deptId: res.data.applyDeptId,
        };
        this.baseForm = {
          applyNum: res.data.applyNum,
          applyReason: res.data.applyReason,
          orgType: res.data.orgType,
          validTime: [res.data.validBeginTime, res.data.validEndTime],
        };
        this.machineFilesList = res.data.fileDtos;
        res.data.cardApplyDetailVos.forEach((item) => {
          if (item.applyObjectType == "1") {
            if (res.data.orgType == 2) {
              this.radioCarList.push(item.ctrVehicleDto);
            } else {
              this.radioCarList.push(item.baseVehicleDto);
            }
          } else {
            item.personBaseDto["code"] = item.personCode;
            item.personBaseDto["personBaseId"] = item.personId;
            this.PersonDataList.push(item.personBaseDto);
            // this.PersonDataList[idx].code = item.personCode;
          }
        });
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
      console.log(row);
      this.previewFile(this.getFileUrl(row.id) + "&fullfilename=" + row.name);
    },
    getList() {
      return Promise.resolve({
        list: this.PersonDataList,
        total: this.PersonDataList.length,
      });
    },
    getCarList() {
      return Promise.resolve({
        list: this.radioCarList,
        total: this.radioCarList.length,
      });
    },
    getTableList() {
      return Promise.resolve({
        list: this.machineFilesList,
        total: this.machineFilesList.length,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.edit-tabs {
  margin: 20px 50px;
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
.content {
  overflow: hidden;
  height: calc(90vh - 250px);
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
</style>
