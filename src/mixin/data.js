export default {
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    isUpdate: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 表单参数
      form: { ...this.data },
    };
  },
  watch: {
    data(newData) {
      this.form = { ...newData };
    },
  },
  methods: {
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            resolve();
          } else {
            reject();
          }
        });
      });
    },
  },
};
