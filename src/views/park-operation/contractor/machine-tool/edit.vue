<template>
  <hqit-content-page :title="title">
    <template slot="content">
      <div class="cl-second">
        <div class="cl-second-content">
          <div class="content-item clearfix">
            <div class="cl-hea-title">机具信息单</div>
            <el-form
              ref="baseForm"
              :model="baseForm"
              :rules="baseRules"
              label-width="100px"
            >
              <el-row>
                <el-form-item label="机具编号: " :required="true">
                  <el-input
                    v-if="!isCheck"
                    v-model="baseForm.machineNo"
                    placeholder="请输入机具编号"
                    disabled
                    clearable
                  ></el-input>
                  <span v-else>{{ baseForm.machineNo }}</span>
                </el-form-item>
                <el-form-item label="承包商: " prop="sealedCtrId">
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
                <el-form-item label="机具名称: " prop="machineName">
                  <el-input
                    v-if="!isCheck"
                    v-model="baseForm.machineName"
                    placeholder="请输入机具名称"
                    clearable
                  ></el-input>
                  <span v-else>{{ baseForm.machineName }}</span>
                </el-form-item>
                <el-form-item label="机具类型: " prop="machineType">
                  <el-select
                    v-if="!isCheck"
                    v-model="baseForm.machineType"
                    placeholder="请选择机具类型"
                    clearable
                    filterable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in dictObj.gatedpark_machine_type"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    />
                  </el-select>
                  <span v-else>
                    {{
                      getNameByKey(
                        dictObj.gatedpark_machine_type,
                        baseForm.machineType,
                      )
                    }}
                  </span>
                </el-form-item>
                <el-form-item label="机具种类: " prop="machineKindId">
                  <el-select
                    v-if="!isCheck"
                    v-model="baseForm.machineKindId"
                    placeholder="请选择机具种类"
                    clearable
                    filterable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in machineKindList"
                      :key="item.code"
                      :label="item.name"
                      :value="+item.code"
                    />
                  </el-select>
                  <span v-else>
                    {{ getNameByKey(machineKindList, baseForm.machineKindId) }}
                  </span>
                </el-form-item>
                <el-form-item label="机具型号: " prop="machineModel">
                  <el-input
                    v-if="!isCheck"
                    v-model="baseForm.machineModel"
                    placeholder="请输入机具型号"
                    clearable
                  ></el-input>
                  <span v-else>{{ baseForm.machineModel }}</span>
                </el-form-item>
                <el-form-item label="负责人: " prop="dutyUserName">
                  <div class="cl-charge">
                    <el-autocomplete
                      v-if="!isCheck"
                      v-model="baseForm.dutyUserName"
                      :fetch-suggestions="querySearchAsync"
                      placeholder="请输入内容"
                      clearable
                      @select="handlePersonSelect"
                    ></el-autocomplete>
                    <span v-else>{{ baseForm.dutyUserName }}</span>
                  </div>
                </el-form-item>
                <el-form-item label="机具状态: " prop="machineStatus">
                  <el-radio-group
                    v-if="!isCheck"
                    v-model="baseForm.machineStatus"
                  >
                    <el-radio
                      v-for="item in dictObj.gatedpark_machine_status"
                      :key="item.code"
                      :label="+item.code"
                    >
                      {{ item.name }}
                    </el-radio>
                  </el-radio-group>
                  <span v-else>
                    {{
                      getNameByKey(
                        dictObj.gatedpark_machine_status,
                        baseForm.machineStatus,
                      )
                    }}
                  </span>
                </el-form-item>
                <el-form-item label="有效期类型: " prop="expireType">
                  <el-select
                    v-if="!isCheck"
                    v-model="baseForm.expireType"
                    placeholder="请选择有效期类型"
                    clearable
                    filterable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in dictObj.gatedpark_valid_type"
                      :key="item.code"
                      :label="item.name"
                      :value="+item.code"
                    />
                  </el-select>
                  <span v-else>
                    {{
                      getNameByKey(
                        dictObj.gatedpark_valid_type,
                        baseForm.expireType,
                      )
                    }}
                  </span>
                </el-form-item>
                <el-form-item
                  v-if="baseForm.expireType == 3"
                  label="时间范围: "
                  prop="expireTime"
                >
                  <el-date-picker
                    v-model="baseForm.expireTime"
                    type="datetimerange"
                    placeholder="请选择时间范围"
                    range-separator="-"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :disabled="isCheck"
                    style="width: 100%"
                    :default-time="['00:00:00', '23:59:59']"
                  />
                </el-form-item>
              </el-row>
              <el-row class="cl-width100 clearfix">
                <el-form-item label="机具照片: " prop="machinePhotoId">
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
              <el-row>
                <el-form-item label="证件有效期: " prop="validDate">
                  <el-date-picker
                    v-model="baseForm.validDate"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    format="yyyy-MM-dd HH:mm"
                    :disabled="isCheck"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    style="width: 100%"
                    :default-time="['00:00:00', '23:59:59']"
                  />
                </el-form-item>
              </el-row>
              <el-row class="cl-width100">
                <el-form-item label="三证照片: " prop="machineFileIds">
                  <template v-if="isCheck">
                    <span v-if="!threeImgList.length"> 暂无照片 </span>
                    <img
                      v-for="(item, idx) of threeImgList"
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
                    :imgs-list.sync="threeImgList"
                    :three-tips="true"
                    :is-check="isCheck"
                    :tip="true"
                  />
                </el-form-item>
              </el-row>
              <el-row class="cl-width100">
                <el-form-item label="机具文件: " prop="fileDtos">
                  <FileUpload
                    v-if="!isCheck"
                    :files-list.sync="machineFilesList"
                  />
                  <span style="color: #999999">
                    支持格式:pdf、word、excel、jpg、png,单个文件不能超过50MB
                  </span>
                  <CtTable
                    ref="table"
                    :table-height="null"
                    :request="getTableList"
                    row-key="id"
                    :has-search="false"
                    :has-batch-btn="false"
                    :show-search-btn="false"
                    :is-select="false"
                    :is-index="true"
                    :has-btn="false"
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
                        class-name="small-padding fixed-width"
                      >
                        <template slot-scope="scope">
                          <el-button
                            type="text"
                            @click="handleDownload(scope.row)"
                          >
                            下载
                          </el-button>
                          <el-button
                            v-if="!isCheck"
                            type="text"
                            @click="handleDel(scope.$index)"
                          >
                            删除
                          </el-button>
                          <el-button
                            v-if="isCheck"
                            type="text"
                            @click="handlePreView(scope.row)"
                          >
                            预览
                          </el-button>
                        </template>
                      </el-table-column>
                    </template>
                  </CtTable>
                </el-form-item>
              </el-row>
            </el-form>
          </div>
        </div>
        <div class="cl-second-footer">
          <el-button
            type="primary"
            @click="isCheck ? handleToEdit() : handleSave()"
          >
            {{ isCheck ? "编辑" : "保存" }}
          </el-button>
        </div>
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
import { getOrgList } from "@/api/access-control-permission/organization-control.js";
import ImgUpload from "@/components/img-upload/img-upload.vue";
import FileUpload from "@/components/file-upload/file-upload.vue";
import { getCtrAllList } from "@/api/contractor";
import {
  saveMachinesManager,
  getMachinesManagerDetails,
} from "@/api/base-data/equipment-reservation.js";
import { getCtrPersonList } from "@/api/contractor/contractor-car.js"; // 获取承包下面的人员
import { fileFlow } from "@/api/system/file.js";
import { getListByParentId } from "@/api/system/custom-code.js";
export default {
  components: { ImgUpload, FileUpload, ViewImage },
  // props: {
  //   isCheck: {
  //     type: Boolean,
  //     default: false,
  //   },
  // },
  data() {
    return {
      isCheck: false, // 是否查看
      title: "机具管理— 新增",
      dialogVisible: false,
      dialogImageUrl: "",
      baseForm: {
        machinesNo: "保存后自动生成", // 机具编号
        machineStatus: 1, // 机具状态
        machineType: null, // 机具种类
        machineKindId: null, // 机具类型
        expireType: null, // 有效期类型
        expireTime: null, // 有效期类型时间范围
        validDate: null, // 证件有效期
      },
      baseRules: {
        machineName: [
          { required: true, message: "请输入机具名称", trigger: "blur" },
        ],
        machineType: [
          { required: true, message: "请选择机具类型", trigger: "change" },
        ],
        machineKindId: [
          { required: true, message: "请选择机具种类", trigger: "change" },
        ],
        dutyUserName: [{ required: true, message: "请选择负责人" }],
        sealedCtrId: [
          { required: true, message: "请选择承包商", trigger: "change" },
        ],
        machineStatus: [
          { required: true, message: "请选择机具状态", trigger: "change" },
        ],
      },
      dictArr: [
        "gatedpark_machine_type", // 机具类型
        "gatedpark_machine_status", // 机具状态
        "gatedpark_valid_type", // 有效期类型
      ],
      dictObj: {
        gatedpark_machine_type: [],
        gatedpark_machine_status: [],
        gatedpark_valid_type: [],
      },
      treeList: [], // 树列表
      props: {
        expandTrigger: "hover",
        checkStrictly: true,
        label: "name",
        value: "id",
        children: "children",
      },
      machineImgList: [], // 机具照片
      threeImgList: [], // 三证照片
      machineFilesList: [], // 机具文件
      machineKindList: [], // 机具种类列表
      contractorList: [], // 承包商列表
      personList: [], // 承包商下的人员列表
    };
  },
  computed: {},
  watch: {
    machineFilesList() {
      this.$refs.table.reload(); // 不重载的话 上传成功的机具文件不会显示在table上
    },
    // // 机具类型
    // "baseForm.machineType": {
    //   handler(id) {
    //     if (!id) {
    //       this.machineKindList = [];
    //       this.baseForm.machineKindId = null;
    //       return;
    //     }
    //     this.getSecondCodeList(id);
    //   },
    //   immediate: true,
    // },
    // 有效期类型
    "baseForm.expireType": {
      handler(val) {
        if (val != 3) this.baseForm.expireTime = null;
      },
      immediate: true,
    },
  },
  created() {
    this.getOrgList();
    this.dictArr.forEach((item) => {
      this.$getTypeCode(item).then((res) => {
        this.$set(this.dictObj, item, res.data);
      });
    });
    this.$getTypeCode("gatedpark_machine_kind").then((res) => {
      this.machineKindList = res.data;
    });
    this.getCtrAllList();
    if (this.$route.query.id) this.getDetail();
    if (this.$route.query.isCheck) {
      this.title = "机具管理--查看";
      this.isCheck = true;
    }
  },
  methods: {
    // 获取树
    getOrgList() {
      getOrgList().then((res) => {
        this.treeList = res.data;
      });
    },
    // 机具文件上传成功后要回显到table中
    getTableList() {
      return Promise.resolve({
        list: this.machineFilesList,
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
    // // 根据一级字典id获取二级字典列表
    // getSecondCodeList(id) {
    //   getListByParentId(id, {}).then((res) => {
    //     this.machineKindList = res.data.list;
    //   });
    // },
    // 获取单条详情
    async getDetail() {
      let res1 = await getMachinesManagerDetails(this.$route.query.id);
      this.baseForm = res1.data;
      // 有效期类型时间范围
      this.$set(this.baseForm, "expireTime", []);
      if (res1.data.expireStartTime && res1.data.expireEndTime) {
        this.$set(this.baseForm, "expireTime", [
          res1.data.expireStartTime,
          res1.data.expireEndTime,
        ]);
      }
      // 证件有效期时间范围
      this.$set(this.baseForm, "validDate", []);
      if (res1.data.validStartTime && res1.data.validEndTime) {
        this.$set(this.baseForm, "validDate", [
          res1.data.validStartTime,
          res1.data.validEndTime,
        ]);
      }
      // 机具照片
      if (res1.data.machinePhotoId) {
        this.machineImgList = res1.data.machinePhotoId.split(",").map((id) => {
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
      // 三证照片
      if (res1.data.machineFileIds) {
        this.threeImgList = res1.data.machineFileIds.split(",").map((id) => {
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
      // 机具文件
      if (res1.data.fileDtos) this.machineFilesList = res1.data.fileDtos;
    },
    // 机具文件下载
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
    // 机具文件删除
    handleDel(index) {
      this.$confirm("确定删除该数据？", "警告", {
        confirmButtonText: "删除",
        confirmButtonClass: "el-button--danger",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.machineFilesList.splice(index, 1);
          this.$msgSuccess("删除成功");
        })
        .catch(() => {
          this.$message({
            message: "删除取消",
          });
        });
    },
    // 预览机具文件
    handlePreView(row) {
      this.previewFile(this.getFileUrl(row.id) + "&fullfilename=" + row.name);
    },
    // 承包商选择后要查询承包商下面的人员列表
    changeCtrId(id) {
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
      this.baseForm.dutyUserName = item.name;
      this.baseForm.dutyUserId = item.personBaseId;
    },
    // 保存
    handleSave() {
      this.$refs["baseForm"].validate((valid) => {
        if (valid) {
          let { validDate, expireTime } = this.baseForm;
          let params = {
            ...this.baseForm,
            buzType: 2,
            machinePhotoId: this.$getIdStr(this.machineImgList),
            machineFileIds: this.$getIdStr(this.threeImgList),
            fileDtos: this.getFileArr(this.machineFilesList), // 机具文件
            validStartTime: validDate && validDate[0], // 证件有效期
            validEndTime: validDate && validDate[1], // 证件有效期
            dutyUserId: this.baseForm.dutyUserId, // 负责人id
            dutyUserName: this.baseForm.dutyUserName, // 负责人名称
            expireStartTime: expireTime ? expireTime[0] : "", // 有效期 产品说不要秒 但是后端又说他没法做 所以前端这么做 是的
            expireEndTime: expireTime ? expireTime[1] : "", // 有效期
          };
          console.log(params, "params");
          delete params.validDate;
          delete params.expireTime;
          delete params.machinesNo;
          saveMachinesManager(
            this.$route.query.id
              ? Object.assign({ id: this.$route.query.id }, params)
              : params,
          ).then(() => {
            this.$msgSuccess(this.$route.query.id ? "编辑成功" : "新增成功");
            this.handleBack();
          });
        }
      });
    },
    // 处理机具文件为统一格式
    getFileArr(data) {
      return data.map((item) => {
        return {
          fileId: item.fileId ? item.fileId : item.id, // 新上传的文件id字段是：id 详情接口返回来的文件id字段是：fileId
          id: item.id,
          name: item.name,
          type: 2,
        };
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
    // 所属组织被选择时 保存下该组织名称
    handleChange() {
      this.$set(
        this.baseForm,
        "sealedOrgName",
        this.$refs["orgCascader"].getCheckedNodes()[0].label,
      );
    },
    // 编辑
    handleToEdit() {
      this.title = "机具管理--编辑";
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
        width: 49.5%;
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
.car-img {
  width: 100px;
  height: 100px;
  margin: 0 10px;
}
/deep/ .el-autocomplete {
  width: 100%;
}
</style>
