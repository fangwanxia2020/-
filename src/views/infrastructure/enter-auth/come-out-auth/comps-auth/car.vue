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
        <template slot="resourceName" slot-scope="{ rowData }">
          <span class="cl-jump" @click="handleOpenMsg(tabsActive, rowData)">
            {{ rowData.resourceName }}
          </span>
        </template>
        <template slot="areaNums" slot-scope="{ rowData }">
          <span
            class="cl-jump"
            @click="
              handleJump(
                '/gatedpark/infrastructure/enter-auth/come-out-auth/auth-area',
                rowData,
              )
            "
          >
            {{ rowData.areaNums }}
          </span>
        </template>
        <template slot="getewayNums" slot-scope="{ rowData }">
          <span
            class="cl-jump"
            @click="
              handleJump(
                '/gatedpark/infrastructure/enter-auth/come-out-auth/auth-bayonet',
                rowData,
              )
            "
          >
            {{ rowData.getewayNums }}
          </span>
        </template>
        <template slot="deviceNums" slot-scope="{ rowData }">
          <span class="cl-jump" @click="handleOpenAuth(1, rowData)">
            {{ rowData.deviceNums }}
          </span>
        </template>
        <template slot="totalNums" slot-scope="{ rowData }">
          <span class="cl-jump" @click="handleOpenAuth(2, rowData)">
            {{ rowData.totalNums }}
          </span>
        </template>
        <template slot="permissionStatus" slot-scope="{ rowData }">
          <span v-if="rowData.permissionStatus == 0">
            <i class="cl-circle" style="background-color: #cccccc"></i> 未授权
          </span>
          <span
            v-if="rowData.permissionStatus == 1"
            @click="handleOpenAuth(3, rowData)"
          >
            <i class="el-icon-refresh" style="color: #026dff"></i>
            授权中(
            {{ rowData.successTotalNums }}
            /
            {{ rowData.totalNums }}
            )
          </span>
          <span
            v-if="rowData.permissionStatus == 2"
            @click="handleOpenAuth(3, rowData)"
          >
            <i class="cl-circle" style="background-color: #1fbe6c"></i>
            全部授权(
            {{ rowData.successTotalNums }}
            /
            {{ rowData.totalNums }}
            )
          </span>
          <span v-if="rowData.permissionStatus == 3">
            <i class="cl-circle" style="background-color: #fb9c14"></i>
            部分授权(
            {{ rowData.successTotalNums }}
            /
            {{ rowData.totalNums }}
            )
          </span>
          <span
            v-if="rowData.permissionStatus == 4"
            @click="handleOpenAuth(3, rowData)"
          >
            <i class="cl-circle" style="background-color: #f26f6d"></i>
            授权失败(
            {{ rowData.successTotalNums }}
            /
            {{ rowData.totalNums }}
            )
          </span>
        </template>
        <template slot="operator">
          <hqit-button
            size="mini"
            btn-text="下发权限"
            @click="handleDown"
          ></hqit-button>
        </template>
        <template slot="opts" slot-scope="{ rowData }">
          <el-button type="text" @click="handleAuth(rowData)"> 授权 </el-button>
          <el-button type="text" @click="handleBackout(rowData)">
            撤销
          </el-button>
        </template>
      </hqit-table>

      <!-- 单位信息、人员信息、车牌信息对话框 -->
      <FormDialog
        ref="msgModel"
        :title="msgTitle"
        :show-cancel-btn="false"
        :show-submit-btn="false"
        :width="800"
        @submit="handleReset"
      >
        <template #default="scope">
          <DialogMessage v-bind="scope.data" />
        </template>
      </FormDialog>

      <!-- 单独授权、合计授权、授权设备对话框 -->
      <FormDialog
        ref="authModel"
        :title="authTitle"
        :show-cancel-btn="false"
        :show-submit-btn="false"
        :width="800"
        @submit="handleReset"
      >
        <template #default="scope">
          <DialogDevice v-bind="scope.data" />
        </template>
      </FormDialog>

      <!-- 授权对话框 -->
      <FormDialog
        ref="allotModel"
        title="分配权限"
        :width="800"
        @submit="handleReset"
      >
        <template #default="scope">
          <AllotAuth v-bind="scope.data" />
        </template>
      </FormDialog>
    </template>
  </hqit-content-page>
</template>

<script>
import optMixin from "./optMixin.js";
export default {
  mixins: [optMixin],
  data() {
    return {
      columns: [],
      searchConfig: [],
    };
  },
  mounted() {
    this.columns = [
      {
        prop: "resourceName",
        label: "车牌号",
        width: "200",
        slotname: "resourceName",
      },
      ...this.columnsBase,
    ];
    this.searchConfig = [
      {
        label: "车牌号",
        prop: "name",
        expression: "LIKE",
        attrs: {
          clearable: true,
          placeholder: "请输入",
        },
      },
      ...this.searchConfigBase,
    ];
  },
};
</script>
