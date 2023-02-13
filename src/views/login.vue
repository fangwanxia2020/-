<template>
  <div v-show="showPage" class="login-container">
    <img
      src="@/assets/images/login_img/loginBg.png"
      class="bg-img"
      alt="qiyetupian"
    />
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <el-form-item prop="username" class="form-input">
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
          placeholder-style="color: #C3C3C3"
        >
          <ty-icon slot="prefix" type="username" class="login-user"></ty-icon>
        </el-input>
      </el-form-item>
      <el-form-item prop="password" class="form-input">
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          placeholder-style="color: #C3C3C3"
          @keyup.enter.native="handleLogin"
        >
          <ty-icon
            slot="prefix"
            type="password"
            class="login-password"
          ></ty-icon>
        </el-input>
        <span class="show-pwd" @click="showPwd">
          <i
            :class="[
              'anticon',
              passwordType === 'password' ? 'closeEye' : 'openEye',
            ]"
          ></i>
        </span>
      </el-form-item>
      <el-button
        :loading="loading"
        type="primary"
        style="
          width: 100%;
          margin-top: 10%;
          padding: 10px 20px;
          font-size: 18px;
        "
        @click.native.prevent="handleLogin"
      >
        登录
      </el-button>
      <div class="bottom">
        <span>密码找回</span>
        <span>|</span>
        <span>用户注册</span>
        <span>|</span>
        <span>申请试用</span>
      </div>
    </el-form>
  </div>
</template>
<script>
import { title } from "@/settings";
import { login } from "@/api/user";
export default {
  name: "login",
  data() {
    return {
      title,
      showPage: false,
      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        username: [this.rule.required("请输入用户名")],
        password: [this.rule.required("请输入密码")],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
      isAdmin: false,
      orgOptions: [],
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        if (route.path.includes("admin")) {
          this.isAdmin = true;
        }
        const roleKey = route.params.roleKey;
        console.log("444", route.params.roleKey);
        sessionStorage.setItem("roleKey", roleKey);
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    if (
      this.$route.query.token != undefined &&
      this.$route.query.token != null
    ) {
      const RsaLoginForm = {
        ...this.loginForm,
        token: this.$route.query.token,
        // password: this.$md5(this.loginForm.password)
      };
      this.$store
        .dispatch("user/login", RsaLoginForm)
        .then(() => {
          this.$router.push({
            path: "/",
          });
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    } else {
      this.showPage = true;
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.isAdmin) {
            delete this.loginForm.orgId;
          }
          const RsaLoginForm = {
            ...this.loginForm,
            grant_type: "tenant-password",
            client_id: "testclient",
            client_secret: "testclient",
            password: this.$md5(this.loginForm.password),
          };
          this.RsaLoginForm = RsaLoginForm;
          // const res = await login(RsaLoginForm);
          login(RsaLoginForm)
            .then((res) => {
              if (res.access_token && res.user_id) {
                this.$store
                  .dispatch("user/login", res)
                  .then(async () => {
                    this.$router.replace("/").catch(() => {});
                  })
                  .finally(() => {
                    this.loading = false;
                  });
              }
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
  },
};
</script>
<style lang="scss">
$bg: #fff;
$light_gray: #000;
$cursor: #000;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  position: relative;
  background-repeat: no-repeat;
  background-color: $primaryColor;
  overflow: hidden;
  box-sizing: border-box;

  .bg-img {
    position: absolute;
    margin: auto;
    top: -9999px;
    right: -9999px;
    bottom: -9999px;
    left: -9999px;
    width: 100%;
    height: 100%;
    // object-fit: contain;
  }

  .el-input {
    display: inline-block;
    height: 37px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      color: $light_gray;
      height: 37px;
      line-height: 37px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
$bg: #01367a;
$dark_gray: #889aa4;
$light_gray: #000;

.login-container {
  position: relative;

  .login-form {
    position: fixed;
    right: 300px;
    top: 29%;
    width: 20%;
    min-width: 360px;
    height: 410px;
    padding: 4% 3%;
    overflow: hidden;
    background: #fff;
    border-radius: 10px;

    .form-input {
      /deep/.el-input input {
        border-bottom: solid 1px #a0a3aa;
        font-size: 14px;
        text-indent: 32px;
      }
    }

    .login-user,
    .login-password {
      color: $primaryColor !important;
    }
    .bottom {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      color: $bg;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
