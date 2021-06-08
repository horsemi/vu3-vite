<template>
  <div :class="[prefixCls]" @scroll="handleScroll">
    <div
      v-for="(item, index) in menuList"
      :key="item.name"
      :class="[`${prefixCls}__sub`, activeIndex === index && `${prefixCls}__sub--active`]"
      @click.stop="handleMenuClick(item, index)"
    >
      <SvgIcon size="20" :name="item.meta.icon"></SvgIcon>
      <span :class="`${prefixCls}-sub-title__inner`">{{ item.meta.title }}</span>
      <transition name="zoom-in-left">
        <div
          v-show="item.meta.showSub"
          :class="`${prefixCls}-popup__container`"
          :style="{ top: getSubTop(index), left: getSubLeft() }"
        >
          <div :class="`${prefixCls}-popup__wrap`">
            <div
              v-for="(itemSub, indxeSub) in item.children"
              :key="indxeSub"
              :class="`${prefixCls}__titlebox`"
            >
              <div v-if="!itemSub.meta.hideMenu">
                <div
                  :class="`${prefixCls}__titlebox__subTitle`"
                  @click="handleItemClick(itemSub)"
                  >{{ itemSub.meta.title }}</div
                >
                <div
                  v-for="(subChild, indexChild) in itemSub.children"
                  :key="indexChild"
                  :class="`${prefixCls}__titlebox__childTitle`"
                  @click="handleItemClick(subChild)"
                >
                  <span v-if="!subChild.meta.hideMenu">
                    {{ subChild.meta.title }}
                  </span>
                </div>
              </div>
            </div>
          </div>
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

  export default defineComponent({
    name: 'LayoutMenu',
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

    &__sub {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      height: 50px;
      padding: 0 20px;
      font-size: 16px;
      color: #000;
      cursor: pointer;
      box-sizing: border-box;
      .zoom-animation(left, scale(0.45, 0.45), scale(1, 1), top left);
    }

    &-sub-title__inner {
      margin-left: 15px;
      letter-spacing: 1px;
    }

    &__sub--active {
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

    &-popup__wrap {
      display: flex;
      flex-wrap: wrap;
    }

    &__titlebox {
      width: 33.33%;
      padding: 10px 15px;
      overflow: hidden;
      white-space: nowrap;
      box-sizing: border-box;

      &__subTitle {
        width: 100%;
        margin-bottom: 10px;
        color: @color-primary;
      }

      &__childTitle {
        width: 100%;
        margin-bottom: 5px;
        color: #8d8d8d;
      }
    }
  }
</style>
