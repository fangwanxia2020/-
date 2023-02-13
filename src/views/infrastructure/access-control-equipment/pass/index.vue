<template>
  <hqit-content-page type="list" style="height: calc(100vh - 145px)">
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
        <template slot="locationImg" slot-scope="{ rowData }">
          <img
            v-if="rowData.imgSrc"
            :src="rowData.imgSrc"
            class="img-src"
            @click="handleOpenPreview(rowData.imgSrc)"
          />
        </template>
        <template slot="status" slot-scope="{ rowData }">
          <el-switch
            v-model="rowData.status"
            :width="50"
            :active-value="1"
            :inactive-value="0"
            @change="handleChangeSt(rowData)"
          >
          </el-switch>
        </template>
        <template slot="chanDeviceVos" slot-scope="{ rowData }">
          <el-tag
            v-for="item in rowData.chanDeviceVos"
            :key="item.id"
            style="margin: 0 5px 5px 0"
          >
            <span v-if="rowData.chanDeviceVos && rowData.chanDeviceVos.length">
              {{ item.name }}
            </span>
          </el-tag>
        </template>
        <template slot="operator">
          <hqit-button
            size="mini"
            btn-type="add"
            btn-text="新增"
            @click="handleAdd"
          ></hqit-button>
        </template>
        <template slot="opts" slot-scope="{ rowData }">
          <el-button type="text" @click="handleCheck(rowData)">
            查看
          </el-button>
          <el-button type="text" @click="handleEdit(rowData)"> 修改 </el-button>
          <el-button type="text" @click="handleDel(rowData)"> 删除 </el-button>
        </template>
      </hqit-table>

      <FormDialog
        ref="model"
        :title="title"
        :width="800"
        :show-cancel-btn="(title || '').indexOf('查看—') == -1"
        :show-submit-btn="(title || '').indexOf('查看—') == -1"
        @submit="handleReset"
      >
        <template #default="scope">
          <Add v-bind="scope.data" />
        </template>
      </FormDialog>

      <ViewImage
        v-if="dialogVisible"
        style="width: 100%; height: 100%"
        :on-close="handleClosePreview"
        :url-list="[dialogImageUrl]"
      >
      </ViewImage>
    </template>
  </hqit-content-page>
</template>

<script>
import Add from "./add.vue";
import {
  passList,
  delPass,
  passDetail,
  editStatus,
} from "@/api/infrastructure/access-control-equipment.js";
import MapImg from "@/mixin/map-img.js";
export default {
  components: { Add },
  mixins: [MapImg],
  data() {
    return {
      title: null,
      passTypeList: [
        { code: 0, name: "人员门禁通道" },
        { code: 1, name: "车辆门禁通道" },
      ],
      columns: [
        {
          prop: "code",
          label: "通道编号",
          width: "150",
        },
        {
          prop: "name",
          label: "通道名称",
          width: "150",
        },
        {
          prop: "channelType",
          label: "闸机类型",
          width: "150",
          formatter: (val) => {
            return this.getNameByKey(this.passTypeList, val);
          },
          attrs: {
            filters: [
              { text: "人员门禁通道", value: 0 },
              { text: "车辆门禁通道", value: 1 },
            ],
            "filter-method": this.handleFilter,
          },
        },
        {
          prop: "status",
          label: "状态",
          width: "100",
          slotname: "status",
          attrs: {
            filters: [
              { text: "常关", value: 0 },
              { text: "常开", value: 1 },
            ],
            "filter-method": this.handleFilter,
          },
        },
        {
          label: "关联设备",
          slotname: "chanDeviceVos",
        },
        {
          label: "位置缩略图",
          width: "200",
          slotname: "locationImg",
          "show-overflow-tooltip": false,
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
          width: "150",
        },
      ],
      searchConfig: [
        {
          label: "通道编号",
          prop: "code",
          expression: "LIKE",
          attrs: {
            clearable: true,
            placeholder: "请输入",
          },
        },
        {
          label: "通道名称",
          prop: "name",
          expression: "LIKE",
          attrs: {
            clearable: true,
            placeholder: "请输入",
          },
        },
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
  methods: {
    async getList(params) {
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
      let res = await passList(resParams);
      this.handleFileData(res.data.list);
      return res;
    },
    // 新增
    handleAdd() {
      this.title = "门禁设备— 新增";
      this.$refs.model.openModel({
        data: {
          pageType: "add",
        },
      });
    },
    // 查看
    handleCheck(row) {
      this.title = "门禁设备— 查看— " + row.name;
      passDetail(row.id).then((res) => {
        this.$refs.model.openModel({
          data: {
            pageType: "check",
            data: { ...res.data },
          },
        });
      });
    },
    // 修改
    handleEdit(row) {
      this.title = "门禁设备— 修改— " + row.name;
      passDetail(row.id).then((res) => {
        this.$refs.model.openModel({
          data: {
            pageType: "edit",
            isUpdate: true,
            data: { ...res.data },
          },
        });
      });
    },
    // 删除
    async handleDel(row) {
      const valid = await this.errorBoundary(this.delPrompt(this, row.name));
      if (valid) {
        delPass([row.id]).then((res) => {
          if (res.code != 200) return this.$message.error(res.msg);
          this.$message.success(res.msg);
          this.handleReset();
        });
      } else {
        this.$message({ message: "删除取消" });
      }
    },
    // 修改状态
    handleChangeSt(row) {
      let params = {
        id: row.id,
        status: row.status,
      };
      editStatus(params).then(() => {
        this.$message({
          type: "success",
          message: "状态修改成功",
        });
        this.handleSearch();
      });
    },
    // 筛选
    handleFilter(value, row, column) {
      const property = column["property"];
      return row[property] === value;
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

<style lang="scss" scoped>
::v-deep .el-switch__core::before {
  content: "常关";
  position: absolute;
  font-size: 12px;
  top: -1px;
  right: 5px;
  color: #fff;
}

.is-checked ::v-deep .el-switch__core::before {
  content: "常开";
  position: absolute;
  font-size: 12px;
  top: -1px;
  left: 5px;
  color: #fff;
}
.text {
  color: #fff;
}
.img-src {
  width: 100%;
  height: 50px;
  cursor: pointer;
  margin-top: 8px;
}
</style>
