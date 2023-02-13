<!---  审核领域管理--编辑 --->
<template>
  <div class="contractor-exam-template-edit design-form-wrap">
    <div class="design-form-wrap__ctnwrap">
      <div v-if="formData" class="design-form">
        <pc-form
          ref="generateForm"
          v-model="editData"
          :data="formData"
          :disabled="isSaw"
        >
          <ty-edit-table
            id="domainId"
            :key="editTableKey"
            slot="editTable"
            ref="editTableObj"
            :disabled="isSaw"
            :columns="columnsEdit"
            :data="dataEdit"
          >
            <template v-slot:fieldType="data">
              <ty-dictionary
                v-model="data.data['fieldType']"
                :disabled="isSaw"
                :multiple="false"
                :remote="false"
                :width="'200'"
                :options="fieldTypeOptions"
              ></ty-dictionary>
            </template>
            <template v-slot:parameterCode="data">
              <el-input
                v-show="data.data['fieldType'] != 'Function'"
                v-model="data.data['parameterCode']"
                :disabled="isSaw"
                :width="'200'"
              ></el-input>
            </template>
            <template v-slot:dictType="data">
              <ty-dictionary
                v-show="
                  data.data['fieldType'] != 'Number' &&
                  data.data['fieldType'] != 'Function'
                "
                v-model="data.data['dictType']"
                :disabled="isSaw"
                :multiple="false"
                :clearable="true"
                :filterable="true"
                :remote="false"
                :width="'200'"
                :options="dictTypeList"
              ></ty-dictionary>
            </template>

            <template v-slot:functionName="data">
              <ty-dictionary
                v-show="
                  data.data['fieldType'] != 'Number' &&
                    data.data['fieldType'] == 'Function'
                "
                v-model="data.data['functionName']"
                :disabled="isSaw"
                :multiple="false"
                :clearable="true"
                :filterable="true"
                :is-all-value="true"
                :remote="false"
                :width="'200'"
                :options="funTypeList"
              ></ty-dictionary>
            </template>
          </ty-edit-table>
        </pc-form>
      </div>
    </div>
    <div class="design-form-wrap__btnwrap">
      <el-button
        v-if="!isSaw"
        size="small"
        type="primary"
        @click="handleSubmit"
      >
        保存
      </el-button>
      <el-button size="small" @click="$router.go(-1)">返回</el-button>
    </div>
  </div>
</template>
<script>
import { getFormData } from "./formData";
import { TyEditTable, TyDictionary } from "ty-pc";

