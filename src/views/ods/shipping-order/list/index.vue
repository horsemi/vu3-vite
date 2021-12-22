<template>
  <div class="list">
    <QueryPlan />
    <div v-loading="loading" class="example">
      <div class="btn__wrap">
        <div class="btn__box">
          <DxButton
            :width="76"
            text="提交"
            :disabled="!permissionStore.hasPermission(shippingOrderType.shippingOrderSumit)"
            type="default"
            @click="onSubmitClick"
          />
          <DxButton
            :width="76"
            text="审核"
            :disabled="!permissionStore.hasPermission(shippingOrderType.shippingOrderApply)"
            @click="onApplyClick"
          />
        </div>
        <div class="btn__box">
          <SummaryButton
            :order-code="ORDER_CODE"
            :all-columns="allColumns"
            :scheme="filterScheme"
            :odata-params="odataParams"
          />
          <DxButton
            :width="100"
            icon="refresh"
            :disabled="!permissionStore.hasPermission(shippingOrderType.shippingOrderQueryList)"
            text="刷新"
            @click="onRefresh"
          />
        </div>
      </div>
      <OdsTable
        ref="dataGrid"
        :table-options="options"
        :order-code="ORDER_CODE"
        :data-source="dataSource"
        :columns="columns"
        :query-list-permission="shippingOrderType.shippingOrderQueryList"
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

  import { defineComponent, ref, provide, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { cloneDeep } from 'lodash-es';
  import { usePermissionStore } from '/@/store/modules/permission';
  import { shippingOrderType } from '/@/enums/actionPermission/shipping-order';
  import { getColumns } from '/@/model/shipping-orders';
  import { getDefiniteColumns } from '/@/model/shipping-order-items';
  import { isArrayEmpty } from '/@/utils/bill/index';
  import { ShippingOrderApi } from '/@/api/ods/shipping-orders';
  import { getOdsListUrlByCode } from '/@/api/ods/common';
  import { getSchemesData } from '/@/utils/scheme/index';

  import DxButton from 'devextreme-vue/button';

  import QueryPlan from '/@/components/QueryPlan/index.vue';
  import SummaryButton from '/@/components/SummaryButton/index.vue';

  export default defineComponent({
    name: 'OdsShippingOrderList',
    components: {
      QueryPlan,
      SummaryButton,
      DxButton,
    },
    setup() {
      const router = useRouter();
      const permissionStore = usePermissionStore();

      const dataGrid = ref();
      const loading = ref(false);

      const ORDER_CODE = 'shipping-orders';
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

      const odataParams = computed(() => {
        return dataGrid.value && dataGrid.value.odataParams;
      });

      const onRefresh = () => {
        dataGrid.value.search();
      };

      const handleBillCodeClick = (data) => {
        router.push({
          name: 'OdsShippingOrderDetail',
          query: {
            id: data.data.id,
            billCode: data.data.billCode,
          },
        });
      };

      const onSubmitClick = () => {
        const selectionData = dataGrid.value.getSelectedRowsData() as {
          GatheringParentCode: string;
        }[];
        if (isArrayEmpty(selectionData)) {
          loading.value = true;
          ShippingOrderApi.onShippingOrderSubmit(
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
          ShippingOrderApi.onShippingOrderApply(
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
          let _allColumns: IColumnItem[] = [];
          if (base) {
            const { columnList, key, keyType } = base;
            columnList?.forEach((item) => {
              item.caption = `基本.${item.caption}`;
            });
            _allColumns.push(...columnList);
            tableKey.value = key;
            tableKeyType.value = keyType;
          }
          if (definite) {
            const { columnList } = definite;
            columnList?.forEach((item) => {
              item.caption = `明细.${item.caption}`;
              item.key = `Items.${item.key}`;
            });
            _allColumns.push(...columnList);
          }
          allColumns.value = _allColumns;
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
        options,
        tableKey,
        tableKeyType,
        dataSource,
        columns,
        allColumns,
        schemeData,
        filterScheme,
        odataParams,
        handleBillCodeClick,
        onChangeScheme,
        onSubmitClick,
        onApplyClick,
        onRefresh,
        shippingOrderType,
        permissionStore,
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
