import type { Directive, App } from 'vue';

const contextMenuOutside: Directive = {
  mounted(el, binding) {
    function handleOutside(e) {
      // 处理组件库内的弹窗不在自定义组件内部的问题
      const dxOverlay = document.getElementsByClassName('dx-overlay-wrapper');

      if (el.contains(e.target) || (dxOverlay.length > 0 && dxOverlay[0].contains(e.target))) {
        return false;
      }
      if (binding.value) {
        binding.value();
      }
    }

    el.__contextmenuOutside__ = handleOutside;
    document.addEventListener('contextmenu', handleOutside);
  },
  unmounted(el) {
    document.removeEventListener('contextmenu', el.__contextmenuOutside__);
    delete el.__contextmenuOutside__;
  },
};

export function setupContextMenuOutsideDirective(app: App) {
  app.directive('contextMenuOutside', contextMenuOutside);
}

export default contextMenuOutside;
