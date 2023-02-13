<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="人员" name="first"></el-tab-pane>
      <el-tab-pane label="车辆" name="second"></el-tab-pane>
    </el-tabs>
    <template v-if="activeName == 'first'">
      <CtTable
        ref="FirstTable"
        :table-height="null"
        :request="getFirstList"
        row-key="id"
        :is-select="false"
        :has-btn="false"
        :page-sizes="[5, 10, 15, 20]"
        :default-page-size="5"
        @filter-change="fillterChange"
        @reset="resetPersonTable"
      >
        <template #search="scope">
          <el-form-item label="工号: ">
            <el-input
              v-model="scope.params.code"
              placeholder="请输入"
              clearable
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
          <el-form-item label="姓名: ">
            <el-input
              v-model="scope.params.name"
              placeholder="请输入"
              clearable
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
          <el-form-item label="单位: ">
            <hqit-tree-select
              v-model="scope.params.orgId"
              style="width: 100%"
              v-bind="{
                clearable: true,
                selectAttrs: { placeholder: '请选择单位' },
              }"
            >
            </hqit-tree-select>
          </el-form-item>
          <el-form-item label="身份证号: ">
            <el-input
              v-model="scope.params.idNo"
              placeholder="请输入"
              clearable
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
          <el-form-item label="手机号: ">
            <el-input
              v-model="scope.params.phone"
              placeholder="请输入"
              clearable
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
        </template>
        <template #table-columns>
          <template>
            <el-table-column
              label="工号"
              prop="code"
              sortable
              show-overflow-tooltip
              width="180"
            >
            </el-table-column>
            <el-table-column
              label="姓名"
              prop="name"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              label="性别"
              prop="genderName"
              column-key="genderName"
              :filters="[
                { text: '男', value: '男' },
                { text: '女', value: '女' },
              ]"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="单位" show-overflow-tooltip prop="orgName">
            </el-table-column>
            <el-table-column label="身份证号" prop="idNo" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="手机号" prop="phone" show-overflow-tooltip>
            </el-table-column>
          </template>
        </template>
      </CtTable>
    </template>
    <template v-if="activeName == 'second'">
      <CtTable
        ref="carTable"
        :table-height="null"
        :request="getCarList"
        row-key="id"
        :is-select="false"
        :has-btn="false"
        :page-sizes="[5, 10, 15, 20]"
        :default-page-size="5"
      >
        <template #search="scope">
          <el-form-item label="车牌号: ">
            <el-input
              v-model="scope.params.vehicleCode"
              placeholder="请输入"
              clearable
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
          <el-form-item label="车辆类型: ">
            <el-input
              v-model="scope.params.vehicleType"
              placeholder="请输入"
              clearable
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
          <el-form-item label="联系人: ">
            <el-input
              v-model="scope.params.personName"
              placeholder="请输入"
              clearable
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
          <el-form-item label="手机号码: ">
            <el-input
              v-model="scope.params.personPhone"
              placeholder="请输入"
              clearable
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
          <el-form-item label="单位: ">
            <hqit-tree-select
              v-model="scope.params.orgId"
              style="width: 100%"
              v-bind="{
                clearable: true,
                selectAttrs: { placeholder: '请选择单位' },
              }"
            >
            </hqit-tree-select>
          </el-form-item>
        </template>
        <template #table-columns>
          <template>
            <el-table-column
              label="车牌号"
              prop="vehicleCode"
              show-overflow-tooltip
              width="180"
            >
            </el-table-column>
            <el-table-column
              label="车辆种类"
              prop="vehicleType"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              label="联系人"
              prop="personName"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              label="手机号"
              prop="personPhone"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              label="所属单位"
              prop="orgName"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              label="经营范围"
              prop="scopeBusiness"
              show-overflow-tooltip
            >
            </el-table-column>
          </template>
        </template>
      </CtTable>
    </template>
  </div>
</template>

