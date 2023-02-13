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
      >
        <template slot="operator">
          <hqit-button
            size="mini"
            btn-type="add"
            btn-text="新增"
            @click="handleAdd"
          ></hqit-button>
        </template>
        <template slot="opts" slot-scope="{ rowData }">
          <el-button type="text" @click="handleConnect(rowData)">
            测试连接
          </el-button>
          <el-button type="text" @click="handleEdit(rowData)"> 修改 </el-button>
          <el-button type="text" @click="handleDel(rowData)"> 删除 </el-button>
        </template>
      </hqit-table>

      <FormDialog ref="model" :title="title" :width="650" @submit="handleReset">
        <template #default="scope">
          <Add v-bind="scope.data" />
        </template>
      </FormDialog>
    </template>
  </hqit-content-page>
</template>

<script>
import Add from "./add.vue";
import {
  getPlatformList,
  delPlatform,
  platformDetail,
} from "@/api/infrastructure/device-platform.js";
export default {
  components: { Add },
  data() {
    return {
      title: null,
      protocolList: [
        { code: 1, name: "大华ICC" },
        { code: 2, name: "海康ISC" },
      ],
      columns: [
        {
          prop: "protocol",
          label: "协议名称",
          width: "150",
        },
        {
          prop: "protocolType",
          label: "协议类型",
          width: "150",
          formatter: (val) => {
            return this.getNameByKey(this.protocolList, val);
          },
        },
        {
          prop: "ipAddress",
          label: "IP地址",
          width: "150",
        },
        {
          prop: "port",
          label: "端口",
          width: "150",
        },
        {
          prop: "accessUsername",
          label: "访问用户名",
          width: "150",
        },
        {
          prop: "accessPassword",
          label: "访问密码",
          width: "150",
        },
        {
          prop: "url",
          label: "路径地址",
          width: "200",
        },
        {
          prop: "protocolExplain",
          label: "协议说明",
          width: "200",
        },
        {
          prop: "value",
          label: "更新者",
        },
        {
          prop: "updateTime",
          label: "更新时间",
          formatter: (val) => {
            return this.awaySecond(val);
          },
          width: "150",
          sortable: true,
        },
        {
          prop: "opts",
          label: "操作",
          align: "right",
          fixed: "right",
          slotname: "opts",
          width: "180",
        },
      ],
      searchConfig: [
        {
          label: "协议名称",
          prop: "protocol",
          expression: "LIKE",
          attrs: {
            clearable: true,
            placeholder: "请输入",
          },
        },
        {
          label: "协议类型",
          prop: "protocolType",
          expression: "EQ",
          type: "select",
          options: [],
          attrs: {
            clearable: true,
          },
        },
        {
          label: "IP地址",
          prop: "ipAddress",
          expression: "LIKE",
          attrs: {
            clearable: true,
            placeholder: "请输入",
          },
        },
        {
          label: "端口",
          prop: "port",
          expression: "LIKE",
          attrs: {
            clearable: true,
            placeholder: "请输入",
          },
        },
        // {
        //   label: "访问用户名",
        //   prop: "value5",
        //   expression: "LIKE",
        //   attrs: {
        //     clearable: true,
        //   },
        // },
        // {
        //   label: "访问密码",
        //   prop: "value6",
        //   expression: "LIKE",
        //   attrs: {
        //     clearable: true,
        //   },
        // },
        // {
        //   label: "更新者",
        //   prop: "value7",
        //   expression: "LIKE",
        //   attrs: {
        //     clearable: true,
        //   },
        // },
        {
          label: "更新时间",
          prop: "updateTime",
          type: "daterange",
          attrs: {
            "start-placeholder": "开始时间",
            "end-placeholder": "结束时间",
          },
        },
      ],
      queryForm: {},
    };
  },
  created() {
    this.searchConfig.find((v) => v.prop == "protocolType").options =
      this.protocolList.map((item) => {
        return { label: item.name, value: item.code };
      });
  },
  methods: {
    getList(params) {
      let resParams = {
        order: "updateTime",
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
      if (this.queryForm.updateTime) {
        // 更新时间 大于等于
        resParams.query.push({
          key: "updateTime",
          expression: "GE",
          value: this.queryForm.updateTime[0],
        });
        // 更新时间 小于等于
        resParams.query.push({
          key: "updateTime",
          expression: "LE",
          value: this.queryForm.updateTime[1],
        });
      }
      return getPlatformList(resParams);
    },
    // 测试连接
    handleConnect() {},
    // 新增
    handleAdd() {
      this.title = "设备平台管理— 新增";
      this.$refs.model.openModel();
    },
    // 修改
    handleEdit(row) {
      this.title = "设备平台管理— 修改— " + row.protocol;
      platformDetail(row.id).then((res) => {
        this.$refs.model.openModel({
          data: {
            data: { ...res.data },
            isUpdate: true,
          },
        });
      });
    },
    // 删除
    async handleDel(row) {
      const valid = await this.errorBoundary(
        this.delPrompt(this, row.protocol),
      );
      if (valid) {
        delPlatform([row.id]).then((res) => {
          if (res.code != 200) return this.$message.error(res.msg);
          this.$message.success(res.msg);
          this.handleReset();
        });
      } else {
        this.$message({ message: "删除取消" });
      }
    },
    // 搜索
    handleSearch(params) {
      this.queryForm = {
        ...params,
      };
      this.$refs.table.getData({}, true);
    },
    // 重置
    handleReset() {
      this.queryForm = {};
      this.$refs.table.$refs.table.clearFilter();
      this.$refs.table.getData({}, true);
    },
  },
};
</script>
