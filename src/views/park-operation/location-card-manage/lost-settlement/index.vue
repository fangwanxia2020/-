<template>
  <hqit-content-page type="list">
    <template slot="content">
      <hqit-table
        ref="table"
        border
        :data-source="getList"
        :columns="columns"
        :prop-show-pager="true"
        :search-config="searchConfig"
        :use-expr="false"
        :show-select="false"
        :show-index="false"
        @search="handleSearch"
        @reset="handleReset"
        @filter-change="tableFilterChange"
      >
        <template slot="receivePersonId">
          <el-autocomplete
            v-model="searchPersonId"
            style="width: 100%"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入"
            clearable
          ></el-autocomplete>
        </template>
        <template slot="operator">
          <hqit-button
            size="mini"
            btn-type="add"
            btn-text="Excel导出"
            @click="handleAdd"
          ></hqit-button>
        </template>
        <template slot="cardNo" slot-scope="{ rowData }">
          <span
            style="color: #358aff; cursor: pointer"
            @click="handleCheckCard(rowData)"
          >
            {{ rowData.cardNo }}
          </span>
        </template>
        <template slot="name" slot-scope="{ rowData }">
          <span
            style="color: #358aff; cursor: pointer"
            @click="handleCheckPerson(rowData)"
          >
            {{ rowData.name }}
          </span>
        </template>
        <template slot="sealedOrgName" slot-scope="{ rowData }">
          <span
            style="color: #358aff; cursor: pointer"
            @click="handleChecksealedCtr(rowData)"
          >
            {{ rowData.sealedOrgName }}
          </span>
        </template>
        <template slot="cardType" slot-scope="{ rowData }">
          <div v-if="rowData.cardType == 0" class="card-box">普通卡</div>
          <div v-else class="card-box color-yellow">防爆卡</div>
        </template>
        <template slot="status" slot-scope="{ rowData }">
          <span>{{ rowData.status == 0 ? "未处理" : "已处理" }}</span>
        </template>
        <template slot="opts" slot-scope="{ rowData }">
          <el-button type="text" @click="handleDel(rowData)"> 删除 </el-button>
          <el-button
            v-if="rowData.status == 0"
            type="text"
            @click="handleEdit(rowData)"
          >
            处理
          </el-button>
        </template>
      </hqit-table>
      <el-dialog
        v-if="personDetails"
        v-dialogDrag
        width="400px"
        :title="personDetailsTitle"
        :visible.sync="personDetails"
      >
        <PersonDetails :person-id="personId" :is-org="true" :is-base="true" />
      </el-dialog>
      <el-dialog
        v-if="corDetails"
        v-dialogDrag
        width="1000px"
        :title="cortractorDetailsTitle"
        :visible.sync="corDetails"
      >
        <ordDetails :org-id="orgId" />
      </el-dialog>
      <!-- 处理意见 -->
      <el-dialog
        v-if="handleShow"
        v-dialogDrag
        :title="title"
        :visible.sync="handleShow"
        width="400px"
      >
        <el-form :model="form" label-width="70px">
          <el-form-item label="处理意见">
            <el-input
              v-model="form.dealRemark"
              type="textarea"
              :rows="4"
              placeholder="请输入处理意见"
              :maxlength="140"
              show-word-limi
            >
            </el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" style="text-align: right">
          <el-button
            type="default"
            class="cancelButton"
            @click="handleShow = false"
          >
            取消
          </el-button>
          <el-button class="confirmButton" type="primary" @click="handleConf">
            确定
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        v-if="cardDetails"
        v-dialogDrag
        :title="title1"
        :visible.sync="cardDetails"
        width="50%"
      >
        <el-form
          ref="form"
          :model="form1"
          :rules="rules"
          class="message-dialog"
          label-width="130px"
          style="padding: 20px 30px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="定位卡型号: " prop="applyOrgId">
                <span class="cl-col">{{ form1.modelNo }}</span>
              </el-form-item>
              <el-form-item label="所属平台: " prop="applyOrgId">
                <span class="cl-col">{{ form1.locPlatName }}</span>
              </el-form-item>
              <el-form-item label="定位精度: " prop="applyOrgId">
                <span class="cl-col">{{ form1.locationAccuracy }}</span>
              </el-form-item>
              <el-form-item label="通讯方式: " prop="applyOrgId">
                <span class="cl-col">{{ form1.communicationMode }}</span>
              </el-form-item>
              <el-form-item label="电池容量: " prop="applyOrgId">
                <span class="cl-col">{{ form1.batteryCapacity }}mA</span>
              </el-form-item>
              <el-form-item label="尺寸大小: " prop="applyOrgId">
                <span class="cl-col">{{ form1.sizeDimension }}mm</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="定位卡种类: " prop="applyOrgId">
                <div v-if="form1.cardType == 0" class="card-box1 padding-0">
                  普通卡
                </div>
                <div v-else class="card-box1 color-yellow padding-0">
                  防爆卡
                </div>
              </el-form-item>
              <el-form-item label="定位频次号: " prop="applyOrgId">
                <span class="cl-col">{{ form1.locationFrequency }}</span>
              </el-form-item>
              <el-form-item label="定位方式: ">
                <span class="cl-col">{{ form1.locationMode }}</span>
              </el-form-item>
              <el-form-item label="充电方式: " prop="applyOrgId">
                <span class="cl-col">{{ form1.chargeMode }}</span>
              </el-form-item>
              <el-form-item label="是否支持NFC: " prop="applyOrgId">
                <span v-if="form1.isSupportNfc == 0" class="cl-col">否</span>
                <span v-else class="cl-col">是</span>
              </el-form-item>
              <el-form-item label="重量: " prop="applyOrgId">
                <span class="cl-col">{{ form1.weight }}克</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>
    </template>
  </hqit-content-page>
