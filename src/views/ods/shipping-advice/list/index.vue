<template>
  <div class="list">
    <QueryPlan />
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
        :table-options="options"
        :order-code="ORDER_CODE"
        :data-source="dataSource"
        :columns="columns"
        :all-columns="allColumns"
        :filter-scheme="filterScheme"
        :table-key="tableKey"
        :table-key-type="tableKeyType"
        @handle-bill-code-click="handleBillCodeClick"
      >
      </OdsTable>
    </div>
  </div>
</template>

<script lang="ts">
  import type { IColumnItem, IKeyType } from '/@/model/types';
  import type { ISchemeItem } from '/@/components/QueryPopup/content/types';
  import type { ITableOptions } from '/@/components/Table/types';
  import type { ISchemeData } from '/@/components/QueryPlan/types';

  import { defineComponent, ref, provide } from 'vue';
  import { useRouter } from 'vue-router';
  import { cloneDeep } from 'lodash-es';

  import { getColumns } from '/@/model/shipping-advices';
  import { getDefiniteColumns } from '/@/model/shipping-advice-items';
  import { isArrayEmpty } from '/@/utils/bill/index';
  import { ShippingAdviceApi } from '/@/api/ods/shipping-advices';
  import { getOdsListUrlByCode } from '/@/api/ods/common';
  import { getSchemesData } from '/@/utils/scheme/index';

  import DxButton from 'devextreme-vue/button';

  import QueryPlan from '/@/components/QueryPlan/index.vue';

  export default defineComponent({
    name: 'OdsShippingAdviceList',
    components: {
      QueryPlan,
      DxButton,
    },
    setup() {
      const router = useRouter();
      const dataGrid = ref();
      const queryPlan = ref();
      const loading = ref(false);

      const ORDER_CODE = 'shipping-advices';
      const options: Partial<ITableOptions> = {
        height: 'calc(100vh - 276px)',
        dataSourceOptions: {
          oDataOptions: {
            url: getOdsListUrlByCode(ORDER_CODE),
          },
        },
      };
      const filterScheme = ref<ISchemeItem>();
      const tableKey = ref<string[]>([]);
      const tableKeyType = ref<IKeyType[]>([]);
      const dataSource = ref();
      const columns = ref<IColumnItem[]>([]);
      const allColumns = ref<IColumnItem[]>([]);
      const schemeData = ref<ISchemeData>({
        scheme: [],
        checkedIndex: 0,
      });
      const schemeDataTemp = ref<ISchemeData>({
        scheme: [],
        checkedIndex: 0,
      });
      const schemeDefaultIndex = ref<number>(0);

      const onRefresh = () => {
        dataGrid.value.search();
      };

      const handleBillCodeClick = (data) => {
        router.push({
          name: 'OdsShippingAdviceDetail',
          query: {
            Id: data.data.Id,
            BillCode: data.data.BillCode,
          },
        });
      };

      const onSubmitClick = () => {
        const selectionData = dataGrid.value.getSelectedRowsData() as {
          GatheringParentCode: string;
        }[];
        if (isArrayEmpty(selectionData)) {
          loading.value = true;
          ShippingAdviceApi.onShippingAdviceSubmit(
            selectionData.map((item) => item.GatheringParentCode)
          )
            .then(() => {
              loading.value = false;
              onRefresh();
            })
            .catch(() => {
              loading.value = false;
            });
        }
      };

      const onApplyClick = () => {
        const selectionData = dataGrid.value.getSelectedRowsData() as {
          GatheringParentCode: string;
        }[];
        if (isArrayEmpty(selectionData)) {
          loading.value = true;
          ShippingAdviceApi.onShippingAdviceApply(
            selectionData.map((item) => item.GatheringParentCode)
          )
            .then(() => {
              loading.value = false;
              onRefresh();
            })
            .catch(() => {
              loading.value = false;
            });
        }
      };

      const onChangeScheme = (data: ISchemeItem) => {
        filterScheme.value = cloneDeep(data);
      };

      const getTableData = async () => {
        const schemeResult = await getSchemesData(ORDER_CODE);

        schemeData.value.checkedIndex = schemeResult.checkedIndex;
        schemeData.value.scheme = schemeResult.scheme;
        schemeDataTemp.value = cloneDeep(schemeData.value);
        schemeDefaultIndex.value = schemeData.value.checkedIndex;
        const scheme = cloneDeep(schemeData.value.scheme[schemeDefaultIndex.value]);

        const fast = scheme.fast || [];
        if (fast.length > 0) {
          scheme.requirement.push(...fast);
        }
        Promise.all([getColumns(), getDefiniteColumns()]).then(([base, definite]) => {
          if (base) {
            const { columnList, key, keyType } = base;
            allColumns.value.push(...columnList);
            tableKey.value = key;
            tableKeyType.value = keyType;
          }
          if (definite) {
            const { columnList } = definite;
            allColumns.value.push(...columnList);
          }
          filterScheme.value = scheme;
        });
      };

      getTableData();

      provide('allColumns', allColumns);
      provide('schemeData', schemeData);
      provide('schemeDataTemp', schemeDataTemp);
      provide('schemeDefaultIndex', schemeDefaultIndex);
      provide('onChangeScheme', onChangeScheme);

      return {
        ORDER_CODE,
        loading,
        dataGrid,
        queryPlan,
        options,
        tableKey,
        tableKeyType,
        dataSource,
        columns,
        allColumns,
        schemeData,
        filterScheme,
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
    padding: 16px;
    padding-bottom: 0;
    background-color: #fff;
    .btn__wrap {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 16px;
      .btn__box {
        & > * {
          margin-right: 8px;
        }
        :nth-last-child(1) {
          margin-right: 0;
        }
      }
    }
  }
</style>
