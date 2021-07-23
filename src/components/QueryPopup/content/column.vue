<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}__field`">
      <DxDataGrid
        height="100%"
        :data-source="fieldList"
        :hover-state-enabled="true"
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
        :hover-state-enabled="true"
        :show-borders="true"
        :show-column-lines="false"
        :show-row-lines="true"
      >
        <DxFilterRow :visible="true" />
        <DxRowDragging :allow-reordering="true" :on-reorder="onReorder" />
        <DxPaging :enabled="false" />
        <DxColumn caption="序号" cell-template="index" alignment="center" />
        <DxColumn data-field="caption" caption="显示字段" alignment="center" />
        <DxColumn caption="操作" alignment="center" cell-template="handle" />
        <template #index="{ data }"> {{ data.rowIndex + 1 }} </template>
        <template #handle="{ data }">
          <span
            v-if="!data.data.mustKey"
            :class="`${prefixCls}__table__del`"
            @click="onDel(data)"
            >删除</span
          >
        </template>
      </DxDataGrid>
    </div>
  </div>
</template>

<script lang="ts">
  import type { IFieldItem, IOrderByItem, ISchemeColumnsItem } from './types';
  import type { IColumnItem } from '/@/model/types';

  import { defineComponent, PropType, ref, watch } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';

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
      // 显示字段数据
      const dataSource = ref<ISchemeColumnsItem[]>([]);

      // 显示字段数据副本，用于记录点击箭头前的数据
      let dataSourceTemp: ISchemeColumnsItem[] = [];

      // 全部字段数据
      const fieldList = ref<IFieldItem[]>([]);

      // 外派显示隐藏列更新事件
      const onChangeColumn = (data: ISchemeColumnsItem[]) => {
        ctx.emit('on-change-column', data);
      };
      // 外派排序更新事件
      const onChangeSort = (data: IOrderByItem[]) => {
        ctx.emit('on-change-sort', data);
      };

      // 点击全部字段行
      const onRowClick = (e) => {
        if (e.data.mustKey) return;
        e.data.checked = !e.data.checked;
        if (e.data.checked) {
          const item = fieldList.value.filter((item) => item.key === e.data.key)[0];
          dataSourceTemp.push({
            key: item.key,
            caption: item.caption,
            expand: item.expand,
            relationKey: item.relationKey,
            mustKey: item.mustKey,
          });
        } else {
          const index = dataSourceTemp.findIndex((item) => item.key === e.data.key);
          dataSourceTemp.splice(index, 1);
        }
      };

      // 点击中间箭头触发
      const onAddCol = () => {
        // 更新显示字段数据
        dataSource.value = [...dataSourceTemp];
        onChangeColumn(dataSource.value);
      };

      // 点击删除触发
      const onDel = (data) => {
        const index = dataSource.value.indexOf(data.data);
        const orderIndex = props.orderBy.findIndex(
          (item) => item.key === data.data.key
        );
        if (orderIndex >= 0) {
          const orderBy = [...props.orderBy];
          orderBy.splice(orderIndex, 1);
          onChangeSort(orderBy);
        }
        if (index >= 0) {
          dataSource.value.splice(index, 1);
          onChangeColumn(dataSource.value);
        }
      };

      // 拖动位置触发
      const onReorder = (e) => {
        const newTasks = [...dataSource.value];
        newTasks.splice(e.fromIndex, 1);
        newTasks.splice(e.toIndex, 0, e.itemData);
        dataSource.value = newTasks;
        onChangeColumn(dataSource.value);
      };

      // 根据全部列处理显示隐藏列数据
      const handleColumns = (allColumns: IColumnItem[], columns: ISchemeColumnsItem[]) => {
        const fieldListTemp: IFieldItem[] = [];
        const data: ISchemeColumnsItem[] = [];
        const sortData: ISchemeColumnsItem[] = [];

        allColumns.forEach((item) => {
          if (item.foundationList && item.foundationList.length > 0) {
            item.foundationList.forEach((field) => {
              const inAllCol = columns.some((col) => field.key === col.key);
              if (inAllCol) {
                data.push({
                  ...field,
                  expand: item.expand,
                  relationKey: item.relationKey,
                  mustKey: item.mustKey,
                });
              }
              fieldListTemp.push({
                ...field,
                expand: item.expand,
                checked: item.mustKey ? item.mustKey : inAllCol,
                relationKey: item.relationKey,
                mustKey: item.mustKey,
              });
            });
          } else {
            const inAllCol = columns.some((col) => item.key === col.key);
            if (inAllCol) {
              data.push({
                key: item.key,
                caption: item.caption,
                mustKey: item.mustKey,
              });
            }
            fieldListTemp.push({
              ...item,
              checked: item.mustKey ? item.mustKey : inAllCol,
            });
          }
        });
        columns.forEach((col) => {
          data.forEach((pre) => {
            if (col.key === pre.key) {
              sortData.push(pre);
            }
          });
        });
        fieldList.value = fieldListTemp;
        dataSource.value = sortData;
        dataSourceTemp = [...sortData];
      };

      // 实时更新组件中的显示隐藏列数据
      watch(
        () => [props.allColumns, props.columns],
        ([allColumns, columns]) => {
          handleColumns(allColumns as IColumnItem[], columns as ISchemeColumnsItem[]);
        },
        {
          immediate: true,
        }
      );

      return {
        dataSource,
        prefixCls,
        fieldList,
        onAddCol,
        onDel,
        onRowClick,
        onReorder,
      };
    },
  });
</script>

<style lang="less">
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
