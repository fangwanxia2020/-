<template>
  <div class="people-dialog-view">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <div class="tree-box">
          <el-tree
            ref="tree"
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="18" :xs="24">
        <ty-business-crud
          :id="'itemUserId'"
          ref="peopleCrud"
          size="mini"
          class="high-search-crud"
          main-key="ty-list"
          search-mode="detault"
          :page-info="{ limit: 10 }"
          :get-list-interface="getListInterface"
          :columns="columns"
          :show-search-fields="['personNum', 'nickName']"
          :show-index="true"
          :show-operation="[]"
          :show-select="true"
          title=""
          @checkedChange="checkedChangeFun"
          @select="selectChangeFun"
        >
        </ty-business-crud>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="2" :xs="24">
        <div style="text-align: right; line-height: 30px">已选人员</div>
      </el-col>
      <el-col :span="22" :xs="24">
        <el-tag
          v-for="tag in checkList"
          :key="tag.itemUserId"
          closable
          @close="closeTagFun(tag)"
        >
          {{ tag.nickName ? tag.nickName : tag.xm }}
        </el-tag>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getWorksiteItemOrg } from "@/api/project/projectOrg";
export default {
  name: "people-dialog-view",
  props: {
    data: {
      //选择的人员
      type: Array,
    },
    //多选模式
    multiple: {
      type: Boolean,
      default: false,
    },
    //是否显示组织或者承包商
    carType: {
      type: Number,
      // default: false
    },
  },
  data() {
    return {
      //记录当选选中的行
      selectionRow: null,
      //人员类型数据字典数据
      personTypeOptions: [],
      sys_user_sex: [],
      //选择的人员
      checkList: this.data,
      // 部门树选项
      deptOptions: undefined,
      defaultProps: {
        children: "children",
        label: "label",
      },
      getListInterface: {
        url: "/worksite/itemUser/list",
        methodType: "get",
        params: {
          itemOrgType: this.carType,
          status: 0,
        },
        resFormatFun: this.getListResFormatFun,
      },
      columns: [
        {
          label: "用户编号",
          prop: "personNum",
        },
        {
          label: "姓名",
          prop: "nickName",
        },
        {
          label: "性别",
          prop: "sex",
          formatter: (val) => {
            return this.sys_user_sexFormat(val) || "-";
          },
        },
        {
          label: "是否开通账号",
          prop: "userId",
          formatter: (val) => {
            return val == null ? "未开通" : "已开通";
          },
        },
        {
          label: "证件号码",
          prop: "papersNum",
        },
        {
          label: "人员类型",
          prop: "workTypeStrList",
          // formatter: (val, row) => {
          //   return this.sjzdFormat(row.personType);
          // },
        },
      ],
    };
  },
  computed: {},
  watch: {
    data(val) {},
  },
  created() {
    // console.log(this.carType);
    // console.log(this.multiple);

    this.getDictsSex("hse_personType").then((response) => {
      this.personTypeOptions = response.data;
    });
    this.getDictsSex("sys_user_sex").then(
      (res) => (this.sys_user_sex = res.data),
    );
    this.getTreeselect();
    setTimeout(() => {
      this.$refs.peopleCrud.setCheckList(this.data);
    }, 1);
  },
  mounted() {
    // this.$nextTick(() => {
    //   console.log(this.$refs.peopleCrud);
    //   //this.$refs.peopleCrud.resetFields();//去除验证
    // });
  },
  methods: {
    getCheckList() {
      return this.checkList;
    },
    //点击复选框事件
    selectChangeFun({ row }) {
      this.selectionRow = row;
    },
    //字典翻译
    sjzdFormat(value) {
      return this.selectDictLabel(this.personTypeOptions, value);
    },
    sys_user_sexFormat(value) {
      return this.selectDictLabel(this.sys_user_sex, value);
    },
    //复选框切换
    checkedChangeFun(selection) {
      if (!this.multiple && selection.length > 1) {
        const selectionRow =
          this.selectionRow || selection[selection.length - 1];
        this.$refs.peopleCrud.setCheckList([selectionRow]);
        this.checkList = [selectionRow];
      } else {
        this.checkList = selection;
      }
      console.log(this.checkList);
    },
    //格式化列表返回值
    getListResFormatFun(res) {
      return {
        list: res.data.records,
        total: res.data.total,
      };
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      getWorksiteItemOrg().then((response) => {
        const data = response.data;
        let dataList = [];
        if (data && data[0]) {
          if (this.carType == 1) {
            data.map((item) => {
              if (item.labelType == 1) {
                dataList.push(item);
              }
            });
          } else if (this.carType == 2) {
            data.map((item) => {
              if (item.labelType == 2) {
                dataList.push(item);
              }
            });
          } else {
            dataList = response.data;
          }
        }
        // console.log(dataList);

        // this.deptTree.data = dataList;
        // console.log(response.data);
        this.deptOptions = dataList;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.getListInterface.params.itemOrgId = data.id;
      this.$refs.peopleCrud._getListData();
    },
    //删掉tag
    closeTagFun(tag) {
      this.$refs.peopleCrud.setCheckList(
        this.checkList.filter((item) => item.itemUserId != tag.itemUserId),
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.people-dialog-view {
  .tree-box {
    width: 100%;
    overflow: auto;
    height: 330px;

    ::v-deep .el-tree-node > .el-tree-node__children {
      overflow: initial;
    }
  }

  .el-tag {
    margin: 0 10px 10px 0;
  }
}
::v-deep {
  .el-icon-circle-close {
    display: none;
  }
}
</style>
