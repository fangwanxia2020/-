/**
 * 操作权限处理
 */

import store from "@/store";
export const hasPermi = {
  inserted(el, binding, vnode) {
    const { value } = binding;
    const all_permission = "*:*:*";
    const permissions = store.getters && store.getters.permissions;

    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value;
      //遍历权限列表是否有相应的权限
      const hasPermissions = permissions.some((permission) => {
        return (
          all_permission === permission || permissionFlag.includes(permission)
        );
      });

      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error(`请设置操作权限标签值`);
    }
  },
};

export const hasListPermi = {
  inserted(el, binding, vnode) {
    const { value } = binding;
    const all_permission = "*:*:*";
    const permissions = store.getters && store.getters.permissions;
    const { permiFlag, column = "columns" } = value || {};
    const hasPermissions = permissions.some((permission) => {
      return all_permission === permission;
    });
    if (hasPermissions) {
      return;
    } //拥有全部权限
    if (permiFlag && column) {
      const tableColumns = vnode.context.$data.columns;
      const listPermi = permissions
        .filter((item) => {
          if (item.indexOf(permiFlag) == 0) {
            const arr = item.split(permiFlag);
            return arr[1];
          } else {
            return false;
          }
        })
        .map((item) => item.split(permiFlag + ":")[1]);
      const newColumns = tableColumns.filter((col) => {
        let show = false;
        if (listPermi.indexOf(col.prop) >= 0) {
          show = true;
        }
        return show;
      });
      //console.log(listPermi,'---listPermi',newColumns);
      vnode.context.$data[column] = newColumns;
    } else {
      throw new Error(`请设置操作权限标签值`);
    }

    //console.log('hasListPermi----',value,vnode.context.$data);
  },
};
