import type { Directive, App } from 'vue';

const clickOutside: Directive = {
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

    el.__clickOutside__ = handleOutside;
    document.addEventListener('click', handleOutside);
  },
  unmounted(el) {
    document.removeEventListener('click', el.__clickOutside__);
    delete el.__clickOutside__;
  },
};

export function setupClickOutsideDirective(app: App) {
  app.directive('clickOutside', clickOutside);
}

export default clickOutside;
