import { wgs84_To_epsg4545 } from "../../data/utils";
import Graphic from "@arcgis/core/Graphic";

function Marker(center, view) {
  view.when(() => {
    // 标点跳转
    view.goTo({
      center,
      zoom: 2,
    });
    let sign = wgs84_To_epsg4545(+center[0], +center[1]);
    // 回显标记
    let pointGraphic = new Graphic({
      geometry: {
        type: "point",
        spatialReference: view.spatialReference,
        x: sign[0],
        y: sign[1],
      },
      symbol: {
        type: "picture-marker",
        url: require("../../img/cursor_mark.png"),
        width: "24px",
        height: "36px",
      },
    });
    view.graphics.add(pointGraphic);
  });
}

export { Marker };
