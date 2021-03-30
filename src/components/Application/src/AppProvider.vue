<script lang="ts">
import { defineComponent, ref } from 'vue';
import { createBreakpointListen } from '/@/hooks/event/useBreakpoint';
import { createAppProviderContext } from './useAppContext';

export default defineComponent({
  name: 'AppProvider',
  inheritAttrs: false,
  setup(props, { slots }) {
    const isMobile = ref(false);
    const isSetState = ref(false);

    createBreakpointListen(({ screenMap, sizeEnum, width }) => {
      const lgWidth = screenMap.get(sizeEnum.LG);
      if (lgWidth) {
        isMobile.value = width.value -1 < lgWidth;
      }
    });

    createAppProviderContext({ isMobile });
    return () => slots.default?.();
  },
})
</script>
