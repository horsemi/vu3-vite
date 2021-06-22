<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}__left`">
      <Menu
        :checked-scheme-index="checkedSchemeIndex"
        :menu-list="menuList"
        @on-change-scheme="onChangeScheme"
      />
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
            <component
              :is="data.component"
              :ref="data.component"
              :requirement="schemeList[checkedSchemeIndex].requirement"
              :order-by="schemeList[checkedSchemeIndex].orderBy"
              :columns="schemeList[checkedSchemeIndex].columns"
              :code="code"
              :all-columns="allColumns"
              @on-change-requirement="onChangeRequirement"
            />
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
import { ISchemeItem } from './types';

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
    allColumns: {
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
    const checkedSchemeIndex = ref(0);
    const schemeList = ref<ISchemeItem[]>([
      {
        uuid: 1,
        // 标题
        title: '7月16日前未完成',
        // 条件
        requirement: [
          {
            requirement: 'BillCode',
            operator: '=',
            operatorList: [],
            value: '',
            type: '',
            datatypekeies: '',
            logic: '',
          },
        ],
        // 排序
        orderBy: [
          {
            key: 'BillCode', // 字段
            caption: '单据编号',
            sort: false, // 排序
          },
        ],
        // 显示隐藏列
        columns: [
          {
            key: 'BillCode',
            caption: '单据编码',
            show: true,
          },
          {
            key: 'BillDate',
            caption: '单据日期',
            show: true,
          },
          {
            key: 'DocumentStatus',
            caption: '业务状态',
            show: false,
          },
          {
            key: 'IsCancelled',
            caption: '取消状态',
            show: false,
          },
          {
            key: 'TotalPackage',
            caption: '包件总数',
            show: true,
          },
          {
            key: 'TotalVolume',
            caption: '总体积',
            show: true,
          },
        ],
      },
    ]);
    schemeList.value.unshift({
      uuid: -1,
      title: '缺省方案',
      requirement: [
        {
          requirement: '',
          operator: '=',
          operatorList: [],
          value: '',
          type: '',
          datatypekeies: '',
          logic: '',
        },
      ],
      orderBy: [],
      columns: [
        {
          key: 'BillCode',
          caption: '单据编码',
          show: false,
        },
        {
          key: 'BillDate',
          caption: '单据日期',
          show: false,
        },
        {
          key: 'DocumentStatus',
          caption: '业务状态',
          show: false,
        },
        {
          key: 'IsCancelled',
          caption: '取消状态',
          show: false,
        },
        {
          key: 'TotalPackage',
          caption: '包件总数',
          show: false,
        },
        {
          key: 'TotalVolume',
          caption: '总体积',
          show: false,
        },
      ],
    });
    const menuList: string[] = [];
    schemeList.value.forEach((item) => {
      menuList.push(item.title);
    });

    const onChangeScheme = (index) => {
      checkedSchemeIndex.value = index;
    };
    const onChangeRequirement = (requirement) => {
      schemeList.value[checkedSchemeIndex.value].requirement = requirement;
      console.log(schemeList.value);
    };

    return {
      prefixCls,
      schemeList,
      menuList,
      multiViewItems,
      selectedIndex,
      checkedSchemeIndex,
      onChangeScheme,
      onChangeRequirement,
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
