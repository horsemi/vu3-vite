<template>
  <div>
    <QueryPlan
      :filter-scheme="filterScheme"
      :all-columns="allColumns"
      :filter-list="filterList"
      :scheme-checked-index="schemeCheckedIndex"
      @on-filter-scheme="onFilterScheme"
      @on-search="onSearch"
    />
    <div class="example">
      <div class="btn__wrap">
        <div class="btn__box">
          <DxButton :width="76" text="提交" type="default" @click="onSubmitClick" />
          <DxButton :width="76" text="审核" @click="onApplyClick" />
          <DxButton :width="76" text="删除" />
          <DxDropDownButton :items="tabList" :width="98" text="标记" />
        </div>
        <div class="btn__box">
          <DxButton
            id="link"
            :width="112"
            text="汇总信息"
            @click="defaultVisible = !defaultVisible"
          >
          </DxButton>
          <DxButton :width="100" icon="refresh" text="刷新" />
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
    <DxPopover v-model:visible="defaultVisible" target="#link" position="bottom">
      <div v-for="(item, index) in summary" :key="index" class="summary">
        <span class="summary__text">{{ item.text }}</span>
        <span class="summary__num">{{ item.num }}</span>
      </div>
    </DxPopover>
  </div>
</template>

<script lang="ts">
import type { IColumnItem } from '/@/model/table/types';
import type { ISchemeColumnsItem, ISchemeItem } from '/@/components/QueryPopup/content/types';
import type { ITableOptions } from '/@/components/Table/type';

import { defineComponent, onMounted, ref } from 'vue';
import { cloneDeep } from 'lodash-es';

import { getColumns } from '/@/model/table/shipping-orders';
import { defaultTableOptions, getCompleteColumns, getDataSource } from '/@/components/Table/common';
import { Persistent } from '/@/utils/cache/persistent';
import { SCHEME_LIST_KEY, SCHEME_CHECKED_INDE_KEY } from '/@/enums/cacheEnum';
import { ShippingOrderApi } from '/@/api/ods/shipping-orders';
import { deepMerge } from '/@/utils';

import DxButton from 'devextreme-vue/button';
import DxDropDownButton from 'devextreme-vue/drop-down-button';
import { DxPopover } from 'devextreme-vue/popover';

import QueryPlan from '/@/components/QueryPlan/index.vue';

export default defineComponent({
  name: 'Analysis',
  components: {
    QueryPlan,
    DxButton,
    DxDropDownButton,
    DxPopover,
  },
  setup() {
    const tabList = ['加急单', '区分物流', '产品异常', '订单异常', '取消标识'];
    const summary = [
      {
        text: '数量汇总',
        num: 136,
      },
      {
        text: '包件数汇总',
        num: '358',
      },
      {
        text: '总包件数汇总',
        num: '358',
      },
      {
        text: '体积汇总',
        num: '153.52',
      },
      {
        text: '总体积汇总',
        num: '153.52',
      },
    ];
    const options: Partial<ITableOptions> = {
      height: 'calc(100vh - 287px)',
      dataSourceOptions: {
        oDataOptions: {
          url: '/api/odata/shipping-orders',
        },
      },
    };
    const defaultVisible = ref(false);
    const filterScheme = ref<ISchemeItem>();
    const tableOptions: ITableOptions = deepMerge(cloneDeep(defaultTableOptions), options);
    const tableKey = ref<string[]>([]);
    const dataSource = ref();
    const columns = ref<IColumnItem[] | undefined>();
    const allColumns = ref<IColumnItem[] | undefined>();
    const filterList = ref<ISchemeItem[]>([]);
    const schemeCheckedIndex = ref<number>(0);

    // const handleBillCodeClick = () => {
    //   go({ name: 'exampleDetails' });
    // };
    const onFilterScheme = (data: ISchemeItem) => {
      filterScheme.value = cloneDeep(data);
    };
    const onSearch = (data) => {
      const scheme = cloneDeep(filterScheme.value);
      scheme?.requirement.push(...data);
      filterScheme.value = cloneDeep(scheme);
    };
    const getQueryPlan = (allColumns) => {
      const oldSchemeList = Persistent.getLocal(SCHEME_LIST_KEY) as ISchemeItem[] | undefined;
      const oldSchemeCheckedIndex = Persistent.getLocal(SCHEME_CHECKED_INDE_KEY) as
        | number
        | undefined;
      if (oldSchemeCheckedIndex) {
        schemeCheckedIndex.value = oldSchemeCheckedIndex;
      }
      if (!oldSchemeList) {
        const columns: ISchemeColumnsItem[] = [];
        allColumns.forEach((item) => {
          columns.push({
            key: item.key,
            caption: item.caption,
            show: true,
          });
        });
        const schemeList = [
          {
            uuid: 0,
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
            columns,
          },
        ];
        Persistent.setLocal(SCHEME_LIST_KEY, schemeList);
      }
    };
    const handleTableData = async () => {
      const columnsData = await getColumns();
      if (columnsData) {
        const { columnList, key, keyType } = columnsData;
        allColumns.value = columnList;
        tableKey.value = key;
        getQueryPlan(allColumns.value);
        filterList.value = Persistent.getLocal(SCHEME_LIST_KEY) as ISchemeItem[];
        filterScheme.value = filterList.value[schemeCheckedIndex.value];
        dataSource.value = await getDataSource(tableOptions, filterScheme.value, key, keyType);
        columns.value = getCompleteColumns(allColumns.value, dataSource.value.select());
      }
    };

    onMounted(async () => {
      await handleTableData();
    });

    return {
      tableOptions,
      tableKey,
      dataSource,
      columns,
      allColumns,
      tabList,
      defaultVisible,
      summary,
      filterList,
      filterScheme,
      schemeCheckedIndex,
      // handleBillCodeClick,
      onFilterScheme,
      onSearch,
    };
  },
  methods: {
    handleBillCodeClick(data: any) {
      this.$router.push({
        name: 'exampleDetails',
        query: { Id: data.data.Id },
      });
    },
    onSubmitClick() {
      const selectionData = (this.$refs as any).dataGrid.getSelectedRowsData();
      ShippingOrderApi.onShippingOrderSubmit(selectionData.map((item) => item.GatheringParentCode));
    },
    onApplyClick() {
      const selectionData = (this.$refs as any).dataGrid.getSelectedRowsData();
      ShippingOrderApi.onShippingOrderApply(selectionData.map((item) => item.GatheringParentCode));
    },
  },
});
</script>

<style lang="less" scoped>
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
