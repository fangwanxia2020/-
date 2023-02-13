<template>
  <div class="edit-content">
    <div class="edit-content-top">
      <back-bar :title="title" />
      <div class="content">
        <div class="content-box">
          <el-tabs v-model="tabsActive">
            <el-tab-pane label="文本消息" name="1">
              <el-form
                ref="baseForm"
                :model="baseForm"
                :rules="baseRules"
                class="content-form"
                label-width="100px"
              >
                <el-row>
                  <el-col :span="16">
                    <el-form-item label="发布主题: " prop="name">
                      <el-input
                        v-model="baseForm.name"
                        type="text"
                        show-word-limit
                        maxlength="100"
                        placeholder="请输入发布主题"
                        clearable
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="发布到: " prop="sex">
                      <div style="margin-top: 30px">
                        <span class="select-text">LED屏幕:</span>
                        <div class="select-btn" @click="showDetails(1)">
                          +选择LED
                        </div>
                      </div>
                      <div>
                        <span class="select-text">IP广播:</span>
                        <div class="select-btn" @click="showDetails(2)">
                          +选择广播
                        </div>
                      </div>
                      <div class="select-img">
                        <el-image
                          src="https://img0.baidu.com/it/u=1605875970,3800081763&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1669914000&t=2a27d596682e6340f133f06e95fca889"
                          class="img"
                        >
                        </el-image>
                      </div>
                    </el-form-item>
                    <el-form-item label="展示类型: " prop="phone">
                      <el-radio-group v-model="baseForm.phone">
                        <el-radio :label="1">滚动展示</el-radio>
                        <el-radio :label="2">固定展示</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="有效期: " prop="validTime">
                      <el-date-picker
                        v-model="baseForm.validTime"
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

                    <el-form-item label="消息内容: " prop="infoText">
                      <ty-editor
                        v-model="baseForm.infoText"
                        :height="300"
                      ></ty-editor>
                    </el-form-item>
                  </el-col>
                </el-row> </el-form></el-tab-pane>
            <el-tab-pane label="视频消息" name="2">
              <el-form
                ref="baseForm1"
                :model="baseForm"
                :rules="baseRules"
                class="content-form"
                label-width="100px"
              >
                <el-row>
                  <el-col :span="16">
                    <el-form-item label="发布主题: " prop="name1">
                      <el-input
                        v-model="baseForm.name1"
                        style="display: inline-block; width: 80%"
                        type="text"
                        show-word-limit
                        maxlength="100"
                        placeholder="请选择发布主题"
                        clearable
                      ></el-input>
                      <div class="select-btn" @click="showLedDetails">
                        +选择模板
                      </div>
                    </el-form-item>
                    <el-form-item label="发布到: " prop="sex">
                      <div style="margin-top: 30px">
                        <span class="select-text">LED屏幕:</span>
                        <div class="select-btn" @click="showDetails(1)">
                          +选择LED
                        </div>
                      </div>
                      <div class="select-img">
                        <el-image
                          src="https://img0.baidu.com/it/u=1605875970,3800081763&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1669914000&t=2a27d596682e6340f133f06e95fca889"
                          class="img"
                        >
                        </el-image>
                      </div>
                    </el-form-item>
                    <el-form-item label="展示类型: " prop="radioType">
                      <el-radio-group v-model="baseForm.radioType">
                        <el-radio :label="1">滚动展示</el-radio>
                        <el-radio :label="2">固定展示</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="有效期: " prop="validTime1">
                      <el-date-picker
                        v-model="baseForm.validTime1"
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

                    <el-form-item label="视频文件: " prop="phone">
                      <div class="file-tip">
                        <FileUpload :files-list.sync="machineFilesList" />
                        <span class="tip">
                          上传说明：最多上传10个，单个文件不能超过500MB
                        </span>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form></el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <div class="footer">
      <el-button v-if="!isCheck" type="primary" @click="save">提交</el-button>
      <el-button v-if="!isCheck" type="primary" @click="save">保存</el-button>
    </div>
    <el-dialog
      v-if="details"
      v-dialogDrag
      :title="showTitle"
      :visible.sync="details"
      width="1200px"
    >
      <!-- <div class="tab-pass page-wrapper"> -->
      <CtTable
        ref="table"
        row-key="id"
        class="ed-dialog"
        :label-width="90"
        :is-select="true"
        :has-high-search="false"
        :table-height="null"
        :request="getList"
      >
        <template #search="scope">
          <el-form-item label="编号: " prop="name">
            <el-input
              v-model="scope.params.name"
              placeholder="请输入编号"
              clearable
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
          <el-form-item label="设备名称: " prop="idCard">
            <el-input
              v-model="scope.params.idCard"
              placeholder="请输入设备名称"
              clearable
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
          <el-form-item label="设备型号: " prop="phone">
            <el-select
              v-model="scope.params.fillingId"
              placeholder="请选择模板分类"
              clearable
              filterable
              style="width: 100%"
            >
              <el-option
                v-for="item in contaList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="所属灯杆: " prop="phone">
            <el-select
              v-model="scope.params.fillingId"
              placeholder="请选择模板分类"
              clearable
              filterable
              style="width: 100%"
            >
              <el-option
                v-for="item in contaList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </template>
        <template #table-columns>
          <el-table-column label="编号" prop="name">
            <template slot-scope="scope">
              <span class="cl-jump">
                {{ scope.row.name }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="设备名称" prop="sex">
            <template slot-scope="scope">
              {{ scope.row.sex == 1 ? "A区喇叭1" : "B区喇叭1" }}
            </template>
          </el-table-column>
          <el-table-column label="设备型号" prop="idCard">
            <template slot-scope="scope">
              {{ scope.row.sex == 1 ? "SYBDTC" : "GBHUSBD" }}
            </template>
          </el-table-column>
          <el-table-column label="所属灯杆" prop="sex">
            <template slot-scope="scope">
              {{ scope.row.sex == 1 ? "应急广播灯杆01" : "应急广播灯杆02" }}
            </template>
          </el-table-column>
          <el-table-column
            label="地理位置"
            prop="fillingName"
          ></el-table-column>

          <el-table-column
            label="运行状态"
            :filters="[
              { text: '在线', value: 0 },
              { text: '离线', value: 1 },
            ]"
            :filter-method="handleFilter"
            prop="sex"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.sex == 0">
                <i
                  class="el-icon-success"
                  style="color: #19be6b; margin-right: 3px"
                ></i>在线
              </span>
              <span v-else>
                <i
                  class="el-icon-error"
                  style="color: #f56c6c; margin-right: 3px"
                ></i>离线</span>
            </template>
          </el-table-column>
        </template>
      </CtTable>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancelButton" @click="details = false">
          取消
        </el-button>
        <el-button
          class="confirmButton"
          type="primary"
          @click="details = false"
        >
          确定
        </el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="showLed"
      v-dialogDrag
      title="选择——LED模板"
      :visible.sync="showLed"
      width="1200px"
    >
      <div class="search-content" style="display: flex">
        <el-form
          ref="queryForm"
          :model="params"
          v-bind="formProps"
          class="search-form"
          style="display: flex; flex: 1; flex-wrap: wrap"
          :label-width="90 + 'px'"
        >
          <el-form-item label="模板名称: " prop="name">
            <el-input
              v-model="form.name"
              placeholder="请输入模板名称"
              clearable
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
          <el-form-item label="模板分类: " prop="fillingId">
            <el-select
              v-model="form.fillingId"
              placeholder="请选择模板分类"
              clearable
              filterable
              style="width: 100%"
            >
              <el-option
                v-for="item in contaList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="search-content-button sty-btn" style="margin-left: 20px">
          <el-button type="primary" @click="reload(1)">查询</el-button>
          <el-button
            plain
            class="search-content-button__reset"
            @click="reset()"
          >
            重置
          </el-button>
        </div>
      </div>
      <div class="box">
        <template>
          <div
            v-for="item in videoList"
            :key="item.videoManageTaskInfoId"
            class="box-item"
          >
            <div class="img-box">
              <img
                class="item-img"
                src="@/assets/images/login_img/push.jpg"
                alt=""
              />
              <div class="icon-box">
                <div class="size-icon">
                  <i size="50" class="el-icon-view" style="color: #fff"></i>
                  <div>预览</div>
                </div>
                <div class="size-icon">
                  <i size="50" class="el-icon-edit" style="color: #fff"></i>
                  <div>编辑</div>
                </div>
                <div class="size-icon">
                  <i
                    size="50"
                    class="el-icon-s-promotion"
                    style="color: #fff"
                  ></i>
                  <div>发布</div>
                </div>
                <div class="size-icon">
                  <i size="50" class="el-icon-delete" style="color: red"></i>
                  <div>删除</div>
                </div>
              </div>
              <img
                class="item-img-left"
                src="@/assets/images/approval/used.png"
              />
            </div>

            <div class="item-template">常用通知模板1</div>
            <div class="time-box">
              <div class="time-box-left">已关联终端数量: 2</div>
              <div class="time-box-right">1920*1080</div>
            </div>
          </div>
        </template>
      </div>
      <div class="pagination">
        <el-pagination
          style="text-align: center"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-count="pages"
          :current-page.sync="page"
          :total="total"
          :page-size="pagesize"
          :page-sizes="pageSizes"
          @current-change="setPage"
          @size-change="changesize"
        />
      </div>
      <!-- </el-dialog></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button class="cancelButton" @click="details = false">
          取消
        </el-button>
        <el-button
          class="confirmButton"
          type="primary"
          @click="details = false"
        >
          确定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { ctrList } from "@/api/contractor/contractor-management.js";
