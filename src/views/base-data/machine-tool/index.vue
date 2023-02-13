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
        :row-class-name="rowClassNameFn"
        @search="handleSearch"
        @reset="resetForm"
        @filter-change="tableFilterChange"
      >
        <template slot="receivePersonId">
          <el-autocomplete
            v-model="searchPersonId"
            style="width: 100%"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入"
            clearable
            @select="handlePersonSelect"
          ></el-autocomplete>
        </template>
        <template slot="operator">
          <hqit-button
            size="mini"
            btn-type="add"
            btn-text="新增"
            @click="handleAdd"
          ></hqit-button>
        </template>
        <template slot="sealedOrgName" slot-scope="{ rowData }">
          <span
            style="color: #358aff; cursor: pointer"
            @click="handleCheckOrg(rowData)"
          >
            {{ rowData.sealedOrgName }}
          </span>
        </template>
        <template slot="dutyUserName" slot-scope="{ rowData }">
          <span
            style="color: #358aff; cursor: pointer"
            @click="handleCheckPerson(rowData)"
          >
            {{ rowData.dutyUserName }}
          </span>
        </template>
        <template slot="machineStatus" slot-scope="{ rowData }">
          <el-switch
            v-model="rowData.machineStatus"
            :width="50"
            :active-value="1"
            :inactive-value="2"
            @change="switchMachineStatus(rowData)"
          >
          </el-switch>
        </template>
        <template slot="opts" slot-scope="{ rowData }">
          <el-button type="text" @click="handleCheck(rowData)">
            查看
          </el-button>
          <el-button type="text" @click="handleEdit(rowData)"> 修改 </el-button>
          <el-button type="text" @click="handleDel(rowData)"> 删除 </el-button>
          <el-button type="text" @click="handleLightCode(rowData)">
            放行码
          </el-button>
        </template>
      </hqit-table>
      <FormDialog
        ref="model"
        :title="title"
        :show-submit-btn="false"
        :show-cancel-btn="false"
      >
        <template #default="scope">
          <ShowCode v-bind="scope.data" />
        </template>
      </FormDialog>
      <el-dialog
        v-if="personDetails"
        v-dialogDrag
        width="450px"
        :title="personDetailsTitle"
        :visible.sync="personDetails"
      >
        <personDetails :person-id="personId" :is-org="true" :is-base="true" />
      </el-dialog>
      <el-dialog v-if="orgDetails" :title="orgTitle" :visible.sync="orgDetails">
        <ordDetails :org-id="orgId" />
      </el-dialog>
    </template>
  </hqit-content-page>
</template>

