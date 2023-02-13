<template>
  <el-form ref="form" :model="form" :validate-on-rule-change="false">
    <el-table ref="table" :data="form.tableData">
      <el-table-column align="center">
        <template slot="header">
          <div class="required">品名</div>
        </template>
        <template slot-scope="scope">
          <el-form-item
            :prop="'tableData.' + scope.$index + '.materialName'"
            :rules="[
              { required: true, message: '请选择品名', trigger: 'change' },
            ]"
          >
            <el-select
              v-if="!isCheck"
              v-model="scope.row.materialName"
              clearable
              placeholder="请选择品名"
            >
              <el-option
                v-for="item in gradelist"
                :key="+item.id"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
            <span v-else>
              {{ scope.row.materialName }}
            </span>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <div class="required">托运重量(吨)</div>
        </template>
        <template slot-scope="scope">
          <el-form-item
            :prop="'tableData.' + scope.$index + '.shipWeight'"
            :rules="[
              { required: true, message: '请输入托运重量', trigger: 'blur' },
            ]"
          >
            <el-input
              v-if="!isCheck"
              v-model="scope.row.shipWeight"
              clearable
              placeholder="请输入托运重量"
            >
            </el-input>
            <span v-else>{{ scope.row.shipWeight }}</span>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column align="center" label="单位">
        <template slot-scope="scope">
          <el-form-item :prop="'tableData.' + scope.$index + '.unit'">
            <el-select
              v-if="!isCheck"
              v-model="scope.row.unit"
              clearable
              placeholder="请选择单位"
            >
              <el-option
                v-for="item in dictObj.gatedpack_goods_unit"
                :key="+item.code"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
            <span v-else>
              {{ scope.row.unit }}
            </span>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="联合国编号" align="center">
        <template slot="header">
          <div>联合国编号</div>
        </template>
        <template slot-scope="scope">
          <el-form-item :prop="'tableData.' + scope.$index + '.unCode'">
            <el-input
              v-if="!isCheck"
              v-model="scope.row.unCode"
              clearable
              placeholder="请输入"
            >
            </el-input>
            <span v-else>{{ scope.row.unCode ? scope.row.unCode : "-" }}</span>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="类别及项别" align="center">
        <template slot="header">
          <div class="required">类别及项别</div>
        </template>
        <template slot-scope="scope">
          <el-form-item
            :prop="'tableData.' + scope.$index + '.materialCategory'"
            :rules="[
              {
                required: true,
                message: '请输入类别及项别',
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              v-if="!isCheck"
              v-model="scope.row.materialCategory"
              clearable
              placeholder="请输入类别及项别"
            >
            </el-input>
            <span v-else>{{ scope.row.materialCategory }}</span>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column align="center" label="包装类别">
        <template slot-scope="scope">
          <el-form-item
            :prop="'tableData.' + scope.$index + '.packageCategory'"
          >
            <el-select
              v-if="!isCheck"
              v-model="scope.row.packageCategory"
              clearable
              placeholder="请选择包装类别"
            >
              <el-option
                v-for="item in dictObj.gatedpack_wrap_type"
                :key="+item.code"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
            <span v-else>
              {{ scope.row.packageCategory }}
            </span>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column align="center" label="包装规格">
        <template slot-scope="scope">
          <el-form-item
            :prop="'tableData.' + scope.$index + '.packageSpecification'"
          >
            <el-select
              v-if="!isCheck"
              v-model="scope.row.packageSpecification"
              clearable
              placeholder="请选择包装规格"
            >
              <el-option
                v-for="item in dictObj.gatedpack_wrap_specification"
                :key="+item.code"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
            <span v-else>
              {{ scope.row.packageSpecification }}
            </span>
          </el-form-item>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
</template>

// 货物明细

<script>
import { getListByExpr } from "@/api/reserve-manage/waybill.js";
export default {
  inject: ["isCheck"],
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      form: {
        tableData: [{ ...this.formData }],
      },
      dictArr: [
        "gatedpack_goods_unit", // 单位
        "gatedpack_wrap_type", // 包装类型
        "gatedpack_wrap_specification", // 包装规格
      ],
      dictObj: {},
      gradelist: [],
    };
  },
  watch: {
    formData: {
      handler(val) {
        console.log(val, "嘻嘻嘻喜欢改");
        this.form.tableData = [{ ...val }];
        console.log(this.form, "改改改湖广会馆");
        this.$forceUpdate();
      },
      // 这里是关键，代表递归监听 demo 的变化
      deep: true,
    },
  },
  mounted() {
    console.log(this.formData, "闯进了的啥");
    getListByExpr().then((res) => {
      console.log(res, "213234");
      this.gradelist = res.data;
    });
    this.dictArr.forEach((item) => {
      this.$getTypeCode(item).then((res) => {
        this.$set(this.dictObj, item, res.data);
      });
    });
  },
};
</script>

<style lang="scss" scoped>
.el-form-item {
  width: 100% !important;
  margin-top: 10px;
}
::v-deep .el-table th > .cell {
  .required {
    &::before {
      content: "*";
      color: #f56c6c;
      margin-right: 4px;
    }
  }
}
::v-deep .el-table__header {
  border-bottom: 2px dashed #e6ebf5;
}
::v-deep .el-table th {
  background-color: transparent !important;
}
::v-deep .el-table--group::after,
::v-deep .el-table--border::after,
::v-deep .el-table::before {
  background-color: #fff !important;
}
::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: transparent;
}
::v-deep .el-form-item__content {
  line-height: 20px;
}
</style>
