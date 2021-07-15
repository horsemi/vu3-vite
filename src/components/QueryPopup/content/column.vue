<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}__field`">
      <DxDataGrid
        height="100%"
        :data-source="fieldList"
        :show-borders="true"
        :show-column-lines="false"
        :show-row-lines="true"
        @rowClick="onRowClick"
      >
        <DxFilterRow :visible="true" />
        <DxPaging :enabled="false" />
        <DxColumn caption="全部字段" cell-template="show" alignment="center" :width="80" />
        <DxColumn data-field="caption" caption="" alignment="center" />
        <template #show="{ data }">
          <DxCheckBox :value="data.data.checked" :disabled="data.data.mustKey" />
        </template>
      </DxDataGrid>
    </div>
    <div :class="`${prefixCls}__next`" @click="onAddCol">
      <i class="dx-icon-chevronnext" />
    </div>
    <div :class="`${prefixCls}__table`">
      <DxDataGrid
        height="100%"
        :data-source="dataSource"
        :show-borders="true"
        :show-column-lines="false"
        :show-row-lines="true"
      >
        <DxFilterRow :visible="true" />
        <DxRowDragging :allow-reordering="true" :on-reorder="onReorder" drop-feedback-mode="push" />
        <DxPaging :enabled="false" />
        <DxColumn caption="序号" cell-template="index" alignment="center" />
        <DxColumn data-field="caption" caption="显示字段" alignment="center" />
        <DxColumn caption="操作" alignment="center" cell-template="handle" />
        <template #index="{ data }"> {{ data.rowIndex + 1 }} </template>
        <template #handle="{ data }">
          <span v-if="!data.data.mustKey" :class="`${prefixCls}__table__del`" @click="onDel(data.rowIndex)">删除</span>
        </template>
      </DxDataGrid>
    </div>
  </div>
</template>

<script lang="ts">
  import type { IFieldItem, IOrderByItem, ISchemeColumnsItem } from './types';
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
        type: Array as PropType<string[]>,
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
      // 显示字段数据
      const dataSource = ref<ISchemeColumnsItem[]>([]);
      // 全部字段数据
      const fieldList = ref<IFieldItem[]>([]);

      // 外派显示隐藏列更新事件
      const onChangeColumn = (data: ISchemeColumnsItem[]) => {
        const temp: string[] = data.map((item) => item.key);
        ctx.emit('on-change-column', temp);
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

      // 点击全部字段行
      const onRowClick = (e) => {
        if (e.data.mustKey) return;
        e.data.checked = !e.data.checked;
      };

      // 点击中间箭头触发
      const onAddCol = () => {
        // 更新显示字段数据
        dataSource.value = fieldList.value
          .filter((item) => item.checked)
          .map((item) => {
            return {
              key: item.key,
              caption: item.caption,
              mustKey: item.mustKey,
            };
          });
      };

      // 点击删除触发
      const onDel = (index: number) => {
        dataSource.value.splice(index, 1);
        onChangeColumn(dataSource.value);
      };

      // 拖动位置触发
      const onReorder = (e) => {
        // 调用数组换位函数
        dataSource.value = handleArrayTransposition(dataSource.value, e.fromIndex, e.toIndex);
        onChangeColumn(dataSource.value);
      };

      // 根据全部列处理显示隐藏列数据
      const handleColumns = (allColumns: IColumnItem[], columns: string[]) => {
        const fieldListTemp: IFieldItem[] = [];
        const data: ISchemeColumnsItem[] = [];
        const sortData: ISchemeColumnsItem[] = [];
        allColumns.forEach((item) => {
          const inAllCol = columns.some((key) => item.key === key);
          fieldListTemp.push({
            key: item.key,
            caption: item.caption,
            checked: item.mustKey ? item.mustKey : inAllCol,
            mustKey: item.mustKey,
          });
          if (inAllCol) {
            data.push({
              key: item.key,
              caption: item.caption,
              mustKey: item.mustKey,
            });
          }
        });
        columns.forEach((key) => {
          data.forEach((pre) => {
            if (key === pre.key) {
              sortData.push(pre);
            }
          });
        });
        fieldList.value = fieldListTemp;
        dataSource.value = sortData;
      };

      // 实时更新组件中的显示隐藏列数据
      watch(
        () => [props.allColumns, props.columns],
        ([allColumns, columns]) => {
          handleColumns(allColumns as IColumnItem[], columns as string[]);
        },
        {
          immediate: true,
        }
      );

      return {
        dataSource,
        prefixCls,
        fieldList,
        onChangeShow,
        onAddCol,
        onDel,
        onRowClick,
        onReorder,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-content-column';

  .@{prefix-cls} {
    display: flex;
    align-items: center;
    height: 100%;

    &__field {
      width: 30%;
      height: 100%;
      min-width: 200px;
    }

    &__next {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 40px;
      margin: 0 10px;
      color: #fff;
      cursor: pointer;
      background-color: #0486fe;
      border-radius: 2px;
      &:hover {
        background: rgba(4, 134, 254, 0.7);
      }
    }

    &__table {
      flex: 1;
      height: 100%;

      &__del {
        color: @color-primary;
        cursor: pointer;
      }
    }
  }
</style>
