<template>
  <div :class="prefixCls">
    <div>
      <LayoutHeader />
    </div>
    <DxDrawer v-model:opened="openState" class="layout-body" position="before" template="menulist">
      <MultipleTabs />
      <DxScrollView>
        <LayoutContent />
      </DxScrollView>
      <template #menulist>
        <LayoutMenu />
      </template>
    </DxDrawer>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, ref } from 'vue';
  import LayoutContent from './default/content/index.vue';
  import LayoutHeader from './default/header/index.vue';
  import LayoutMenu from './default/menu/index.vue';
  import MultipleTabs from './default/tabs/index.vue';

  import DxDrawer from 'devextreme-vue/drawer';
  import DxScrollView from 'devextreme-vue/scroll-view';
  import { useViewStore } from '/@/store/modules/view';
  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    name: 'Layout',
    components: {
      LayoutContent,
      LayoutHeader,
      LayoutMenu,
      MultipleTabs,
      DxDrawer,
      DxScrollView,
    },
    setup() {
      const viewStore = useViewStore();
      const prefixCls = useDesign('layout');
      const viewState = computed(() => viewStore.getViewList);
      const openState = ref(true);

      return {
        viewState,
        openState,
        prefixCls,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-layout';

  .@{prefix-cls} {
    flex-direction: column;
    display: flex;
    width: 100%;
    height: 100%;
  }

  .layout-body {
    flex: 1;
    min-height: 0;
  }
</style>
