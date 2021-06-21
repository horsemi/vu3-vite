<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}__left`">
      <Menu :checked-scheme="checkedScheme" />
    </div>
    <div :class="`${prefixCls}__right`">
      <DxTabPanel
        v-model:selected-index="selectedIndex"
        height="calc(100% - 48px)"
        :data-source="multiViewItems"
        :loop="true"
        :animation-enabled="true"
        :swipe-enabled="true"
        :focus-state-enabled="false"
      >
        <template #item="{ data }">
          <div :class="`${prefixCls}__right__item`">
            <component :is="data.component" :code="code" :custom-columns="customColumns" />
          </div>
        </template>
      </DxTabPanel>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { useDesign } from '/@/hooks/web/useDesign';
import DxTabPanel from 'devextreme-vue/tab-panel';
import Menu from './menu.vue';
import Requirement from './requirement.vue';
import Sort from './sort.vue';
import Column from './column.vue';
import { IColumnItem } from '/@/model/types';

export default defineComponent({
  components: {
    DxTabPanel,
    Menu,
    Requirement,
    Sort,
    Column,
  },
  props: {
    code: {
      type: String,
      default: '',
    },
    customColumns: {
      type: Array as PropType<IColumnItem[]>,
      default: () => {
        return [];
      },
    },
  },
  setup() {
    const multiViewItems = [
      {
        title: '条件',
        component: 'Requirement',
      },
      {
        title: '排序',
        component: 'Sort',
      },
      {
        title: '显示隐藏列',
        component: 'Column',
      },
    ];
    const { prefixCls } = useDesign('popup-content');
    const selectedIndex = ref(0);
    const checkedScheme = ref(-1);

    return {
      prefixCls,
      multiViewItems,
      selectedIndex,
      checkedScheme,
    };
  },
});
</script>

<style lang="less" scoped>
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
  }

  &__right {
    flex: 1;
    padding-left: 20px;
  }

  &__right__item {
    padding: 10px 0;
  }
}
</style>
