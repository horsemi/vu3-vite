<template>
  <div :class="[prefixCls]">
    <DxSortable
      item-orientation="horizontal"
      drag-direction="horizontal"
      @reorder="onTabDrop($event)"
    >
      <div
        v-for="item in viewState"
        :key="item.fullPath"
        :class="`${prefixCls}-tabs__container`"
        @click="handleItemClick(item)"
      >
        <div :class="[`${prefixCls}-tabs__wrapper`, isActive(item) ? 'active' : '']">
          <span :class="`${prefixCls}-tabs-title__wrapper`">{{ item.meta.title }}</span>
          <i class="dx-icon dx-icon-close" @click.stop="handleItemClose(item)" />
        </div>
      </div>
    </DxSortable>
  </div>
</template>

<script lang="ts">
  import type { RouteLocationNormalized } from 'vue-router';

  import { computed, defineComponent, unref } from 'vue';
  import { useRouter } from 'vue-router';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { useViewStore } from '/@/store/modules/view';
  import { useGo } from '/@/hooks/web/usePage';

  import { DxSortable } from 'devextreme-vue/sortable';

  export default defineComponent({
    name: 'MultipleTabs',
    components: { DxSortable },
    setup() {
      const { prefixCls } = useDesign('multiple-tabs');
      const viewStore = useViewStore();
      const go = useGo();
      const router = useRouter();

      const viewState = computed(() => viewStore.getViewList);

      const getViewsState = computed(() => {
        return viewStore.getViewList.filter((item) => !item.meta?.hideTab);
      });

      const unClose = computed(() => unref(getViewsState).length === 1);

      function handleItemClick(route: RouteLocationNormalized) {
        go(route.fullPath);
      }

      function handleItemClose(e) {
        if (unref(unClose)) {
          return;
        }
        viewStore.closeViewByKey(e.fullPath, router);
      }

      function onTabDrop(e) {
        viewStore.sortViews({
          oldIndex: e.fromIndex,
          newIndex: e.toIndex,
        });
      }

      return {
        prefixCls,
        viewState,
        handleItemClick,
        handleItemClose,
        onTabDrop,
      };
    },
    methods: {
      isActive(route: RouteLocationNormalized) {
        return route.fullPath === this.$route.fullPath;
      },
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-multiple-tabs';

  .@{prefix-cls} {
    position: relative;
    width: 100%;
    height: 50px;
    padding-top: 10px;
    background-color: #f5f6fa;

    &-tabs__container {
      display: inline-block;
      margin-right: 10px;
    }

    &-tabs__wrapper {
      padding: 8px;
      color: #adadad;
      cursor: pointer;
      background-color: #fff;
      border-radius: 10px;
    }

    &-tabs-title__wrapper {
      margin-right: 15px;
    }

    .active {
      height: 40px;
      color: #1890ff;
      border-radius: 10px 10px 0 0;
    }
  }
</style>
