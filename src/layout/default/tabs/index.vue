<template>
  <div :class="[prefixCls]">
    <DxScrollView show-scrollbar="onHover" direction="horizontal" :height="40">
      <div style="white-space: nowrap">
        <DxSortable
          :filter="`.tabs-move`"
          item-orientation="horizontal"
          drag-direction="horizontal"
          @reorder="onTabDrop($event)"
        >
          <div
            v-for="item in viewState"
            :key="item.fullPath"
            :class="[`${prefixCls}-tabs__container`, !isAffix(item) && 'tabs-move']"
            @click="handleItemClick(item)"
          >
            <div :class="[`${prefixCls}-tabs__wrapper`, isActive(item) ? 'active' : '']">
              <span :class="`${prefixCls}-tabs-title__wrapper`">{{ item.meta.title }}</span>
              <i
                v-if="!isAffix(item)"
                class="dx-icon dx-icon-clear"
                @click.stop="handleItemClose(item)"
              />
            </div>
          </div>
        </DxSortable>
      </div>
    </DxScrollView>
  </div>
</template>

<script lang="ts">
  import type { RouteLocationNormalized } from 'vue-router';

  import { computed, defineComponent, unref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { useViewStore } from '/@/store/modules/view';
  import { useGo } from '/@/hooks/web/usePage';
  import { usePermissionStore } from '/@/store/modules/permission';

  import { DxSortable } from 'devextreme-vue/sortable';
  import { DxScrollView } from 'devextreme-vue/scroll-view';

  export default defineComponent({
    name: 'MultipleTabs',
    components: {
      DxSortable,
      DxScrollView,
    },
    setup() {
      const { prefixCls } = useDesign('multiple-tabs');
      const viewStore = useViewStore();
      const go = useGo();
      const router = useRouter();
      const route = useRoute();
      const permissionStore = usePermissionStore();

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
        const affixLen = viewState.value.filter((item) => item.meta && item.meta.affix).length;
        viewStore.sortViews({
          oldIndex: e.fromIndex + affixLen,
          newIndex: e.toIndex + affixLen,
        });
      }

      function isAffix(item: RouteLocationNormalized) {
        return item.meta && item.meta.affix;
      }

      function addTags() {
        const { name } = route;
        if (name) {
          viewStore.addView(route);
        }
        return false;
      }

      function filterAffixTags(routes, basePath = '/') {
        let tags: RouteLocationNormalized[] = [];
        routes.forEach((route) => {
          const tagPath = basePath + '/' + route.path;
          if (route.meta && route.meta.affix) {
            tags.push({
              ...route,
              fullPath: tagPath,
              path: tagPath,
            });
          }
          if (route.children) {
            const tempTags = filterAffixTags(route.children, route.path);
            if (tempTags.length >= 1) {
              tags = [...tags, ...tempTags];
            }
          }
        });
        return tags;
      }

      function initTags() {
        const affixTags = filterAffixTags(permissionStore.getPermissionRoutes);
        for (const tag of affixTags) {
          // Must have tag name
          if (tag.name) {
            viewStore.addView(tag);
          }
        }
      }

      initTags();
      addTags();

      return {
        prefixCls,
        viewState,
        handleItemClick,
        handleItemClose,
        onTabDrop,
        isAffix,
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
    height: 56px;
    padding-top: 16px;

    &-tabs__container {
      display: inline-block;
      margin-right: 4px;
      box-shadow: 0 2px 6px 0 rgb(0 0 0 / 4%);
    }

    &-tabs__wrapper {
      padding: 8px 16px;
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
      color: #3694fd;
      border-top: 3px solid #3694fd;
      border-radius: 4px 4px 0 0;
    }
  }
</style>
