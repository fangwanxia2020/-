<template>
  <div class="map">
    <!-- 头部 -->
    <NavBar />
    <!--地图挂载容器-->
    <div id="viewDiv"></div>
    <!-- 工具栏 -->
    <ToolBar ref="toolbar" @toolBarClick="toolBarClick" />
    <!-- 搜索框 -->
    <Search />
    <!-- 设备操作 -->
    <EquipList ref="equipList" @itemClick="equipItemClick" />
    <VideoPopup
      v-if="Object.keys(videoPopup).length > 0"
      ref="videoPopup"
      :info="videoPopup"
    />
    <DoorPopup
      v-if="Object.keys(doorPopup).length > 0"
      ref="doorPopup"
      :info="doorPopup"
    />
  </div>
</template>
<script>
import Map from "@/utils/map.js";
import { wgs84_To_epsg4545, epsg4545_To_wgs84 } from "@/map/data/utils.js";
import axios from "axios";
import {
  getEdgevacDeviceList,
  getEdgePacDeviceList,
  getVideoByCode,
} from "@/api/map/index.js";
import ToolBar from "./components/tool-bar.vue";
import NavBar from "./components/nav-bar.vue";
import Search from "./components/search.vue";
import EquipList from "./components/equip-list.vue";
import VideoPopup from "./popup/video-popup.vue";
import DoorPopup from "./popup/door-popup.vue";

import videoActive from "@/assets/images/map/video_active.png";
import doorActive from "@/assets/images/map/door_active.png";

