<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}__field`">
      <DxDataGrid
        ref="fieldTable"
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
      <div :class="`${prefixCls}__field__checkall`">
        <DxCheckBox @valueChanged="onChangeCheckAll" />
      </div>
    </div>
    <div :tabindex="-1" :class="`${prefixCls}__next`" @click="onAddCol">
      <i class="dx-icon-chevronnext" />
    </div>
    <div :class="`${prefixCls}__table`">
      <DxDataGrid
        height="100%"
        :data-source="schemeData.scheme[schemeData.checkedIndex]['columns']"
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
        <template #index="{ data }">{{ getRowIndex(data) }}</template>
        <template #handle="{ data }">
          <span v-if="!data.data.mustKey" :class="`${prefixCls}__table__del`" @click="onDel(data)"
            >删除</span
          >
        </template>
      </DxDataGrid>
    </div>
  </div>
</template>

<script lang="ts">
  import type { IFieldItem, ISchemeColumnsItem } from './types';
  import type { IColumnItem } from '/@/model/types';
  import type { ISchemeData } from '../../QueryPlan/types';
  import type { Ref } from 'vue';

  import { defineComponent, inject, ref, watch } from 'vue';

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
    setup() {
      const allColumns = inject('allColumns') as Ref<IColumnItem[]>;
      const schemeData = inject('schemeData') as Ref<ISchemeData>;

      const { prefixCls } = useDesign('content-column');

      // 显示字段数据副本，用于记录点击箭头前的数据
      let dataSourceTemp: ISchemeColumnsItem[] = [];

      // 全部字段数据
      const fieldList = ref<IFieldItem[]>([]);

      const fieldTable = ref();

      function getRowIndex(data) {
        const curIndex = schemeData.value.scheme[schemeData.value.checkedIndex].columns.indexOf(
          data.data
        );
        if (curIndex !== -1) {
          return curIndex + 1;
        } else {
          return data.rowIndex + 1;
        }
      }

      // 点击全部字段行
      function onRowClick(e) {
        if (e.data.mustKey) return;
        e.data.checked = !e.data.checked;
        if (e.data.checked) {
          const item = fieldList.value.find((item) => item.key === e.data.key);
          if (item) {
            dataSourceTemp.push({
              key: item.key,
              caption: item.caption,
              expand: item.expand,
              relationKey: item.relationKey,
              mustKey: item.mustKey,
              entityKey: item.entityKey || '',
            });
          }
        } else {
          const index = dataSourceTemp.findIndex((item) => item.key === e.data.key);
          dataSourceTemp.splice(index, 1);
        }
      }

      // 全选字段
      function onChangeCheckAll(e) {
        const { value } = e;
        const dataItems = fieldTable.value.instance.getDataSource().items();
        if (dataItems && dataItems.length) {
          if (value) {
            dataItems.forEach((item) => {
              item.checked = true;
              const colIndex = dataSourceTemp.findIndex((el) => el.key === item.key);
              colIndex === -1 &&
                dataSourceTemp.push({
                  key: item.key,
                  caption: item.caption,
                  expand: item.expand,
                  relationKey: item.relationKey,
                  mustKey: item.mustKey,
                  entityKey: item.entityKey || '',
                });
            });
          } else {
            dataItems.forEach((item) => {
              if (!item.mustKey) {
                item.checked = false;
                const colIndex = dataSourceTemp.findIndex((el) => item.key === el.key);
                colIndex !== -1 && dataSourceTemp.splice(colIndex, 1);
              }
            });
          }
        }
      }

      // 点击中间箭头触发
      function onAddCol() {
        // 更新显示字段数据
        schemeData.value.scheme[schemeData.value.checkedIndex].columns = [...dataSourceTemp];
      }

      // 点击删除触发
      function onDel(data) {
        const orderIndex = schemeData.value.scheme[schemeData.value.checkedIndex].orderBy.findIndex(
          (item) => item.key === data.data.key
        );
        if (orderIndex >= 0) {
          const temp = [...schemeData.value.scheme[schemeData.value.checkedIndex].orderBy];
          temp.splice(orderIndex, 1);
          schemeData.value.scheme[schemeData.value.checkedIndex].orderBy = temp;
        }
        const temp = [...schemeData.value.scheme[schemeData.value.checkedIndex].columns];
        temp.splice(data.rowIndex, 1);
        schemeData.value.scheme[schemeData.value.checkedIndex].columns = temp;
      }

      // 拖动位置触发
      function onReorder(e) {
        const newTasks = [...schemeData.value.scheme[schemeData.value.checkedIndex].columns];
        newTasks.splice(e.fromIndex, 1);
        newTasks.splice(e.toIndex, 0, e.itemData);
        schemeData.value.scheme[schemeData.value.checkedIndex].columns = newTasks;
      }

      function getFieldList(allColumns: IColumnItem[]) {
        const data: IFieldItem[] = [];
        const columns = schemeData.value.scheme[schemeData.value.checkedIndex].columns;
        allColumns.forEach((item) => {
          if (item.foundationList && item.foundationList.length > 0) {
            item.foundationList.forEach((field) => {
              const index = columns.findIndex((col) => col.key === field.key);
              data.push({
                ...field,
                caption: field.caption,
                expand: item.expand,
                relationKey: item.relationKey,
                mustKey: item.mustKey,
                checked: item.mustKey ?? index !== -1 ? true : false,
                entityKey: item.entityKey || '',
              });
            });
          } else if (!item.hide) {
            const index = columns.findIndex((col) => item.key === col.key);
            data.push({
              ...item,
              entityKey: item.entityKey || '',
              caption: item.caption,
              checked: item.mustKey ?? index !== -1 ? true : false,
            });
          }
        });
        fieldList.value = data;
      }

      function handleColumnsChange(columns: IColumnItem[]) {
        dataSourceTemp = [...columns];
        fieldList.value.forEach((field) => {
          const index = columns.findIndex((item) => item.key === field.key);
          if (index !== -1) {
            field.checked = true;
          } else if (!field.mustKey) {
            field.checked = false;
          }
        });
      }

      watch(
        allColumns,
        () => {
          getFieldList(allColumns.value);
        },
        {
          immediate: true,
        }
      );

      watch(
        schemeData,
        () => {
          !schemeData.value.scheme[schemeData.value.checkedIndex]['columns'] &&
            (schemeData.value.scheme[schemeData.value.checkedIndex]['columns'] = []);
          handleColumnsChange(schemeData.value.scheme[schemeData.value.checkedIndex]['columns']);
        },
        {
          immediate: true,
          deep: true,
        }
      );

      return {
        allColumns,
        prefixCls,
        fieldList,
        fieldTable,
        schemeData,
        getRowIndex,
        onAddCol,
        onDel,
        onRowClick,
        onReorder,
        onChangeCheckAll,
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
      position: relative;
      width: 30%;
      height: 100%;
      min-width: 200px;
    }

    &__field__checkall {
      position: absolute;
      top: 40px;
      left: 30px;
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
        background: #5eb2ff;
      }
      &:focus {
        background: #1165b2;
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
