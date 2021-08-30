<template>
  <div v-loading="loading" :class="prefixCls" :style="getWrapStyle">
    <iframe ref="frameRef" :src="frameSrc" :class="`${prefixCls}__main`" />
  </div>
</template>
<script lang="ts">
  import type { CSSProperties } from 'vue';
  import { defineComponent, ref, unref, onMounted, nextTick, computed } from 'vue';

  import { getViewportOffset } from '/@/utils/dom';

  import { useWindowSizeFn } from '/@/hooks/event/useWindowSizeFn';

  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    name: 'IFrame',
    props: {
      frameSrc: {
        type: String,
        default: '',
      },
    },
    setup() {
      const loading = ref(false);
      // debugger
      const topRef = ref(50);
      const heightRef = ref(window.innerHeight);
      const frameRef = ref<HTMLFrameElement | null>(null);

      const { prefixCls } = useDesign('iframe-page');
      useWindowSizeFn<void>(calcHeight, 150, { immediate: true });

      const getWrapStyle = computed(
        (): CSSProperties => {
          return {
            height: `${unref(heightRef)}px`,
          };
        }
      );

      function calcHeight() {
        const iframe = unref(frameRef);
        if (!iframe) {
          return;
        }
        let top = 112;
        top += 20;
        topRef.value = top;
        heightRef.value = window.innerHeight - top;
        const clientHeight = document.documentElement.clientHeight - top;
        iframe.style.height = `${clientHeight}px`;
      }

      function hideLoading() {
        loading.value = false;
        calcHeight();
      }

      function init() {
        nextTick(() => {
          const iframe = unref(frameRef);
          if (!iframe) return;

          const _frame = iframe as any;
          if (_frame.attachEvent) {
            _frame.attachEvent('onload', () => {
              hideLoading();
            });
          } else {
            iframe.onload = () => {
              hideLoading();
            };
          }
        });
      }
      onMounted(() => {
        loading.value = true;
        init();
      });

      return {
        getWrapStyle,
        loading,
        frameRef,
        prefixCls,
      };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-iframe-page';

  .@{prefix-cls} {
    &__mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    &__main {
      width: 100%;
      // height: 100%;
      overflow: hidden;
      background-color: #fff;
      border: 0;
      box-sizing: border-box;
    }
  }
</style>