<script>
import { getApplyCodeInfo } from "@/api/location-card-management/index.js";
export default {
  props: {
    batchId: {
      type: [Number, String],
    },
  },
  data() {
    return {
      activeName: "first",
      personDataList: [],
      carDataList: [],
      genderNameList: [],
    };
  },
  watch: {
    activeName(val) {
      if (val == "first") {
        setTimeout(() => {
          this.$refs.FirstTable.reset();
        }, 100);
      } else {
        setTimeout(() => {
          this.$refs.carTable.reset();
        }, 100);
      }
    },
  },
  mounted() {
    getApplyCodeInfo(this.batchId).then((result) => {
      result.data.personDetailsDto &&
        (this.personDataList = result.data.personDetailsDto);
      result.data.baseVehicleDto &&
        (this.carDataList = result.data.baseVehicleDto);
      this.$refs.FirstTable.reset();
    });
  },
  methods: {
    // 人员列表
    getFirstList(params) {
      let allArr = this.personDataList;
      let arr = [];
      let newArr = [];
      let begin = (params.pageNum - 1) * params.pageSize;
      let end = params.pageNum * params.pageSize;
      if (params.code) {
        newArr = [];
        allArr.forEach((item) => {
          if (item.code && item.code.indexOf(params.code) != -1) {
            newArr.push(item);
          }
        });
        allArr = newArr;
      }
      if (params.name) {
        newArr = [];
        allArr.forEach((item) => {
          if (item.name && item.name.indexOf(params.name) != -1) {
            newArr.push(item);
          }
        });
        allArr = newArr;
      }
      if (params.idNo) {
        newArr = [];
        allArr.forEach((item) => {
          if (item.idNo && item.idNo.indexOf(params.idNo) != -1) {
            newArr.push(item);
          }
        });
        allArr = newArr;
      }
      if (params.phone) {
        newArr = [];
        allArr.forEach((item) => {
          if (item.phone && item.phone.indexOf(params.phone) != -1) {
            newArr.push(item);
          }
        });
        allArr = newArr;
      }
      if (params.orgId && params.orgId.length) {
        newArr = [];
        allArr.forEach((item) => {
          params.orgId.forEach((items) => {
            if (item.orgId && item.orgId == items) {
              newArr.push(item);
            }
          });
        });
        allArr = newArr;
      }
      if (this.genderNameList.length) {
        newArr = [];
        allArr.forEach((item) => {
          this.genderNameList.forEach((items) => {
            if (item.genderName && item.genderName == items) {
              newArr.push(item);
            }
          });
        });
        allArr = newArr;
      }
      arr = allArr.slice(begin, end);
      return Promise.resolve({
        list: arr,
        total: allArr.length,
      });
    },
    resetPersonTable() {
      this.$refs.FirstTable.$refs.batchTable.clearSort();
      this.$refs.FirstTable.clearTableFilter();
    },
    // 车辆列表
    getCarList(params) {
      console.log(111);
      let allArr = this.carDataList;
      let arr = [];
      let newArr = [];
      let begin = (params.pageNum - 1) * params.pageSize;
      let end = params.pageNum * params.pageSize;
      if (params.vehicleCode) {
        newArr = [];
        allArr.forEach((item) => {
          if (
            item.vehicleCode &&
            item.vehicleCode.indexOf(params.vehicleCode) != -1
          ) {
            newArr.push(item);
          }
        });
        allArr = newArr;
      }
      if (params.vehicleType) {
        newArr = [];
        allArr.forEach((item) => {
          if (
            item.vehicleType &&
            item.vehicleType.indexOf(params.vehicleType) != -1
          ) {
            newArr.push(item);
          }
        });
        allArr = newArr;
      }
      if (params.personName) {
        newArr = [];
        allArr.forEach((item) => {
          if (
            item.personName &&
            item.personName.indexOf(params.personName) != -1
          ) {
            newArr.push(item);
          }
        });
        allArr = newArr;
      }
      if (params.personPhone) {
        newArr = [];
        allArr.forEach((item) => {
          if (
            item.personPhone &&
            item.personPhone.indexOf(params.personPhone) != -1
          ) {
            newArr.push(item);
          }
        });
        allArr = newArr;
      }
      if (params.orgId && params.orgId.length) {
        newArr = [];
        allArr.forEach((item) => {
          params.orgId.forEach((items) => {
            if (item.orgId && item.orgId == items) {
              newArr.push(item);
            }
          });
        });
        allArr = newArr;
      }
      arr = allArr.slice(begin, end);
      return Promise.resolve({
        list: arr,
        total: allArr.length,
      });
    },
    fillterChange(val) {
      this.genderNameList = val.genderName;
      this.$refs.FirstTable.reload(1);
    },
  },
};
</script>

<style></style>
