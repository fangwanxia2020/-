import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import TileLayer from "@arcgis/core/layers/TileLayer";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import Draw from "@arcgis/core/views/draw/Draw";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import FeatureLayer from "@arcgis/core/layers/GraphicsLayer";
import Search from "@arcgis/core/widgets/Search";
import Point from "@arcgis/core/geometry/Point";
import Circle from "@arcgis/core/geometry/Circle";
import DistanceMeasurement2D from "@arcgis/core/widgets/DistanceMeasurement2D";

class InitMap {
  viewer = null;
  //地图
  useMap(options) {
    return new Map(options);
  }
  //图层
  useTileLayer(options) {
    return new TileLayer(options);
  }
  //视图层
  useMapView(options) {
    this.viewer = new MapView(options);
    return this.viewer;
  }
  useSpatialReference(options) {
    return new SpatialReference(options);
  }
  useFeatureLayer(options) {
    return new FeatureLayer(options);
  }
  //搜索框
  useSearch(options) {
    return new Search(options);
  }
  //popup弹窗
  usePopup(viewer, options) {
    viewer.popup.open(options);
  }
  useDraw(viewer) {
    return new Draw({
      view: viewer,
    });
  }
  static createGraphic(options) {
    return new Graphic(options);
  }
  static createPoint(options) {
    return new Point(options);
  }
  static createCircle(options) {
    return new Circle(options);
  }
  static createDistanceMeasurement2D(viewer) {
    return new DistanceMeasurement2D({
      view: viewer,
    });
  }
  static getMapCursor(viewer) {
    viewer.container
      .querySelector(".esri-view-root > .esri-view-surface")
      .getAttribute("data-cursor");
  }
  static setMapCursor(viewer, type) {
    viewer.container
      .querySelector(".esri-view-root > .esri-view-surface")
      .setAttribute("data-cursor", type);
  }
}
export default InitMap;
