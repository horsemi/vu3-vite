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
      @dataErrorOccurred="onDataErrorOccurred"
      @cellPrepared="onCellPrepared"
    >
      <DxLoadPanel :enabled="false" />
      <template v-for="item in tableColumns" :key="item.key">
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
          :alignment="getAlignment(item)"
          :cell-template="getTemplate(item)"
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
      <DxSummary v-if="summaryList.length > 0">
        <DxTotalItem
          v-for="item in summaryList"
          :key="item.columnName"
          :name="item.columnName"
          :column="item.columnName"
          :show-in-column="item.columnName"
          :customize-text="item.showSummaryFn"
        >
        </DxTotalItem>
      </DxSummary>
      <template #billCode="{ data }">
        <ContextMenu>
          <template #default>
            <div
              id="billcode"
              :class="`${prefixCls}__table-billno-column__wrap`"
              @click="$emit('handleBillCodeClick', data)"
              @mouseenter="getRowData(data)"
              >{{ data.value }}</div
            >
          </template>
          <template #content>
            <div class="elementId" :data-clipboard-text="clipValue">复制内容</div>
          </template>
        </ContextMenu>
      </template>
    </DxDataGrid>

    <div
      v-if="options.dataSourceOptions.paginate && !options.useScrolling && tableData"
      :class="`${prefixCls}__jump`"
      >跳至<input type="number" @change="handleJump" />页</div
    >
  </div>
</template>

