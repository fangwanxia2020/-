import {
  bayonetList,
  platformList,
} from "@/api/infrastructure/access-control-equipment.js";
export default {
  data() {
    return {
      bayonetList: [], // 卡口列表
      platformList: [], // 平台列表
      dictArr: [
        "base_camera_brand", // 品牌
      ],
      dictObj: {
        base_camera_brand: [],
      },
    };
  },
  watch: {
    platformList: function (val) {
      if (!this.searchConfig) return;
      this.searchConfig.find((v) => v.prop == "edgePlatId").options = val.map(
        (item) => {
          return { label: item.protocol, value: item.id };
        },
      );
    },
    bayonetList: function (val) {
      if (!this.searchConfig) return;
      this.searchConfig.find((v) => v.prop == "gatewayId").options = val.map(
        (item) => {
          return { label: item.name, value: item.id };
        },
      );
    },
  },
  mounted() {
    this.dictArr.forEach((item) => {
      this.$getTypeCode(item).then((res) => {
        this.$set(this.dictObj, item, res.data);
      });
    });
    this.getBayonetList();
    this.getPlatformList();
  },
  methods: {
    // 卡口下拉
    getBayonetList() {
      let params = {
        order: "updateTime",
        sort: "DESC",
        pageNum: 1,
        pageSize: 9999999,
        query: [],
      };
      bayonetList(params).then((res) => {
        this.bayonetList = res.data.list;
      });
    },
    // 平台下拉
    getPlatformList() {
      let params = {
        order: "updateTime",
        sort: "DESC",
        pageNum: 1,
        pageSize: 9999999,
        query: [],
      };
      platformList(params).then((res) => {
        this.platformList = res.data.list;
      });
    },
  },
};
