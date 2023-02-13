<template>
  <div class="permission-search-comps-auth" style="height: calc(100vh - 145px)">
    <div class="left-box">
      <el-select
        v-model="searchId"
        placeholder="请选择车牌号码"
        clearable
        filterable
        class="cl-search"
        style="width: 100%"
      >
        <el-option
          v-for="item in carList"
          :key="item.id"
          :label="item.vehicleCode"
          :value="item.id"
        ></el-option>
      </el-select>
      <div class="all-list" @scroll="handleScroll">
        <div v-for="item in carList" :key="item.id" class="list-item">
          <div class="fl-title">
            <h4>{{ item.orgName }}</h4>
            <el-radio v-model="radioId" :label="item.id">&nbsp;</el-radio>
          </div>
          <div class="fl-label">
            <label>车牌号：</label>
            <span>{{ item.vehicleCode }}</span>
          </div>
          <div class="fl-label">
            <label>联系人：</label>
            <span>{{ item.personName }}</span>
          </div>
          <div class="fl-label">
            <label>手机号：</label>
            <span>{{ item.phone }}</span>
          </div>
          <div class="fl-label">
            <label>车辆颜色：</label>
            <span>{{ item.vehicleColor }}</span>
          </div>
          <div class="fl-label">
            <label>车辆类型：</label>
            <span>{{ item.vehicleType }}</span>
          </div>
          <div class="fl-label">
            <label>运营范围：</label>
            <span>{{ item.scopeBusiness }}</span>
          </div>
        </div>
      </div>
    </div>
    <hqit-content-page type="list">
      <template slot="content">
        <hqit-table
          ref="table"
          :data-source="getList"
          :columns="columns"
          :prop-show-pager="true"
          :search-config="searchConfig"
          :use-expr="false"
          :show-select="false"
          :show-index="false"
          :label-width="'130px'"
          @search="handleSearch"
          @reset="handleReset"
        >
          <template slot="deviceName" slot-scope="{ rowData }">
            <span class="cl-jump" @click="handleOpenMsg(rowData)">
              {{ rowData.deviceName }}
            </span>
          </template>
          <template slot="status" slot-scope="{ rowData }">
            <span v-if="rowData.status">
              <i class="el-icon-success" style="color: #1fbe6c"></i> 在线
            </span>
            <span v-if="!rowData.status">
              <i class="el-icon-error" style="color: #f26f6d"></i> 离线
            </span>
          </template>
          <template slot="value5" slot-scope="{ rowData }">
            <span v-if="rowData.value5 == 0"> 独立配置 </span>
            <span v-if="rowData.value5 == 1"> 继承自单位 </span>
          </template>
          <template slot="status2" slot-scope="{ rowData }">
            <span v-if="rowData.status2 == 1">
              <i class="cl-circle" style="background-color: #1fbe6c"></i>
              下载成功
            </span>
            <span v-if="rowData.status2 == 2">
              <i class="cl-circle" style="background-color: #f26f6d"></i>
              下载失败
            </span>
            <span v-if="rowData.status2 == 3">
              <i class="cl-circle" style="background-color: #aaaaaa"></i>
              待下载
            </span>
          </template>
          <template slot="opts" slot-scope="{ rowData }">
            <el-button
              v-if="rowData.status2 != 1"
              type="text"
              @click="handleDownload(rowData)"
            >
              手动下载
            </el-button>
          </template>
        </hqit-table>

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
      </template>
    </hqit-content-page>
  </div>
</template>

<script>
import personCarMixin from "./personCarMixin.js";
export default {
  mixins: [personCarMixin],
};
</script>
