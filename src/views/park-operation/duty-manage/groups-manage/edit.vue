<template>
  <div class="cl-second">
    <div class="cl-second-content">
      <back-bar :title="title" />
      <div class="content-item clearfix">
        <div class="cl-hea-title">班组信息</div>
        <el-form
          ref="baseForm"
          class="container-content"
          :model="baseForm"
          :rules="baseRules"
          label-width="100px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="班组名称: " prop="machineNo">
                <el-input
                  v-if="!isCheck"
                  v-model="baseForm.machineNo"
                  placeholder="请输入"
                  clearable
                ></el-input>
                <!-- <span v-else>{{ baseForm.machineNo }}</span> -->
                <span v-else>早班 </span>
              </el-form-item>
              <!-- <el-form-item label="开始时间: " prop="startTime">
                <el-time-select
                  v-if="!isCheck"
                  v-model="baseForm.startTime"
                  :picker-options="{
                    start: '00:00',
                    step: '00:30',
                    end: '23:30',
                  }"
                  placeholder="选择时间"
                >
                </el-time-select>
                <span v-else>23:00</span>
              </el-form-item> -->
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态: " prop="vehicleState">
                <el-radio-group v-if="!isCheck" v-model="baseForm.vehicleState">
                  <el-switch
                    v-model="baseForm.vehicleState"
                    :active-value="0"
                    :width="50"
                    :inactive-value="1"
                  >
                  </el-switch>
                </el-radio-group>
                <span v-else>启用</span>
              </el-form-item>
              <!-- <el-form-item label="结束时间: " prop="endTime">
                <el-time-select
                  v-if="!isCheck"
                  v-model="baseForm.edfTime"
                  :picker-options="{
                    start: '00:00',
                    step: '00:30',
                    end: '23:30',
                  }"
                  placeholder="选择时间"
                >
                </el-time-select>
                <template v-else>
                  <span>2:00</span>
                </template>
              </el-form-item> -->
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="班组描述: " style="width: 100%">
              <el-input
                v-if="!isCheck"
                v-model="baseForm.scopeBusiness"
                type="textarea"
                placeholder="内容(选填)"
              >
              </el-input>
              <!-- <span v-else>{{ baseForm.machineNo }}</span> -->
              <span v-else>文案描述</span>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item
              label="班组人员: "
              style="width: 100%"
              prop="vehicleState"
            >
              <template v-if="!isCheck">
                <el-tag type="success">黄山洪-19876621131</el-tag>
                <el-button
                  size="small"
                  type="primary"
                  style="margin-left: 10px"
                >
                  +添加人员
                </el-button>
              </template>
              <!-- <span v-else>{{ baseForm.machineNo }}</span> -->
              <span v-else>
                <el-tag type="success">黄山洪-19876621131</el-tag>
              </span>
            </el-form-item>
          </el-row>
        </el-form>
        <div class="cl-hea-title">值班周期</div>
        <el-form
          ref="baseForm"
          class="container-content"
          :model="baseForm"
          :rules="baseRules"
          label-width="100px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="开始时间: " prop="startTime">
                <el-time-select
                  v-if="!isCheck"
                  v-model="baseForm.startTime"
                  :picker-options="{
                    start: '00:00',
                    step: '00:30',
                    end: '23:30',
                  }"
                  placeholder="选择时间"
                >
                </el-time-select>
                <span v-else>23:00</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束时间: " prop="endTime">
                <el-time-select
                  v-if="!isCheck"
                  v-model="baseForm.edfTime"
                  :picker-options="{
                    start: '00:00',
                    step: '00:30',
                    end: '23:30',
                  }"
                  placeholder="选择时间"
                >
                </el-time-select>
                <template v-else>
                  <span>2:00</span>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="添加班次: " style="width: 100%" prop="value">
              <el-select v-model="baseForm.value" placeholder="请选择">
                <el-option
                  v-for="item in cities"
                  :key="item.value"
                  :label="item.key"
                  :value="item.value"
                  :disabled="isCheck"
                >
                  <span class="rating">{{ item.label }}</span>
                  <span>{{ item.value }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="cl-second-footer">
      <el-button
        type="primary"
        @click="isCheck ? handleToEdit() : handleSave()"
      >
        {{ isCheck ? "编辑" : "保存" }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { getOrgList } from "@/api/access-control-permission/organization-control.js";
export default {
  components: {},
  data() {
    return {
      isCheck: false, // 是否查看
      title: "班组管理— 新增",
      baseForm: {
        machinesNo: "", // 机具编号
        vehicleState: 1, // 机具状态
        value: "白班 当天(08:00至16:00)",
      },
      baseRules: {
        machineNo: [{ required: true, message: "请输入", trigger: "blur" }],
        vehicleState: [
          { required: true, message: "请选择状态", trigger: "change" },
        ],
        startTime: [{ required: true, message: "请选择开始时间" }],
        endTime: [{ required: true, message: "请选择结束时间" }],
        value: [{ required: true, message: "请选择班次", trigger: "change" }],
      },
      cities: [
        {
          value: "当天(08:00至16:00)",
          label: "白班",
          key: "白班 当天(08:00至16:00)",
        },
        {
          value: "跨天(23:30至02:00)",
          label: "晚班",
          key: "晚班 跨天(23:30至02:00)",
        },
        {
          value: "当天(08:00至16:00)",
          label: "休息",
          key: "休息 当天(08:00至16:00)",
        },
      ],
    };
  },
  created() {
    if (this.$route.query.id) this.getDetail();
  },
  methods: {
    getDetail() {
      this.title = "班组管理— 修改— 甲组";
      if (this.$route.query.isCheck) {
        this.isCheck = true;
        this.title = "班组管理— 查看— 甲组";
      }
    },
    // 编辑
    handleToEdit() {
      this.isCheck = false;
    },
    handleBack() {
      this.$router.go(-1);
    },
    // 保存
    handleSave() {},
  },
};
</script>

<style lang="scss" scoped>
.cl-second {
  .cl-second-content {
    .content-item {
      margin-top: 20px;
    }
    .container-content {
      padding: 20px 15%;
    }

    .el-form-item {
      width: 52%;
    }
  }
}
.rating {
  border-radius: 8px;
  margin: 0 5px;
  padding: 5px 5px;
  background: #7f7f7f;
  color: #fff;
  margin-right: 10px;
}
::v-deep .el-switch__core::before {
  content: "禁用";
  position: absolute;
  font-size: 12px;
  top: -1px;
  right: 5px;
  color: #fff;
}

.is-checked ::v-deep .el-switch__core::before {
  content: "启用";
  position: absolute;
  font-size: 12px;
  top: -1px;
  left: 5px;
  color: #fff;
}
</style>