<script lang="ts">
  import type { IOdataParams, ITableOptions, ITableSummary } from './types';
  import type { IColumnItem } from '/@/model/types';
  import type { ISchemeItem, ISummaryItem } from '../QueryPopup/content/types';

  import {
    defineComponent,
    onBeforeUnmount,
    ref,
    PropType,
    watch,
    nextTick,
    computed,
    onActivated,
    onDeactivated,
  } from 'vue';
  import { cloneDeep, isEmpty, merge } from 'lodash-es';
  import { getOdataList } from '/@/api/ods/common';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { clientSummary, defaultTableOptions, getCompleteColumns } from './common';
  import { usePermissionStore } from '/@/store/modules/permission';

  import { useAppStore } from '/@/store/modules/app';

  import DxDataGrid, {
    DxSelection,
    DxPaging,
    DxColumn,
    DxPager,
    DxLookup,
    DxScrolling,
    DxLoadPanel,
    DxSummary,
    DxTotalItem,
  } from 'devextreme-vue/data-grid';
  import Clipboard from 'clipboard';
  import { odsMessage } from '/@/components/Message';

  import { getOdataQuery } from '/@/utils/odata';
  import CustomStore from 'devextreme/data/custom_store';
  import DataSource from 'devextreme/data/data_source';

  import ContextMenu from '/@/components/ContextMenu/index.vue';
  export default defineComponent({
    components: {
      DxDataGrid,
      DxSelection,
      DxPaging,
      DxPager,
      DxLookup,
      DxColumn,
      DxScrolling,
      DxLoadPanel,
      DxSummary,
      DxTotalItem,
      ContextMenu,
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
          return ['Id'];
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
      queryListPermission: {
        type: String,
        default: '',
      },
    },
    emits: [
      'handleBillCodeClick',
      'handleSelectionClick',
      'optionChanged',
      'cellClick',
      'onLoaded',
      'onLoad',
    ],
    setup(props, ctx) {
      const { prefixCls } = useDesign('ods-table');
      const permissionStore = usePermissionStore();
      const appStore = useAppStore();
      const dataGrid = ref();
      const odataParams = ref<Partial<IOdataParams>>();
      const pageIndex = ref(0);
      const pageSize = ref(50);
      const pageSizes = [50, 100, 1000, 2000, 3000];
      const rowRenderingMode = ref('standard');
      const remoteOperationValue = { paging: true, sorting: true, summary: true };
      let clipboard: any = null;
      // 记录滚动条位置
      const tableScrollable = {
        top: 0,
        left: 0,
      };

      const mergeData: { cols: string[]; rows: number[] } = {
        cols: [],
        rows: [],
      };

      const tableData = ref();
      const tableColumns = ref<IColumnItem[]>([]);
      const summaryList = ref<ITableSummary[]>([]);
      const clipValue = ref('');
      const options = computed(() => {
        return merge(cloneDeep(defaultTableOptions), props.tableOptions);
      });

      const SearchPermission = computed(() => {
        return permissionStore.hasPermission(props.queryListPermission);
      });

      const summaryData = computed(() => {
        return tableData.value.items().map((item, index) => {
          const temp = { ...item };
          if (mergeData.rows.includes(index)) {
            mergeData.cols.forEach((col) => {
              temp[col] = '';
            });
          }
          return temp;
        });
      });

      const mainKey = computed(() => {
        return props.tableKey[0];
      });

      // TODO: 表格key待定
      const dataGridKey = computed(() => {
        // 解决不关联明细时使用明细的tableKey
        let index = props.tableKey.length - 1;
        if (props.filterScheme.relationShips.length) {
          const relationShips = props.filterScheme.relationShips.filter((item) => item.value);
          index = relationShips.length - 1;
        }
        return props.tableKey[index];
      });

      onActivated(() => {
        clipboard = new Clipboard('.elementId');
        clipboard.on('success', function (e) {
          odsMessage({
            type: 'success',
            message: '复制成功',
          });
          e.clearSelection();
        });
        clipboard.on('error', function () {
          odsMessage({
            type: 'error',
            message: '复制失败',
          });
        });
        scrollToTable();
      });
      onDeactivated(() => {
        (clipboard as any).destroy();
        clipboard = null;
        resetTableScrollable();
      });

      const resetTableScrollable = () => {
        const { instance } = dataGrid.value;
        tableScrollable.top = instance.getScrollable().scrollTop();
        tableScrollable.left = instance.getScrollable().scrollLeft();
      };

      // 处理keep-alive等情况下骨架屏遮挡列表数据，滚动条位置错误问题
      const scrollToTable = () => {
        const { instance } = dataGrid.value;
        instance.getScrollable().scrollTo(tableScrollable);
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

      const handleCustomOptionText = (cellInfo) => {
        if (cellInfo.value) {
          return '生效';
        } else {
          return '失效';
        }
      };

      // TODO: 明细可勾选后，数据重复问题
      const onSelectionChanged = ({ selectedRowKeys, selectedRowsData }) => {
        ctx.emit('handleSelectionClick', selectedRowsData);
      };

      const handleJump = (e) => {
        const index = parseInt(e.target.value) - 1;
        pageIndex.value = index >= 0 ? index : 0;
      };

      // TODO: 是否可精简
      // 处理汇总信息
      const handleClientSummary = (summary: ISummaryItem[]) => {
        if (!summary || !summary.length) return;
        const _summary: ITableSummary[] = [];
        summary?.forEach((item) => {
          item.mode === 'page' &&
            _summary.push({
              columnName: item.key,
              showSummaryFn: () => {
                return clientSummary({
                  summary: { columnName: item.key, summaryType: item.type },
                  source: summaryData.value,
                  allColumns: props.allColumns,
                });
              },
            });
        });
        summaryList.value = _summary;
      };

      const handleFilterScheme = (scheme: ISchemeItem) => {
        if (scheme.columns && props.allColumns.length > 0) {
          if (dataGrid.value && dataGrid.value.instance) {
            // 清空排序，处理相同字段desc失效
            // dataGrid.value.instance.clearSorting();
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
            if (SearchPermission.value) {
              // 重新 new datasource
              getTableData();

              // 重新 获取列数据
              tableColumns.value = getCompleteColumns(props.allColumns, scheme.columns);
              nextTick(() => {
                handleClientSummary(scheme?.summary);
              });
            }
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

      // 初始化合并列数据
      const initMergeData = (res) => {
        const { relationShips } = props.filterScheme;
        // 判断是否需要合并
        const mergeFlag =
          relationShips?.findIndex((item) => !item.isMainEntity && item.value) !== -1;
        mergeData.cols = [];
        mergeData.rows = [];
        if (mergeFlag) {
          const { columns } = props.filterScheme;
          const isMainEntityCode = relationShips?.find((item) => item.isMainEntity)?.entityCode;
          // 查找哪些key需要合并 = 哪些key的属性值要清空
          columns.forEach((item) => {
            if (!item.entityKey || item.entityKey === isMainEntityCode) {
              mergeData.cols.push(item.key);
            }
          });
          // 查找哪些行需要合并
          // 一般来说第一条不需要合并，第一条以后主键重复的需要合并
          const obj = {};
          res.map((item, index) => {
            obj[item[mainKey.value]]
              ? mergeData.rows.push(index)
              : (obj[item[mainKey.value]] = item[mainKey.value]);
            return item;
          });
        }
      };

      const getTableData = () => {
        tableData.value = new DataSource({
          store: new CustomStore({
            key: dataGridKey.value,
            load: async (loadOptions) => {
              if (Object.keys(loadOptions).length) {
                const params = getOdataQuery({
                  scheme: props.filterScheme,
                  allColumns: props.allColumns,
                  tableSort: loadOptions.sort,
                  defaultSort: options.value.dataSourceOptions.sort,
                  tableKey: props.tableKey,
                });
                odataParams.value = params;

                const dataParams = { ...params, $top: pageSize.value };
                dataParams['$skip'] = loadOptions.skip;

                const totalCountParams = { $aggregate: 'count(1)' };
                params['$filter'] && (totalCountParams['$filter'] = params['$filter']);
                params['$expand'] && (totalCountParams['$expand'] = params['$expand']);

                const [res, totalCount] = await Promise.all([
                  getOdataList(
                    props.orderCode,
                    dataParams,
                    props.systemCode ? props.systemCode : undefined
                  ),
                  getOdataList(
                    props.orderCode,
                    totalCountParams,
                    props.systemCode ? props.systemCode : undefined
                  ),
                ]);

                initMergeData(res);

                return {
                  data: res,
                  totalCount: totalCount[0]['Count'] || 0,
                };
              }
            },
            onLoaded() {
              ctx.emit('onLoaded');
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

      const getTemplate = (item) => {
        if (item.cellTemplate) {
          return item.cellTemplate;
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
        return code && appStore.getGlobalEnumDataByCode(code.toLowerCase());
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
          tableScrollable.top = 0;
          tableScrollable.left = 0;
          scrollToTable();

          pageSize.value = e.value;
          // 切换页码时，切到第一页
          pageIndex.value = 0;
          rowRenderingMode.value = e.value >= 1000 ? 'virtual' : 'standard';
        }
        if (
          e.fullName.includes('sortOrder') ||
          e.fullName === 'paging.pageIndex' ||
          e.fullName === 'paging.pageSize'
        ) {
          ctx.emit('onLoad');
        }
        ctx.emit('optionChanged', e);
      }

      function onCellClick(e) {
        ctx.emit('cellClick', e);
      }

      // 数据发生错误时，把loading取消
      function onDataErrorOccurred() {
        ctx.emit('onLoaded');
      }

      // 合并单元格
      function onCellPrepared(e) {
        if (
          e.rowIndex >= 0 &&
          mergeData.cols.length &&
          mergeData.rows.length &&
          mergeData.cols.includes(e.column.dataField) &&
          mergeData.rows.includes(e.rowIndex)
        ) {
          e.cellElement.innerHTML = '—';
        }
      }

      return {
        dataGrid,
        options,
        tableData,
        tableColumns,
        odataParams,
        prefixCls,
        pageIndex,
        pageSizes,
        summaryList,
        onSelectionChanged,
        handleJump,
        getGlobalEnumDataByCode,
        search,
        getSelectedRowsData,
        getSorting,
        getTemplate,
        getAlignment,
        handleCustomizeDecimal,
        handleCustomizeText,
        handleCustomOptionText,
        getRowData,
        clipValue,
        rowRenderingMode,
        onOptionChanged,
        getTableDataSourceOption,
        onCellClick,
        onDataErrorOccurred,
        scrollToTable,
        resetTableScrollable,
        onCellPrepared,
        remoteOperationValue,
        SearchPermission,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-ods-table';

  .is-not-virtual-row {
    display: none;
  }

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
      max-width: 110%;
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

    .dx-datagrid-total-footer > .dx-datagrid-content {
      padding-top: 0;
      padding-bottom: 0;
      background: #f5f5f5;
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
