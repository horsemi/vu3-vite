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
          <DxButton :width="76" text="提交" type="default" @click="onClick($event)" />
          <DxButton :width="76" text="审核" @click="onClick($event)" />
          <DxButton :width="76" text="删除" @click="onClick($event)" />
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
          <DxButton :width="100" icon="refresh" text="刷新" @click="onClick($event)" />
        </div>
      </div>
      <OdsTable
        :table-options="tableOptions"
        :data-source="dataSource"
        :columns="columns"
        :all-columns="allColumns"
        :filter-scheme="filterScheme"
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
  import { defineComponent, onMounted, ref } from 'vue';
  import { ITableOptions } from '/@/components/Table/type';
  import { useGo } from '/@/hooks/web/usePage';
  import QueryPlan from '../../../components/QueryPlan/index.vue';
  import DxButton from 'devextreme-vue/button';
  import DxDropDownButton from 'devextreme-vue/drop-down-button';
  import { DxPopover } from 'devextreme-vue/popover';
  import { getColumns } from '/@/model/shipping-orders';
  import { getDataSource } from '/@/components/Table/common';
  import { IColumnItem } from '/@/model/types';
  import { ISchemeColumnsItem, ISchemeItem } from '/@/components/QueryPopup/content/types';
  import { Persistent } from '/@/utils/cache/persistent';
  import { SCHEME_LIST_KEY, SCHEME_CHECKED_INDE_KEY } from '/@/enums/cacheEnum';
  import { cloneDeep } from 'lodash-es';

  export default defineComponent({
    name: 'Analysis',
    components: {
      QueryPlan,
      DxButton,
      DxDropDownButton,
      DxPopover,
    },
    setup() {
      const go = useGo();
      const allColumns = ref<IColumnItem[] | undefined>();
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
      const options: ITableOptions = {
        height: 'calc(100vh - 286px)',
        page: {
          size: 20,
        },
        dataSourceOptions: {
          sort: [{ selector: 'BillDate', desc: true }],
          oDataOptions: {
            url: '/api/odata/shipping-orders',
            key: 'BillCode',
          },
        },
      };
      const defaultVisible = ref(false);
      const filterScheme = ref<ISchemeItem | undefined>(undefined);
      const tableOptions = ref<ITableOptions | undefined>();
      const dataSource = ref();
      const columns = ref<IColumnItem[] | undefined>();
      const filterList = ref<ISchemeItem[]>([]);
      const schemeCheckedIndex = ref<number>(0);

      const handleBillCodeClick = () => {
        go('exampleDetails');
      };
      const onFilterScheme = (data: ISchemeItem) => {
        filterScheme.value = cloneDeep(data);
      };
      const onSearch = (data) => {
        console.log(data);
        const scheme = cloneDeep(filterList.value[schemeCheckedIndex.value]);
        console.log(scheme);
        scheme?.requirement.push(...data);
        filterScheme.value = cloneDeep(scheme);
      };

      onMounted(async () => {
        allColumns.value = await getColumns();
        getQueryPlan(allColumns.value);
        filterList.value = Persistent.getLocal(SCHEME_LIST_KEY) as ISchemeItem[];
        filterScheme.value = filterList.value[schemeCheckedIndex.value];
        const { customOptions, data } = await getDataSource(options, filterScheme.value);
        tableOptions.value = customOptions;
        dataSource.value = data;
        const newColums: IColumnItem[] = [];
        const select = dataSource.value.select();
        allColumns.value?.forEach((col) => {
          select.forEach((item) => {
            if (col.key === item) {
              newColums.push(col);
            }
          });
        });
        columns.value = newColums;
      });

      const getQueryPlan = (allColumns) => {
        const oldSchemeList = Persistent.getLocal(SCHEME_LIST_KEY) as ISchemeItem[] | undefined;
        const oldSchemeCheckedIndex = Persistent.getLocal(SCHEME_CHECKED_INDE_KEY) as number | undefined;
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
              mustKey: item.mustKey
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

      return {
        tableOptions,
        dataSource,
        columns,
        allColumns,
        tabList,
        defaultVisible,
        summary,
        filterList,
        filterScheme,
        schemeCheckedIndex,
        handleBillCodeClick,
        onFilterScheme,
        onSearch,
      };
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
