import type { Directive, App } from 'vue';
import { usePermissionStore } from '/@/store/modules/permission';

const permission: Directive = {
  mounted(el, binding) {
    const permissionStore = usePermissionStore();
    const { value } = binding;
    if (value && value instanceof Array && value.length > 0) {
      const permissionList = permissionStore.getPermCodeList;
      const hasPermission = permissionList.some((item) => {
        return value.includes(item);
      });
      if (!hasPermission) {
        el.remove();
      }
    } else {
      throw new Error("参数错误, 例子: v-permission=\"['admin','editor']\"");
    }
  },
};
export function setupPermissionDirective(app: App) {
  app.directive('permission', permission);
}

export default permission;
