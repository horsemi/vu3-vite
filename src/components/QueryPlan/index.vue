<template>
  <div :class="prefixCls">
    <QueryFrom ref="queryForm" :columns="allColumns" />
    <QueryButton @on-search="onSearch" @on-reset="onReset" @on-queryPlan="onQueryPlan" />
    <QueryQuick
      :checked-index="checkedIndex"
      :quick-data="quickData"
      @on-filter-scheme="onFilterScheme"
      @on-change-checked-index="onChangeCheckedIndex"
    />
    <QueryPopup
      ref="popup"
      :checked-index="checkedIndex"
      :all-columns="allColumns"
      :filter-list="filterList"
      @on-filter-scheme="onFilterScheme"
      @on-change-schemedata="onChangeSchemedata"
      @on-change-checked-index="onChangeCheckedIndex"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType, ref, watch } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import QueryFrom from './component/form.vue';
  import QueryButton from './component/button.vue';
  import QueryQuick from './component/quick.vue';
  import QueryPopup from '/@/components/QueryPopup/index.vue';
  import { IColumnItem } from '/@/model/types';
  import { ISchemeItem } from '../QueryPopup/content/types';
  import { cloneDeep } from 'lodash-es';

  export default defineComponent({
    components: {
      QueryFrom,
      QueryButton,
      QueryQuick,
      QueryPopup,
    },
    props: {
      allColumns: {
        type: Array as PropType<IColumnItem[]>,
        default: () => {
          return [];
        },
      },
      filterList: {
        type: Array as PropType<ISchemeItem[]>,
        default: () => {
          return [];
        },
      },
      schemeCheckedIndex: {
        type: Number,
        default: 0,
      },
    },
    emits: ['on-change-filter-value', 'on-filter-scheme', 'on-search'],
    setup(props, ctx) {
      const { prefixCls } = useDesign('query-plan');
      const popup = ref();
      const queryForm = ref();
      const quickData = ref<ISchemeItem[]>([]);
      const checkedIndex = ref(0);

      const onReset = () => {
        //
      };
      const onQueryPlan = () => {
        popup.value.openPopup();
      };
      const onFilterScheme = (data) => {
        ctx.emit('on-filter-scheme', data);
      };
      const onChangeSchemedata = (data) => {
        quickData.value = cloneDeep(data);
      };
      const onSearch = () => {
        const queryList = queryForm.value.queryList;
        ctx.emit('on-search', queryList);
      };
      const onChangeCheckedIndex = (index) => {
        checkedIndex.value = index;
      };

      watch(
        () => props.filterList,
        (val) => {
          quickData.value = val;
        },
        {
          immediate: true,
        }
      );

      watch(
        () => props.schemeCheckedIndex,
        (val) => {
          checkedIndex.value = val;
        },
        {
          immediate: true,
        }
      );

      return {
        prefixCls,
        popup,
        queryForm,
        quickData,
        checkedIndex,
        onReset,
        onQueryPlan,
        onFilterScheme,
        onChangeSchemedata,
        onSearch,
        onChangeCheckedIndex,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-query-plan';

  .@{prefix-cls} {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 64px;
    margin-bottom: 20px;
    background-color: #fff;
    box-sizing: border-box;
  }
</style>
