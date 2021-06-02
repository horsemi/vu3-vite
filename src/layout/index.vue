<template>
  <div class="side-nav-outer-toolbar">
    <div>
      <layout-header />
    </div>
    <DxDrawer v-model:opened="openState" class="layout-body" position="before" template="menulist">
      <DxScrollView ref="scrollViewRef" class="with-footer">
        <div>
          <router-link
            v-for="(item, index) in viewState"
            :key="index"
            :to="item.fullPath"
            style="margin: 5px"
            >{{ item.name }}</router-link
          >
        </div>
        <LayoutContent />
      </DxScrollView>
      <template #menulist>
        <LayoutMenu />
      </template>
    </DxDrawer>
    <!-- <div style="display: inline-block; width: 60px; vertical-align: top">
      <LayoutMenu />
    </div>
    <div style="display: inline-block; width: calc(100% - 60px); text-align: center">
      <div>
        <router-link
          v-for="(item, index) in viewState"
          :key="index"
          :to="item.fullPath"
          style="margin: 5px"
          >{{ item.name }}</router-link
        >
      </div>
      <LayoutContent />
    </div> -->
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, ref } from 'vue';
  import LayoutContent from './default/content/index.vue';
  import LayoutHeader from './default/header/index.vue';
  import LayoutMenu from './default/menu/index.vue';
  import DxDrawer from 'devextreme-vue/drawer';
  import DxScrollView from 'devextreme-vue/scroll-view';
  import { useViewStore } from '/@/store/modules/view';

  export default defineComponent({
    name: 'Layout',
    components: { LayoutContent, LayoutHeader, LayoutMenu, DxDrawer, DxScrollView },
    setup() {
      const viewStore = useViewStore();
      const viewState = computed(() => viewStore.getViewList);
      const openState = ref(true);

      return {
        viewState,
        openState,
      };
    },
  });
</script>

<style lang="less" scoped>
  .side-nav-outer-toolbar {
    flex-direction: column;
    display: flex;
    width: 100%;
    height: 100%;
  }

  .tab {
    margin-right: 5px;
  }
  .layout-body {
    flex: 1;
    min-height: 0;
  }
</style>
