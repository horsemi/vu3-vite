<template>
  <div :class="prefixCls">
    <QueryFrom ref="queryForm" :columns="allColumns" />
    <QueryButton @on-search="onSearch" @on-reset="onReset" @on-queryPlan="onQueryPlan" />
    <QueryQuick
      :checked-index="checkedIndex"
      :scheme-list-temp="schemeListTemp"
      @on-change-checked-index="onChangeCheckedIndex"
    />
    <QueryPopup
      ref="popup"
      :checked-index="popupIndex"
      :all-columns="allColumns"
      :scheme-list="schemeList"
      @on-change-checked-index="onChangeCheckedIndex"
      @on-change-requirement="onChangeRequirement"
      @on-change-sort="onChangeSort"
      @on-change-column="onChangeColumn"
      @on-title-change="onTitleChange"
      @on-submit-scheme="onSubmitScheme"
      @on-save-scheme="onSaveScheme"
      @on-del-scheme="onDelScheme"
      @on-reset-scheme="onResetScheme"
      @on-submit="onSubmit"
      @on-change-checked-default="onChangeCheckedDefault"
      @on-change-popup-index="onChangePopupIndex"
    />
  </div>
</template>

<script lang="ts">
  import type { IColumnItem } from '/@/model/table/types';
  import type {
    IOrderByItem,
    IRequirementItem,
    ISchemeColumnsItem,
    ISchemeItem,
  } from '../QueryPopup/content/types';

  import { defineComponent, PropType, ref, watch } from 'vue';
  import { cloneDeep } from 'lodash-es';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Persistent } from '/@/utils/cache/persistent';
  import { SCHEME_LIST_KEY, SCHEME_CHECKED_INDE_KEY } from '/@/enums/cacheEnum';

  import QueryFrom from './component/form.vue';
  import QueryButton from './component/button.vue';
  import QueryQuick from './component/quick.vue';
  import QueryPopup from '/@/components/QueryPopup/index.vue';

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
      'on-search',
      'on-filter-scheme',
    ],
    setup(props, ctx) {
      const { prefixCls } = useDesign('query-plan');
      // 弹窗的dom
      const popup = ref();
      // 左侧搜索组件
      const queryForm = ref();
      // 快捷过滤用的选中下标
      const checkedIndex = ref(0);
      // 方案弹窗用的选中下标
      const popupIndex = ref(0);
      // 过滤方案数据，用于交互
      const schemeList = ref<ISchemeItem[]>([]);
      // 过滤方案数据副本，用于保存
      const schemeListTemp = ref<ISchemeItem[]>([]);

      // 外派列表过滤方案更新事件
      const onChangeScheme = (data: ISchemeItem) => {
        ctx.emit('on-filter-scheme', data);
      };
      // 点击重置触发
      const onReset = () => {
        //
      };
      // 点击查询方案触发
      const onQueryPlan = () => {
        popup.value.openPopup();
      };
      // 点击查询触发
      const onSearch = () => {
        const queryList = queryForm.value.queryList;
        ctx.emit('on-search', queryList);
      };
      // 处理选中超出数据长度的情况
      const handleOverLength = () => {
        const index = schemeListTemp.value.length;
        if (checkedIndex.value >= index) {
          checkedIndex.value = index - 1;
        }
        if (props.schemeCheckedIndex >= index) {
          handleChangeCheckedDefault(index - 1);
        }
      };
      // 处理保存数据
      const handleSaveData = (data: ISchemeItem[], msg: string) => {
        Persistent.setLocal(SCHEME_LIST_KEY, data);
        handleOverLength();
        useMessage(msg, 'success');
      };
      // 处理默认方案更新
      const handleChangeCheckedDefault = (index: number) => {
        Persistent.setLocal(SCHEME_CHECKED_INDE_KEY, index);
      };
      // 接收选中下标更新
      const onChangeCheckedIndex = (index: number) => {
        checkedIndex.value = index;
        onChangeScheme(schemeListTemp.value[checkedIndex.value]);
      };
      // 接收条件数据更新
      const onChangeRequirement = (data: IRequirementItem[]) => {
        schemeList.value[popupIndex.value].requirement = data;
      };
      // 接收排序数据更新
      const onChangeSort = (data: IOrderByItem[]) => {
        schemeList.value[popupIndex.value].orderBy = data;
      };
      // 接收显示隐藏列更新
      const onChangeColumn = (data: ISchemeColumnsItem[]) => {
        schemeList.value[popupIndex.value].columns = data;
      };
      // 接收标题更新
      const onTitleChange = (title: string) => {
        schemeList.value[popupIndex.value].title = title;
        // 改完标题自动保存
        onSubmitScheme();
      };
      // 接收保存事件
      const onSubmitScheme = () => {
        const temp = cloneDeep(schemeListTemp.value);
        temp[popupIndex.value] = cloneDeep(schemeList.value[popupIndex.value]);
        schemeListTemp.value = temp;
        handleSaveData(schemeListTemp.value, '保存成功');
      };
      // 接收另存事件
      const onSaveScheme = () => {
        const temp = cloneDeep(schemeList.value);
        temp.push({ ...cloneDeep(schemeList.value[popupIndex.value]), title: '' });
        schemeList.value = temp;
        popupIndex.value = schemeList.value.length - 1;
      };
      // 接收删除事件
      const onDelScheme = () => {
        // 两个数据都需要删除
        const index = popupIndex.value;
        const temp = cloneDeep(schemeList.value);
        const data = cloneDeep(schemeListTemp.value);
        temp.splice(index, 1);
        data.splice(index, 1);
        schemeList.value = temp;
        schemeListTemp.value = data;
        popupIndex.value = index - 1;
        handleSaveData(schemeListTemp.value, '删除成功');
      };
      // 接收重置事件
      const onResetScheme = () => {
        schemeList.value[popupIndex.value] = cloneDeep(schemeListTemp.value[popupIndex.value]);
      };
      // 接收确认事件
      const onSubmit = () => {
        checkedIndex.value = popupIndex.value;
        onChangeScheme(schemeList.value[popupIndex.value]);
        onSearch();
      };
      // 接受默认方案更新事件
      const onChangeCheckedDefault = () => {
        handleChangeCheckedDefault(popupIndex.value);
      };
      // 接受弹窗选中下标更新事件
      const onChangePopupIndex = (index: number) => {
        popupIndex.value = index;
      };
      // 处理组件数据
      const handleData = (val: ISchemeItem[]) => {
        schemeList.value = cloneDeep(val);
        schemeListTemp.value = cloneDeep(val);
      };

      watch(
        () => props.filterList,
        (val) => {
          handleData(val);
        },
        {
          immediate: true,
        }
      );

      watch(
        () => props.schemeCheckedIndex,
        (val) => {
          checkedIndex.value = val;
          popupIndex.value = val;
        },
        {
          immediate: true,
        }
      );

      return {
        prefixCls,
        popup,
        queryForm,
        checkedIndex,
        schemeList,
        schemeListTemp,
        popupIndex,
        onSearch,
        onReset,
        onQueryPlan,
        onChangeCheckedIndex,
        onChangeRequirement,
        onChangeSort,
        onChangeColumn,
        onTitleChange,
        onSubmitScheme,
        onSaveScheme,
        onDelScheme,
        onResetScheme,
        onSubmit,
        onChangeCheckedDefault,
        onChangePopupIndex,
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
