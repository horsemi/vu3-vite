<template>
  <div :class="[prefixCls]">
    <DxDataGrid
      ref="dataGrid"
      :data-source="tableData"
      :allow-column-resizing="tableOptions.allowColumnResizing"
      :height="tableOptions.height"
      :column-auto-width="tableOptions.columnAutoWidth"
      :hover-state-enabled="tableOptions.hoverStateEnabled"
      :show-column-lines="tableOptions.showColumnLines"
      :show-row-lines="tableOptions.showRowLines"
      :show-borders="tableOptions.showBorders"
      :row-alternation-enabled="tableOptions.rowAlternationEnabled"
      :customize-columns="customizeColumns"
      @selection-changed="onSelectionChanged"
    >
      <template v-for="(item, index) in tableColumns" :key="index">
        <DxColumn
          v-if="!item.hide"
          :data-field="item.key"
          :caption="item.caption"
          :data-type="item.type"
          :cell-template="item.cellTemplate"
          :alignment="item.alignment ? item.alignment : 'center'"
        >
          <DxLookup
            v-if="item.datatypekeies === 'enum'"
            :data-source="getGlobalEnumDataByCode(item.type)"
            value-expr="key"
            display-expr="description"
          />
        </DxColumn>
      </template>
      <DxSelection
        :select-all-mode="tableOptions.selection.allMode"
        :show-check-boxes-mode="tableOptions.selection.checkBoxesMode"
        mode="multiple"
      />
      <DxPaging
        :enabled="tableOptions.dataSourceOptions.paginate"
        :page-size="tableOptions.page.size"
        :page-index="pageIndex"
      />
      <DxPager
        :visible="tableOptions.dataSourceOptions.paginate && !tableOptions.useScrolling"
        :show-info="true"
        :show-navigation-buttons="true"
        info-text="共{1}页，{2}条数据"
        display-mode="full"
      />
      <DxScrolling v-if="tableOptions.useScrolling" mode="virtual" row-rendering-mode="virtual" />
      <template #billCode="{ data }">
        <div
          :class="`${prefixCls}__table-billno-column__wrap`"
          @click="$emit('handleBillCodeClick', data)"
          >{{ data.value }}</div
        >
      </template>
    </DxDataGrid>
    <div
      v-if="tableOptions.dataSourceOptions.paginate && !tableOptions.useScrolling"
      :class="`${prefixCls}__jump`"
      >跳至<input type="number" @change="handleJump" />页</div
    >
  </div>
</template>

