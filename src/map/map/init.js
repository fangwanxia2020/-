import config from "./config"; // 配置项
import { epsg4545_To_wgs84 } from "../data/utils";
import axios from "axios";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import TileLayer from "@arcgis/core/layers/TileLayer";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import Draw from "@arcgis/core/views/draw/Draw";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
// import * as identify from "@arcgis/core/rest/identify";
// import IdentifyParameters from "@arcgis/core/rest/support/IdentifyParameters";
// import { Message } from "element-ui";
import store from "../../store";

function ArcGIS() {
  this.map = null; // 地图
  this.view = null; // 地图底图
  this.heatmap = null;
  this.measurement = null; //测量
  this.sketch = null; //测量
}

ArcGIS.prototype.init = function init(id, center, shouldClick) {
  return axios({
    method: "get",
    url: config.getApiKeyUrl,
  })
    .then((resp) => {
      const { data } = resp;
      if (data) {
        const spatialReference = new SpatialReference({
          wkid: 4545,
        });
        this.baseMap = {
          //矢量地图
          vectorMap: new TileLayer({
            url: config.TileLayerUrl,
            minScale: 3000000,
            apiKey: data,
            spatialReference,
          }),
          //影像地图
          rasterMap: new TileLayer({
            url: config.rasterMapUrl,
            minScale: 3000000,
            apiKey: data,
            spatialReference,
          }),
          type: 1, // 1 为矢量 | 2：影像
        };
        this.map = new Map({});
        this.map.add(this.baseMap.vectorMap, 0); // 0 表示图层的级别 0在最下面
        // 创建地图视图
        this.view = new MapView({
          map: this.map,
          center: center,
          container: id,
          zoom: 3,
          locale: "zh-cn", //设置地图语言类型
        });
        //鼠标单击获取转换后的坐标
        if (shouldClick) {
          this.view.on("click", (e) => {
            this.view.graphics.removeAll();
            store.commit("map/SET_SCREENSHOT", "");
            this.map.remove(this.GraphicsLayer);
            this.GraphicsLayer = new GraphicsLayer();
            this.map.add(this.GraphicsLayer);
            let point = {
              type: "point",
              spatialReference: this.view.spatialReference,
              x: e.mapPoint.x,
              y: e.mapPoint.y,
            };
            let pointdata = epsg4545_To_wgs84(point.x, point.y);
            // let pointdata = [point.x, point.y];
            store.commit("map/SET_CENTER", [
              pointdata[0].toFixed(7),
              pointdata[1].toFixed(7),
            ]);
            let symbol = {
              type: "picture-marker",
              url: require("../img/cursor_mark.png"),
              width: "24px",
              height: "36px",
            };
            let pointGraphic = new Graphic({
              geometry: point,
              symbol: symbol,
            });
            this.GraphicsLayer.add(pointGraphic);
            // this.view.goTo(pointGraphic);
            // 截图
            setTimeout(() => {
              this.view.takeScreenshot().then(function (screenshot) {
                let imageElement = document.getElementById(id);
                imageElement.src = screenshot.dataUrl;
                store.commit("map/SET_SCREENSHOT", imageElement.src);
              });
            }, 500);
          });
        }
        this.GraphicsLayer = GraphicsLayer;
        this.Graphic = Graphic;

        // this.Draw = Draw
        this.view.when(() => {
          this.Draw = new Draw({
            view: this.view,
          });
        });
        this.view.ui._removeComponents(["zoom"]);

        return {
          view: this.view,
          map: this.map,
        };
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export default ArcGIS;
