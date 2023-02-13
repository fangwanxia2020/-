<script>
let _key = 1;
export default {
  name: "form-dialog",
  props: {
    title: String,
    width: Number,
    top: Number,
    cancelText: String,
    successText: String,
    size: {
      type: String,
      default: "normal",
    },
    onCloseClear: {
      type: Boolean,
      default: true,
    },
    appendToBody: {
      type: Boolean,
      default: false,
    },
    // 是否展示取消按钮
    showCancelBtn: {
      type: Boolean,
      default: true,
    },
    // 是否展示确定按钮
    showSubmitBtn: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      visible: false,
      modalBody: undefined,
      loading: false,
      handleCancel: undefined,
      handleSubmit: undefined,
      // 暂存数据，多用于修改功能的表单弹窗
      data: undefined,
      $_title: "",
      setSty: "width: 100px;height: 30px;padding: 0;",
    };
  },
  computed: {
    w() {
      if (this.width) {
        return `${this.width}px`;
      }
      switch (this.size) {
        case "small":
          return "400px";
        default:
          return "600px";
      }
    },
  },
  watch: {
    visible(val) {
      if (val === false) {
        _key++;
      }
    },
  },
  methods: {
    closeModel() {
      this.visible = false;
      this.handleSubmit = undefined;
      this.handleCancel = undefined;
      this.data = undefined;
    },
    openModel(handle) {
      this.visible = true;
      this.handleSubmit = handle && handle.submit;
      this.handleCancel = handle && handle.cancel;
      this.data = handle && handle.data;
      this.$_title = handle && handle.title;
    },
    submit() {
      return this.modalBody.componentInstance
        .validate()
        .then(() => {
          this.loading = true;
          return this.modalBody.componentInstance.request();
        })
        .then((res) => {
          this.$emit("submit", res);
          return this.handleSubmit && this.handleSubmit(res);
        })
        .then(() => this.closeModel())
        .catch((e) => {
          e && console.error(e);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    cancel() {
      this.closeModel();
      this.$emit("cancel");
      this.handleCancel && this.handleCancel();
    },
    closedEvent() {
      this.$emit("closed");
    },
  },
  render() {
    return (
      <el-dialog
        ref="dialog"
        title={this.$_title || this.title}
        width={this.w}
        top={this.top}
        visible={this.visible}
        destroy-on-close
        v-dialogDrag
        scopedSlots={{
          default: () => {
            if (this.visible) {
              const [vnode] = this.$scopedSlots.default({
                data: this.data,
                closeDialog: this.closeModel,
              });
              const _vnode = this.$createElement(
                vnode.componentOptions.Ctor,
                {
                  ...vnode.data,
                  key: _key,
                  on: {
                    ...vnode.on,
                    ...vnode.componentOptions.listeners,
                  },
                  props: {
                    ...vnode.componentOptions.propsData,
                  },
                },
                vnode.componentOptions.children,
              );
              this.modalBody = _vnode;
              return _vnode;
            }
            return this.modalBody;
          },
        }}
        close-on-click-modal={false}
        close-on-press-escape={false}
        onClose={this.closeModel}
        onClosed={this.closedEvent}
        props={{ ...this.$attrs }}
        append-to-body={this.appendToBody}
      >
        <div slot="footer" class="dialog-footer">
          <el-button
            class="cancelButton"
            onClick={this.cancel}
            style={!this.showCancelBtn ? "display: none;" : this.setSty}
          >
            {this.cancelText || "取消"}
          </el-button>
          <el-button
            class="confirmButton"
            type="primary"
            onClick={this.submit}
            directives={[{ name: "loading", value: this.loading }]}
            style={!this.showSubmitBtn ? "display: none;" : this.setSty}
          >
            {this.successText || "确定"}
          </el-button>
        </div>
      </el-dialog>
    );
  },
};
</script>
