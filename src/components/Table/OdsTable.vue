<template>
  <div :class="[prefixCls]">
    <DxDataGrid
      ref="dataGrid"
      :data-source="tableData"
      width="100%"
      :allow-column-resizing="options.allowColumnResizing"
      column-resizing-mode="widget"
      :column-min-width="50"
      :height="height ? height : options.height"
      :column-auto-width="options.columnAutoWidth"
      :hover-state-enabled="options.hoverStateEnabled"
      :show-column-lines="options.showColumnLines"
      :show-row-lines="options.showRowLines"
      :show-borders="options.showBorders"
      :row-alternation-enabled="options.rowAlternationEnabled"
      :cache-enabled="false"
      :remote-operations="remoteOperationValue"
      @selection-changed="onSelectionChanged"
      @option-changed="onOptionChanged"
      @cellClick="onCellClick"
    >
      <DxLoadPanel :enabled="false" />
      <template v-for="(item, index) in tableColumns" :key="index">
        <DxColumn
          v-if="!item.hide"
          :css-class="`${item.cssClass || ''} header-bold`"
          :data-field="item.key"
          :allow-sorting="getSorting(item.allowSort, item.expand, item.relationKey)"
          :caption="item.caption"
          :customize-text="
            item.customizeText
              ? item.customizeText
              : item.type === 'decimal'
              ? handleCustomizeDecimal
              : handleCustomizeText
          "
          :data-type="item.type"
          :cell-template="getTemplate(item.cellTemplate, item.expand, item.relationKey)"
          :alignment="getAlignment(item)"
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
        :select-all-mode="options.selection.allMode"
        :show-check-boxes-mode="options.selection.checkBoxesMode"
        mode="multiple"
      />
      <DxPaging
        :enabled="options.dataSourceOptions.paginate"
        :page-size="options.page.size"
        :page-index="pageIndex"
      />
      <DxPager
        :visible="options.dataSourceOptions.paginate && !options.useScrolling"
        :show-info="true"
        :show-navigation-buttons="true"
        :show-page-size-selector="true"
        :allowed-page-sizes="pageSizes"
        info-text="共{1}页，{2}条数据"
        display-mode="full"
      />
      <DxScrolling
        :mode="options.useScrolling ? 'virtual' : 'standard'"
        :row-rendering-mode="rowRenderingMode"
      />
      <template #billCode="{ data }">
        <div
          id="billcode"
          :class="`${prefixCls}__table-billno-column__wrap`"
          @click="$emit('handleBillCodeClick', data)"
          @mouseenter="getRowData(data)"
          >{{ data.value }}</div
        >
      </template>
      <template #foundation="{ data: rowInfo }">
        <div>{{ getFoundationData(rowInfo) }}</div>
      </template>
    </DxDataGrid>
    <DxContextMenu :data-source="contentMenuTitle" :width="200" target="#billcode">
      <template #item="{ data: e }">
        <div class="elementId" :data-clipboard-text="clipValue">
          {{ e.text }}
        </div>
      </template>
    </DxContextMenu>
    <div
      v-if="options.dataSourceOptions.paginate && !options.useScrolling && tableData"
      :class="`${prefixCls}__jump`"
      >跳至<input type="number" @change="handleJump" />页</div
    >
  </div>
</template>

