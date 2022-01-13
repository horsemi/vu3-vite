<template>
  <DxScrollView direction="both">
    <div :class="prefixCls">
      <div :class="`${prefixCls}__left`">
        <DxSelectBox
          v-model:value="targetBill"
          value-expr="key"
          display-expr="caption"
          :items="BILL_CODE"
          placeholder="目标单据"
          @ValueChanged="changeSelectValue"
        />
        <DxButton
          style="margin-top: 10px"
          width="100%"
          text="加载默认过滤方案"
          type="normal"
          styling-mode="contained"
          @click="onLoadDefaultScheme"
        />
        <DxTextArea
          v-model:value="filterDataTextString"
          :class="`${prefixCls}__left__textArea`"
          height="calc(100% - 138px)"
          @change="changeTextAreaValue"
        />
        <DxButton
          style="margin-top: 10px"
          width="100%"
          text="保存为默认过滤方案"
          type="danger"
          styling-mode="contained"
          @click="onSaveDefaultScheme"
        />
      </div>
      <div :class="`${prefixCls}__right`">
        <QueryFrom />
        <DxTabPanel
          style="display: flex; flex-direction: column; margin-bottom: 5px"
          height="100%"
          :data-source="multiViewItems"
          :loop="true"
          :animation-enabled="true"
          :focus-state-enabled="false"
        >
          <template #item="{ data }">
            <div>
              <component :is="data.component" />
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
  import type { IColumnItem, IRelationShipItem } from '/@/model/types';
  import type { ISchemeItem, IRequirementItem } from '/@/components/QueryPopup/content/types';
  import type { ISchemeData } from '/@/components/QueryPlan/types';

  import { relationShips as getAdvicesRelationShips } from '/@/model/entity/shipping-advices';
  import { relationShips as getOrdersRelationShips } from '/@/model/entity/shipping-orders';

  import { defineComponent, ref, provide } from 'vue';
  import DxTabPanel from 'devextreme-vue/tab-panel';
  import DxButton from 'devextreme-vue/button';
  import DxTextArea from 'devextreme-vue/text-area';
  import DxSelectBox from 'devextreme-vue/select-box';
  import { DxScrollView } from 'devextreme-vue/scroll-view';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { initEntityColumn } from '/@/utils/bill/relationship';
  import { getSchemesData, saveDefaultSchemes } from '/@/utils/scheme/index';

  import { odsMessage } from '/@/components/Message';
  import { BILL_CODE } from './constant';
  import QueryFrom from '/@/components/QueryPlan/component/form.vue';
  import Content from '/@/components/QueryPopup/content/index.vue';
  import Requirement from '/@/components/QueryPopup/content/requirement.vue';
  import Sort from '/@/components/QueryPopup/content/sort.vue';
  import Column from '/@/components/QueryPopup/content/column.vue';
  import Summary from '/@/components/QueryPopup/content/summary.vue';

  export default defineComponent({
    name: 'FilterPlan',
    components: {
      QueryFrom,
      Content,
      Requirement,
      Sort,
      Column,
      Summary,
      DxTabPanel,
      DxButton,
      DxTextArea,
      DxSelectBox,
      DxScrollView,
    },
    setup() {
      const { prefixCls } = useDesign('filter-plan');
      const targetBill = ref('');
      const allColumns = ref<IColumnItem[]>([]);

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
          title: '汇总',
          component: 'summary',
        },
        {
          title: '显示隐藏列',
          component: 'column',
        },
      ];

      const schemeData = ref<ISchemeData>({
        scheme: [
          {
            id: '0',
            title: '默认过滤方案',
            requirement: [],
            orderBy: [],
            columns: [],
            summary: [],
            businessCode: '',
            relationShips: [],
          },
        ],
        checkedIndex: 0,
      });
      const schemeDataTemp = ref<ISchemeData>({
        scheme: [],
        checkedIndex: 0,
      });

      let filterDataTextString = Object.keys(schemeData.value.scheme[schemeData.value.checkedIndex])
        .length
        ? ref<string>(JSON.stringify(schemeData.value.scheme[schemeData.value.checkedIndex]))
        : ref<string>('');

      const relationShips = ref<IRelationShipItem[]>([]);

      function onChangeScheme(data: IRequirementItem[]) {
        schemeData.value.scheme[schemeData.value.checkedIndex].fast = data;
      }

      function changefilterData() {
        if (!targetBill.value) {
          odsMessage({
            type: 'error',
            message: '请选择目标单据',
          });
          return;
        }
        try {
          const _data = JSON.parse(filterDataTextString.value);

          schemeData.value.scheme[schemeData.value.checkedIndex].relationShips =
            _data.relationShips;
          initEntityColumnHandle().then(() => {
            schemeData.value.scheme[schemeData.value.checkedIndex].requirement = _data.requirement;
            schemeData.value.scheme[schemeData.value.checkedIndex].orderBy = _data.orderBy;
            schemeData.value.scheme[schemeData.value.checkedIndex].columns = _data.columns;
            schemeData.value.scheme[schemeData.value.checkedIndex].fast = _data.fast;
            schemeData.value.scheme[schemeData.value.checkedIndex].summary = _data.summary;
          });
        } catch {
          odsMessage({
            type: 'error',
            message: 'JSON格式存在问题',
          });
        }
      }
      function changefilterDataText() {
        filterDataTextString.value = JSON.stringify(
          schemeData.value.scheme[schemeData.value.checkedIndex]
        );
      }

      function changeTextAreaValue(e) {
        filterDataTextString.value = e.event.currentTarget.value;
      }

      function changeSelectValue(e) {
        switch (e.event.target.innerText) {
          case '发货单':
            relationShips.value = getOrdersRelationShips;
            resetFilterValue();
            initEntityColumnHandle();
            break;
          case '发货通知单':
            relationShips.value = getAdvicesRelationShips;
            resetFilterValue();
            initEntityColumnHandle();
            break;
        }
      }

      function onLoadDefaultScheme() {
        getSchemesData(targetBill.value).then((resolve) => {
          if (Array.isArray(resolve.scheme) && resolve.scheme.length > 0) {
            const schemeResult = resolve.scheme.filter((item) => item.creatorId === '0');

            if (schemeResult.length === 0) {
              odsMessage({
                type: 'warning',
                message: '无法加载该单据的默认过滤方案',
              });
            } else {
              schemeData.value.scheme[schemeData.value.checkedIndex] = schemeResult[0];
              changefilterDataText();
              odsMessage({
                type: 'success',
                message: '加载成功',
              });
            }
          } else {
            odsMessage({
              type: 'warning',
              message: '无法加载该单据的默认过滤方案',
            });
          }
        });
      }

      function onSaveDefaultScheme() {
        schemeData.value.scheme[schemeData.value.checkedIndex].businessCode = targetBill.value;
        saveDefaultSchemes(schemeData.value.scheme[schemeData.value.checkedIndex]);
      }

      /**
       * @description 重置过滤方案
       */
      function resetFilterValue() {
        filterDataTextString.value = '';
        schemeData.value.scheme[schemeData.value.checkedIndex].businessCode = '';
        schemeData.value.scheme[schemeData.value.checkedIndex].requirement = [
          {
            key: '',
            operator: '=',
            operatorList: [],
            value: undefined,
            type: '',
            datatypekeies: '',
            relationKey: '',
            logic: 'and',
            entityKey: '',
          },
        ];
        schemeData.value.scheme[schemeData.value.checkedIndex].orderBy = [];
        schemeData.value.scheme[schemeData.value.checkedIndex].columns = allColumns.value.filter(
          (item) => item.mustKey
        );
        schemeData.value.scheme[schemeData.value.checkedIndex].relationShips = [];
        schemeData.value.scheme[schemeData.value.checkedIndex].fast = [
          {
            key: '',
            operator: '=',
            operatorList: [],
            value: undefined,
            type: '',
            datatypekeies: '',
            relationKey: '',
            entityKey: '',
          },
        ];
      }

      /**
       * @description 根据关联实体获取字段
       */
      const initEntityColumnHandle = (
        scheme: ISchemeItem = schemeData.value.scheme[schemeData.value.checkedIndex]
      ): Promise<void> => {
        return new Promise((resolve) => {
          initEntityColumn(scheme, relationShips.value).then(({ _allColumns, _tableKey }) => {
            allColumns.value = _allColumns;
            resolve();
          });
        });
      };

      provide('allColumns', allColumns);
      provide('schemeData', schemeData);
      provide('schemeDataTemp', schemeDataTemp);
      provide('onChangeScheme', onChangeScheme);
      provide('initEntityColumnHandle', initEntityColumnHandle);
      provide('relationShips', relationShips);

      return {
        multiViewItems,
        BILL_CODE,
        prefixCls,
        allColumns,
        fast,
        targetBill,
        filterDataTextString,
        changefilterData,
        changefilterDataText,
        onChangeScheme,
        onSaveDefaultScheme,
        onLoadDefaultScheme,
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
