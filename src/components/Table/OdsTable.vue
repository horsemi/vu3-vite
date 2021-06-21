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
      :filter-value="filterValue"
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
      <DxPaging
        :enabled="tableOptions.dataSourceOptions.paginate"
        :page-size="tableOptions.page.size"
        :page-index="pageIndex"
      />
      <DxPager
        :visible="tableOptions.dataSourceOptions.paginate"
        :show-info="true"
        :show-navigation-buttons="true"
        info-text="共{1}页，{2}条数据"
        display-mode="full"
      />
      <template #billCode="{ data }">
        <DxButton type="normal" styling-mode="text" @click="$emit('handleBillCodeClick', data)">{{
          data.key
        }}</DxButton>
      </template>
    </DxDataGrid>
    <div v-if="tableOptions.dataSourceOptions.paginate" :class="`${prefixCls}__jump`"
      >跳至<input type="number" @change="handleJump" />页</div
    >
  </div>
</template>

<script lang="ts">
  import { defineComponent, onBeforeUnmount, ref, PropType } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import DxDataGrid, { DxSelection, DxPaging, DxColumn, DxPager } from 'devextreme-vue/data-grid';
  import DxButton from 'devextreme-vue/button';
  import { defaultTableOptions } from './common';
  import { ITableOptions } from './type';
  import { IColumnItem } from '/@/model/types';

  export default defineComponent({
    components: {
      DxDataGrid,
      DxSelection,
      DxPaging,
      DxPager,
      DxColumn,
      DxButton,
    },
    props: {
      tableOptions: {
        type: Object as PropType<ITableOptions>,
        default: () => {
          return defaultTableOptions;
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
      filterValue: {
        type: Array,
        default: () => {
          return [];
        },
      },
    },
    emits: ['handleBillCodeClick'],
    setup(props) {
      const { prefixCls } = useDesign('ods-table');
      const pageIndex = ref(0);

      const onSelectionChanged = ({ selectedRowKeys, selectedRowsData }) => {
        console.log(selectedRowKeys, selectedRowsData);
      };
      const handleJump = (e) => {
        const index = parseInt(e.target.value) - 1;
        pageIndex.value = index >= 0 ? index : 0;
      };
      const customizeColumns = () => {
        // console.log(columns);
      };

      onBeforeUnmount(() => {
        props.dataSource && props.dataSource.dispose();
      });

      return {
        prefixCls,
        pageIndex,
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
      padding-top: 20px;
      padding-right: 150px;
      padding-bottom: 20px;
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
