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

  import { defineComponent, ref } from 'vue';
  import { cloneDeep } from 'lodash-es';

  import { getColumns } from '/@/model/shipping-advices';
  import {
    defaultTableOptions,
    getCompleteColumns,
    getDataSource,
  } from '/@/components/Table/common';
  import { Persistent } from '/@/utils/cache/persistent';
  import { SCHEME_DATA_KEY } from '/@/enums/cacheEnum';
  import { ShippingAdviceApi } from '/@/api/ods/shipping-advices';
  import { deepMerge } from '/@/utils';

  import DxButton from 'devextreme-vue/button';

  import QueryPlan from '/@/components/QueryPlan/index.vue';

  export default defineComponent({
    name: 'OdsShippingAdviceList',
    components: {
      QueryPlan,
      DxButton,
    },
    setup() {
      const ORDER_CODE = 'shipping-advice';
      const options: Partial<ITableOptions> = {
        height: 'calc(100vh - 287px)',
        dataSourceOptions: {
          oDataOptions: {
            url: `/api/odata/${ORDER_CODE}s`,
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
          name: 'OdsShippingAdviceDetail',
          query: { Id: data.data.Id },
        });
      },

      onSubmitClick() {
        const selectionData = (this.$refs as any).dataGrid.getSelectedRowsData();
        ShippingAdviceApi.onShippingAdviceSubmit(
          selectionData.map((item) => item.GatheringParentCode)
        ).then(() => {
          this.onRefresh();
        });
      },
      onApplyClick() {
        const selectionData = (this.$refs as any).dataGrid.getSelectedRowsData();
        ShippingAdviceApi.onShippingAdviceApply(
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