<script lang="ts">
  import type { ITableOptions } from './types';
  import type { IColumnItem } from '/@/model/types';
  import type { ISchemeItem } from '../QueryPopup/content/types';

  import { defineComponent, onBeforeUnmount, ref, PropType, watch, nextTick } from 'vue';
  import { isEmpty } from 'lodash-es';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { defaultTableOptions, getFilter, getSort, getSelect, getCompleteColumns } from './common';
  import { useAppStore } from '/@/store/modules/app';

  import DxDataGrid, {
    DxSelection,
    DxPaging,
    DxColumn,
    DxPager,
    DxLookup,
    DxScrolling,
  } from 'devextreme-vue/data-grid';

  export default defineComponent({
    components: {
      DxDataGrid,
      DxSelection,
      DxPaging,
      DxPager,
      DxLookup,
      DxColumn,
      DxScrolling,
    },
    props: {
      tableOptions: {
        type: Object as PropType<ITableOptions>,
        default: () => {
          return defaultTableOptions;
        },
      },
      tableKey: {
        type: Array as PropType<string[]>,
        default: () => {
          return [];
        },
      },
      dataSource: {
        type: Object,
        default: () => {
          return {};
        },
      },
      columns: {
        type: Array as PropType<IColumnItem[]>,
        default: () => {
          return [];
        },
      },
      allColumns: {
        type: Array as PropType<IColumnItem[]>,
        default: () => {
          return [];
        },
      },
      filterScheme: {
        type: Object as PropType<ISchemeItem>,
        default: () => {
          return {};
        },
      },
    },
    emits: ['handleBillCodeClick', 'handleSelectionClick'],
    setup(props, ctx) {
      const { prefixCls } = useDesign('ods-table');
      const appStore = useAppStore();
      const dataGrid = ref();
      const pageIndex = ref(0);
      const tableData = ref();
      const tableColumns = ref<IColumnItem[]>([]);

      const onSelectionChanged = ({ selectedRowKeys, selectedRowsData }) => {
        ctx.emit('handleSelectionClick', selectedRowsData);
      };
      const handleJump = (e) => {
        const index = parseInt(e.target.value) - 1;
        pageIndex.value = index >= 0 ? index : 0;
      };
      const customizeColumns = () => {
        // console.log(columns);
      };

      const handleFilterScheme = (scheme: ISchemeItem) => {
        if (!isEmpty(tableData.value) && !isEmpty(scheme)) {
          const select = getSelect(props.allColumns, scheme.columns, props.tableKey);
          const filter = getFilter(scheme.requirement);
          const sort = getSort(scheme.orderBy, props.tableOptions.dataSourceOptions.sort);
          tableData.value.filter(filter);
          tableData.value.select(select);
          tableColumns.value = getCompleteColumns(props.allColumns, tableData.value.select());
          // 清空排序，处理相同字段desc失效
          dataGrid.value.instance.clearSorting();
          // 排序字段在列更新后加载，解决列未更新，排序无法加上问题
          nextTick(() => {
            tableData.value.sort(sort);
            search();
          });
        }
      };

      const search = () => {
        tableData.value.reload();
      };

      onBeforeUnmount(() => {
        props.dataSource && props.dataSource.dispose();
      });

      watch(
        () => props.filterScheme,
        (val) => {
          handleFilterScheme(val);
        },
        {
          immediate: true,
        }
      );

      watch(
        () => props.dataSource,
        (val) => {
          if (!isEmpty(val)) {
            tableData.value = val;
          }
        }
      );

      watch(
        () => props.columns,
        (val) => {
          tableColumns.value = val;
        },
        {
          immediate: true,
        }
      );

      function getGlobalEnumDataByCode(code: string | undefined) {
        return code && appStore.getGlobalEnumDataByCode(code);
      }

      return {
        dataGrid,
        tableData,
        tableColumns,
        prefixCls,
        pageIndex,
        onSelectionChanged,
        handleJump,
        customizeColumns,
        getGlobalEnumDataByCode,
        search,
      };
    },
    methods: {
      getSelectedRowsData() {
        const dataGrid = (this.$refs.dataGrid as any).instance;
        return dataGrid.getSelectedRowsData();
      },
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-ods-table';

  .@{prefix-cls} {
    position: relative;
    width: 100%;
    height: 100%;

    // 隔行换色
    .dx-datagrid .dx-row-alt > td,
    .dx-datagrid .dx-row-alt > tr > td {
      background-color: #fafafa;
    }

    // 行被选中样式
    .dx-datagrid-rowsview .dx-selection.dx-row:not(.dx-row-focused) > td,
    .dx-datagrid-rowsview .dx-selection.dx-row:not(.dx-row-focused) > tr > td,
    .dx-datagrid-rowsview .dx-selection.dx-row:not(.dx-row-focused):hover > td,
    .dx-datagrid-rowsview .dx-selection.dx-row:not(.dx-row-focused):hover > tr > td {
      background-color: #e6f7ff;
    }

    &__table-billno-column__wrap {
      color: #1890ff;
      text-decoration: underline;
      cursor: pointer;
    }

    // 分页器样式
    .dx-datagrid-pager {
      padding-top: 20px;
      padding-right: 150px;
      padding-bottom: 20px;
      border: none !important;
    }

    // 选中页码样式
    .dx-pager .dx-page-sizes .dx-selection,
    .dx-pager .dx-pages .dx-selection {
      color: #fff !important;
      background-color: #3694fd;
    }

    // 分压器禁用箭头容器样式
    .dx-pager .dx-pages .dx-navigate-button.dx-button-disable {
      color: #c8c9cc;
      opacity: 1;
    }

    // 分压器箭头容器样式
    .dx-pager .dx-pages .dx-next-button,
    .dx-pager .dx-pages .dx-prev-button {
      width: 33px;
      height: 33px;
      padding: 0;
      margin-right: 5px;
      color: #666;
      border: 1px solid #d3d3d3;
      border-radius: 4px;
      box-sizing: border-box;
    }

    // 分页器箭头样式
    .dx-pager .dx-pages .dx-next-button::before,
    .dx-pager .dx-pages .dx-prev-button::before {
      font-size: 17px;
    }

    // 分页器省略号样式
    .dx-pager .dx-pages .dx-separator {
      padding-right: 10px;
      padding-left: 5px;
    }

    // 页码样式
    .dx-pager .dx-pages .dx-page {
      width: 33px;
      height: 33px;
      padding: 0;
      margin: 0 5px 0 0;
      line-height: 31px;
      color: #666;
      text-align: center;
      border: 1px solid #d3d3d3;
      border-radius: 4px;
    }

    // 跳转分页样式
    &__jump {
      position: absolute;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      width: 150px;
      height: 73px;
      color: #959595;
      input {
        width: 60px;
        padding: 3px 10px;
        margin: 0 5px;
        border: 1px solid #d3d3d3;
        border-radius: 4px;
        outline: none;
      }
      // 隐藏输入框箭头样式
      input[type='number'] {
        -moz-appearance: textfield;
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }
      }
    }
  }
</style>
