<template>
  <div :class="prefixCls">
    <div>
      <LayoutHeader />
    </div>
    <DxDrawer
      v-model:opened="openState"
      opened-state-mode="push"
      reveal-mode="expand"
      class="layout-body"
      position="before"
      template="menulist"
      :max-size="menuSize.max"
      :min-size="menuSize.min"
    >
      <div class="layout-body-content">
        <div class="menu-button">
          <div class="menu-button-box" @click="toggleMenu">
            <svg-icon
              v-if="opened"
              name="sidebar-arrow"
              width="15px"
              height="15px"
              color="#808080"
              class="menu-button-icon"
            />
            <svg-icon
              v-else
              name="sidebar-arrow"
              dir="down"
              width="15px"
              height="15px"
              color="#808080"
              class="menu-button-icon"
            />
          </div>
        </div>
        <div class="content-wrap">
          <MultipleTabs />
          <DxScrollView>
            <LayoutContent />
          </DxScrollView>
        </div>
      </div>
      <template #menulist>
        <LayoutMenu :open-state="openState" :menu-size="menuSize" @toggle-menu="toggleMenu" />
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
    const menuSize = {
      max: 200,
      min: 54
    };
    const viewStore = useViewStore();
    const prefixCls = useDesign('layout');
    const viewState = computed(() => viewStore.getViewList);
    const openState = ref(true);
    const toggleMenu = () => {
      openState.value = !openState.value;
    };

    return {
      viewState,
      openState,
      prefixCls,
      toggleMenu,
      menuSize
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

  &__box {
    display: flex;
  }
}

.layout-body {
  flex: 1;
  min-height: 0;

  .layout-body-content {
    display: flex;

    .menu-button {
      display: flex;
      align-items: center;
      width: 20px;
      height: calc(100vh - 50px);
      background: @background-color-primary;

      .menu-button-box {
        width: 12px;
        height: 80px;
        line-height: 80px;
        cursor: pointer;
        background: #fff;
        border-radius: 0 20px 20px 0;
      }

      .menu-button-icon {
        position: relative;
        left: -3px;
        margin: 0;
        vertical-align: middle;
      }
    }

    .content-wrap {
      flex: 1;
    }
  }
}
</style>
