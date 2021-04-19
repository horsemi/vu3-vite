import { createVNode, h, reactive, ref, render, toRefs, Transition, VNode, vShow, withCtx, withDirectives } from 'vue';
import { removeClass } from '/@/utils/dom';
import type { ILoadingCreateComponentParams, ILoadingInstance } from './loading.type';

export function createLoadingComponent({
  options,
  globalLoadingOption,
}: ILoadingCreateComponentParams): ILoadingInstance {
  let vm: Nullable<VNode> = null;
  let afterLeaveTimer: Nullable<number> = null;

  const afterLeaveFlag = ref(false);
  const data = reactive({
    ...options,
    originalPosition: '',
    originalOverflow: '',
    visible: false,
  });

  function setText(text: string) {
    data.text = text;
  };

  function destroySelf() {
    const target = data.parent;
    if (!target) {
        return;
    }
    if (!target.vLoadingAddClassList) {
      let loadingNumber: number | string | null = target.getAttribute('loading-number');

      loadingNumber = Number.parseInt(loadingNumber as string, 10) - 1;
      if (!loadingNumber) {
        removeClass(target, 'v-loading-parent--relative');
        target.removeAttribute('loading-number');
      } else {
        target.setAttribute('loading-number', loadingNumber.toString());
      }
      removeClass(target, 'v-loading-parent--hidden');
    }
    if (vm && vm.el && vm.el.parentNode) {
      vm.el.parentNode.removeChild(vm.el);
    }
  }

  function close() {
    const target = data.parent;
    if (!target) {
        return;
    }
    target.vLoadingAddClassList = undefined;
    if (data.fullscreen) {
      globalLoadingOption.fullscreenLoading = undefined;
    }
    afterLeaveFlag.value = true;
    if (afterLeaveTimer) {
      clearTimeout(afterLeaveTimer);
    }
    
    afterLeaveTimer = window.setTimeout(() => {
      if (afterLeaveFlag.value) {
        afterLeaveFlag.value = false;
        destroySelf();
      }
    }, 400)
    data.visible = false;
  }

  function handleAfterLeave() {
    if (!afterLeaveFlag.value) return;
    afterLeaveFlag.value = false;
    destroySelf();
  }

  const componentSetupConfig = {
    ...toRefs(data),
    setText,
    close,
    handleAfterLeave,
  };

  const elLoadingComponent = {
    name: 'Loading',
    setup() {
      return componentSetupConfig
    },
    render(): VNode {
      const spinner = h('svg', {
        class: 'circular',
        viewBox: '25 25 50 50',
      }, [
        h('circle', { class: 'path', cx: '50', cy: '50', r: '20', fill: 'none' }),
      ])

      const noSpinner = h('i', { class: data.spinner });
      const spinnerText = h('p', { class: 'v-loading-text' }, [data.text]);

      return h(Transition, {
        name: 'v-loading-fade',
        onAfterLeave: handleAfterLeave,
      }, {
        default: withCtx(() => [withDirectives(createVNode('div', {
          style: {
            backgroundColor: data.background || '',
          },
          class: [
            'v-loading-mask',
            data.customClass,
            data.fullscreen ? 'is-fullscreen' : '',
          ],
        }, [
          h('div', {
            class: 'v-loading-spinner',
          }, [
            !data.spinner ? spinner : noSpinner,
            data.text ? spinnerText : null,
          ]),
        ]),
        [[vShow, data.visible]])]),
      })
    },
  };

  vm = createVNode(elLoadingComponent);

  render(vm, document.createElement('div'));

  return {
    ...componentSetupConfig,
    vm,
    get $el() {
      return vm?.el as HTMLElement
    },
  } as ILoadingInstance
}
