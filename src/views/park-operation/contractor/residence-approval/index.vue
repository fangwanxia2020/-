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
        @reset="resetForm"
        @filter-change="tableFilterChange"
      >
        <template slot="orgName" slot-scope="{ rowData }">
          <el-tag
            v-for="tag in rowData.orgExVoList.filter((org) => org.orgName)"
            :key="tag.orgIs"
          >
            {{ tag.orgName }}&nbsp;&nbsp;
          </el-tag>
        </template>
        <template slot="opts" slot-scope="{ rowData }">
          <template v-if="!gettabsId">
            <el-button type="text" @click="handleDetails(rowData)">
              查看
            </el-button>
            <el-button
              v-if="
                rowData.status == 3 ||
                rowData.status == 4 ||
                rowData.status == 2
              "
              type="text"
              @click="approvalRecord(rowData)"
            >
              审批记录
            </el-button>
          </template>
          <template v-else>
            <el-button
              v-if="getlistType == 1"
              type="text"
              @click="handleToOperate(rowData, 1)"
            >
              去审批
            </el-button>
            <el-button
              v-if="getlistType == 2"
              type="text"
              @click="handleToOperate(rowData, 2)"
            >
              查看结果
            </el-button>
            <el-button
              v-if="getlistType == 3"
              type="text"
              @click="handleToOperate(rowData, 3)"
            >
              查看详情
            </el-button>
          </template>
        </template>
      </hqit-table>
    </template>
  </hqit-content-page>
</template>

<script>
import { getCtrFilingList } from "@/api/contractor";
import { getTemplateId } from "@/api/approval/approval-manege.js";
import needTodoMixin from "@/views/my-application/needTodo/needTodoMixin.js";
export default {
  name: "registration",
  mixins: [needTodoMixin],
  data() {
    return {
      queryForm: {},
      columns: [
        {
          prop: "name",
          label: "承包商名称",
          width: "150",
        },
        {
          prop: "contacts",
          label: "联系人",
        },
        {
          prop: "phone",
          label: "手机号码",
        },
        {
          prop: "orgName",
          label: "服务单位",
          slotname: "orgName",
        },
        {
          prop: "fillingReason",
          label: "入驻理由",
        },
        {
          prop: "status",
          label: "审批状态",
          formatter: (val) => {
            return this.changeStatus(val);
          },
          attrs: {
            filters: [
              { text: "待审批", value: 1 },
              { text: "审批中", value: 2 },
              { text: "审批通过", value: 3 },
              { text: "审批不通过", value: 4 },
            ],
            columnKey: "status",
          },
        },
        {
          prop: "applyName",
          label: "申请人",
        },
        {
          prop: "createTime",
          label: "申请时间",
          sortable: true,
          width: 160,
          formatter: (val) => {
            return this.awaySecond(val);
          },
        },
        {
          prop: "opts",
          label: "操作",
          align: "right",
          slotname: "opts",
          width: 180,
        },
      ],
      searchConfig: [
        {
          prop: "name",
          label: "承包商名称", // 单位下拉框直接用（类型使用tree）
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "联系人",
          prop: "contacts",
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "手机号码",
          prop: "phone",
          expression: "LIKE",
          attrs: {
            clearable: true,
          },
        },
        {
          prop: "orgIdList",
          label: "服务单位", // 单位下拉框直接用（类型使用tree）
          expression: "IN",
          type: "hqit-tree-select",
          attrs: {
            selectAttrs: { placeholder: "请选择单位" },
          },
        },
        {
          label: "申请人",
          prop: "applyName",
        },
        {
          label: "申请时间",
          prop: "createTime",
          type: "daterange",
        },
      ],
    };
  },
  computed: {
    //申请状态
    changeStatus() {
      let name;
      return (num) => {
        switch (num) {
          case 1:
            name = "待审批";
            break;
          case 2:
            name = "审批中";
            break;
          case 3:
            name = "审批通过";
            break;
          case 4:
            name = "审批不通过";
            break;
          case 5:
            name = "驳回";
            break;

          default:
            name = "";
            break;
        }
        return name;
      };
    },
  },
  methods: {
    //防爆卡列表
    async getList(params) {
      let ids = [];
      let resObj = {};
      if (this.gettabsId) {
        resObj = await this.handleIds(params);
        ids = resObj.externalBizId;
        if (!ids.length) {
          return Promise.resolve({
            list: [],
            total: 0,
          });
        }
      }
      let resParams = {
        pageNum: params.page,
        pageSize: params.size,
        query: {
          statusList: [2, 3, 4],
        },
      };
      this.searchConfig.forEach((configItem) => {
        if (
          this.queryForm[configItem.prop] &&
          this.queryForm[configItem.prop] != ""
        ) {
          resParams.query[configItem.prop] = this.queryForm[configItem.prop];
        }
      });
      if (this.queryForm.status && this.queryForm.status.length) {
        resParams.query.statusList = this.queryForm.status;
      }
      if (this.queryForm.createTime && this.queryForm.createTime.length) {
        resParams.query.createTimeStart =
          this.queryForm.createTime[0] + " 00:00:00";
        resParams.query.createTimeEnd =
          this.queryForm.createTime[1] + " 23:59:59";
        delete resParams.query.createTime;
      }
      if (this.gettabsId && ids.length) {
        resParams.query.ids = ids;
      }
      let res = await getCtrFilingList(resParams);
      this.$refs.table.page.total = res.data.pagination.total;
      if (this.gettabsId && ids.length && res.data.list.length) {
        res.data.list.forEach((litem) => {
          resObj.infoVo.forEach((iitem) => {
            if (litem.id == iitem.externalBizId) {
              this.$set(litem, "instanceId", iitem.instanceId);
            }
          });
        });
      }
      return Promise.resolve({
        data: res.data && res.data.list.length ? res.data.list : [],
      });
    },
    //查看
    handleDetails(row) {
      this.$router.push({
        path: "/gatedpark/park-operation/contractor/registration/check",
        query: { id: row.id },
      });
    },
    // 审批记录
    approvalRecord(row) {
      getTemplateId({ domainId: 7, externalBizId: row.id }).then((res) => {
        this.$router.push({
          path: "/gatedpark/approval/hasDo",
          query: {
            instanceId: res.data,
            domainId: 7,
            isTaskId: true,
            detail: true,
          },
        });
      });
    },
    // 查询
    handleSearch(params) {
      this.queryForm = {
        ...this.queryForm,
        ...params,
      };
      this.$refs.table.getData({}, true);
    },
    //重置搜索
    resetForm() {
      this.queryForm = {};
      this.$refs.table.$refs.table.clearSort();
      this.$refs.table.$refs.table.clearFilter();
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
  },
};
</script>
<style lang="scss" scoped>
::v-deep {
  .el-autocomplete {
    width: 100%;
  }
  .el-cascader {
    width: 100%;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
}
</style>
