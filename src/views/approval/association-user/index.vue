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
        :show-select="false"
        :use-expr="false"
        :show-index="false"
        @search="handleSearch"
        @reset="resetForm"
      >
        <template slot="operator">
          <hqit-button
            size="mini"
            btn-text="返回"
            @click="linkTo"
          ></hqit-button>
          <hqit-button
            size="mini"
            btn-type="add"
            btn-text="新增"
            @click="dialogVisible = true"
          ></hqit-button>
        </template>
        <template slot="opts" slot-scope="{ rowData }">
          <el-button type="text" @click="BatchDelete(rowData)">
            删除
          </el-button>
        </template>
      </hqit-table>
      <el-dialog
        v-if="dialogVisible"
        v-dialogDrag
        title="选择人员"
        :visible.sync="dialogVisible"
        width="1200px"
      >
        <PersonSel :is-select="true" :checkboxlist.sync="PersonDataList" />
        <span slot="footer" class="dialog-footer">
          <el-button class="cancelButton" @click="dialogVisible = false">
            取消
          </el-button>
          <el-button class="confirmButton" type="primary" @click="addUser">
            确定
          </el-button>
        </span>
      </el-dialog>
    </template>
  </hqit-content-page>
</template>

<script>
import {
  getAssociationUserList,
  addAssociationUser,
  deleteAssociationUser,
} from "@/api/approval/role-setting.js";
import PersonSel from "@/components/FormBody/person-sel/index.vue";
export default {
  components: { PersonSel },
  data() {
    return {
      dialogVisible: false,
      PersonDataList: [],
      queryForm: {},
      columns: [
        {
          prop: "username",
          label: "工号",
        },
        {
          prop: "personName",
          label: "姓名",
        },
        {
          prop: "gender",
          label: "性别",
          formatter: (val) => {
            return this.changeSex(val);
          },
        },
        {
          prop: "personOrgName",
          label: "单位",
        },
        {
          prop: "phone",
          label: "手机号码",
        },

        {
          prop: "createTime",
          label: "创建时间",
          formatter: (val) => {
            return this.awaySecond(val);
          },
        },
        {
          prop: "createName",
          label: "创建人",
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
          label: "姓名",
          prop: "personName",
          attrs: {
            clearable: true,
          },
        },
        {
          prop: "sealedOrgId",
          label: "单位", // 单位下拉框直接用（类型使用tree）
          expression: "IN",
          type: "hqit-tree-select",
        },
        {
          label: "手机号",
          prop: "phone",
          attrs: {
            clearable: true,
          },
        },
        {
          label: "创建时间",
          type: "daterange",
          prop: "createTime",
        },
      ],
    };
  },
  computed: {
    changeSex() {
      return (sex) => {
        let newSex;
        switch (sex) {
          case 0:
            newSex = "男";
            break;
          case 1:
            newSex = "女";
            break;

          default:
            newSex = "未知";
            break;
        }
        return newSex;
      };
    },
  },
  mounted() {},
  methods: {
    async getList(params) {
      let data = {
        pageNum: params.page,
        pageSize: params.size,
        workflowRoleId: this.$route.query.workflowRoleId,
      };
      this.searchConfig.forEach((configItem) => {
        if (
          this.queryForm[configItem.prop] &&
          this.queryForm[configItem.prop] != ""
        ) {
          data[configItem.prop] = this.queryForm[configItem.prop];
        }
      });
      if (this.queryForm.createTime && this.queryForm.createTime.length) {
        data["beginTime"] = this.queryForm.createTime[0];
        data["endTime"] = this.queryForm.createTime[1];
      }
      let res = await getAssociationUserList(data);
      this.$refs.table.page.total = res.data.total;
      return Promise.resolve({
        data: res.data.records,
      });
    },
    // 新增关联用户
    addUser() {
      let data = [];
      this.PersonDataList.forEach((item) => {
        data.push({
          workflowRoleId: parseInt(this.$route.query.workflowRoleId),
          domainId: parseInt(this.$route.query.domainId),
          lockFlag: item.isLock ? 1 : 0,
          phone: item.phone,
          gender: this.getGender(item.genderName),
          personName: item.name, // 人员姓名
          personId: item.personBaseId, // 人员id（personBaseId）
          personOrgId: item.orgId, // 单位id
          personOrgName: item.orgName, // 单位名字
        });
      });
      // return;
      addAssociationUser(data).then(() => {
        this.dialogVisible = false;
        this.$msgSuccess("新增成功");
        this.$refs.table.getData({}, true);
      });
    },
    // 批量删除
    async BatchDelete(row) {
      const valid = await this.errorBoundary(
        this.delPrompt(this, row.personName),
      );
      if (valid) {
        deleteAssociationUser([row.workflowRoleRelId]).then((res) => {
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
    getGender(str) {
      let sex;
      switch (str) {
        case "男":
          sex = 0;
          break;
        case "女":
          sex = 1;
          break;

        default:
          sex = 2;
          break;
      }
      return sex;
    },
    linkTo() {
      this.$router.go(-1);
    },
    // 查询
    handleSearch(params) {
      this.queryForm = {
        ...params,
      };
      this.$refs.table.getData({}, true);
    },
    resetForm() {
      this.queryForm = {};
      this.$refs.table.getData({}, true);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  .container-title {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e9e9e9;
    padding-bottom: 20px;
    margin-bottom: 30px;
  }
}
</style>
