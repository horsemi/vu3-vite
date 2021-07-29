<template>
  <div :class="prefixCls" @mouseenter="AddHover" @mouseleave="RemoveHover">
    <div
      :class="[
        `${prefixCls}-title__wrapper`,
        isSubActive(subMenuData.path),
        isHover ? `${prefixCls}-title__wrapper--hover` : '',
      ]"
      @click="handleItemClick(subMenuData)"
      >{{ subMenuData.meta.title }}</div
    >
    <div
      v-for="(subChild, indexChild) in MenuData"
      :key="indexChild"
      :class="[`${prefixCls}-item-text__wrapper`, isActive(subChild)]"
      @click="handleItemClick(subChild)"
    >
      <span>
        {{ subChild.meta.title }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
  import type { AppRouteRecordRaw } from '/@/router/types';

  import { defineComponent, PropType, unref, computed, ref } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { RouteLocationRawEx, useGo } from '/@/hooks/web/usePage';

  import { useRouter } from 'vue-router';

  export default defineComponent({
    name: 'SubMenuItem',
    props: {
      subMenuData: {
        type: Object as PropType<AppRouteRecordRaw>,
        default: () => {
          return {};
        },
      },
    },
    setup(props) {
      const go = useGo();
      const router = useRouter();
      const { prefixCls } = useDesign('layout-submenu');

      const isHover = ref<boolean>(false);

      const activeName = computed(() => {
        return router.currentRoute.value.name;
      });

      const activePath = computed(() => {
        return router.currentRoute.value.path.split('/').slice(1)[1];
      });

      const MenuData = computed(() => {
        return (
          props.subMenuData.children &&
          props.subMenuData.children.filter((menuItem) => {
            return !menuItem.meta.hideMenu;
          })
        );
      });

      function handleItemClick(item: RouteLocationRawEx) {
        go(item);
      }

      function isActive(route): string | undefined {
        if (route.name === unref(activeName)) {
          return `${prefixCls}-item-text__wrapper--active`;
        } else {
          return '';
        }
      }

      function isSubActive(route): string | undefined {
        if (route === unref(activePath)) {
          return `${prefixCls}-title__wrapper--active`;
        } else {
          return '';
        }
      }

      function AddHover() {
        isHover.value = true;
      }

      function RemoveHover() {
        isHover.value = false;
      }
      return {
        prefixCls,
        isHover,
        MenuData,
        handleItemClick,
        isActive,
        isSubActive,
        AddHover,
        RemoveHover,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-layout-submenu';

  .@{prefix-cls} {
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    &-title__wrapper {
      width: 102px;
      padding: 6px;
      margin: 0 6px;
      margin-bottom: 10px;
      color: @color-primary;
      cursor: pointer;
      &--active {
        color: #1890ff;
        background-color: #e6f7ff;
      }
      &--hover {
        color: #1890ff;
        background-color: #e6f7ff;
      }
    }
    &-item-text__wrapper {
      display: inline-block;
      width: 102px;
      padding: 6px;
      margin: 0 6px;
      color: #8d8d8d;
      cursor: pointer;
      &:hover {
        color: #1890ff;
        background-color: #e6f7ff;
      }
      &--active {
        color: #1890ff;
        background-color: #e6f7ff;
      }
    }
  }
</style>
