# 微应用项目模板调整

### v0.1.1 20220517

1. 全局样式调整

   src/assets 文件夹替换当前项目test分支下最新的assets文件

   src/layout/components/Navbar.vue

   <style lang="scss" scoped>
   .navbar1 {
     box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
     background: $primaryColor-ie;
     - background: $primaryColor;
     + background: #001947;
     }
     </style>

​		src/assets/styles/variable.scss

```diff
// 主题色
$primaryColor: var(--primaryColor);
- $primaryColor-ie:#416DDD;
+ $primaryColor-ie: #026DFF;
+ $primaryColor-whp: #001947;
```

新增

src/components/IconSelect/index.vue

```
<template>
  <div class="icon-body">
    <el-input
      v-model="name"
      style="position: relative;"
      clearable
      placeholder="请输入图标名称"
      @clear="filterIcons"
      @input.native="filterIcons"
    >
      <i
        slot="suffix"
        class="el-icon-search el-input__icon"
      />
    </el-input>
    <div class="icon-list">
      <div
        v-for="(item, index) in iconList"
        :key="index"
        @click="selectedIcon(item)"
      >
        <ty-icon
          :type="item"
          :size="20"
        />
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import icons from './requireIcons'
export default {
  name: 'IconSelect',
  data() {
    return {
      name: '',
      iconList: icons
    }
  },
  methods: {
    filterIcons() {
      if (this.name) {
        this.iconList = this.iconList.filter(item => item.includes(this.name))
      }
      else {
        this.iconList = icons
      }
    },
    selectedIcon(name) {
      this.$emit('selected', name)
      document.body.click()
    },
    reset() {
      this.name = ''
      this.iconList = icons
    }
  }
}

</script>
<style
  rel="stylesheet/scss"
  lang="scss"
  scoped
>
.icon-body {
  width: 100%;
  padding: 10px;

  .icon-list {
    height: 200px;
    overflow-y: scroll;

    div {
      height: 30px;
      line-height: 30px;
      margin-bottom: -5px;
      cursor: pointer;
      width: 33%;
      float: left;
    }
    
    i {
      vertical-align: middle;
    }
    
    span {
      display: inline-block;
      vertical-align: middle;
      fill: currentColor;
      overflow: hidden;
      width: 100px;
      height: 36px;
    }
  }
}

</style>
```

新增 src/components/IconSelect/requireIcons.js

```
const icons = [
  "whp_transport",
  "whp_train",
  "whp_safe",
  "whp_qualifications",
  "whp_news",
  "whp_map",
  "whp_screen",
  "whp_chemicals",
  "whp_date",
  "whp_consignment",
  "whp_catalogue",
  "whp_bulletinboard",
  "whp_assessment",
  "skin",
  "bidding",
  "organization",
  "examine",
  "platformManage",
  "addUser",
  "acceptance",
  "view",
  "preview",
  "survey",
  "settings",
  "platformUser",
  "userManage",
  "basics",
  "item",
  "purchaser",
  "notice",
  "myProject",
  "openEye",
  "closeEye",
  "home",
  "username",
  "password",
  "hamburger",
  "skin",
  "components",
  "input",
  "text",
  "passwordInput",
  "textarea",
  "select",
  "checkbox",
  "radio",
  "image",
  "date",
  "time",
  "star",
  "number",
  "edit",
  "cascader",
  "switch",
  "color",
  "card",
  "tab",
  "grid",
  "slider",
  "standard",
  "pen",
  "structure",
  "notes",
  "code",
  "table",
  "designer",
  "form",
  "analysis",
  "logout",
  "download"]
export default icons
```

2.微应用配置问题修复

package.json

```
    - "ty-pc": "^2.4.59",
    + "ty-pc": "^2.4.81",
```

src/layout/components/AppMain.vue

```
    if (this.isInBaseSite) {
       - return this.user.cachedViews || []
       + const { childRoute } = this.user.loadedApp['这里是基座配置的目录路径']
       + const loadedRoutes = childRoute.map((item) =>
       +   this.$router.resolve(item)
       + )
       + console.log('loadedRoutes', loadedRoutes)
       + const loadedRouteNames = loadedRoutes.map((item) => item.route.name)
       + console.log('loadedRouteNames', loadedRouteNames)
       + return loadedRouteNames || []
      } else {
        return this.$store.state.tagsView.cachedViews
      }
```