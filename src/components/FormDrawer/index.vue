<script>
import Drawer from "./Drawer.vue";
let _key = 1;
export default {
  name: "FormDrawer",
  components: { Drawer },
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
    },
    submit() {
      this.modalBody.componentInstance
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
      <Drawer
        ref="dialog"
        title={this.title}
        visible={this.visible}
        destroy-on-close
        scopedSlots={{
          default: () => {
            if (this.visible) {
              const [vnode] = this.$scopedSlots.default({ data: this.data });
              const _vnode = this.$createElement(
                vnode.componentOptions.Ctor,
                {
                  ...vnode.data,
                  key: _key,
                  on: vnode.on,
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
        onClose={this.closeModel}
        onClosed={this.closedEvent}
        props={{ ...this.$attrs }}
      >
        <div slot="footer" class="drawer-footer">
          <el-button onClick={this.cancel}>
            {this.cancelText || "取消"}
          </el-button>
          <el-button
            type="primary"
            onClick={this.submit}
            v-loading={this.loading}
          >
            {this.successText || "确定"}
          </el-button>
        </div>
      </Drawer>
    );
  },
};
</script>

<style lang="scss">
.drawer-footer {
  padding: 20px;
  display: flex;
  .el-button {
    flex: 1;
  }
}
</style>
