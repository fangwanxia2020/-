import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "ty-pc/lib/utils/auth";
const state = {
  userId: "",
  token: getToken(),
  name: "",
  avatar: "",
  roles: [],
  permissions: [],
  userInfo: {},
};
const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USERID: (state, id) => {
    state.userId = id;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_USER: (state, data) => {
    state.userInfo = data;
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions;
  },
};
const actions = {
  //登录
  login({ commit }, res) {
    return new Promise((resolve, reject) => {
      commit("SET_TOKEN", res.access_token);
      setToken(res.access_token);
      // commit('SET_USERID', res.user_id)
      resolve();
    });
  },
  //修改用户名
  updateUserName({ commit }, name) {
    commit("SET_NAME", name);
  },
  //获取用户信息
  getInfo({ commit }, isloginGet) {
    return new Promise((resolve, reject) => {
      getInfo({})
        .then((response) => {
          localStorage.setItem("orgId", response.data.orgId);
          localStorage.setItem("userId", response.data.userId);
          let use = response.data;
          localStorage.setItem("use", JSON.stringify(use));
          const sysuuid = response.data;
          if (!sysuuid) {
            reject("获取用户信息失败！");
          }
          if (!isloginGet) {
            commit("SET_USERID", sysuuid.userId);
          }
          commit("SET_NAME", response.data.username);
          commit("SET_USER", response.data);
          commit("SET_ROLES", sysuuid.roles);
          //TODO
          commit("SET_PERMISSIONS", response.data.permissions);
          commit("SET_TOKEN", getToken());
          resolve(sysuuid);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  //注销
  logout({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      commit("SET_TOKEN", "");
      commit("SET_USERID", "");
      commit("SET_ROLES", []);
      commit("SET_PERMISSIONS", []);
      removeToken();
      dispatch("tagsView/delAllViews", null, {
        root: true,
      });
      resolve();
      // logout(state.token).then(() => {
      //   commit('SET_TOKEN','')
      //   commit('SET_USERID','')
      //   commit('SET_ROLES',[])
      //   commit('SET_PERMISSIONS',[])
      //   removeToken()
      //   dispatch('tagsView/delAllViews',null,{
      //     root: true
      //   })
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    });
  },
  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      removeToken();
      resolve();
    });
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
