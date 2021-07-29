<template>
  <div>
    <h1>欢迎来到ODS平台</h1>
    <div>
      <DxDropDownBox
        v-model:value="gridValue"
        v-model:opened="isGridBoxOpened"
        :accept-custom-value="true"
        placeholder="请选择"
        :open-on-field-click="false"
        :defer-rendering="false"
        :display-expr="gridBoxDisplayExpr"
        value-expr="Id"
        width="250"
        :on-initialized="onDropDownBoxInitialized"
        @focus-in="onFocusIn"
        @input="onInput"
      >
        <template #content>
          <DxDataGrid
            v-model:selected-row-keys="gridValue"
            :columns="gridColumns"
            :data-source="gridDataSource"
            :hover-state-enabled="true"
            height="100%"
            :on-initialized="onInitialized"
            @selection-changed="onSelectionChanged"
          >
            <DxSelection mode="single" />
            <DxPaging :enabled="true" :page-size="10" />
            <DxScrolling mode="virtual" />
          </DxDataGrid>
        </template>
      </DxDropDownBox>
    </div>
    <div>
      gridValue:
      {{ gridValue }}
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useDebounceFn } from '@vueuse/core';

  import DxDropDownBox from 'devextreme-vue/drop-down-box';
  import { DxDataGrid, DxSelection, DxPaging, DxScrolling } from 'devextreme-vue/data-grid';

  import { getOdsListUrlByCode, getDataSource } from '/@/api/ods/common';

  export default defineComponent({
    name: 'Analysis',
    components: {
      DxDropDownBox,
      DxDataGrid,
      DxSelection,
      DxPaging,
      DxScrolling,
    },
    setup() {
      const dropDownBox = ref();
      const dataGrid = ref();
      const gridValue = ref();
      const isGridBoxOpened = ref(false);
      const gridColumns = ['BillCode', 'BillTypeCode'];

      const dataSource = getDataSource(
        {
          select: ['Id', 'BillCode', 'BillTypeCode'],
        },
        {
          url: getOdsListUrlByCode('shipping-order'),
          version: 4,
        }
      );

      const gridDataSource = dataSource;
      const debounceFn = useDebounceFn(searchData, 1000);

      function onInitialized(e) {
        dataGrid.value = e.component;
      }

      function onDropDownBoxInitialized(e) {
        dropDownBox.value = e.component;
      }

      function gridBoxDisplayExpr(item) {
        if (item.BillCode) {
          return `${item.BillCode}`;
        } else {
          return '';
        }
      }

      function onFocusIn() {
        isGridBoxOpened.value = true;
      }

      function onSelectionChanged() {
        isGridBoxOpened.value = false;
      }

      function onInput(e) {
        const value = e.event.target.value;
        debounceFn(value);
      }

      function searchData(value: string) {
        if (typeof value === 'string') {
          gridDataSource.filter(['BillCode', 'contains', value]);
          gridDataSource.load();
        } else if (!value) {
          dataGrid.value.clearFilter();
        }
      }

      return {
        gridDataSource,
        gridColumns,
        dropDownBox,
        isGridBoxOpened,
        gridValue,
        onInitialized,
        onDropDownBoxInitialized,
        gridBoxDisplayExpr,
        onSelectionChanged,
        onFocusIn,
        onInput,
      };
    },
  });
</script>