<script lang="ts">
  import type { ITableOptions } from './types';
  import type { IColumnItem, IKeyType } from '/@/model/types';
  import type { ISchemeItem } from '../QueryPopup/content/types';

  import {
    defineComponent,
    onBeforeUnmount,
    ref,
    PropType,
    watch,
    nextTick,
    computed,
    onMounted,
    onActivated,
  } from 'vue';
  import { cloneDeep, isEmpty } from 'lodash-es';
  import { getOdataList } from '/@/api/ods/common';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { defaultTableOptions, getCompleteColumns } from './common';
  import { useAppStore } from '/@/store/modules/app';

  import { deepMerge } from '/@/utils';
  import DxContextMenu from 'devextreme-vue/context-menu';
  import DxDataGrid, {
    DxSelection,
    DxPaging,
    DxColumn,
    DxPager,
    DxLookup,
    DxScrolling,
    DxLoadPanel,
  } from 'devextreme-vue/data-grid';
  import Clipboard from 'clipboard';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getOdataQuery } from '/@/utils/odata';
  import CustomStore from 'devextreme/data/custom_store';
  import DataSource from 'devextreme/data/data_source';
  export default defineComponent({
    components: {
      DxDataGrid,
      DxSelection,
      DxPaging,
      DxPager,
      DxLookup,
      DxColumn,
      DxScrolling,
      DxContextMenu,
      DxLoadPanel,
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
      height: {
        type: String,
        default: '',
      },
      orderCode: {
        type: String,
        default: '',
      },
      systemCode: {
        type: String,
        default: '',
      },
    },
    emits: ['handleBillCodeClick', 'handleSelectionClick', 'optionChanged', 'cellClick'],
    setup(props, ctx) {
      const { prefixCls } = useDesign('ods-table');
      const appStore = useAppStore();
      const dataGrid = ref();
      const pageIndex = ref(0);
      const pageSize = ref(50);
      const pageSizes = [50, 100, 1000, 2000, 3000];
      const rowRenderingMode = ref('standard');
      const remoteOperationValue = { paging: true, sorting: true, summary: true };
      const contentMenuTitle = [
        {
          text: '复制内容',
        },
      ];

      const tableData = ref();
      const tableColumns = ref<IColumnItem[]>([]);
      const clipValue = ref('');
      const options = computed(() => {
        return deepMerge(cloneDeep(defaultTableOptions), props.tableOptions);
      });

      onMounted(() => {
        const clipboard = new Clipboard('.elementId');
        clipboard.on('success', function (e) {
          useMessage('复制成功', 'success');
          e.clearSelection();
        });
        clipboard.on('error', function () {
          useMessage('复制失败', 'error');
        });
      });
      onActivated(() => {
        hiddenVirtualRow();
      });

      // 处理keep-alive等情况下骨架屏遮挡列表数据，滚动条位置错误问题
      const hiddenVirtualRow = () => {
        const { dataSource, instance } = dataGrid.value;
        if (dataSource && dataSource.key && instance) {
          const key = dataSource.key();
          const items = dataSource.items();
          if (items.length > 1) {
            const preItem = { [key]: items[0][key] };
            const nextItem = { [key]: items[1][key] };
            // 滚动到第二条数据的位置，再回到第一条，刷新滚动状态
            instance.navigateToRow(nextItem);
            instance.navigateToRow(preItem);
          }
        }
      };

      const handleCustomizeDecimal = (cellInfo) => {
        const { value } = cellInfo;
        if (typeof value === 'number') {
          return value.toFixed(3);
        } else {
          return '—';
        }
      };

      const handleCustomizeText = (cellInfo) => {
        const { valueText } = cellInfo;
        if (valueText === '') {
          return '—';
        } else {
          return valueText;
        }
      };

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
          if (dataGrid.value && dataGrid.value.instance) {
            // 清空排序，处理相同字段desc失效
            dataGrid.value.instance.clearSorting();
            // 回到第一页
            dataGrid.value.instance.pageIndex(0);
            // 刷新表格，解决 tableColumns.value = [] 的时候 表头显示key
            dataGrid.value.instance.refresh();
          }
          if (tableData.value) {
            // 如果已经有datasource就销毁
            tableData.value.dispose();
          }
          // 获取数据前，清空列数据，解决列数据引起的排序和显示隐藏列问题
          tableColumns.value = [];
          // 等列数据渲染完后再去获取表格数据，还是解决列数据引起的排序和显示隐藏列问题
          nextTick(() => {
            // 重新 获取列数据
            tableColumns.value = getCompleteColumns(props.allColumns, scheme.columns);
            // 重新 new datasource
            getTableData();
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

      const getTableData = () => {
        tableData.value = new DataSource({
          store: new CustomStore({
            key: 'Id',
            load: async (loadOptions) => {
              if (Object.keys(loadOptions).length) {
                const result = await getOdataList(
                  props.orderCode,
                  getOdataQuery({
                    scheme: props.filterScheme,
                    allColumns: props.allColumns,
                    top: pageSize.value,
                    skip: pageIndex.value,
                    tableSort: loadOptions.sort,
                  }),
                  props.systemCode ? props.systemCode : undefined
                );

                const data: any[] = [];
                result.value.forEach((item) => {
                  data.push(item);
                  if (item.Items && item.Items.length) {
                    item.Items.forEach((def) => {
                      data.push(def);
                    });
                  }
                });

                return {
                  data,
                  totalCount: result['@odata.count'],
                };
              }
            },
          }),
        });
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

      const getAlignment = (item) => {
        if (item.type === 'int32' || item.type === 'int64' || item.type === 'decimal') {
          return 'right';
        } else if (item.type === 'boolean') {
          return 'center';
        } else {
          return 'left';
        }
      };

      const getFoundationData = (rowInfo) => {
        // 获取基础数据列的key，并以_分割
        const keyArr = rowInfo.column.name.split('_');
        // 获取关联的实体名称
        const expand = keyArr[0];
        // 获取实体中指定的属性名称
        const expandKey = keyArr[1];
        if (rowInfo.data[expand]) {
          return rowInfo.data[expand][expandKey];
        } else {
          return '—';
        }
      };

      const getTableDataSourceOption = () => {
        return tableData.value;
      };

      onBeforeUnmount(() => {
        tableData.value = null;
        // tableColumns.value = null;
        if (!isEmpty(tableData.value)) {
          tableData.value.dispose();
        }
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
        },
        {
          immediate: true,
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

      function getRowData(e) {
        clipValue.value = e.value;
      }
      function getGlobalEnumDataByCode(code: string | undefined) {
        return code && appStore.getGlobalEnumDataByCode(code);
      }

      function getSelectedRowsData() {
        return dataGrid.value.instance.getSelectedRowsData();
      }

      function onOptionChanged(e) {
        if (e.fullName === 'paging.pageIndex') {
          pageIndex.value = e.value;
        }
        if (e.fullName === 'paging.pageSize') {
          // 切换页码也会有滚动条问题
          pageSize.value = e.value;
          hiddenVirtualRow();
          rowRenderingMode.value = e.value >= 1000 ? 'virtual' : 'standard';
        }
        ctx.emit('optionChanged', e);
      }

      function onCellClick(e) {
        ctx.emit('cellClick', e);
      }

      return {
        dataGrid,
        options,
        tableData,
        tableColumns,
        prefixCls,
        pageIndex,
        pageSizes,
        onSelectionChanged,
        handleJump,
        getGlobalEnumDataByCode,
        search,
        getSelectedRowsData,
        getFoundationData,
        getSorting,
        getTemplate,
        getAlignment,
        handleCustomizeDecimal,
        handleCustomizeText,
        getRowData,
        clipValue,
        contentMenuTitle,
        rowRenderingMode,
        onOptionChanged,
        getTableDataSourceOption,
        onCellClick,
        remoteOperationValue,
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

    .dx-header-row
      > td
      > .dx-datagrid-text-content:not(.dx-sort-indicator):not(.dx-header-filter-indicator) {
      max-width: 102%;
    }
    // 给表头单元格加上左右边框
    .dx-datagrid .dx-datagrid-headers .dx-header-filter,
    .dx-datagrid .dx-datagrid-headers .dx-header-row > td {
      border-right: 1px solid #ebeef5;
      border-left: 1px solid #ebeef5;
    }
    // 表头底部框
    .dx-datagrid-headers .dx-datagrid-table .dx-row > td {
      border-bottom: 1px solid #ebeef5;
    }

    // 去掉单元格的左右边框
    .dx-datagrid .dx-column-lines > td {
      border-right: none;
      border-left: none;
    }
    .dx-datagrid .dx-row-lines > td {
      border-bottom: 1px solid #ebeef5;
    }

    // 重置单元格内边距
    .dx-datagrid .dx-row > td {
      padding: 12px;
    }

    // 隔行换色
    .dx-datagrid .dx-row-alt > td,
    .dx-datagrid .dx-row-alt > tr > td {
      background-color: #fafafa;
    }

    &__table-billno-column__wrap {
      color: #3694fd;
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
      padding-top: 16px;
      padding-right: 150px;
      padding-bottom: 16px;
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
      height: 65px;
      color: #959595;
      input {
        width: 60px;
        padding: 3px 10px;
        margin: 0 5px;
        border: 1px solid #d3d3d3;
        border-radius: 4px;
        outline: none;
        &:hover {
          border-color: rgba(81, 108, 133, 0.4);
        }
        &:focus {
          border-color: #337ab7;
        }
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
