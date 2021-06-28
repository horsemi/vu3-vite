<template>
  <div v-click-outside="handleMenuClose" :class="[prefixCls]">
    <DxScrollView show-scrollbar="onHover" direction="vertical" :width="200" :on-scroll="onScroll">
      <div
        v-for="(item, index) in menuList"
        :key="item.name"
        :class="[`${prefixCls}-item__container`, isActive(item)]"
        @click.stop="handleMenuClick(item, index)"
      >
        <div :class="`${prefixCls}-item-box`">
          <SvgIcon size="23" :name="item.meta.icon"></SvgIcon>
          <span :class="`${prefixCls}-item-title__inner`">{{ item.meta.title }}</span>
        </div>
        <transition name="zoom-in-left">
          <div
            v-show="item.meta.showSub"
            :class="`${prefixCls}-popup__container`"
            :style="{ top: getSubTop(index), left: getSubLeft() }"
          >
            <MenuPopup :menu-item-data="item.children" />
          </div>
        </transition>
      </div>
    </DxScrollView>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, unref, computed } from 'vue';
import { RouteLocationRawEx, useGo } from '/@/hooks/web/usePage';
import { useDesign } from '/@/hooks/web/useDesign';
import { usePermissionStore } from '/@/store/modules/permission';
import { useRouter } from 'vue-router';

import DxScrollView from 'devextreme-vue/scroll-view';

import MenuPopup from './component/submenu/index.vue';

export default defineComponent({
  name: 'LayoutMenu',
  components: { MenuPopup, DxScrollView },
  props: {
    openState: Boolean,
    menuSize: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props) {
    const go = useGo();
    const { prefixCls } = useDesign('layout-menu');
    const router = useRouter();
    const activeIndex = ref<number>(0);
    const activeName = computed(() => {
      return router.currentRoute.value.name;
    });

    const scrollTop = ref<number>(0);
    const permissionStore = usePermissionStore();
    const menuList = ref(permissionStore.getMenuList);

    function isActive(route): string | undefined {
      if (route.name === unref(activeName)) {
        return `${prefixCls}-item__container--active`;
      } else if (route.children) {
        for (let item of route.children) {
          return isActive(item);
        }
      } else {
        return '';
      }
    }

    function handleMenuClick(item, index) {
      menuList.value[activeIndex.value].meta.showSub = false;
      activeIndex.value = index;
      if (item.children) {
        const menu = item.children.filter((item) => !item.meta!.hideMenu);
        menu.length === 1 && !menu[0].children
          ? go(item.children[0] as RouteLocationRawEx)
          : (item.meta!.showSub = true);
      }
    }
    const onScroll = (e): void => {
      scrollTop.value = e.scrollOffset.top;
    };
    const getSubTop = (index: number): string => {
      const top = (index + 1) * 50 + 16 - scrollTop.value;
      if (top > 0) {
        return top + 'px';
      } else {
        return 0 + 'px';
      }
    };
    const getSubLeft = (): string => {
      const left = props.openState ? props.menuSize.max + 3 + 'px' : props.menuSize.min + 3 + 'px';
      return left;
    };

    const handleMenuClose = () => {
      menuList.value[activeIndex.value].meta.showSub = false;
    };

    return {
      onScroll,
      getSubTop,
      getSubLeft,
      handleMenuClick,
      handleMenuClose,
      prefixCls,
      activeIndex,
      activeName,
      isActive,
      menuList,
    };
  },
});
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-layout-menu';

.@{prefix-cls} {
  width: 200px;
  height: 100%;
  padding-top: 10px;
  overflow: auto;

  &-item__container {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 50px;
    padding: 0 20px;
    font-size: 16px;
    color: #000;
    box-sizing: border-box;
    .zoom-animation(left, scale(0.45, 0.45), scale(1, 1), top left);

    &:hover {
      color: #69c0ff !important;
    }
  }

  &-item-box {
    width: 100%;
    cursor: pointer;
  }

  &-item-title__inner {
    margin-left: 15px;
    font-size: 16px;
    letter-spacing: 1px;
  }

  &-item__container--active {
    color: @color-primary !important;
    background: #e6f7ff;
    &::before {
      position: absolute;
      left: 0;
      display: inline-block;
      width: 6px;
      height: 50px;
      background-color: @color-primary;
      content: '';
    }
  }

  &-popup__container {
    position: fixed;
    top: 50px;
    z-index: @page-popup-z-index;
    width: 500px;
    padding: 10px 15px;
    color: #fff;
    background: #fff;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  }
}
</style>
