<template>
  <div class="list">
    <QueryPlan
      ref="QueryPlan"
      :order-code="ORDER_CODE"
      :all-columns="allColumns"
      :scheme-data="schemeData"
      :scheme-checked-index="schemeCheckedIndex"
      @on-change-scheme="onChangeScheme"
    />
    <div v-loading="loading" class="example">
      <div class="btn__wrap">
        <div class="btn__box">
          <DxButton :width="76" text="提交" type="default" @click="onSubmitClick" />
          <DxButton :width="76" text="审核" @click="onApplyClick" />
        </div>
        <div class="btn__box">
          <DxButton :width="100" icon="refresh" text="刷新" @click="onRefresh" />
        </div>
      </div>
      <OdsTable
        ref="dataGrid"
        :table-options="tableOptions"
        :data-source="dataSource"
        :columns="columns"
        :all-columns="allColumns"
        :filter-scheme="filterScheme"
        :table-key="tableKey"
        @handle-bill-code-click="handleBillCodeClick"
      >
      </OdsTable>
    </div>
  </div>
</template>

<script lang="ts">
  import type { IColumnItem } from '/@/model/types';
  import type { ISchemeItem } from '/@/components/QueryPopup/content/types';
  import type { ITableOptions } from '/@/components/Table/types';
  import type { ISchemeData } from '/@/components/QueryPlan/types';

  import { defineComponent, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { cloneDeep } from 'lodash-es';

  import { getColumns } from '/@/model/shipping-orders';
  import {
    defaultTableOptions,
    getCompleteColumns,
    getDataSource,
  } from '/@/components/Table/common';
  import { Persistent } from '/@/utils/cache/persistent';
  import { SCHEME_DATA_KEY } from '/@/enums/cacheEnum';
  import { ShippingOrderApi } from '/@/api/ods/shipping-orders';
  import { deepMerge } from '/@/utils';
  import { getOdsListUrlByCode } from '/@/api/ods/common';

  import DxButton from 'devextreme-vue/button';

  import QueryPlan from '/@/components/QueryPlan/index.vue';

  export default defineComponent({
    name: 'OdsShippingOrderList',
    components: {
      QueryPlan,
      DxButton,
    },
    setup() {
      const router = useRouter();
      const dataGrid = ref();
      const loading = ref(false);
      const ORDER_CODE = 'shipping-order';
      const options: Partial<ITableOptions> = {
        height: 'calc(100vh - 287px)',
        dataSourceOptions: {
          oDataOptions: {
            url: getOdsListUrlByCode(ORDER_CODE),
          },
        },
      };
      const filterScheme = ref<ISchemeItem>({
        uuid: '',
        title: '',
        requirement: [],
        orderBy: [],
        columns: [],
      });
      const tableOptions: ITableOptions = deepMerge(cloneDeep(defaultTableOptions), options);
      const tableKey = ref<string[]>([]);
      const dataSource = ref();
      const columns = ref<IColumnItem[]>([]);
      const allColumns = ref<IColumnItem[]>([]);
      const schemeData = ref<ISchemeData>({
        scheme: [],
        fast: [],
        checkedIndex: 0,
      });
      const schemeCheckedIndex = ref<number>(0);

      const onRefresh = () => {
        dataGrid.value.search();
      };

      const handleBillCodeClick = (data) => {
        router.push({
          name: 'OdsShippingOrderDetail',
          query: { Id: data.data.Id },
        });
      };

      const onSubmitClick = () => {
        const selectionData = dataGrid.value.getSelectedRowsData();
        if (selectionData.length > 0) {
          loading.value = true;
          ShippingOrderApi.onShippingOrderSubmit(
            selectionData.map((item) => item.GatheringParentCode)
          ).then(() => {
            loading.value = false;
            onRefresh();
          }).catch(() => {
            loading.value = false;
          });
        }
      };

      const onApplyClick = () => {
        const selectionData = dataGrid.value.getSelectedRowsData();
        if (selectionData.length > 0) {
          loading.value = true;
          ShippingOrderApi.onShippingOrderApply(
            selectionData.map((item) => item.GatheringParentCode)
          ).then(() => {
            loading.value = false;
            onRefresh();
          }).catch(() => {
            loading.value = false;
          });
        }
      };

      const onChangeScheme = (data: ISchemeItem) => {
        filterScheme.value = cloneDeep(data);
      };

      const getTableData = () => {
        schemeData.value = (Persistent.getLocal(SCHEME_DATA_KEY) as any)[ORDER_CODE];
        schemeCheckedIndex.value = schemeData.value.checkedIndex;
        const scheme = cloneDeep(schemeData.value.scheme[schemeCheckedIndex.value]);
        const fast = schemeData.value.fast;
        if (fast.length > 0) {
          scheme.requirement.push(...fast);
        }
        filterScheme.value = scheme;
        getColumns().then((res) => {
          if (res) {
            const { columnList, key, keyType } = res;
            allColumns.value = columnList;
            tableKey.value = key;
            getDataSource(tableOptions, filterScheme.value, allColumns.value, key, keyType).then(
              (data) => {
                dataSource.value = data;
                columns.value = getCompleteColumns(allColumns.value, dataSource.value.select());
              }
            );
          }
        });
      };

      getTableData();

      return {
        ORDER_CODE,
        loading,
        dataGrid,
        tableOptions,
        tableKey,
        dataSource,
        columns,
        allColumns,
        schemeData,
        filterScheme,
        schemeCheckedIndex,
        handleBillCodeClick,
        onChangeScheme,
        onSubmitClick,
        onApplyClick,
        onRefresh,
      };
    },
  });
</script>

<style lang="less" scoped>
  .list {
    overflow: hidden;
  }

  .example {
    width: 100%;
    padding: 20px;
    padding-bottom: 0;
    background-color: #fff;
    .btn__wrap {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 20px;
      .btn__box {
        & > * {
          margin-right: 10px;
        }
        :nth-last-child(1) {
          margin-right: 0;
        }
      }
    }
  }

  .summary {
    display: flex;
    width: 200px;
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
    .summary__text,
    .summary__num {
      flex: 1;
      text-align: right;
    }
    .summary__num {
      margin-left: 14px;
      text-align: left;
    }
  }
</style>
