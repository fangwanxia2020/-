<template>
  <div class="visitor-analyse">
    <div class="search-content">
      <el-form ref="form" :model="form" label-width="110px">
        <el-form-item label="拜访单位: ">
          <hqit-tree-select
            v-model="orgId"
            :check-strictly="true"
            :clearable="true"
            :select-attrs="{ placeholder: '选择单位' }"
            style="width: 100%"
          >
          </hqit-tree-select>
        </el-form-item>
        <el-form-item v-if="isWho" label="车辆种类: ">
          <el-select v-model="carTypeId" clearable>
            <el-option
              v-for="item in carTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="search-content-button">
        <el-button type="primary" @click="handleSearch"> 查询 </el-button>
        <el-button
          plain
          class="search-content-button__reset"
          @click="handleReset"
        >
          重置
        </el-button>
      </div>
    </div>
    <div class="body-content">
      <h3 style="text-align: center">
        {{ !isWho ? "访客来访分析" : "车辆来访分析" }}
      </h3>
      <el-tabs v-model="tabsActive">
        <el-tab-pane
          v-for="item in tabsList"
          :key="item.code"
          :label="item.name"
          :name="item.code"
        ></el-tab-pane>
      </el-tabs>
      <!-- 访客来源 -->
      <VisitorOrigin
        v-if="tabsActive == 1"
        :org-id="orgId"
        :to-req.sync="toReq"
        :car-type-id="carTypeId"
      />
      <!-- 理由分析 -->
      <ReasonAnalyse
        v-if="tabsActive == 2 && !isWho"
        :org-id="orgId"
        :to-req.sync="toReq"
      />
      <!-- 拜访单位统计 -->
      <VisitorCompany
        v-if="tabsActive == 3"
        :org-id="orgId"
        :to-req.sync="toReq"
        :car-type-id="carTypeId"
      />
      <!-- 时间段分布 -->
      <TimeDistribute
        v-if="tabsActive == 4"
        :org-id="orgId"
        :to-req.sync="toReq"
        :car-type-id="carTypeId"
      />
    </div>
  </div>
</template>

<script>
import VisitorOrigin from "./visitor-origin/index.vue";
import ReasonAnalyse from "./reason-analyse/index.vue";
import VisitorCompany from "./visitor-company/index.vue";
import TimeDistribute from "./time-distribute/index.vue";
import { getCarKind } from "@/api/reserve-manage/index.js";
export default {
  components: {
    VisitorOrigin,
    ReasonAnalyse,
    VisitorCompany,
    TimeDistribute,
  },
  data() {
    return {
      form: {},
      tabsList: [],
      tabsActive: "1",
      tabPos: "today",
      tabDate: [],
      orgId: [], // 单位id
      isWho: 0, // 0-人 1-车
      toReq: false, // 是否可以请求
      carTypeId: "", // 车辆种类id
      carTypeList: [],
    };
  },
  watch: {
    $route: {
      handler: function (val) {
        // 人
        if (val.name == "visitor-analyse") {
          this.isWho = 0;
          this.tabsList = [
            { code: "1", name: "访客来源" },
            { code: "2", name: "理由分析" },
            { code: "3", name: "拜访单位统计" },
            { code: "4", name: "时间段分布" },
          ];
        }
        // 车
        if (val.name == "car-analyse") {
          this.isWho = 1;
          this.tabsList = [
            { code: "1", name: "车辆归属" },
            { code: "3", name: "拜访单位统计" },
            { code: "4", name: "时间段分布" },
          ];
        }
      },
      immediate: true,
    },
  },
  mounted() {
    if (this.$route.name == "car-analyse") this.getCarKind();
  },
  methods: {
    // 获取车辆类型
    getCarKind() {
      let params = {
        pageNum: 1,
        pageSize: 9999,
        expr: [],
        name: "",
        typeCode: "",
        order: "createTime",
        sort: "DESC",
      };
      getCarKind(params).then((res) => {
        this.carTypeList = res.data.list;
      });
    },
    // 查询
    handleSearch() {
      this.toReq = true;
    },
    // 重置
    handleReset() {
      this.orgId = [];
      this.carTypeId = "";
      this.toReq = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.visitor-analyse {
  padding: 15px 30px 20px;
  .search-content {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgba(211, 219, 234, 0.5) !important;
    ::v-deep {
      .el-form {
        display: flex;
      }
      .el-button {
        height: 36px;
        width: 100px;
        padding: 0;
      }
      .el-select {
        width: 100%;
      }
      .el-form-item {
        margin-bottom: 11px;
      }
      .el-form-item__label {
        color: #909399;
      }
    }
    &-button {
      margin-left: 20px;
      &__reset {
        color: #026dff;
        border: 1px solid #026dff;
        &:hover {
          background-color: #e6f0ff !important;
        }
      }
    }
  }
  ::v-deep .el-tabs__nav-wrap::after {
    background-color: transparent;
  }
}
</style>

<style lang="scss">
.cl-item-content {
  .item-tab {
    width: 100%;
    height: 54px;
    .el-radio-group {
      float: right;
    }
  }
  overflow: hidden;
}
.cl_hide_input {
  position: relative !important;
}
.cl_hide_input .el-date-editor {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}
.cl-null-tips {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #909399;
  width: 100%;
  height: 450px;
}
</style>
