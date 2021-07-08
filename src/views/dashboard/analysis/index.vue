<template>
  <div class="list">
    <QueryPlan
      ref="QueryPlan"
      :all-columns="allColumns"
      :scheme-data="schemeData"
      :scheme-checked-index="schemeCheckedIndex"
      @on-change-scheme="onChangeScheme"
    />
    <div class="example">
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

  import { defineComponent, onMounted, ref } from 'vue';
  import { cloneDeep } from 'lodash-es';

  import { getColumns } from '/@/model/shipping-orders';
  import {
    defaultTableOptions,
    getCompleteColumns,
    getDataSource,
  } from '/@/components/Table/common';
  import { Persistent } from '/@/utils/cache/persistent';
  import { SCHEME_DATA_KEY, SCHEME_CHECKED_INDE_KEY } from '/@/enums/cacheEnum';
  import { ShippingOrderApi } from '/@/api/ods/shipping-orders';
  import { deepMerge } from '/@/utils';

  import DxButton from 'devextreme-vue/button';

  import QueryPlan from '/@/components/QueryPlan/index.vue';

  export default defineComponent({
    name: 'Analysis',
    components: {
      QueryPlan,
      DxButton,
    },
    setup() {
      const options: Partial<ITableOptions> = {
        height: 'calc(100vh - 287px)',
        dataSourceOptions: {
          oDataOptions: {
            url: '/api/odata/shipping-orders',
          },
        },
      };
      const filterScheme = ref<ISchemeItem>();
      const tableOptions: ITableOptions = deepMerge(cloneDeep(defaultTableOptions), options);
      const tableKey = ref<string[]>([]);
      const dataSource = ref();
      const columns = ref<IColumnItem[] | undefined>();
      const allColumns = ref<IColumnItem[] | undefined>();
      const schemeData = ref<ISchemeData>({
        scheme: [],
        fast: [],
      });
      const schemeCheckedIndex = ref<number>(0);

      // const handleBillCodeClick = () => {
      //   go({ name: 'exampleDetails' });
      // };
      const onChangeScheme = (data: ISchemeItem) => {
        filterScheme.value = cloneDeep(data);
      };
      const getQueryPlan = () => {
        const oldSchemeData = Persistent.getLocal(SCHEME_DATA_KEY);
        const oldSchemeCheckedIndex = Persistent.getLocal(SCHEME_CHECKED_INDE_KEY) as
          | number
          | undefined;
        if (oldSchemeCheckedIndex) {
          schemeCheckedIndex.value = oldSchemeCheckedIndex;
        }
        if (!oldSchemeData) {
          const schemeData = {
            scheme: [
              {
                uuid: '0',
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
                  'BillCode',
                  'BillDate',
                  'DocumentStatus',
                  'DeliveryWarehouseCode',
                  'Nickname',
                  'DeliveryPointCode',
                  'ThreeServicePointCode',
                  'TotalVolume',
                  'TotalPackage',
                ],
              },
            ],
            fast: [
              {
                requirement: '',
                operator: '=',
                operatorList: [],
                value: '',
                type: '',
                datatypekeies: '',
              },
            ],
          };
          Persistent.setLocal(SCHEME_DATA_KEY, schemeData);
        }
      };
      const handleTableData = async () => {
        getQueryPlan();
        schemeData.value = Persistent.getLocal(SCHEME_DATA_KEY) as ISchemeData;
        const scheme = cloneDeep(schemeData.value.scheme[schemeCheckedIndex.value]);
        const fast = schemeData.value.fast;
        if (fast.length > 0) {
          scheme.requirement.push(...fast);
        }
        filterScheme.value = scheme;
        const columnsData = await getColumns();
        if (columnsData) {
          const { columnList, key, keyType } = columnsData;
          allColumns.value = columnList;
          tableKey.value = key;
          dataSource.value = await getDataSource(
            tableOptions,
            filterScheme.value,
            allColumns.value,
            key,
            keyType
          );
          columns.value = getCompleteColumns(allColumns.value, dataSource.value.select());
        }
      };

      onMounted(async () => {
        await handleTableData();
      });

      onMounted(async () => {
        await handleTableData();
      });

      return {
        tableOptions,
        tableKey,
        dataSource,
        columns,
        allColumns,
        schemeData,
        filterScheme,
        schemeCheckedIndex,
        // handleBillCodeClick,
        onChangeScheme,
      };
    },
    methods: {
      handleBillCodeClick(data: any) {
        this.$router.push({
          name: 'ShippingOrderDetail',
          query: { Id: data.data.Id },
        });
      },

      onSubmitClick() {
        const selectionData = (this.$refs as any).dataGrid.getSelectedRowsData();
        ShippingOrderApi.onShippingOrderSubmit(
          selectionData.map((item) => item.GatheringParentCode)
        ).then(() => {
          this.onRefresh();
        });
      },
      onApplyClick() {
        const selectionData = (this.$refs as any).dataGrid.getSelectedRowsData();
        ShippingOrderApi.onShippingOrderApply(
          selectionData.map((item) => item.GatheringParentCode)
        ).then(() => {
          this.onRefresh();
        });
      },
      onRefresh() {
        (this.$refs.dataGrid as any).search();
      },
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
