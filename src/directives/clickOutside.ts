import type { Directive, App } from 'vue';

const clickOutside: Directive = {
  mounted(el, binding) {
    function handleOutside(e) {
      if (el.contains(e.target)) {
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
  }
};

export function setupClickOutsideDirective(app: App) {
  app.directive('clickOutside', clickOutside);
}

export default clickOutside;
