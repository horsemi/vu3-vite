<template>
  <div :class="[prefixCls]">
    <DxDataGrid
      :data-source="dataSource"
      :height="tableOptions.height"
      :show-column-lines="tableOptions.showColumnLines"
      :show-row-lines="tableOptions.showRowLines"
      :show-borders="tableOptions.showBorders"
      :row-alternation-enabled="tableOptions.rowAlternationEnabled"
      :customize-columns="customizeColumns"
      @selection-changed="onSelectionChanged"
    >
      <template v-for="(item, index) in columns" :key="index">
        <DxColumn
          v-if="!item.hide"
          :data-field="item.key" 
          :caption="item.caption"
          :data-type="item.type"
          :cell-template="item.cellTemplate"
        />
      </template>
      <DxSelection
        :select-all-mode="tableOptions.selection.allMode"
        :show-check-boxes-mode="tableOptions.selection.checkBoxesMode"
        mode="multiple"
      />
      <DxPaging :page-size="tableOptions.page.size" :page-index="pageIndex" />
      <DxPager
        :visible="true"
        :show-info="true"
        :show-navigation-buttons="true"
        info-text="共{1}页，{2}条数据"
        display-mode="full"
      />
    </DxDataGrid>
    <div :class="`${prefixCls}__jump`">跳至<input type="number" @change="handleJump" />页</div>
  </div>
</template>

<script lang="ts">
import ODataStore from 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';
import { defineComponent, onBeforeUnmount, ref } from 'vue';
import { useDesign } from '/@/hooks/web/useDesign';
import { deepMerge } from '/@/utils/index';
import { ITableOptions, ITableColumnsItem } from './type';
import DxDataGrid, { DxSelection, DxPaging, DxColumn, DxPager } from 'devextreme-vue/data-grid';

const defaultTableOptions: ITableOptions = {
  dataSourceOptions: {
    sort: '',
    paginate: true,
    oDataOptions: {
      url: '',
      version: 4,
    },
  },
  height: '100%',
  showColumnLines: false,
  showRowLines: true,
  showBorders: false,
  rowAlternationEnabled: true,
  selection: {
    allMode: 'allPages',
    checkBoxesMode: 'always',
  },
  page: {
    size: 10,
  },
};

export default defineComponent({
  components: {
    DxDataGrid,
    DxSelection,
    DxPaging,
    DxPager,
    DxColumn
  },
  props: {
    options: {
      type: Object,
      default: () => {
        return {};
      },
    },
    columns: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup(props) {
    const { prefixCls } = useDesign('ods-table');
    const pageIndex = ref(0);
    const tableOptions = ref(deepMerge(defaultTableOptions, props.options));
    const dataSource = new DataSource({
      // requireTotalCount: true,
      sort: tableOptions.value.dataSourceOptions.sort,
      paginate: tableOptions.value.dataSourceOptions.paginate,
      pageSize: tableOptions.value.page.size,
      store: new ODataStore({
        ...tableOptions.value.dataSourceOptions.oDataOptions,
        beforeSend: (e) => {  
            console.log(e);
        }
      }),
      select: props.columns.map((item) => {
        return (item as ITableColumnsItem).key;
      })
    });
    dataSource.load().then(
      (data) => {
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );

    const onSelectionChanged = ({ selectedRowKeys, selectedRowsData }) => {
      console.log(selectedRowKeys, selectedRowsData);
    };
    const handleJump = (e) => {
      const index = parseInt(e.target.value) - 1;
      pageIndex.value = index >= 0 ? index : 0;
    };

    onBeforeUnmount(() => {
      dataSource.dispose();
    });

    const customizeColumns = (columns) => {
      console.log(columns);
    };

    return {
      dataSource,
      prefixCls,
      pageIndex,
      tableOptions,
      onSelectionChanged,
      handleJump,
      customizeColumns,
    };
  },
});
</script>

<style lang="less">
@prefix-cls: ~'@{namespace}-ods-table';

.@{prefix-cls} {
  position: relative;

  // 表头样式
  .dx-datagrid-headers {
    color: #000;
    background-color: #fafafa;
    border: none;
  }

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

  // 分页器样式
  .dx-datagrid-pager {
    padding-right: 150px;
    border: none;
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
    height: 54px;
    padding-left: 10px;
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