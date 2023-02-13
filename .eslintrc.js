// ESlint 检查配置
module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ['plugin:vue/recommended', 'eslint:recommended', "plugin:prettier/recommended", "prettier",],

  // add your custom rules here
  //it is base on https://github.com/vuejs/eslint-config-vue
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",

    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
        trailingComma: "all",
        arrowParens: "always",
      },
    ],
    "comma-dangle": ["off", "always-multiline"],
    "vue/require-default-prop": [
      "off",
      {
        required: false,
        "non-required": false,
      },
    ],
    "vue/max-attributes-per-line": [2, {
      "singleline": 10,
      "multiline": {
        "max": 1,
        "allowFirstLine": false
      }
    }],
    "vue/singleline-html-element-content-newline": "off",
    "vue/multiline-html-element-content-newline":"off",
    "vue/html-self-closing":"off",
    "vue/name-property-casing": ["error", "kebab-case"],  // vue组件name可以使用驼峰/横杠命名
    "vue/html-indent":"off",
  },
}