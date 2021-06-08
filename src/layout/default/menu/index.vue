<template>
  <div :class="[prefixCls]" @scroll="handleScroll">
    <div
      v-for="(item, index) in menuList"
      :key="item.name"
      :class="[
        `${prefixCls}-item__container`,
        activeIndex === index && `${prefixCls}-item__container--active`,
      ]"
      @click.stop="handleMenuClick(item, index)"
    >
      <SvgIcon size="23" :name="item.meta.icon"></SvgIcon>
      <span :class="`${prefixCls}-item-title__inner`">{{ item.meta.title }}</span>
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
  </div>
</template>

<script lang="ts">
  import type { AppRouteRecordRaw } from '/@/router/types';

  import { defineComponent, ref } from 'vue';
  import { RouteLocationRawEx, useGo } from '/@/hooks/web/usePage';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { usePermissionStore } from '/@/store/modules/permission';

  import MenuPopup from './component/submenu/index.vue';

  export default defineComponent({
    name: 'LayoutMenu',
    components: { MenuPopup },
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
      const activeIndex = ref<number>(0);
      const scrollTop = ref<number>(0);
      const permissionStore = usePermissionStore();
      const menuList = ref(permissionStore.getMenuList);

      const handleItemClick = (item: RouteLocationRawEx) => {
        go(item);
      };
      const handleMenuClick = (item: AppRouteRecordRaw, index) => {
        menuList.value[activeIndex.value].meta.showSub = false;
        activeIndex.value = index;
        if (item.children) {
          item.meta.showSub = true;
        }
      };
      const handleScroll = (e): void => {
        scrollTop.value = e.target.scrollTop;
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
        const left = props.openState
          ? props.menuSize.max + 3 + 'px'
          : props.menuSize.min + 3 + 'px';
        return left;
      };
      document.body.addEventListener(
        'click',
        () => {
          menuList.value[activeIndex.value].meta.showSub = false;
        },
        false
      );

      return {
        handleScroll,
        handleItemClick,
        getSubTop,
        getSubLeft,
        handleMenuClick,
        prefixCls,
        activeIndex,
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
    }

    &-item-title__inner {
      margin-left: 15px;
      font-size: 16px;
      letter-spacing: 1px;
    }

    &-item__container--active {
      color: @color-primary;
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
      z-index: @page-layout-menu-z-index;
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
