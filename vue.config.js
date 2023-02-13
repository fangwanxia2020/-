const { name, version } = require("./package.json");
const path = require("path");
//时间戳
const Timestamp = new Date().getTime();
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  lintOnSave: process.env.NODE_ENV === "development",
  devServer: {
    host: "0.0.0.0",
    // port: 8899, // 和主应用监听的端口一致
    open: true, // 浏览器自动打开页面
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    proxy: {
      "/apigateway": {
        target: "http://192.168.0.114",
      },
      "/arcgis": {
        target: "http://171.110.98.196:8800",
      },
    },
  },
  configureWebpack: (config) => {
    config.output = Object.assign({}, config.output, {
      library: `${name}-[name]`,
      libraryTarget: "umd", // 把微应用打包成 umd 库格式
      jsonpFunction: `webpackJsonp_${name}`,
      // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
      filename: `js/[name].${version}.${Timestamp}.js`,
      chunkFilename: `js/[name].${version}.${Timestamp}.js`,
    });
  },
  chainWebpack(config) {
    // 命名
    config.resolve.alias.set("@", resolve("src"));
    config.resolve.alias.set("vue$", "vue/dist/vue.esm.js");
    config.plugins.delete("preload"); // TODO: need test
    config.plugins.delete("prefetch"); // TODO: need test
    // set preserveWhitespace
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap((options) => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();
    config.when(process.env.NODE_ENV === "development", (config) =>
      config.devtool("cheap-source-map"),
    );
    config.when(process.env.NODE_ENV !== "development", (config) => {
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/,
          },
        ])
        .end();
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs", // 打包后的文件名
            test: /[\\/]node_modules[\\/]/, // 匹配对应文件
            priority: 10, // 优先级配置，优先匹配优先级更高的规则，不设置的规则优先级默认为0
            chunks: "initial", // 打包规则
          },
          elementUI: {
            name: "chunk-elementUI",
            priority: 31,
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
          },
          tyPc: {
            name: "chunk-tyPc",
            priority: 25,
            test: /[\\/]node_modules[\\/]_?ty-pc(.*)/,
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      });
    });
  },
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "~@/assets/styles/variable.scss";
        `,
      },
    },
  },
};
