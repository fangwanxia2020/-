import { fileUpload, fileBatchDetail } from "@/api/system/file.js";
import ArcgisMap from "@/map/index.vue";
import ViewImage from "@/components/viewImage/index.vue";
export default {
  components: { ArcgisMap, ViewImage },
  data() {
    return {
      centerStr: "", // 中心点
      base64url: "", // 截图所得base64
      hasChange: false,
      imgId: "", // 回显时保存照片id
      // 预览相关
      dialogImageUrl: "",
      dialogVisible: false,
    };
  },
  watch: {
    "$store.state.map.center": function (val) {
      this.form.center = val;
      this.centerStr = val.join(",");
    },
    "$store.state.map.screenshot": function (val) {
      this.base64url = val;
      this.hasChange = val ? true : false;
    },
  },
  methods: {
    // 根据文件id获取文件数据（批量获取）
    handleFileData(data, id = "imageId") {
      if (!data.length) return;
      let idArr = data.map((item) => {
        if (item[id]) return item[id];
      });
      if (!idArr.length) return;
      fileBatchDetail(idArr).then((file) => {
        file.data.forEach((fitem) => {
          data.map((ritem) => {
            if (ritem[id] == fitem.id) {
              // this.$set(ritem, "imgSrc", fitem.downloadUrl);
              this.$set(
                ritem,
                "imgSrc",
                this.baseUrl +
                  "/api/sysfile/file_info/download?id=" +
                  ritem[id],
              );
            }
          });
        });
      });
    },
    // 截图上传
    async toUpload(base64) {
      let formData = new FormData();
      let file = this.blobToFile(
        this.dataURLtoBlob(base64),
        new Date().getTime() + ".png",
      );
      formData.append("file", file);
      let id;
      await fileUpload(formData).then((res) => {
        id = res.data.id;
      });
      return Promise.resolve({ id });
    },
    // 先将base64转换为blob
    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    // 再将blob转换为file
    blobToFile(theBlob, fileName) {
      theBlob.lastModifiedDate = new Date(); // 文件最后的修改日期
      theBlob.name = fileName; // 文件名
      return new File([theBlob], fileName, {
        type: theBlob.type,
        lastModified: Date.now(),
      });
    },
    // 打开预览
    handleOpenPreview(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    // 关闭预览
    handleClosePreview() {
      this.dialogVisible = false;
    },
  },
};
