const newPeople = (formVal, ischeck, optionsList) => {
  // console.log(type)
  let disCheck = ischeck;
  const formData = {
    list: [
      {
        type: "grid",
        icon: "icon-grid-",
        name: "栅格布局",
        columns: [
          {
            span: 8,
            list: [
              {
                type: "radio",
                icon: "icon-radio-active",
                name: "审批结果",
                flag: 0,
                options: {
                  borderRadius: "no",
                  inline: true,
                  defaultValue: 1,
                  showLabel: true,
                  options: optionsList,
                  required: true,
                  width: "",
                  optionDataType: 1,
                  interfaceId: 1622625342000,
                  resList: "data.records",
                  tipFont: "",
                  dictKey: "",
                  props: {
                    value: "value",
                    label: "label",
                  },
                  disabled: disCheck,
                  hide: disCheck,
                },
                key: "1622625320000_64008",
                model: "status",
                rules: [
                  {
                    required: true,
                    message: "状态不能为空",
                  },
                ],
              },
              {
                type: "textarea",
                icon: "icon-diy-com-textarea",
                name: "审批意见",
                flag: 0,
                options: {
                  borderRadius: "no",
                  width: "150%",
                  defaultValue: "",
                  row: "3",
                  required: true,
                  disabled: false,
                  pattern: "",
                  minlength: "",
                  patternTips: "",
                  tipFont: "",
                  maxlength: "100",
                  placeholder: "",
                  interfaceId: 1616753113000,
                  hide: disCheck,
                },
                key: 16167531115000,
                model: "approvalOppion",
                rules: [
                  {
                    required: true,
                    message: "审批意见不能为空",
                  },
                ],
              },
            ],
          },
        ],
        options: {
          gutter: 0,
          justify: "start",
          align: "top",
        },
        key: 1622625288000,
        model: "grid_1622625288000",
        rules: [],
      },
      {
        type: "title",
        flag: 0,
        icon: "icon-wenzishezhi-",
        name: "审批记录",
        options: {
          width: "100%",
          defaultValue: "",
          interfaceId: 1626087097000,
        },
        key: 1626087097000,
        model: "",
        rules: [],
      },
      {
        type: "slot",
        icon: "icon-wenzishezhi-",
        name: "自定义插槽",
        flag: 1,
        options: {
          width: "100%",
          slotName: "infoSlot",
          defaultValue: "",
          required: false,
          validator: "",
          hideLabel: true,
        },
        key: 1619666607000,
        model: "slot_1619666607000",
        rules: [],
      },
      {
        type: "slot",
        icon: "icon-wenzishezhi-",
        name: "自定义插槽",
        flag: 1,
        options: {
          width: "100%",
          slotName: "apparovalSolt",
          defaultValue: "",
          required: false,
          validator: "",
          hideLabel: true,
        },
        key: 1619666607111,
        model: "slot_1619666607111",
        rules: [],
      },
    ],
    config: {
      id: "form_1622625243000",
      labelWidth: 130,
      labelPosition: "right",
      size: "medium",
      column: "column",
      formName: "表单组件",
    },
  };
  return formData;
};

const newFace = (formVal) => {
  const formData = {
    list: [
      {
        type: "slot",
        icon: "icon-wenzishezhi-",
        name: "审批信息",
        flag: 1,
        options: {
          width: "100%",
          slotName: "imgHead",
          defaultValue: [],
          required: false,
          validator: "",
          hideLabel: true,
        },
        key: 1622686786000,
        model: "imgHead",
        rules: [],
      },
      // {
      //   "type": "slot",
      //   "icon": "icon-wenzishezhi-",
      //   "name": "自定义插槽",
      //   "flag": 1,
      //   "options": {
      //     "width": "100%",
      //     "slotName": "syncBtn",
      //     "defaultValue": [],
      //     "required": false,
      //     "validator": "",
      //     "hideLabel": true
      //   },
      //   "key": 1622686850000,
      //   "model": "slot_1622686850000",
      //   "rules": []
      // }
    ],
    config: {
      id: "form_1622686760000",
      labelWidth: 130,
      labelPosition: "right",
      size: "medium",
      column: "column",
      formName: "表单组件",
    },
  };
  return formData;
};
export { newPeople, newFace };
