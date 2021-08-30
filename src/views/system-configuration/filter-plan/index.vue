<template>
  <DxScrollView direction="both">
    <div :class="prefixCls">
      <div :class="`${prefixCls}__left`">
        <DxSelectBox
          :items="billType"
          placeholder="单据类型"
          value="发货单"
          @ValueChanged="changeSelectValue"
        />
        <DxTextArea
          v-model:value="filterDataTextString"
          :class="`${prefixCls}__left__textArea`"
          height="calc(100% - 46px)"
          @change="changeTextAreaValue"
        />
      </div>
      <div :class="`${prefixCls}__right`">
        <QueryFrom
          ref="queryForm"
          :columns="allColumns"
          :fast="filterData.fast"
          @on-save-fast="onSaveFast"
        />
        <DxTabPanel
          style="display: flex; flex-direction: column; margin-bottom: 5px"
          height="100%"
          :data-source="multiViewItems"
          :loop="true"
          :animation-enabled="true"
          :swipe-enabled="true"
          :focus-state-enabled="false"
        >
          <template #item="{ data }">
            <div>
              <component
                :is="data.component"
                :ref="data.component"
                :requirement="filterData.requirement"
                :order-by="filterData.orderBy"
                :columns="filterData.columns"
                :all-columns="allColumns"
                @on-change-requirement="onChangeRequirement"
                @on-change-sort="onChangeSort"
                @on-change-column="onChangeColumn"
              />
            </div>
          </template>
        </DxTabPanel>
        <div :class="`${prefixCls}__right__button`">
          <DxButton
            :width="120"
            text="解析JSON"
            type="normal"
            styling-mode="contained"
            @click="changefilterData"
          />
          <DxButton
            :width="120"
            text="生成JSON"
            type="normal"
            styling-mode="contained"
            @click="changefilterDataText"
          />
        </div>
      </div>
    </div>
  </DxScrollView>
</template>
<script lang="ts">
  import type { IMultiViewItem } from '/@/components/QueryPopup/content/types';
  import type { IColumnItem } from '/@/model/types';
  import type {
    IOrderByItem,
    IRequirementItem,
    ISchemeColumnsItem,
  } from '/@/components/QueryPopup/content/types';
  import type { IQueryItem } from '/@/components/QueryPlan/types';
  import { getColumns as getAdvicesColumns } from '/@/model/shipping-advices';
  import { getColumns as getOrdersColumns } from '/@/model/shipping-orders';

  import { defineComponent, ref, reactive } from 'vue';
  import DxTabPanel from 'devextreme-vue/tab-panel';
  import DxButton from 'devextreme-vue/button';
  import DxTextArea from 'devextreme-vue/text-area';
  import DxSelectBox from 'devextreme-vue/select-box';
  import { DxScrollView } from 'devextreme-vue/scroll-view';

  import { useDesign } from '/@/hooks/web/useDesign';

  import { useMessage } from '/@/hooks/web/useMessage';
  import { SHIPPINGADVICE, SHIPPINGORDER } from './constant';
  import QueryFrom from '/@/components/QueryPlan/component/form.vue';
  import Content from '/@/components/QueryPopup/content/index.vue';
  import Requirement from '/@/components/QueryPopup/content/requirement.vue';
  import Sort from '/@/components/QueryPopup/content/sort.vue';
  import Column from '/@/components/QueryPopup/content/column.vue';

  interface FilterData {
    requirement?: IRequirementItem[];
    orderBy?: IOrderByItem[];
    columns?: ISchemeColumnsItem[];
    fast?: IQueryItem[];
  }

  export default defineComponent({
    name: 'FilterPlan',
    components: {
      QueryFrom,
      Content,
      Requirement,
      Sort,
      Column,
      DxTabPanel,
      DxButton,
      DxTextArea,
      DxSelectBox,
      DxScrollView,
    },
    setup() {
      const { prefixCls } = useDesign('filter-plan');

      const queryForm = ref();
      const allColumns = ref<IColumnItem[]>([]);
      const advicesColumns = ref<IColumnItem[]>([]);
      const ordersColumns = ref<IColumnItem[]>([]);
      let filterData: FilterData = reactive({});
      let filterDataTextString = Object.keys(filterData).length
        ? ref<string>(JSON.stringify(filterData))
        : ref<string>('');
      const fast = ref<IRequirementItem[]>([]);
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

      const billType = [SHIPPINGORDER, SHIPPINGADVICE];

      function onChangeRequirement(data: IRequirementItem[]) {
        filterData.requirement = data;
      }

      function onChangeSort(data: IOrderByItem[]) {
        filterData.orderBy = data;
      }

      function onChangeColumn(data: ISchemeColumnsItem[]) {
        filterData.columns = data;
      }

      function onSaveFast(data: IRequirementItem[]) {
        filterData.fast = data;
      }

      function changefilterData() {
        try {
          filterData.requirement = JSON.parse(filterDataTextString.value).requirement;
          filterData.orderBy = JSON.parse(filterDataTextString.value).orderBy;
          filterData.columns = JSON.parse(filterDataTextString.value).columns;
          filterData.fast = JSON.parse(filterDataTextString.value).fast;
        } catch {
          useMessage('JSON格式存在问题', 'error');
        }
      }
      function changefilterDataText() {
        queryForm.value && queryForm.value.onSaveFast();
        filterDataTextString.value = JSON.stringify(filterData);
      }

      function changeTextAreaValue(e) {
        filterDataTextString.value = e.event.currentTarget.value;
      }

      function changeSelectValue(e) {
        switch (e.event.target.innerText) {
          case SHIPPINGORDER:
            allColumns.value = ordersColumns.value;
            resetFilterValue();
            break;
          case SHIPPINGADVICE:
            allColumns.value = advicesColumns.value;
            resetFilterValue();
            break;
          default:
            break;
        }
      }
      function resetFilterValue() {
        filterDataTextString.value = '';
        filterData.requirement = [];
        filterData.orderBy = [];
        filterData.columns = [];
        filterData.fast = [];
      }
      getAdvicesColumns().then((res) => {
        if (res) {
          const { columnList } = res;
          advicesColumns.value = columnList;
        }
      });
      getOrdersColumns().then((res) => {
        if (res) {
          const { columnList } = res;
          ordersColumns.value = columnList;
          allColumns.value = columnList;
        }
      });

      return {
        queryForm,
        multiViewItems,
        billType,
        prefixCls,
        allColumns,
        fast,
        filterData,
        filterDataTextString,
        onChangeRequirement,
        onChangeSort,
        onChangeColumn,
        changefilterData,
        changefilterDataText,
        onSaveFast,
        changeTextAreaValue,
        changeSelectValue,
        resetFilterValue,
      };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-filter-plan';

  .@{prefix-cls} {
    display: flex;
    width: 100%;
    height: calc(100vh - 136px);
    background-color: #fff;
    &__left {
      flex: 1;
      height: 100%;
      padding-top: 15px;
      overflow: auto;
      &__textArea {
        margin-top: 10px;
      }
    }
    &__right {
      flex: 4;
      height: calc(100% - 64px - 34px - 7px);
      padding-left: 20px;
      &__button {
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>
