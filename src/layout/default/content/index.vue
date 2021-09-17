<template>
  <!-- <div id="layout_content" v-loading="getPageLoading" :class="prefixCls">  -->
  <div id="layout_content" :class="prefixCls">
    <PageLayout />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';
  import PageLayout from './page.vue';

  export default defineComponent({
    name: 'LayoutContent',
    components: {
      PageLayout,
    },
    setup() {
      const { prefixCls } = useDesign('layout-content');
      return {
        prefixCls,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-layout-content';

  .@{prefix-cls} {
    position: relative;
    flex: 1;
    height: 100%;

    &-loading {
      position: absolute;
      top: 200px;
      // z-index: @page-loading-z-index;
    }
  }
</style>