</template>

<script>
import PersonDetails from "@/components/FormBody/person-details/index.vue";
import ordDetails from "@/components/FormBody/org-details/index.vue";
import { getPersonList } from "@/api/access-control-permission/organization-control.js";
import {
  cardList,
  removeCardLoseReport,
  cardDeal,
  cardExportDeal,
  batchQueryLocCard,
} from "@/api/location-card-management";
export default {
  components: { PersonDetails, ordDetails },
  data() {
    return {
      accessShow: false,
      personDetails: false,
      corDetails: false, //承包商查看详情
      personList: false,
      personDetailsTitle: "",
      searchPersonId: "",
      cortractorDetailsTitle: "",
      orgId: "", //组织id
      personId: null, //查看负责人详情ID
      form1: {},
      cardDetails: false,
      form: {
        dealRemark: "",
      },
      handleShow: false,
      item: {},
      title: "",
      title1: "",
      rules: {
        applyOrgId: [
          { required: true, message: "请输入单位", trigger: "blur" },
        ],
      },
      columns: [
        {
          prop: "cardNo",
          label: "卡号",
          slotname: "cardNo",
        },
        {
          prop: "name",
          label: "姓名",
          slotname: "name",
        },
        {
          prop: "sealedOrgName",
          label: "单位",
          width: 150,
        },
        {
          prop: "cardType",
          label: "定位卡类型",
          slotname: "cardType",
          width: 120,
          attrs: {
            filters: [
              { text: "普通卡", value: 0 },
              { text: "防爆卡", value: 1 },
            ],
            columnKey: "cardType",
          },
        },
        {
          prop: "status",
          label: "状态",
          slotname: "status",
          width: 120,
          attrs: {
            filters: [
              { text: "未处理", value: 0 },
              { text: "已处理", value: 1 },
            ],
            columnKey: "status",
          },
        },
        {
          prop: "dealPersonName",
          label: "处理人",
        },
        {
          prop: "updateTime",
          label: "更新时间",
          width: 180,
          formatter: (val) => {
            return this.awaySecond(val);
          },
          sortable: true,
        },
        {
          prop: "opts",
          label: "操作",
          align: "right",
          fixed: "right",
          slotname: "opts",
          width: "150",
        },
      ],
      searchConfig: [
        {
          label: "卡号",
          prop: "cardNo",
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "姓名",
          prop: "name",
          expression: "LIKE",
          type: "hqit-pro-select",
          attrs: {
            clearable: true,
            selectAttrs: { placeholder: "请选择姓名" },
            idKey: "name",
            singleSelect: true,
          },
        },
        {
          prop: "sealedOrgId",
          label: "单位", // 单位下拉框直接用（类型使用tree）
          expression: "EQ",
          type: "hqit-tree-select",
          attrs: {
            checkStrictly: false,
            selectAttrs: { placeholder: "请选择单位" },
          },
        },
        {
          label: "处理人",
          prop: "dealPersonId",
          expression: "IN",
          type: "hqit-pro-select",
          attrs: {
            clearable: true,
            selectAttrs: { placeholder: "请选择处理人" },
            idKey: "personBaseId",
            singleSelect: true,
          },
        },
        {
          label: "更新时间",
          prop: "updateTime",
          type: "daterange",
        },
      ],
      queryForm: {},
      areaList: [],
      controlList: [], //设备列表
    };
  },
  watch: {},
  mounted() {},
  methods: {
    // 查看人员详情信息
    handleCheckPerson(row) {
      this.personId = row.reportPersonId;
      this.personDetailsTitle = `查看— ${row.name}`;
      this.personDetails = true;
    },
    // 查询承包商详情
    handleChecksealedCtr(row) {
      console.log(row);
      this.orgId = row.sealedOrgId;
      this.corDetails = true;
      this.cortractorDetailsTitle = "拜访单位— 查看—" + row.sealedOrgName;
    },
    // 获取列表数据
    getList(params) {
      console.log(params, "123456");
      console.log(this.searchConfig, "123456");
      console.log(this.queryForm, "12345");
      let resParams = {
        order: "createTime",
        sort: "DESC",
        pageNum: params.page, // 页码
        pageSize: params.size, // 显示数量
        query: [],
      };
      this.searchConfig.forEach((configItem) => {
        if (
          this.queryForm[configItem.prop] &&
          this.queryForm[configItem.prop] != "" &&
          configItem.expression
        ) {
          resParams.query.push({
            key: configItem.prop,
            value: this.queryForm[configItem.prop],
            expression: configItem.expression,
          });
        }
      });
      if (this.queryForm.cardType && this.queryForm.cardType.length) {
        resParams.query.push({
          key: "cardType",
          value: this.queryForm.cardType,
          expression: "IN",
        });
      }
      if (this.queryForm.status && this.queryForm.status.length) {
        resParams.query.push({
          key: "status",
          value: this.queryForm.status,
          expression: "IN",
        });
      }
      //单位
      // if (this.queryForm.sealedOrgId) {
      //   resParams.query.push({
      //     expression: "EQ",
      //     key: "sealedOrgId",
      //     value: this.queryForm.sealedOrgId,
      //   });
      // }
      if (this.queryForm.updateTime && this.queryForm.updateTime.length > 0) {
        // 更新时间 大于等于
        resParams.query.push({
          key: "accessTime",
          expression: "GE",
          value: this.queryForm.updateTime[0],
        });
        // 更新时间 小于等于
        resParams.query.push({
          key: "accessTime",
          expression: "LE",
          value: this.queryForm.updateTime[1] + " 23:59:59",
        });
      }
      return cardList(resParams);
    },
    // 导出
    handleAdd() {
      // return;
      console.log("hahaha");
      cardExportDeal([]).then((res) => {
        console.log(res);
        let fileName = "数据导出.xlsx";
        let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
        this.createDownLoadClick(blob, fileName);
      });
    },
    //创建a标签下载
    createDownLoadClick(content, fileName) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(link.href);
    },
    // 处理
    handleEdit(row) {
      console.log(row, "哈哈哈");
      this.form.dealRemark = "";
      this.item = row;
      this.title = `丢卡结算— 处理— ${row.name}`;
      this.handleShow = true;
    },
    // 弹窗确认
    handleConf() {
      if (this.form.dealRemark == "") {
        this.$message.warning("处理意见不能为空");
        return;
      }
      // 处理意见
      let params = {
        id: this.item.id,
        status: this.item.status,
        dealRemark: this.form.dealRemark,
      };
      cardDeal(params).then(() => {
        this.$message({
          type: "success",
          message: "保存成功",
        });
        this.handleSearch();
      });
      this.handleShow = false;
    },
    // 查看定位卡信息
    handleCheckCard(row) {
      let cardNos = [];
      this.title1 = `查看—${row.cardNo}— ${row.name}`;
      cardNos.push(row.cardNo);
      this.getBatchQueryLocCard(cardNos);
    },
    async getBatchQueryLocCard(cardNos) {
      const { data } = await batchQueryLocCard(cardNos);
      this.form1 = data[0];
      this.cardDetails = true;
    },

    async handleDel(row) {
      console.log(row, 123);
      const valid = await this.errorBoundary(this.delPrompt(this, row.cardNo));
      if (valid) {
        removeCardLoseReport([row.id]).then((res) => {
          if (res.code != 200) return this.$message.error(res.msg);
          this.$message.success(res.msg);
          this.$refs.table.getData({}, true);
        });
      } else {
        this.$message({
          message: "删除取消",
        });
      }
    },
    // 搜索
    handleSearch(params) {
      if (this.searchPersonId != "") {
        this.queryForm = {
          dealPersonId: this.searchPersonId.split("-")[1],
        };
      }
      console.log(params, "叫华哥湖广会馆");
      this.queryForm = {
        ...this.queryForm,
        ...params,
      };
      this.$refs.table.getData({}, true);
    },
    // 表格条件筛选
    tableFilterChange(val) {
      console.log(val, "叫华哥湖广会馆val1");
      this.queryForm = {
        ...this.queryForm,
        ...val,
      };
      this.$refs.table.getData({}, true);
    },
    // 重置
    handleReset() {
      this.searchPersonId = "";
      this.queryForm = {};
      this.$refs.table.$refs.table.clearFilter();
      this.$refs.table.getData({}, true);
    },
    // 接待人搜索查询
    querySearchAsync(queryString, cb) {
      console.log("12345");
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
          var results = res.data.list.map((person) => {
            return {
              value: `${person.name}-${person.personId}`,
              ...person,
            };
          });
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            cb(results);
          }, 3000 * Math.random());
        });
      }
    },
  },
};
</script>
<style scope lang="scss">
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
::v-deep .el-menu-item {
  height: 40px !important;
  line-height: 40px !important;
  padding-left: 0px !important;
}
.select-people {
  display: inline-block;
  text-align: center;
  width: 100px;
  background: #358aff;
  height: 33px;
  line-height: 33px;
  color: #fff;
  border-radius: 5px;
  margin-right: 10px;
  cursor: pointer;
}
.card-box {
  padding: 5px 10px;
  background: #47cb89;
  border-radius: 5px;
  width: 80px;
  text-align: center;
  color: #fff;
}
.card-box1 {
  background: #47cb89;
  margin-top: 5px;
  border-radius: 5px;
  width: 80px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: #fff;
}
.color-yellow {
  background: #ffad33;
}
</style>