import {
  defineDomain,
  getDomainInfo,
  // getFunList,
} from "@/api/approval/field-manage";
import { udcTypeList } from "@/api/system/dict/type";
export default {
  components: {
    TyEditTable,
    TyDictionary,
  },
  data() {
    return {
      editTableKey: new Date().getTime(),
      contractorList: [],
      formData: null,
      editData: {},
      dictTypeList: [],
      funTypeList: [],
      fieldTypeOptions: [
        {
          value: "Number",
          label: "数字",
        },
        {
          value: "String",
          label: "文本",
        },
        // {
        //   value: "Function",
        //   label: "方法",
        // },
      ],
      columnsEdit: [
        {
          prop: "fieldName",
          label: "条件字段名称",
          formFormat: {
            type: "input",
            icon: "icon-input",
            name: "单行文本",
            flag: 0,
            options: {
              clearable: false,
              showText: false,
              width: "100%",
              defaultValue: "",
              required: true,
              dataType: "string",
              maxlength: "",
              minlength: "",
              validator: "",
              pattern: "",
              patternTips: "",
              placeholder: "",
              disabled: true,
              hide: false,
              tipFont: "",
              mouseTips: "",
              borderRadius: "no",
            },
            key: 1617767377000,
            model: "input_1617767377000",
            rules: [
              //   {
              //   "required": true,
              //   "message": "条件字段名称不能为空"
              // }
            ],
          },
        },
        {
          prop: "fieldType",
          label: "字段类型",
          width: 150,
          type: "slot",
          formFormat: {
            type: "select",
            icon: "icon-select",
            name: "下拉选择",
            flag: 0,
            options: {
              borderRadius: "no",
              defaultValue: "",
              multiple: false,
              disabled: false,
              clearable: false,
              placeholder: "",
              required: false,
              showLabel: true,
              width: "",
              options: [
                {
                  value: "Number",
                  label: "数字",
                },
                {
                  value: "String",
                  label: "文本",
                },
                // {
                //   value: "Function",
                //   label: "方法",
                // },
              ],
              filterable: false,
              optionDataType: 1,
              // interfaceMethod: "/basic/system/dict/type/list",
              // interfaceParam: '{"pageSize":"999999"}',
              interfaceId: 1618540007000,
              resList: "rows",
              // interfaceType: "get",
              tipFont: "",
              dictKey: "",
              props: {
                value: "dictType",
                label: "dictName",
              },
            },
            key: 1618540003000,
            model: "select_1618540003000",
            rules: [],
          },
        },
        {
          prop: "parameterCode",
          label: "关联字段编码",
          type: "slot",
        },
        // {
        //   prop: "functionName",
        //   label: "方法名称",
        //   type: "slot",
        //   // show: false,
        // },

        {
          prop: "dictType",
          label: "值域关联字典",
          type: "slot",
          formFormat: {
            type: "select",
            icon: "icon-select",
            name: "下拉选择",
            flag: 0,
            options: {
              borderRadius: "no",
              defaultValue: "",
              multiple: false,
              disabled: false,
              clearable: true,
              placeholder: "",
              required: false,
              showLabel: false,
              width: "",
              options: [
                {
                  value: "选项1",
                },
                {
                  value: "选项2",
                },
                {
                  value: "选项3",
                },
              ],
              filterable: true,
              optionDataType: 2,
              // interfaceMethod: "/basic/system/dict/type/list",
              // interfaceParam: '{"pageSize":"999999"}',
              interfaceId: 1618540007000,
              resList: "rows",
              // interfaceType: "get",
              tipFont: "",
              dictKey: "",
              props: {
                value: "dictType",
                label: "dictName",
              },
            },
            key: 1618540003000,
            model: "select_1618540003000",
            rules: [],
          },
        },
        {
          prop: "operation",
          label: "操作",
          width: "150",
          type: "operation",
        },
      ],
      dataEdit: [
        {
          id: "new_11",
        },
      ],
    };
  },

  computed: {
    //是否查看类型，不能编辑
    isSaw() {
      return !!this.$route.query.detail || false;
    },
  },
  watch: {},
  created() {
    const domainId = this.$route.query.domainId;
    // udcTypeList().then((res) => {
    //   console.log(res, "自定义码封闭园区");
    //   this.dictTypeList = res.data.list;
    // });
    // let tagTitle = "新增领域";
    if (domainId) {
      // tagTitle = "编辑领域";
      getDomainInfo(domainId).then((res) => {
        const { bizForm = [] } = res.data;
        bizForm &&
          bizForm.forEach((i) => {
            if (i.fieldType == "Function") {
              i.parameterCode = "";
            }
          });
        this.editData = {
          ...res.data,
        };
        this.formData = getFormData(this.editData, true);
        bizForm.push({
          id: "new_" + new Date().getTime(),
        });
        this.dataEdit = bizForm;
      });
    } else {
      this.formData = getFormData(this.editData);
    }
    // //修改基座的标签
    // const userObj = this.$globalState.getGlobalState("user") || {};
    // this.$globalState.setGlobalState("user", {
    //   ...userObj,
    //   tagTitleObj: {
    //     ...userObj.tagTitleObj,
    //     [this.$route.path]: tagTitle,
    //   },
    // });
  },
  mounted() {
    this.getdictTypeList();
    // this.getFunList();
  },
  methods: {
    handleSubmit() {
      //验证表单
      this.$refs.generateForm.getData().then((dta) => {
        //验证编辑列表
        this.$refs.editTableObj.getData().then(() => {
          let err = false;
          for (let i = 0; i < this.dataEdit.length - 1; i++) {
            const { fieldName, fieldType, parameterCode, functionName } =
              this.dataEdit[i];
            if (
              (!fieldName || !fieldType || !parameterCode) &&
              fieldType != "Function"
            ) {
              err = true;
              break;
            } else if (fieldType == "Function" && !functionName) {
              err = true;
              break;
            }
          }
          if (err) {
            this.$message.error("请完善列表数据！");
            return;
          }
          //最后一个元素
          const lastObj = this.dataEdit[this.dataEdit.length - 1];
          if (lastObj && lastObj.fieldName == undefined) {
            this.dataEdit.pop();
          }
          // 保存时删掉新增的列表数据的id
          this.dataEdit = this.dataEdit.map((item) => {
            if (String(item.id).indexOf("new_") >= 0) {
              delete item.id;
            }
            return item;
          });
          const bizForm = this.dataEdit.map((item) => {
            if (item.fieldType == "String") {
              return {
                fieldType: item.fieldType,
                fieldName: item.fieldName,
                parameterCode: item.parameterCode,
                dictType: item.dictType,
              };
            } else if (item.fieldType == "Number") {
              return {
                fieldType: item.fieldType,
                fieldName: item.fieldName,
                parameterCode: item.parameterCode,
              };
            } else if (item.fieldType == "Function") {
              return {
                fieldType: item.fieldType,
                fieldName: item.fieldName,
                parameterCode:
                  new Date().getTime().toString() +
                  Math.floor(Math.random() * 900), //生成一个唯一的id
                functionName: item.functionName.label || item.functionName,
                functionId: item.functionName.value || item.functionId,
              };
            }
          });
          const postData = {
            ...this.editData,
            bizForm,
          };
          let fun = defineDomain;
          const id = this.$route.query.id;
          if (id) {
            //修改
            postData.id = id;
          }
          console.log(JSON.stringify(postData));
          fun(postData).then(() => {
            this.$msgSuccess("编辑成功");
            this.$router.push({
              path: "/gatedpark/approval/field-manage",
            });
          });
        });
      });
    },
    getdictTypeList() {
      udcTypeList().then((res) => {
        this.dictTypeList = res.data.list.map((i) => {
          return {
            value: i["code"],
            label: i["name"],
          };
        });
      });
    },
    // getFunList() {
    //   const id = this.$route.query.domainId;
    //   if (id) {
    //     getFunList(id).then((res) => {
    //       console.log(res);
    //       this.funTypeList = res.data.map((i) => ({
    //         label: i.functionName,
    //         value: i.functionId,
    //       }));
    //     });
    //   }
    // },
  },
};
</script>
<style lang="scss" scoped></style>
