<template>
  <div :class="prefixCls">
    <div>
      <LayoutHeader />
    </div>
    <DxDrawer
      v-model:opened="openState"
      opened-state-mode="shrink"
      reveal-mode="expand"
      position="before"
      template="menulist"
      :max-size="menuSize.max"
      :min-size="menuSize.min"
    >
      <div :class="`${prefixCls}__body`">
        <div :class="`${prefixCls}__menubtn`">
          <div :class="`${prefixCls}__icon__box`" @click="toggleMenu">
            <SvgIcon
              v-if="openState"
              name="sidebar-arrow"
              size="15"
              :class="`${prefixCls}__icon`"
            />
            <SvgIcon
              v-else
              name="sidebar-arrow"
              :class="[`${prefixCls}__icon`, `${prefixCls}__icon__down`]"
            />
          </div>
        </div>
        <div :class="`${prefixCls}__body__content`">
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
        min: 54,
      };
      const viewStore = useViewStore();
      const { prefixCls } = useDesign('layout');
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
        menuSize,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-layout';

  .@{prefix-cls} {
    flex: 1;

    &__body {
      display: flex;
    }

    &__menubtn {
      display: flex;
      align-items: center;
      width: 20px;
      height: calc(100vh - 56px);
      background: @background-color-primary;
    }

    &__icon__box {
      width: 12px;
      height: 80px;
      line-height: 80px;
      cursor: pointer;
      background: #fff;
      border-radius: 0 20px 20px 0;
    }

    &__icon {
      position: relative;
      left: -3px;
      margin: 0;
      vertical-align: middle;
      &__down {
        transform: rotate(180deg);
        transition: transform 0.2s;
      }
    }

    &__body__content {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: calc(100vh - 56px);
      padding-right: 20px;
      padding-bottom: 20px;
      overflow: hidden;
      background-color: @background-color-primary;
    }
  }

  .dx-scrollable-simulated .dx-scrollable-content {
    display: flex;
    flex-direction: column;
  }
  .dx-scrollview-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>