import FileUpload from "@/components/file-upload/file-upload.vue";
import { fileBatchDetail } from "@/api/system/file.js";
import {
  listByExpr,
  listBct,
  getFilingPerson,
  addFilingPerson,
  editFilingPerson,
} from "@/api/contractor/contractor-management.js";

export default {
  components: { FileUpload },
  data() {
    return {
      title: "发布申请— 新增",
      pageSizes: [10, 20, 30, 50],
      pages: 1,
      page: 1,
      total: 0,
      extra: {},
      imgUrl:
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F2018-06-27%2F5b3345789ca2c.jpg&refer=http%3A%2F%2Fpic1.win4000.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1672315300&t=e72c7c66a86a93540767ac098d665168",
      videoList: [],
      // videoList: [
      //   { name: "张三" },
      //   { name: "李四" },
      //   { name: "王五" },
      //   { name: "王五" },
      //   { name: "王五" },
      // ],
      formProps: {},
      params: {},
      form: {},
      showTitle: "",
      tabsActive: "1",
      content: "",
      radio: "1",
      isCheck: false,
      details: false,
      showLed: false,
      isShow: true,
      selectTabs: true,
      selectTimeTabs: true,
      treeList: [],
      machineFilesList: [],
      contaList: [],
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
        name: "",
        name1: "",
        expireEndTime: "",
        radioType: 1,
        phone: 1,
        validTime1: [],
        validTime: [],
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
        name: [
          { required: true, message: "发布主题不能为空", trigger: "blur" },
        ],
        name1: [
          { required: true, message: "发布主题不能为空", trigger: "blur" },
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        radioType: [
          { required: true, message: "请选择展示类型", trigger: "blur" },
        ],
        validTime: [
          {
            type: "array",
            required: true,
            message: "请选择日期",
          },
        ],
        validTime1: [
          {
            type: "array",
            required: true,
            message: "请选择日期",
          },
        ],
        phone: {
          required: true,
          message: "请选择展示类型",
          trigger: "blur",
        },
        infoText: [
          { required: true, message: "消息内容不能为空", trigger: "blur" },
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
      // this.getDetails(this.$route.query.id);
      this.title = "修改——发布申请——哈哈哈";
    }
  },

  methods: {
    showDetails(type) {
      if (type == 1) {
        this.showTitle = "选择——LED设备";
      } else {
        this.showTitle = "选择——IP广播";
      }
      this.details = true;
    },
    showLedDetails() {
      this.showLed = true;
    },
    // 筛选
    handleFilter(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    getList(params) {
      let resParams = {
        order: "createTime",
        sort: "DESC",
        pageNum: params.pageNum, // 页码
        pageSize: params.pageSize, // 显示数量
        query: {},
        expr: [],
      };
      params.name &&
        resParams.expr.push(this.handleExpression("LIKE", "name", params.name)); // 姓名
      params.idCard &&
        resParams.expr.push(
          this.handleExpression("LIKE", "idCard", params.idCard),
        ); // 身份证号
      params.phone &&
        resParams.expr.push(
          this.handleExpression("LIKE", "phone", params.phone),
        ); // 电话
      params.fillingId &&
        resParams.expr.push(
          this.handleExpression("LIKE", "fillingId", params.fillingId),
        ); // 承包商
      params.jobTypeId &&
        resParams.expr.push(
          this.handleExpression("LIKE", "jobTypeId", params.jobTypeId),
        ); // 人员工种
      // 更新时间
      params.updateTime &&
        resParams.expr.push(
          this.handleExpression("GE", "updateTime", params.updateTime[0]),
        );
      params.updateTime &&
        resParams.expr.push(
          this.handleExpression("LE", "updateTime", params.updateTime[1]),
        );
      return Promise.resolve({
        total: 0,
        list: [],
      });
      return ctrList(resParams).then((res) => {
        return {
          list: res.data.list,
          total: res.data.pagination.total,
        };
      });
    },
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
          this.$refs["baseForm1"].validate((valid1) => {
            if (valid1) {
              if (this.machineFilesList.length == 0) {
                this.$message.warning("视频文件不能为空");
                return;
              }
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
        padding: 0px 118px 0px;
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
::v-deep .switch .el-switch__core::before {
  content: "否";
  position: absolute;
  font-size: 12px;
  top: -1px;
  right: 5px;
  color: #fff;
}
::v-deep .el-tabs__header {
  border-bottom: 1px solid #ccc;
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
.select-text {
  display: inline-block;
  width: 80px;
  text-align: right;
}
.select-btn {
  display: inline-block;
  text-align: center;
  height: 35px;
  width: 100px;
  background: #0089ff;
  line-height: 35px;
  color: #fff;
  border-radius: 5px;
  margin-left: 10px;
  cursor: pointer;
}
.select-img {
  width: 370px;
  height: 210px;
  margin: 10px 0 0 90px;
  img {
    width: 100%;
    height: 100%;
  }
}
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
::v-deep .search-content-button {
  .el-button {
    width: 50px;
  }
}
::v-deep .sty-btn {
  .el-button {
    width: 70px;
  }
}
::v-deep .search-form {
  .el-form-item {
    flex: 0 0 50%;
  }
}

.box {
  padding: 20px 10px;
  display: flex;
  flex-flow: wrap;
  background: #fff;
  justify-content: flex-start;
}
.box-item {
  position: relative;
  width: calc(33% - 38px);
  height: 250px;
  text-align: center;
  background: #f5f5f5;
  margin-bottom: 40px;
  margin-right: 50px;
  // padding: 10px;
  border-radius: 15px;
  background: #fff;
  box-shadow: 5px 5px 5px #ccc;
  .img-box {
    position: relative;
    border-radius: 15px 15px 0 0;
    width: 100%;
    height: 170px;
    display: block;
  }
  .item-img-left {
    position: absolute;
    right: 0;
    top: 0;
    width: 80px;
    height: 80px;
  }
  .icon-box {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: #7a7a7a;
    display: flex;
    flex-flow: wrap;
    justify-content: center;
    align-items: center;
    display: none;
  }
  .size-icon {
    cursor: pointer;
    margin-left: 20px;
    font-size: 25px;
    i {
      padding: 6px;
      background: #aaaaaa;
      border-radius: 50%;
    }
    div {
      font-size: 14px;
      color: #fff;
      margin-top: 4px;
    }
  }
  .item-img {
    width: 100%;
    height: 100%;
    border-radius: 15px 15px 0 0;
  }
  .item-template {
    text-align: left;
    padding-left: 15px;
    padding-top: 15px;
    font-weight: bold;
  }
  .time-box {
    margin-top: 10px;
    padding: 0 15px;
    display: flex;
    font-size: 12px;
    align-items: center;
    justify-content: space-between;
    .time-box-left {
      color: #026dff;
    }
    .time-box-right {
      color: #999999;
    }
  }
  .check-item {
    position: absolute;
    top: 0;
    right: 0;
  }
}
// .box-item:hover .icon-box {
//   // display: block;
//   display: flex;
//   flex-flow: wrap;
//   justify-content: center;
//   align-items: center;
//   border-radius: 15px 15px 0 0;
//   opacity: 0.7;
// }
.box-item:nth-child(3n) {
  margin-right: 0px;
}
::v-deep .ed-dialog {
  .el-form-item__label {
    width: 90px;
  }
  .el-form-item__content {
    margin-left: 90px;
  }
}
</style>
