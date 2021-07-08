<template>
  <div :class="prefixCls">
    <DxDataGrid
      height="100%"
      :data-source="dataSource"
      :show-borders="false"
      :show-column-lines="false"
      :show-row-lines="true"
    >
      <DxFilterRow :visible="true" />
      <DxRowDragging :allow-reordering="true" :on-reorder="onReorder" drop-feedback-mode="push" />
      <DxPaging :enabled="false" />
      <DxColumn caption="序号" cell-template="index" alignment="center" />
      <DxColumn data-field="caption" caption="字段" alignment="center" />
      <DxColumn caption="显示" cell-template="show" alignment="center" />
      <template #index="{ data }"> {{ data.rowIndex + 1 }} </template>
      <template #show="{ data }">
        <DxCheckBox
          v-model:value="data.data.show"
          :disabled="data.data.mustKey"
          @valueChanged="onChangeShow(data.data.show, data.data.key)"
        />
      </template>
    </DxDataGrid>
  </div>
</template>

<script lang="ts">
  import type { IOrderByItem, ISchemeColumnsItem } from './types';
  import type { IColumnItem } from '/@/model/types';

  import { defineComponent, PropType, ref, watch } from 'vue';
  import { cloneDeep } from 'lodash-es';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { handleArrayTransposition } from '/@/utils';

  import {
    DxDataGrid,
    DxColumn,
    DxPaging,
    DxRowDragging,
    DxFilterRow,
  } from 'devextreme-vue/data-grid';
  import { DxCheckBox } from 'devextreme-vue/check-box';

  export default defineComponent({
    components: {
      DxDataGrid,
      DxColumn,
      DxCheckBox,
      DxPaging,
      DxRowDragging,
      DxFilterRow,
    },
    props: {
      columns: {
        type: Array as PropType<ISchemeColumnsItem[]>,
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
      orderBy: {
        type: Array as PropType<IOrderByItem[]>,
        default: () => {
          return [];
        },
      },
    },
    emits: ['on-change-column', 'on-change-sort'],
    setup(props, ctx) {
      const { prefixCls } = useDesign('content-column');
      // 显示隐藏列数据
      const dataSource = ref<ISchemeColumnsItem[]>([]);

      // 外派显示隐藏列更新事件
      const onChangeColumn = (data: ISchemeColumnsItem[]) => {
        ctx.emit('on-change-column', data);
      };
      // 外派排序更新事件
      const onChangeSort = (data: IOrderByItem[]) => {
        ctx.emit('on-change-sort', data);
      };

      // 是否显示选择框更新触发
      const onChangeShow = (show: boolean, key: string) => {
        // 如果不显示且排序中有此字段，则把排序中的此字段去除
        if (!show) {
          const orderBy = cloneDeep(props.orderBy);
          props.orderBy.forEach((item, index) => {
            if (item.key === key) {
              orderBy.splice(index, 1);
              return;
            }
          });
          onChangeSort(orderBy);
        }
        onChangeColumn(dataSource.value);
      };
      // 拖动位置触发
      const onReorder = (e) => {
        // 调用数组换位函数
        dataSource.value = handleArrayTransposition(dataSource.value, e.fromIndex, e.toIndex);
        onChangeColumn(dataSource.value);
      };

      // 根据全部列处理显示隐藏列数据
      const handleColumns = (allColumns, columns) => {
        const data: ISchemeColumnsItem[] = [];
        columns.forEach((col) => {
          allColumns.forEach((allCol) => {
            if (allCol.key === col.key && !allCol.hide) {
              data.push({
                key: allCol.key,
                caption: allCol.caption,
                show: col.show,
                mustKey: allCol.mustKey,
              });
            }
          });
        });
        return data;
      };

      // 实时更新组件中的显示隐藏列数据
      watch(
        () => [props.allColumns, props.columns],
        ([allColumns, columns]) => {
          dataSource.value = handleColumns(allColumns, columns);
        },
        {
          immediate: true,
        }
      );

      return {
        dataSource,
        prefixCls,
        onChangeShow,
        onReorder,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-content-column';

  .@{prefix-cls} {
    height: 100%;

    span {
      margin-right: 20px;
      color: @color-primary;
      cursor: pointer;
    }
  }
</style>
