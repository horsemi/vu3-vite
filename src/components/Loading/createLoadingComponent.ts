import {
  createVNode,
  h,
  reactive,
  ref,
  render,
  toRefs,
  Transition,
  VNode,
  vShow,
  withCtx,
  withDirectives,
} from 'vue';
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
  }

  function destroySelf() {
    const target = data.parent;
    if (!target) {
      return;
    }
    if (!target.vLoadingAddClassList) {
      let loadingNumber: number | string | null = target.getAttribute('loading-number');

      loadingNumber = Number.parseInt(loadingNumber as string, 10) - 1;
      if (!loadingNumber) {
        removeClass(target as HTMLElement, 'v-loading-parent--relative');
        target.removeAttribute('loading-number');
      } else {
        target.setAttribute('loading-number', loadingNumber.toString());
      }
      removeClass(target as HTMLElement, 'v-loading-parent--hidden');
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
    }, 400);
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
      return componentSetupConfig;
    },
    render(): VNode {
      const spinner = h(
        'div',
        {
          class: 'dx-loadingContainer',
        },
        [
          h(
            'div',
            {
              class: 'dx-loadindicator-content',
            },
            [
              h('div', { class: 'dx-loadindicator-icon' }, [
                h('div', {
                  class: ['dx-loadindicator-segment', 'dx-loadindicator-segment7'],
                }),
                h('div', {
                  class: ['dx-loadindicator-segment', 'dx-loadindicator-segment6'],
                }),
                h('div', {
                  class: ['dx-loadindicator-segment', 'dx-loadindicator-segment5'],
                }),
                h('div', {
                  class: ['dx-loadindicator-segment', 'dx-loadindicator-segment4'],
                }),
                h('div', {
                  class: ['dx-loadindicator-segment', 'dx-loadindicator-segment3'],
                }),
                h('div', {
                  class: ['dx-loadindicator-segment', 'dx-loadindicator-segment2'],
                }),
                h('div', {
                  class: ['dx-loadindicator-segment', 'dx-loadindicator-segment1'],
                }),
                h('div', {
                  class: ['dx-loadindicator-segment', 'dx-loadindicator-segment0'],
                }),
              ]),
            ]
          ),
        ]
      );

      const spinnerText = h('div', { class: 'dx-loadpanel-message' }, [data.text]);
      return h(
        Transition,
        {
          name: 'v-loading-fade',
          onAfterLeave: handleAfterLeave,
        },
        {
          default: withCtx(() => [
            withDirectives(
              createVNode(
                'div',
                {
                  style: {
                    backgroundColor: data.background || null,
                  },
                  class: [
                    'v-loading-mask',
                    data.customClass,
                    data.fullscreen ? 'is-fullscreen' : '',
                  ],
                },
                [
                  h(
                    'div',
                    {
                      class: 'v-loading-spinner',
                    },
                    [spinner, spinnerText]
                  ),
                ]
              ),
              [[vShow, data.visible]]
            ),
          ]),
        }
      );
    },
  };

  vm = createVNode(elLoadingComponent);

  render(vm, document.createElement('div'));

  return {
    ...componentSetupConfig,
    vm,
    get $el() {
      return vm?.el as HTMLElement;
    },
  } as ILoadingInstance;
}