<script>
import personDetails from "@/components/FormBody/person-details/index.vue";
import ordDetails from "@/components/FormBody/org-details/index.vue";
import ShowCode from "@/components/FormBody/base-data/show-code/index.vue";
import {
  getMachinesManager,
  delMachineStatus,
  updateMachineStatus,
} from "@/api/base-data/equipment-reservation.js";
import { getPersonList } from "@/api/access-control-permission/organization-control.js";
export default {
  components: { ShowCode, personDetails, ordDetails },
  data() {
    return {
      personDetails: false,
      orgDetails: false,
      orgId: "",
      searchPersonId: "",
      orgTitle: "",
      personId: "",
      personDetailsTitle: "",
      title: "",
      machinesKindList: [],
      machinesTypeList: [],
      columns: [
        {
          prop: "sealedOrgName",
          label: "单位",
          slotname: "sealedOrgName",
        },
        {
          prop: "dutyUserName",
          label: "负责人",
          slotname: "dutyUserName",
        },
        {
          prop: "machineName",
          label: "机具名称",
        },
        {
          prop: "machineType",
          label: "机具类型",
          formatter: (val) => {
            return this.getNameByKey(this.machinesTypeList, val, "code");
            // return val;
          },
        },
        {
          prop: "machineKindId",
          label: "机具种类",
          formatter: (val) => {
            return this.getNameByKey(this.machinesKindList, val, "code");
          },
        },
        {
          prop: "machineStatus",
          label: "机具状态",
          slotname: "machineStatus",
          attrs: {
            filters: [
              { text: "启用", value: 1 },
              { text: "禁用", value: 2 },
            ],
            columnKey: "machineStatus",
          },
        },

        {
          prop: "updateTime",
          label: "更新时间",
          sortable: true,
          formatter: (val) => {
            return this.awaySecond(val);
          },
        },
        {
          prop: "opts",
          label: "操作",
          align: "right",
          slotname: "opts",
          width: 200,
        },
      ],
      searchConfig: [
        {
          prop: "sealedOrgId",
          label: "单位", // 单位下拉框直接用（类型使用tree）
          expression: "IN",
          type: "hqit-tree-select",
          attrs: {
            selectAttrs: { placeholder: "请选择单位" },
          },
        },
        {
          label: "机具种类",
          prop: "machineKindId",
          expression: "EQ",
          type: "select",
          options: [],
          attrs: {
            placeholder: "请选择机具种类",
          },
        },
        {
          label: "机具名称",
          prop: "machineName",
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "机具类型",
          prop: "machineType",
          expression: "EQ",
          type: "select",
          options: [],
          attrs: {
            placeholder: "请选择机具类型",
          },
        },
        {
          label: "负责人",
          prop: "receivePersonId",
          slotName: "receivePersonId",
        },
        {
          label: "更新时间",
          prop: "updateTime",
          type: "daterange",
        },
      ],
      queryForm: {},
    };
  },
  computed: {},
  watch: {
    searchPersonId(val) {
      if (val == "") {
        this.queryForm["dutyUserId"] = "";
      }
    },
  },
  mounted() {
    this.getMachinesKindList();
    this.getMachinesTypeList();
  },
  methods: {
    // 获取列表数据
    getList(params) {
      let resParams = {
        order: "createTime",
        sort: "DESC",
        pageNum: params.page,
        pageSize: params.size,
        query: [
          {
            expression: "EQ",
            key: "buzType",
            value: "1",
          },
        ],
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
      // dutyUserName 负责人查询
      if (this.queryForm["dutyUserId"]) {
        resParams.query.push({
          expression: "EQ",
          key: "dutyUserId",
          value: this.queryForm["dutyUserId"],
        });
      }
      // 机具状态筛选
      if (this.queryForm["machineStatus"]) {
        resParams.query.push({
          expression: "EQ",
          key: "machineStatus",
          value: this.queryForm["machineStatus"][0],
        });
      }
      // 更新时间
      if (this.queryForm.updateTime && this.queryForm.updateTime.length) {
        resParams.query.push({
          key: "updateTime",
          expression: "GE",
          value: this.queryForm.updateTime[0] + " 00:00:00",
        });
        resParams.query.push({
          key: "updateTime",
          expression: "LE",
          value: this.queryForm.updateTime[1] + " 23:59:59",
        });
      }
      return getMachinesManager(resParams);
    },
    // 获取机具种类列表
    getMachinesKindList() {
      this.$getTypeCode("gatedpark_machine_kind").then((res) => {
        this.machinesKindList = res.data;
        this.searchConfig.find((v) => v.prop == "machineKindId").options =
          res.data.map((item) => {
            return { label: item.name, value: item.code };
          });
      });
    },
    //  获取机具类型列表
    getMachinesTypeList() {
      this.$getTypeCode("gatedpark_machine_type").then((res) => {
        this.machinesTypeList = res.data;
        this.searchConfig.find((v) => v.prop == "machineType").options =
          res.data.map((item) => {
            return { label: item.name, value: item.code };
          });
      });
    },
    // 重置
    handleReset() {
      this.$refs.table.reset();
    },
    // 新增
    handleAdd() {
      this.$router.push({
        path: "/gatedpark/base-data/machine-tool/add",
      });
    },
    // 编辑
    handleEdit(data) {
      this.$router.push({
        path: "/gatedpark/base-data/machine-tool/edit",
        query: { id: data.id },
      });
    },
    // 登记码
    handleLoginCode() {
      this.$refs.model.openModel();
      this.title = "机具登记二维码";
    },
    // 放行码
    handleLightCode() {
      this.$refs.model.openModel({
        data: {
          theNum: "MT12146846887733",
        },
      });
      this.title = "机具放行二维码";
    },
    // 查看详情
    handleCheck(data) {
      this.$router.push({
        path: "/gatedpark/base-data/machine-tool/edit",
        query: { id: data.id, isCheck: true },
      });
    },
    // 删除
    async handleDel(row) {
      const valid = await this.errorBoundary(
        this.delPrompt(this, row.machineName),
      );
      if (valid) {
        delMachineStatus([row.id]).then((res) => {
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
    // 修改机具状态
    switchMachineStatus(row) {
      updateMachineStatus({
        id: row.id,
        machineStatus: row.machineStatus,
      })
        .then(() => {
          this.$msgSuccess("修改成功");
        })
        .catch(() => {
          row.machineStatus == "1"
            ? (row.machineStatus = 2)
            : (row.machineStatus = 1);
        });
    },
    // 接待人搜索查询
    querySearchAsync(queryString, cb) {
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
              value: `${person.name}`,
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
    handlePersonSelect(item) {
      this.queryForm["dutyUserId"] = item.personBaseId;
    },
    // 查询
    handleSearch(params) {
      this.queryForm = {
        ...this.queryForm,
        ...params,
      };
      this.$refs.table.getData({}, true);
    },
    // 查看人员详情信息
    handleCheckPerson(row) {
      this.personId = row.dutyUserId;
      this.personDetailsTitle = `负责人— 查看— ${row.dutyUserName}`;
      this.personDetails = true;
    },
    // 查看单位详情信息
    handleCheckOrg(row) {
      this.orgId = row.sealedOrgId;
      this.orgTitle = `拜访单位— 查看— ${row.sealedOrgName}`;
      this.orgDetails = true;
    },
    //重置搜索
    resetForm() {
      this.searchPersonId = "";
      this.queryForm = {};
      this.$refs.table.$refs.table.clearSort();
      this.$refs.table.getData({}, true);
    },
    // 表格条件筛选
    tableFilterChange(val) {
      this.queryForm = {
        ...this.queryForm,
        ...val,
      };
      this.$refs.table.getData({}, true);
    },
    // 机具过期列背景色发生改变
    rowClassNameFn(row) {
      if (row.row.expireType == 3) {
        let date = new Date(row.row.expireEndTime);
        let nerDate = Math.round(new Date());
        if (nerDate < date) {
          return "table-column-red";
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .table-column-red {
  background-color: rgb(255, 236, 232);
}
::v-deep .el-switch__core::before {
  content: "禁用";
  position: absolute;
  font-size: 12px;
  top: -1px;
  right: 5px;
  color: #fff;
}

.is-checked ::v-deep .el-switch__core::before {
  content: "启用";
  position: absolute;
  font-size: 12px;
  top: -1px;
  left: 5px;
  color: #fff;
}
</style>
