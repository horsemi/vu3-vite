<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}__left`">
      <Menu
        ref="menu"
        :checked-index="checkedIndex"
        :menu-list="menuList"
        @on-change-checked-index="onChangeCheckedIndex"
        @on-submit-scheme="onSubmitScheme"
        @on-save-scheme="onSaveScheme"
        @on-reset-scheme="onResetScheme"
        @on-del-scheme="onDelScheme"
        @on-title-change="onTitleChange"
      />
    </div>
    <div :class="`${prefixCls}__right`">
      <DxTabPanel
        height="calc(100% - 48px)"
        :data-source="multiViewItems"
        :loop="true"
        :animation-enabled="true"
        :swipe-enabled="true"
        :focus-state-enabled="false"
      >
        <template #item="{ data }">
          <div :class="`${prefixCls}__right__item`">
            <component
              :is="data.component"
              :ref="data.component"
              :requirement="schemeList[checkedIndex] && schemeList[checkedIndex].requirement"
              :order-by="schemeList[checkedIndex] && schemeList[checkedIndex].orderBy"
              :columns="schemeList[checkedIndex] && schemeList[checkedIndex].columns"
              :all-columns="allColumns"
              @on-change-requirement="onChangeRequirement"
              @on-change-sort="onChangeSort"
              @on-change-column="onChangeColumn"
            />
          </div>
        </template>
      </DxTabPanel>
    </div>
  </div>
</template>

<script lang="ts">
  import type { IColumnItem } from '/@/model/table/types';
  import type {
    IMultiViewItem,
    IOrderByItem,
    IRequirementItem,
    ISchemeColumnsItem,
    ISchemeItem,
  } from './types';

  import { computed, defineComponent, PropType, ref } from 'vue';
  
  import { useDesign } from '/@/hooks/web/useDesign';

  import DxTabPanel from 'devextreme-vue/tab-panel';

  import Menu from './menu.vue';
  import Requirement from './requirement.vue';
  import Sort from './sort.vue';
  import Column from './column.vue';

  export default defineComponent({
    components: {
      DxTabPanel,
      Menu,
      Requirement,
      Sort,
      Column,
    },
    props: {
      allColumns: {
        type: Array as PropType<IColumnItem[]>,
        default: () => {
          return [];
        },
      },
      schemeList: {
        type: Array as PropType<ISchemeItem[]>,
        default: () => {
          return [];
        },
      },
      checkedIndex: {
        type: Number,
        default: 0,
      },
    },
    emits: [
      'on-change-checked-index',
      'on-change-requirement',
      'on-change-sort',
      'on-change-column',
      'on-title-change',
      'on-submit-scheme',
      'on-save-scheme',
      'on-del-scheme',
      'on-reset-scheme',
    ],
    setup(props, ctx) {
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
          title: '显示隐藏列',
          component: 'column',
        },
      ];

      // menu的dom
      const menu = ref();

      // 标题列表数据
      const menuList = computed(() => {
        const data = props.schemeList.map((item) => {
          return item.title;
        });
        return data;
      });

      // 外派选中下标更新
      const onChangeCheckedIndex = (index: number) => {
        ctx.emit('on-change-checked-index', index);
      };
      // 外派条件数据更新
      const onChangeRequirement = (data: IRequirementItem[]) => {
        ctx.emit('on-change-requirement', data);
      };
      // 外派排序数据更新
      const onChangeSort = (data: IOrderByItem[]) => {
        ctx.emit('on-change-sort', data);
      };
      // 外派显示隐藏列更新
      const onChangeColumn = (data: ISchemeColumnsItem[]) => {
        ctx.emit('on-change-column', data);
      };
      // 外派标题更新
      const onTitleChange = (title: string) => {
        ctx.emit('on-title-change', title);
      };
      // 外派保存事件
      const onSubmitScheme = () => {
        ctx.emit('on-submit-scheme');
      };
      // 外派另存事件
      const onSaveScheme = () => {
        ctx.emit('on-save-scheme');
        // 另存需要开启menu的修改状态，让其可以修改标题
        menu.value.onEditScheme();
      };
      // 外派删除事件
      const onDelScheme = () => {
        ctx.emit('on-del-scheme');
      };
      // 外派重置事件
      const onResetScheme = () => {
        ctx.emit('on-reset-scheme');
      };

      return {
        prefixCls,
        multiViewItems,
        menuList,
        menu,
        onChangeCheckedIndex,
        onChangeRequirement,
        onChangeSort,
        onChangeColumn,
        onTitleChange,
        onSubmitScheme,
        onSaveScheme,
        onDelScheme,
        onResetScheme,
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