export default {
  name: "arcgis",
  components: {
    ToolBar,
    NavBar,
    Search,
    EquipList,
    VideoPopup,
    DoorPopup,
  },
  data() {
    return {
      viewer: null,
      gisConstructor: {},
      map: {},
      baseMap: null,
      draw: null,
      activeIndex: null,
      videoList: [], //摄像头设备
      doorList: [], //门禁设备
      markerPoint: [
        { x: 570134.4107719596, y: 2408146.8412854923 },
        { x: 601684.3712301273, y: 2443722.9588145507 },
      ],
      doorMarkerPoint: [],
      tempObj: {},
      equipTempObj: {},
      cirCleDis: null, //绘制圆时的最后半径
      circleCenter: null, //圆心
      equipType: null, //当前图层显示什么设备
      rings: null, //长方形坐标
      videoPopup: {},
      doorPopup: {},
    };
  },
  created() {
    this.getVideoList();
    this.getDoorList();
    console.log(wgs84_To_epsg4545(108.678074, 21.76693));
  },
  async mounted() {
    const map = new Map();
    const { usePopup, useDraw } = map;
    const { data } = await axios({
      method: "get",
      url: "/arcgis/tokens/?request=getToken&username=szbuser&password=szb1234",
    });
    const spatialReference = map.useSpatialReference({
      wkid: 4545,
    });
    const tileLayerOption = {
      url: "/arcgis/rest/services/QZGPQ/DZDT_CS/MapServer",
      minScale: 3000000,
      apiKey: data,
      spatialReference,
    };
    const vectorMap = map.useTileLayer(tileLayerOption);

    this.baseMap = map.useMap();
    this.baseMap.add(vectorMap, 0);

    this.viewer = map.useMapView({
      map: this.baseMap,
      center: [108.675703, 21.772139],
      container: "viewDiv",
      zoom: 3,
      locale: "zh-cn", //设置地图语言类型
    });

    // 初始化绘制工具
    this.draw = useDraw(this.viewer);

    //清除放大工具
    this.viewer.ui.remove("zoom");
    this.viewer.ui.remove("attribution");
    // 监听
    this.viewer.on("click", (e) => {
      var screenPoint = {
        x: e.x,
        y: e.y,
      };
      // hitTest根据点判断当前是否有图片
      this.viewer.hitTest(screenPoint).then((response) => {
        var result = response.results[0];
        if (result) {
          //
        } else {
          this.viewer.popup.close();
        }
      });
    });
    // 监听鼠标移动时间
    this.viewer.on("pointer-move", (e) => {
      var screenPoint = {
        x: e.x,
        y: e.y,
      };
      // hitTest根据点判断当前是否有图片
      this.viewer.hitTest(screenPoint).then(async (response) => {
        var result = response.results[0];
        let content = null;
        if (result) {
          try {
            console.log(result.graphic.attributes);
            const data = result.graphic.attributes;
            if (data.type == "video") {
              const { data: videoData } = await getVideoByCode(data.cameraCode);
              if (videoData.length > 0) {
                this.videoPopup = {
                  title: data.cameraName,
                  videoUrl: videoData[0].listStream[0],
                };
              }
              content = this.$refs.videoPopup && this.$refs.videoPopup.$el;
            } else if (data.type == "door") {
              content = this.$refs.doorPopup && this.$refs.doorPopup.$el;
            }
            this.$nextTick(() => {
              usePopup(this.viewer, {
                location: result.graphic.geometry,
                content,
              });
            });
          } catch (e) {
            console.log(e);
          }
        } else {
          if (Map.getMapCursor(this.viewer) != "default") {
            Map.setMapCursor(this.viewer, "default");
          }
        }
      });
    });
  },
  methods: {
    // 获取设备列表
    getVideoList(query = {}, type) {
      getEdgevacDeviceList(query).then((res) => {
        this.markerPoint = res.data
          .filter((item) => item.latitude && item.longitude)
          .map((item) => {
            const arr = wgs84_To_epsg4545(item.longitude, item.latitude);
            return {
              x: arr[0],
              y: arr[1],
              ...item,
              type: "video",
            };
          });
        if (type == "draw" && this.markerPoint.length > 0) {
          this.doVideoMarker();
        }
      });
    },
    //获取门禁设备
    getDoorList(query = {}, type) {
      getEdgePacDeviceList(query).then((res) => {
        this.doorMarkerPoint = res.data
          .filter((item) => item.latitude && item.longitude)
          .map((item) => {
            return {
              x: item.longitude,
              y: item.latitude,
              ...item,
              type: "door",
            };
          });
        if (type == "draw" && this.doorMarkerPoint.length > 0) {
          this.doDoorMarker();
        }
      });
    },
    //根据绘制区域获取门禁设备
    getDoorListByDraw(type) {
      let query = {};
      if (type == "circle") {
        query = {
          coordList: [
            {
              longitude: this.circleCenter.x,
              latitude: this.circleCenter.y,
            },
          ],
          radius: this.cirCleDis,
          species: 0,
        };
      } else if (type == "rectangle" || type == "polygon") {
        console.log(this.rings);
        query = {
          coordList: this.rings.map((item) => {
            return {
              longitude: item[0],
              latitude: item[1],
            };
          }),
          species: 1,
        };
      }
      this.getDoorList(query, "draw");
    },
    //根据绘制区域获取门禁设备
    getVideoListByDraw(type) {
      let query = {};
      if (type == "circle") {
        const xy = epsg4545_To_wgs84(this.circleCenter.x, this.circleCenter.y);
        query = {
          coordList: [
            {
              longitude: xy[0],
              latitude: xy[1],
            },
          ],
          radius: this.cirCleDis,
          species: 0,
        };
      } else if (type == "rectangle" || type == "polygon") {
        query = {
          coordList: this.rings.map((item) => {
            const xy = epsg4545_To_wgs84(item[0], item[1]);
            return {
              longitude: xy[0],
              latitude: xy[1],
            };
          }),
          species: 1,
        };
      }
      this.getVideoList(query, "draw");
    },
    // 工具栏
    toolBarClick(type) {
      if (type === "Clear") {
        this.activeWidget && this.activeWidget.destroy();
        this.clean();
        return;
      }
      if (type == "Distance") {
        return this.setDistance();
      }
      Map.setMapCursor(this.viewer, "crosshair");
      var tool = type.toLowerCase();
      let action = this.draw.create(tool, { mode: "click" });
      action.on("vertex-add", (evt) => {
        console.log(evt);
        this.drawByType(tool, evt.vertices);
      });
      action.on("cursor-update", (evt) => {
        this.drawByType(tool, evt.vertices);
      });
      action.on("draw-complete", (evt) => {
        this.drawByType(tool, evt.vertices);

        if (this.equipType == "door") {
          this.getDoorListByDraw(tool);
        } else if (this.equipType == "video") {
          this.getVideoListByDraw(tool);
        }
        Map.setMapCursor(this.viewer, "default");
      });
      action.on("vertex-remove", (evt) => {
        this.drawByType(tool, evt.vertices);
      });
    },
    drawByType(type, vertices) {
      switch (type) {
        case "polyline":
          this.measureLine(vertices);
          break;
        case "polygon":
          this.measurePolygon(vertices);
          break;
        case "circle":
          this.measureCircle(vertices);
          break;
        case "rectangle":
          this.measureRectangle(vertices);
          break;
      }
    },
    //测距
    setDistance() {
      // 实例化测距工具
      this.activeWidget = Map.createDistanceMeasurement2D(this.viewer);
      this.activeWidget.viewModel.start();
    },
    // 绘制线
    measureLine(vertices) {
      this.clean();
      let line = this.createLine(vertices);
      let graphic = Map.createGraphic({
        geometry: line,
        symbol: {
          type: "simple-line", // autocasts as new SimpleFillSymbol
          color: [4, 90, 141],
          width: 4,
          cap: "round",
          join: "round",
        },
      });
      this.tempObj.polyline = graphic;
      this.viewer.graphics.add(graphic);
    },
    //绘制面
    measurePolygon(vertices) {
      this.clean();
      this.rings = vertices;
      let polygon = this.createPolygon(vertices);
      let graphic = Map.createGraphic({
        geometry: polygon,
        symbol: {
          type: "simple-fill", // autocasts as new SimpleFillSymbol()
          color: [51, 51, 204, 0.9],
          style: "solid",
          outline: {
            // autocasts as new SimpleLineSymbol()
            color: "red",
            width: 1,
          },
        },
      });
      this.tempObj.polygon = graphic;
      this.viewer.graphics.add(graphic);
    },
    //绘制圆形
    measureCircle(vertices) {
      this.clean();
      if (vertices.length < 2) {
        return;
      }
      this.circleCenter = Map.createPoint({
        hasZ: false,
        hasM: false,
        x: vertices[0][0],
        y: vertices[0][1],
        spatialReference: this.viewer.spatialReference,
      });
      this.cirCleDis = this.circleCenter.distance(
        Map.createPoint({
          hasZ: false,
          hasM: false,
          x: vertices[1][0],
          y: vertices[1][1],
          spatialReference: this.viewer.spatialReference,
        }),
      );
      let graphic = Map.createGraphic({
        geometry: Map.createCircle({
          hasZ: false,
          hasM: false,
          center: this.circleCenter,
          radius: this.cirCleDis,
          spatialReference: this.viewer.spatialReference,
        }),
        symbol: {
          type: "simple-fill", // autocasts as new SimpleFillSymbol()
          color: [51, 51, 204, 0.9],
          style: "solid",
          outline: {
            // autocasts as new SimpleLineSymbol()
            color: "white",
            width: 1,
          },
        },
      });
      this.tempObj.circle = graphic;
      this.viewer.graphics.add(graphic);
    },
    //绘制长方形
    measureRectangle(vertices) {
      this.clean();
      if (vertices.length < 2) {
        return;
      }
      this.rings = [
        vertices[0],
        [vertices[0][0], vertices[1][1]],
        vertices[1],
        [vertices[1][0], vertices[0][1]],
      ];
      let polygon = this.createPolygon(this.rings);
      let graphic = Map.createGraphic({
        geometry: polygon,
        symbol: {
          type: "simple-fill", // autocasts as new SimpleFillSymbol()
          color: [51, 51, 204, 0.9],
          style: "solid",
          outline: {
            // autocasts as new SimpleLineSymbol()
            color: "white",
            width: 1,
          },
        },
      });
      this.tempObj.rectangle = graphic;
      this.viewer.graphics.add(graphic);
    },
    //创建线
    createLine(vertices) {
      let polyline = {
        type: "polyline", // autocasts as new Polyline()
        paths: vertices,
        spatialReference: this.viewer.spatialReference,
      };
      return polyline;
    },
    //创建面
    createPolygon(vertices) {
      let polygon = {
        type: "polygon", // autocasts as new Polygon()
        hasZ: false,
        hasM: false,
        rings: [vertices],
        spatialReference: this.viewer.spatialReference,
      };
      return polygon;
    },
    //创建圆
    createCircle(center, dis) {
      let circle = {
        type: "circle",
        hasZ: false,
        hasM: false,
        center: center,
        radius: dis,
        spatialReference: this.viewer.spatialReference,
      };
      return circle;
    },
    //清除toolbar绘制的内容
    clean() {
      const keyArr = Object.keys(this.tempObj);
      if (keyArr.length > 0) {
        keyArr.forEach((key) => {
          this.viewer.graphics.remove(this.tempObj[key]);
        });
      }
      this.tempObj = {};
    },
    //设备操作
    equipItemClick(item) {
      console.log(item);
      if (this.equipType == item.type) {
        this.equipType = null;
        this.$refs.equipList.setIndex(null);
        return this.viewer.graphics.removeAll();
      }
      this.equipType = item.type;
      if (item.type == "video") {
        this.doVideoMarker();
      } else if (item.type == "door") {
        this.doDoorMarker();
      }
    },
    //根据已有数据绘制摄像头marker
    doVideoMarker() {
      this.viewer.graphics.removeAll();
      this.$refs.toolbar.setIndex(null);
      this.markerPoint.forEach((device) => {
        this.createPictureMarker(device.x, device.y, videoActive, device);
      });
    },
    //根据已有数据绘制门禁marker
    doDoorMarker() {
      this.viewer.graphics.removeAll();
      this.$refs.toolbar.setIndex(null);
      this.doorMarkerPoint.forEach((device) => {
        this.createPictureMarker(device.x, device.y, doorActive, device);
      });
    },
    //创建marker
    createPictureMarker(x, y, picture, device) {
      const symbol = this.createPictureMarkerSymbol(picture);
      const point = Map.createPoint({
        x,
        y,
        spatialReference: this.viewer.spatialReference,
      });
      let graphic = Map.createGraphic({
        geometry: point,
        symbol: symbol,
        attributes: device,
      });
      this.viewer.graphics.add(graphic);
    },
    createPictureMarkerSymbol(picture) {
      let symbol = {
        type: "picture-marker", // autocasts as new PictureMarkerSymbol()
        url: picture,
        width: "22px",
        height: "22px",
      };
      return symbol;
    },
  },
};
</script>

<style>
.map {
  height: 100%;
}

#viewDiv {
  width: 100%;
  height: calc(100% - 60px);
}

.esri-popup__header,
.esri-popup__footer,
.esri-popup__button.esri-popup__button--dock {
  display: none !important;
}

.esri-view .esri-view-surface--inset-outline:focus::after {
  outline: 0 !important;
}

/* popup的阴影 */
.esri-popup--shadow {
  box-shadow: none !important;
}

/* popup的背景色 */
.esri-popup__main-container {
  background-color: #fff !important;
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
  border-radius: 5px;
  width: auto !important;
}

.esri-popup__pointer-direction {
  width: 10px !important;
  height: 10px !important;
  background-color: #fff !important;
}

.esri-popup__content {
  margin: 0px !important;
}
</style>
