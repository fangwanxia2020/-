<template>
  <div>
    <div class="cl-tab-flex">
      <el-tabs v-model="tabsId">
        <el-tab-pane
          v-for="item in tabsList"
          :key="item.domainId + ''"
          :label="item.domainName"
          :name="item.domainId + ''"
        ></el-tab-pane>
      </el-tabs>
      <el-dropdown @command="handleClick">
        <span class="el-dropdown-link">
          <i class="el-icon-s-tools"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="1" :class="{ select: '1' === listType }">
            待办任务
          </el-dropdown-item>
          <el-dropdown-item command="2" :class="{ select: '2' === listType }">
            已办任务
          </el-dropdown-item>
          <el-dropdown-item command="3" :class="{ select: '3' === listType }">
            我的申请
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div style="height: calc(100vh - 145px)">
      <ReserveRecord v-if="tabsId == '1'" :the-act="'first'" />
      <ReserveRecord v-if="tabsId == '5'" :the-act="'second'" />
      <ReserveRecord v-if="tabsId == '6'" :the-act="'third'" />
      <LongTermCard v-if="tabsId == '9'" :the-act="'1'" />
      <LongTermCard v-if="tabsId == '10'" :the-act="'2'" />
      <ExplosionProofCard v-if="tabsId == '11'" />
      <ContractorLongCard v-if="tabsId == '12'" :the-act="'1'" />
      <ContractorLongCard v-if="tabsId == '13'" :the-act="'2'" />
      <ResidenceApproval v-if="tabsId == '7'" />
      <ChangeApproval v-if="tabsId == '8'" />
    </div>
  </div>
</template>

<script>
import { getTabList } from "@/api/my-application/needTodo.js";
export default {
  components: {
    // 访客预约审批/人车预约审批/机具预约审批
    ReserveRecord: () =>
      import("@/views/park-operation/reserve-manage/reserve-record/index.vue"),
    // 中长期卡申请审批/中长期卡续期审批
    LongTermCard: () =>
      import(
        "@/views/park-operation/location-card-manage/long-term-card/index.vue"
      ),
    // 防爆卡申请审批
    ExplosionProofCard: () =>
      import(
        "@/views/park-operation/location-card-manage/explosion-proof-card/index.vue"
      ),
    // 承包商中长期卡申请审批/承包商中长期卡续期审批
    ContractorLongCard: () =>
      import(
        "@/views/park-operation/contractor/contractor-long-card/index.vue"
      ),
    // 承包商入驻审批
    ResidenceApproval: () =>
      import("@/views/park-operation/contractor/residence-approval/index.vue"),
    // 承包商变更审批
    ChangeApproval: () =>
      import("@/views/park-operation/contractor/change-approval/index.vue"),
  },
  data() {
    return {
      tabsList: [],
      tabsId: "",
      listType: "1",
    };
  },
  provide() {
    return {
      tabsId: () => this.tabsId,
      listType: () => this.listType,
    };
  },
  mounted() {
    this.getTabList();
  },
  methods: {
    getTabList() {
      getTabList({ systemFlag: "gatepark" }).then((res) => {
        this.tabsList = res.data.records;
        this.tabsId =
          res.data.records.length && res.data.records[0].domainId + "";
      });
    },
    handleClick(type) {
      this.listType = type;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-tabs {
  padding: 0 30px;
}
.cl-tab-flex {
  display: flex;
  .el-tabs {
    width: calc(100% - 30px);
  }
  .el-dropdown {
    width: 30px;
    .el-icon-s-tools {
      font-size: 20px;
      color: #539afe;
      padding-top: 12px;
      cursor: pointer;
    }
  }
}
.select {
  background-color: #e6f0ff;
  color: #358aff;
}
</style>
