<template>
  <div :class="[prefixCls]" @mouseleave="handleMenuClose">
    <DxScrollView show-scrollbar="onHover" direction="vertical" :width="200" :on-scroll="onScroll">
      <div
        v-for="(item, index) in menuList"
        :ref="
          (el) => {
            if (el) menuListRef[index] = el;
          }
        "
        :key="item.name"
        :tabindex="-1"
      >
        <Popper :is-show-popper="item.meta.showSub">
          <template #popper>
            <div
              :class="`${prefixCls}-popup__container`"
              @mouseenter="handleMenuClick(item, index)"
              @mouseleave="handleMenuClose"
            >
              <MenuPopup :menu-item-data="item.children" />
            </div>
          </template>
          <template #trigger>
            <div
              :class="[`${prefixCls}-item__container`, isActive(item)]"
              @mouseenter="handleMenuClick(item, index)"
            >
              <div :class="`${prefixCls}-item-box`">
                <SvgIcon size="23" :name="item.meta.icon"></SvgIcon>
                <span :class="`${prefixCls}-item-title__inner`">{{ item.meta.title }}</span>
              </div>
            </div>
          </template>
        </Popper>
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

  import Popper from './component/use-popper/index.vue';

  import MenuPopup from './component/submenu/index.vue';

  export default defineComponent({
    name: 'LayoutMenu',
    components: {
      MenuPopup,
      Popper,
      DxScrollView,
    },
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
      const timeout = ref<any>(null);

      const activePath = computed(() => {
        return `/${router.currentRoute.value.path.split('/').slice(1)[0]}`;
      });

      const scrollTop = ref<number>(0);
      const permissionStore = usePermissionStore();
      const menuList = ref(permissionStore.getMenuList);
      const menuListRef = ref([]);

      function isActive(route): string | undefined {
        if (route.path === unref(activePath)) {
          return `${prefixCls}-item__container--active`;
        } else {
          return '';
        }
      }

      function handleMenuClick(item, index) {
        // 延时展开菜单
        clearTimeout(unref(timeout));
        timeout.value = setTimeout(() => {
          menuList.value[activeIndex.value].meta.showSub = false;
          activeIndex.value = index;
          if (item.children) {
            const menu = item.children.filter((item) => !item.meta!.hideMenu);
            menu.length === 1 && !menu[0].children
              ? go(item.children[0] as RouteLocationRawEx)
              : (item.meta!.showSub = true);
          }
        }, 300);
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
        const left = props.openState ? props.menuSize.max + 'px' : props.menuSize.min + 3 + 'px';
        return left;
      };

      const handleMenuClose = () => {
        // 延时关闭菜单
        clearTimeout(unref(timeout));
        timeout.value = setTimeout(() => {
          menuList.value[activeIndex.value].meta.showSub = false;
        }, 300);
      };

      return {
        onScroll,
        getSubTop,
        getSubLeft,
        handleMenuClick,
        handleMenuClose,
        prefixCls,
        activeIndex,
        activePath,
        isActive,
        menuList,
        menuListRef,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-layout-menu';

  .@{prefix-cls} {
    width: 200px;
    // height: calc(100vh - 56px) !important; // 在一定比例下会出现滚动条
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
        color: @color-primary !important;
        background-image: linear-gradient(to right, #fff, #e8f7ff);
      }

      &:focus {
        color: @color-primary !important;
        background-image: linear-gradient(to right, #fff, #e8f7ff);
      }

      &--active {
        color: @color-primary !important;
        background-image: linear-gradient(to right, #fff, #e8f7ff);
        &::after {
          position: absolute;
          right: 0;
          display: inline-block;
          width: 6px;
          height: 50px;
          background-color: @color-primary;
          content: '';
        }
      }
    }

    &-item-box {
      display: flex;
      width: 100%;
      cursor: pointer;
      align-items: center;
      &_svg {
        color: #5c5c5c;
      }
    }

    &-item-title__inner {
      margin-left: 15px;
      font-size: 16px;
      font-weight: 400;
      letter-spacing: 1px;
    }

    &-popup__container {
      // position: fixed;
      // z-index: @page-menu-z-index;
      width: 392px;
      max-height: 100vh;
      overflow-y: auto;
      // padding: 10px 15px;
      color: #fff;
      background: #fff;
      // border: 3px solid #ebeef5;
      border-radius: 4px;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    }
  }
</style>
