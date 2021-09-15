<template>
  <div :class="prefixCls">
    <QueryFrom
      ref="queryForm"
      :columns="allColumns"
      :fast="fast"
      @on-save-fast="onSaveFast"
      @on-search="onSearch"
    />
    <QueryButton @on-search="onSearch" @on-reset="onReset" @on-queryPlan="onQueryPlan" />
    <QueryQuick
      :checked-index="checkedIndex"
      :scheme-list-temp="schemeListTemp"
      @on-change-checked-index="onChangeCheckedIndex"
    />
    <QueryPopup
      ref="popup"
      :checked-index="checkedIndex"
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
      @on-submit-checked-default="handleChangeCheckedDefault"
    />
  </div>
</template>

<script lang="ts">
  import type { IColumnItem } from '/@/model/types';
  import type {
    IOrderByItem,
    IRequirementItem,
    ISchemeColumnsItem,
    ISchemeItem,
  } from '../QueryPopup/content/types';
  import type { IQueryItem, ISchemeData } from './types';

  import { defineComponent, PropType, ref, watch, provide, reactive } from 'vue';
  import { cloneDeep } from 'lodash-es';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { saveSchemesData, deleteSchemes, saveDefaultScheme } from '/@/utils/scheme/index';

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
      orderCode: {
        type: String,
        default: '',
      },
      allColumns: {
        type: Array as PropType<IColumnItem[]>,
        default: () => {
          return [];
        },
      },
      schemeData: {
        type: Object as PropType<ISchemeData>,
        default: () => {
          return {
            scheme: [],
          };
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
      'on-change-scheme',
    ],
    setup(props, ctx) {
      const { prefixCls } = useDesign('query-plan');
      const userStore = useUserStore();
      // 弹窗的dom
      const popup = ref();
      // 左侧搜索组件
      const queryForm = ref();
      // 快捷过滤用的选中下标
      const checkedIndex = ref(0);
      // 过滤方案默认坐标
      const schemeDefaultIndex = ref<number>(0);
      provide('schemeDefaultIndex', schemeDefaultIndex);
      provide('checkedIndex', checkedIndex);

      // 过滤方案数据，用于交互
      const schemeList = ref<ISchemeItem[]>([]);
      // 过滤方案数据副本，用于保存
      const schemeListTemp = ref<ISchemeItem[]>([]);
      // 快速过滤数据
      const fast = ref<IRequirementItem[]>([]);
      const currentSchemeItem = reactive<{ creatorId: string; isShare: boolean }>({
        creatorId: '',
        isShare: false,
      });
      const updateSchemeIsShareState = (isShareState: boolean) => {
        currentSchemeItem.isShare = isShareState;
        schemeList.value[checkedIndex.value].isShare = isShareState;
        schemeListTemp.value[checkedIndex.value].isShare = isShareState;
        handleSaveData('保存成功', schemeListTemp.value);
      };

      provide('updateSchemeIsShareState', updateSchemeIsShareState);

      // 外派列表过滤方案更新事件
      const onChangeScheme = (data: ISchemeItem) => {
        ctx.emit('on-change-scheme', data);
      };
      // 点击重置触发
      const onReset = () => {
        if (checkedIndex.value < schemeListTemp.value.length) {
          const popupListTemp = schemeListTemp.value[checkedIndex.value];
          schemeList.value[checkedIndex.value] = cloneDeep(popupListTemp);
          fast.value = popupListTemp.fast || [];
          queryForm.value.changeQueryList(fast.value);
          onSearch();
        }
      };
      // 点击查询方案触发
      const onQueryPlan = () => {
        popup.value.openPopup();
      };
      // 点击查询触发
      const onSearch = () => {
        const queryList = queryForm.value.queryList;
        const scheme = cloneDeep(schemeList.value[checkedIndex.value]);
        queryList.forEach((item) => {
          if (item.requirement) {
            scheme.requirement.push(item);
          }
        });
        onChangeScheme(scheme);
      };
      // 处理选中超出数据长度的情况
      const handleOverLength = () => {
        const index = schemeListTemp.value.length;
        if (checkedIndex.value >= index) {
          checkedIndex.value = index - 1;
        }
        // if (props.schemeCheckedIndex >= index) {
        //   handleChangeCheckedDefault(index - 1);
        // }
      };
      // 处理保存数据
      const handleSaveData = (msg: string, scheme: ISchemeItem[], query: IQueryItem[] = []) => {
        saveSchemesData(scheme[checkedIndex.value]).then((resolve) => {
          if (resolve) {
            schemeList.value[checkedIndex.value] = resolve;
          }
        });

        if (query.length > 0) {
          fast.value = query;
        }

        handleOverLength();
        useMessage(msg, 'success');
      };
      // 处理默认方案更新
      const handleChangeCheckedDefault = (checkedState: boolean) => {
        updateSchemeDefaultIndex(checkedState);
        saveDefaultScheme(schemeList.value[checkedIndex.value], checkedState);
      };

      const updateSchemeDefaultIndex = (schemeDefault: boolean) => {
        if (schemeDefault) {
          schemeDefaultIndex.value = checkedIndex.value;
        } else {
          schemeDefaultIndex.value = 0;
        }
      };

      // 接收选中下标更新
      const onChangeCheckedIndex = (index: number, isSearch = true) => {
        checkedIndex.value = index;

        // 共享方案状态更新
        const scheme = cloneDeep(schemeListTemp.value[checkedIndex.value]);
        queryForm.value.queryList = scheme.fast || [];
        scheme.fast &&
          scheme.fast.forEach((item) => {
            if (item.requirement) {
              scheme.requirement.push(item);
            }
          });

        if (isSearch) {
          onChangeScheme(scheme);
        }
      };
      // 接收条件数据更新
      const onChangeRequirement = (data: IRequirementItem[]) => {
        schemeList.value[checkedIndex.value].requirement = data;
      };
      // 接收排序数据更新
      const onChangeSort = (data: IOrderByItem[]) => {
        schemeList.value[checkedIndex.value].orderBy = data;
      };
      // 接收显示隐藏列更新
      const onChangeColumn = (data: ISchemeColumnsItem[]) => {
        schemeList.value[checkedIndex.value].columns = data;
      };
      // 接收标题更新
      const onTitleChange = (title: string) => {
        schemeList.value[checkedIndex.value].title = title;
        // 改完标题自动保存
        onSubmitScheme();
      };
      // 接收保存事件
      const onSubmitScheme = (fast: IQueryItem[] = []) => {
        schemeListTemp.value[checkedIndex.value] = cloneDeep(schemeList.value[checkedIndex.value]);

        handleSaveData('保存成功', schemeListTemp.value, fast);
      };
      // 接收另存事件
      const onSaveScheme = () => {
        schemeList.value.push({
          ...cloneDeep(schemeList.value[checkedIndex.value]),
          title: '',
          id: '0',
        });
        checkedIndex.value = schemeList.value.length - 1;
      };
      // 接收删除事件
      const onDelScheme = () => {
        deleteSchemes(schemeList.value[checkedIndex.value].id, userStore.getUserInfo.accountId);
        // 两个数据都需要删除
        const index = checkedIndex.value;
        const temp = [...schemeList.value];
        temp.splice(index, 1);
        schemeList.value = temp;
        checkedIndex.value = index - 1;

        if (index < schemeListTemp.value.length) {
          const data = [...schemeListTemp.value];
          data.splice(index, 1);
          schemeListTemp.value = data;
        }
      };
      // 接收重置事件
      const onResetScheme = () => {
        const popupUuid = schemeList.value[checkedIndex.value].id;
        const popupListTemp = schemeListTemp.value.find((item) => item.id === popupUuid);

        if (popupListTemp) {
          schemeList.value[checkedIndex.value] = cloneDeep(popupListTemp);
          onChangeScheme(schemeList.value[checkedIndex.value]);
        }
      };
      // 接收确认事件
      const onSubmit = () => {
        onSearch();
      };
      // 接受快速过滤保存设置
      const onSaveFast = (fast: IQueryItem[]) => {
        if (checkedIndex.value === 0) {
          schemeList.value.push({
            ...cloneDeep(schemeList.value[checkedIndex.value]),
            title: '缺省方案（个人）',
            id: '0',
            fast: fast,
          });
          checkedIndex.value = schemeList.value.length - 1;
        }
        let scheme = cloneDeep(schemeList.value[checkedIndex.value]);
        scheme.fast = fast;
        schemeListTemp.value[checkedIndex.value] = scheme;

        handleSaveData('保存成功', schemeListTemp.value, fast);
      };

      // 处理组件数据
      const handleData = (val = props.schemeData) => {
        if (val.scheme && val.scheme.length > 0) {
          currentSchemeItem.creatorId = val.scheme[checkedIndex.value].creatorId || '';
          currentSchemeItem.isShare = val.scheme[checkedIndex.value].isShare || false;
          schemeList.value = cloneDeep(val.scheme);
          schemeListTemp.value = cloneDeep(val.scheme);
          fast.value = cloneDeep(props.schemeData.scheme[props.schemeCheckedIndex].fast) || [];
        }
      };
      watch(
        () => props.schemeData,
        (val) => {
          handleData(val);
        }
      );

      watch(
        () => props.schemeCheckedIndex,
        (val) => {
          checkedIndex.value = val;
          schemeDefaultIndex.value = val;
        },
        {
          immediate: true,
        }
      );

      watch(
        () => checkedIndex.value,
        (v) => {
          currentSchemeItem.creatorId = schemeList.value[v].creatorId || '';
          currentSchemeItem.isShare = schemeList.value[v].isShare || false;
        }
      );
      provide('currentSchemeItem', currentSchemeItem);
      return {
        prefixCls,
        popup,
        queryForm,
        checkedIndex,
        schemeList,
        schemeListTemp,
        fast,
        handleData,
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
        handleChangeCheckedDefault,
        onSaveFast,
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
    margin-bottom: 16px;
    background-color: #fff;
    box-sizing: border-box;
  }
</style>
