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
      @selection-changed="onSelectionChanged"
    >
      <template v-for="(item, index) in tableColumns" :key="index">
        <DxColumn
          v-if="!item.hide"
          css-class="header-bold"
          :data-field="item.key"
          :allow-sorting="getSorting(item.allowSort, item.expand, item.relationKey)"
          :caption="item.caption"
          :data-type="item.type"
          :cell-template="getTemplate(item.cellTemplate, item.expand, item.relationKey)"
          :alignment="item.alignment ? item.alignment : 'center'"
        >
          <DxLookup
            v-if="item.type === 'enum'"
            :data-source="getGlobalEnumDataByCode(item.expand)"
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
        :show-page-size-selector="true"
        :allowed-page-sizes="[50, 100, 200]"
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
      <template #foundation="{ data: rowInfo }">
        <div
          v-if="
            tableColumns[rowInfo.columnIndex - 1] &&
            tableColumns[rowInfo.columnIndex - 1].expand &&
            rowInfo.data[tableColumns[rowInfo.columnIndex - 1].expand]
          "
          >{{
            rowInfo.data[tableColumns[rowInfo.columnIndex - 1].expand][
              tableColumns[rowInfo.columnIndex - 1].key.split(
                tableColumns[rowInfo.columnIndex - 1].expand + '_'
              )[1]
            ]
          }}</div
        >
      </template>
    </DxDataGrid>
    <div
      v-if="tableOptions.dataSourceOptions.paginate && !tableOptions.useScrolling && tableData"
      :class="`${prefixCls}__jump`"
      >跳至<input type="number" @change="handleJump" />页</div
    >
  </div>
</template>

<script lang="ts">
  import type { ITableOptions } from './types';
  import type { IColumnItem, IKeyType } from '/@/model/types';
  import type { ISchemeItem } from '../QueryPopup/content/types';

  import { defineComponent, onBeforeUnmount, ref, PropType, watch, nextTick } from 'vue';
  import { isEmpty } from 'lodash-es';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { defaultTableOptions, getCompleteColumns, getTableDataSource } from './common';
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
      tableKeyType: {
        type: Array as PropType<IKeyType[]>,
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

      const handleFilterScheme = (scheme: ISchemeItem) => {
        if (
          !isEmpty(scheme) &&
          !isEmpty(scheme.columns) &&
          props.allColumns.length > 0 &&
          props.tableKey.length > 0 &&
          props.tableKeyType.length > 0
        ) {
          const instance = dataGrid.value.instance;
          if (instance) {
            // 清空排序，处理相同字段desc失效
            instance.clearSorting();
            // 回到第一页
            instance.pageIndex(0);
          }
          tableData.value = getTableDataSource(
            props.tableOptions,
            scheme,
            props.allColumns,
            props.tableKey,
            props.tableKeyType
          );
          tableColumns.value = [];
          nextTick(() => {
            tableColumns.value = getCompleteColumns(props.allColumns, scheme.columns);
          });
        }
      };

      const search = () => {
        const instance = dataGrid.value.instance;
        if (instance && !isEmpty(tableData.value)) {
          instance.clearSelection();
          tableData.value.reload();
        }
      };

      const getSorting = (allowSort, expand, relationKey) => {
        if (expand && relationKey) {
          return false;
        } else if (allowSort !== undefined) {
          return allowSort;
        } else {
          return true;
        }
      };

      const getTemplate = (template, expand, relationKey) => {
        if (expand && relationKey) {
          return 'foundation';
        } else if (template) {
          return template;
        } else {
          return '';
        }
      };

      onBeforeUnmount(() => {
        if (!isEmpty(tableData.value)) {
          tableData.value.dispose();
        }
      });

      watch(
        () => props.filterScheme,
        (val) => {
          handleFilterScheme(val);
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

      function getSelectedRowsData() {
        return dataGrid.value.instance.getSelectedRowsData();
      }

      return {
        dataGrid,
        tableData,
        tableColumns,
        prefixCls,
        pageIndex,
        onSelectionChanged,
        handleJump,
        getGlobalEnumDataByCode,
        search,
        getSelectedRowsData,
        getSorting,
        getTemplate,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-ods-table';

  .@{prefix-cls} {
    position: relative;
    width: 100%;
    height: 100%;

    // 表头字段加粗
    .dx-header-row .header-bold {
      font-weight: bold;
    }

    // 隔行换色
    .dx-datagrid .dx-row-alt > td,
    .dx-datagrid .dx-row-alt > tr > td {
      background-color: #fafafa;
    }

    &__table-billno-column__wrap {
      color: #1890ff;
      text-decoration: underline;
      cursor: pointer;
    }

    .dx-datagrid-table .dx-freespace-row > td {
      // 去掉空余空间的边框，当指定表格高度时，会出现这个占满空余空间
      border: none !important;
    }

    // 分页器样式
    .dx-datagrid-pager {
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-width: 800px;
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
      height: 33px;
      padding: 0 10px;
      margin: 0 5px 0 0;
      line-height: 31px;
      color: #666;
      text-align: center;
      border: 1px solid #d3d3d3;
      border-radius: 4px;
    }

    // 行数设置样式
    .dx-pager .dx-page-sizes .dx-page-size {
      height: 33px;
      padding: 0 10px;
      line-height: 31px;
      text-align: center;
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
