const getters = {
  sidebar: (state) => state.app.sidebar,
  token: (state) => state.user.token,
  device: (state) => state.app.device,
  avatar: (state) => state.user.avatar,
  userId: (state) => state.user.userId,
  orgId: (state) => state.user.userInfo.orgId,
  name: (state) => state.user.name,
  roles: (state) => state.user.roles,
  permission_routes: (state) => state.permission.routes,
  visitedViews: (state) => state.tagsView.visitedViews,
  cachedViews: (state) => state.tagsView.cachedViews,
  permissions: (state) => state.user.permissions,
  menuState: (state) => state.chemicalInfo.menuState,
};
export default getters;
