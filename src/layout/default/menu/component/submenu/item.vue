<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}-title__wrapper`" @click="handleItemClick(subMenuData)">{{
      subMenuData.meta.title
    }}</div>
    <div
      v-for="(subChild, indexChild) in subMenuData.children"
      :key="indexChild"
      :class="`${prefixCls}-item-text__wrapper`"
      @click="handleItemClick(subChild)"
    >
      <span v-if="!subChild.meta.hideMenu">
        {{ subChild.meta.title }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
  import type { AppRouteRecordRaw } from '/@/router/types';

  import { defineComponent, PropType } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { RouteLocationRawEx, useGo } from '/@/hooks/web/usePage';

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
    setup() {
      const go = useGo();
      const { prefixCls } = useDesign('layout-submenu');

      function handleItemClick(item: RouteLocationRawEx) {
        go(item);
      }

      return {
        prefixCls,
        handleItemClick,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-layout-submenu';

  .@{prefix-cls} {
    &-title__wrapper {
      width: 100%;
      margin-bottom: 10px;
      color: @color-primary;
      cursor: pointer;
    }

    &-item-text__wrapper {
      width: 100%;
      margin-bottom: 5px;
      color: #8d8d8d;
      cursor: pointer;
    }
  }
</style>
