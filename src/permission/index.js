import { hasPermi, hasListPermi } from "./hasPermi";

const install = function (Vue) {
  Vue.directive("hasPermi", hasPermi);
  Vue.directive("hasListPermi", hasListPermi);
};

if (window.Vue) {
  window["hasPermi"] = hasPermi;
  window["hasListPermi"] = hasPermi;
  Vue.use(install); // eslint-disable-line
}

export default install;
