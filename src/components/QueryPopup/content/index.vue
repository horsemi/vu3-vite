<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}__left`">
      <Menu />
    </div>
    <div :class="`${prefixCls}__right`">
      <DxTabPanel
        style="display: flex; flex-direction: column"
        height="100%"
        :data-source="multiViewItems"
        :loop="true"
        :animation-enabled="true"
        :focus-state-enabled="false"
      >
        <template #item="{ data }">
          <div :class="`${prefixCls}__right__item`">
            <component :is="data.component" />
          </div>
        </template>
      </DxTabPanel>
    </div>
  </div>
</template>

<script lang="ts">
  import type { IMultiViewItem } from './types';

  import { defineComponent } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';

  import DxTabPanel from 'devextreme-vue/tab-panel';

  import Menu from './menu.vue';
  import Requirement from './requirement.vue';
  import Sort from './sort.vue';
  import Column from './column.vue';
  import Summary from './summary.vue';

  export default defineComponent({
    components: {
      DxTabPanel,
      Menu,
      Requirement,
      Sort,
      Column,
      Summary,
    },
    setup() {
      const { prefixCls } = useDesign('popup-content');
      // tabs标签页数据
      const multiViewItems: IMultiViewItem[] = [
        {
          title: '条件',
          component: 'requirement',
        },
        {
          title: '排序',
          component: 'sort',
        },
        {
          title: '汇总',
          component: 'summary',
        },
        {
          title: '显示隐藏列',
          component: 'column',
        },
      ];

      return {
        prefixCls,
        multiViewItems,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-popup-content';

  .@{prefix-cls} {
    display: flex;
    height: 100%;
    margin: 20px 0;
    overflow: hidden;
    border-top: 1px solid @border-color-primary;
    border-bottom: 1px solid @border-color-primary;

    &__left {
      width: 20%;
      height: 100%;
      min-width: 200px;
    }

    &__right {
      width: calc(80% - 20px);
      padding-left: 20px;
    }

    &__right__item {
      padding: 10px 0;
    }

    .dx-tabpanel-container {
      overflow: hidden;
    }
  }
</style>
