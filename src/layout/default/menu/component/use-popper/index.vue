<script lang="ts">
  import { cloneVNode, ComponentPublicInstance, Fragment, Teleport } from 'vue';

  import { defineComponent, ref, unref, h, onMounted, onUnmounted, watch } from 'vue';
  import { createPopper, Instance } from '@popperjs/core';

  import renderPopper from '../renderers/popper';

  export default defineComponent({
    name: 'Popper',
    props: {
      isShowPopper: {
        type: Boolean,
        default: false,
      },
    },
    emits: [],
    setup(props, ctx) {
      let popperInstance: Instance | null = null;
      const triggerRef = ref<ComponentPublicInstance | HTMLElement | null>(null);
      const popperRef = ref<HTMLElement | null>(null);

      if (!ctx.slots.trigger) {
        console.error('Trigger must be provide');
      }

      onMounted(() => {
        initializePopper();
      });

      onUnmounted(() => {
        destroyPopper();
      });

      function initializePopper() {
        if (!props.isShowPopper) {
          return;
        }

        popperInstance = createPopper(
          unref(triggerRef) as HTMLElement,
          unref(popperRef) as HTMLElement,
          {
            placement: 'right-start',
            modifiers: [
              {
                name: 'offset',
                options: {
                  // offset: [-35, 20],
                },
              },
            ],
          }
        );

        popperInstance.update();
      }

      function destroyPopper() {
        if (popperInstance || !props.isShowPopper) {
          popperInstance?.destroy?.();
          popperInstance = null;
        }
      }

      function update() {
        if (props.isShowPopper) {
          initializePopper();
        } else {
          destroyPopper();
        }
      }

      watch(
        () => props.isShowPopper,
        (value) => {
          if (value) {
            update();
          }
        }
      );

      return {
        triggerRef,
        popperRef,
        initializePopper,
        destroyPopper,
        update,
      };
    },
    render() {
      const _t = this.$slots.trigger?.();

      const trigger = cloneVNode(_t![0], {}, true);
      const _p = this.$slots.popper?.();

      const popper = renderPopper(
        {
          visibility: this.$props.isShowPopper,
        },
        [cloneVNode(_p![0], {}, true)]
      );

      return h(Fragment, null, [
        h(trigger, {
          ref: 'triggerRef',
        }),
        h(
          Teleport as any,
          {
            to: 'body',
            disabled: false,
          },
          [popper]
        ),
      ]);
    },
  });
</script>

<style lang="less">
  .menu-popper__container-animation {
    .zoom-animation(left, scale(0, 0), scale(1, 1), top left);
  }
</style>
