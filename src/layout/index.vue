<template>
  <div id="layout_content" :class="prefixCls">
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
  <DxLoadPanel
    v-model:visible="getPageLoading"
    :position="position"
    :show-indicator="true"
    :show-pane="true"
    :shading="true"
    message="正在加载"
    shading-color="transparent"
  />
</template>

<script lang="ts">
  import { defineComponent, computed, ref, onMounted, onUnmounted } from 'vue';

  import LayoutContent from './default/content/index.vue';
  import LayoutHeader from './default/header/index.vue';
  import LayoutMenu from './default/menu/index.vue';
  import MultipleTabs from './default/tabs/index.vue';

  import DxDrawer from 'devextreme-vue/drawer';
  import DxScrollView from 'devextreme-vue/scroll-view';
  import { DxLoadPanel } from 'devextreme-vue/load-panel';

  import { useRouter } from 'vue-router';
  import { useViewStore } from '/@/store/modules/view';
  import { useAppStore } from '/@/store/modules/app';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { initGlobalEnumData } from '/@/logics/initAppConfig';

  export default defineComponent({
    name: 'Layout',
    components: {
      LayoutContent,
      LayoutHeader,
      LayoutMenu,
      MultipleTabs,
      DxDrawer,
      DxScrollView,
      DxLoadPanel,
    },
    setup() {
      const menuSize = {
        max: 200,
        min: 54,
      };
      initGlobalEnumData();
      const viewStore = useViewStore();
      const appStore = useAppStore();
      const router = useRouter();
      const { prefixCls } = useDesign('layout');

      const viewState = computed(() => viewStore.getViewList);
      const openState = computed({
        get: () => appStore.getMenuOpenState,
        set: (value: boolean) => {
          appStore.setMenuOpenState(value);
        },
      });

      const toggleMenu = () => {
        openState.value = !openState.value;
      };
      const getPageLoading = computed(() => viewStore.getLoadingTimes > 0);

      // iframe 通讯监听方法
      function reciveMessage(e) {
        if (e.data.status === 401) {
          router.push({ path: '/login' });
        }
      }
      onMounted(() => {
        window.addEventListener('message', reciveMessage);
      });

      onUnmounted(() => {
        window.removeEventListener('message', reciveMessage);
      });

      return {
        viewState,
        openState,
        prefixCls,
        toggleMenu,
        menuSize,
        reciveMessage,
        getPageLoading,
        position: { of: '#layout_content' },
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
      width: 16px;
      height: calc(100vh - 56px);
      background: @background-color-primary;
    }

    &__icon__box {
      width: 8px;
      height: 80px;
      line-height: 80px;
      cursor: pointer;
      background: #fff;
      border-radius: 0 10px 10px 0;
    }

    &__icon {
      position: relative;
      left: -5px;
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
      padding-right: 16px;
      padding-bottom: 16px;
      overflow: hidden;
      background-color: @background-color-primary;
    }
  }
</style>
