<template>
  <div v-loading="getPageLoading" :class="prefixCls">
    <PageLayout />
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';
  import PageLayout from './page.vue';
  import { useAppStore } from '/@/store/modules/app';

  export default defineComponent({
    name: 'LayoutContent',
    components: { PageLayout },
    setup() {
      const appStore = useAppStore();
      const getPageLoading = computed(() => appStore.getPageLoading);
      const { prefixCls } = useDesign('layout-content');
      return {
        getPageLoading,
        prefixCls,
      };
    },
  });
</script>
<style lang="less">
  @import 'src/styles/config.less';
  @prefix-cls: ~'@{namespace}-layout-content';

  .@{prefix-cls} {
    position: relative;
    flex: 1 1 auto;
    min-height: 0;

    &.fixed {
      width: 1200px;
      margin: 0 auto;
    }

    &-loading {
      position: absolute;
      top: 200px;
      z-index: @page-loading-z-index;
    }
  }
</style>
