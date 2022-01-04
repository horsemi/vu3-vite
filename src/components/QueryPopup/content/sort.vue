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
        <DxColumn caption="可排序字段" cell-template="show" :width="86" alignment="center" />
        <DxColumn data-field="caption" caption="" alignment="center" />
        <template #show="{ data }">
          <DxCheckBox :value="data.data.checked" />
        </template>
      </DxDataGrid>
    </div>
    <div :tabindex="-1" :class="`${prefixCls}__next`" @click="onAddCol">
      <i class="dx-icon-chevronnext" />
    </div>
    <div :class="`${prefixCls}__table`">
      <DxDataGrid
        height="100%"
        :data-source="schemeData.scheme[schemeData.checkedIndex]['orderBy']"
        :hover-state-enabled="true"
        :show-borders="false"
        :show-column-lines="false"
        :show-row-lines="true"
      >
        <DxFilterRow :visible="true" />
        <DxRowDragging :allow-reordering="true" :on-reorder="onReorder" />
        <DxPaging :enabled="false" />
        <DxColumn caption="序号" cell-template="index" alignment="center" />
        <DxColumn data-field="caption" caption="字段" alignment="center" />
        <DxColumn
          data-field="sort"
          caption="排序方式"
          cell-template="sort"
          alignment="center"
          :allow-filtering="false"
        />
        <DxColumn caption="操作" cell-template="handle" alignment="center" />
        <template #index="{ data }"> {{ data.rowIndex + 1 }} </template>
        <template #sort="{ data }">
          <DxSelectBox
            v-model:value="data.data.desc"
            style="padding: 0"
            :data-source="sortOptions"
            display-expr="name"
            value-expr="desc"
          />
        </template>
        <template #handle="{ data }">
          <div :class="`${prefixCls}__table__handle`">
            <span @click="onDel(data)">删除</span>
          </div>
        </template>
      </DxDataGrid>
    </div>
  </div>
</template>

<script lang="ts">
  import type { IColumnItem } from '/@/model/types';
  import type { IFieldItem, IOrderByItem, ISortOptions } from './types';
  import type { ISchemeData } from '../../QueryPlan/types';
  import type { Ref } from 'vue';

  import { defineComponent, inject, ref, watch } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';

  import { DxCheckBox } from 'devextreme-vue/check-box';
  import {
    DxDataGrid,
    DxColumn,
    DxPaging,
    DxRowDragging,
    DxFilterRow,
  } from 'devextreme-vue/data-grid';
  import DxSelectBox from 'devextreme-vue/select-box';

  export default defineComponent({
    components: {
      DxCheckBox,
      DxDataGrid,
      DxColumn,
      DxSelectBox,
      DxPaging,
      DxRowDragging,
      DxFilterRow,
    },
    setup() {
      const allColumns = inject('allColumns') as Ref<IColumnItem[]>;
      const schemeData = inject('schemeData') as Ref<ISchemeData>;

      const { prefixCls } = useDesign('content-sort');
      // 升降序下拉框配置项
      const sortOptions: ISortOptions[] = [
        {
          name: '升序',
          desc: false,
        },
        {
          name: '降序',
          desc: true,
        },
      ];

      // 左侧选择框字段数据
      const fieldList = ref<IFieldItem[]>([]);

      // 右侧排序列表数据副本，用于记录点击箭头前的数据
      let dataSourceTemp: IOrderByItem[] = [];

      // 点击全部字段行
      function onRowClick(e) {
        e.data.checked = !e.data.checked;
        if (e.data.checked) {
          const item = fieldList.value.find((item) => item.key === e.data.key);
          // 后端设置了最多只能5个排序字段，理论上前端不管有多少个
          if (dataSourceTemp.length >= 5) {
            return;
          }
          if (item) {
            dataSourceTemp.push({
              key: item.key,
              caption: item.caption,
              desc: false,
              entityKey: item.entityKey || '',
            });
          }
        } else {
          const index = dataSourceTemp.findIndex((item) => item.key === e.data.key);
          dataSourceTemp.splice(index, 1);
        }
      }

      // 点击中间箭头触发
      function onAddCol() {
        // 更新排序列表数据
        schemeData.value.scheme[schemeData.value.checkedIndex].orderBy = [...dataSourceTemp];

        const columns = [...schemeData.value.scheme[schemeData.value.checkedIndex].columns];

        // 处理字段有排序但是没有显示的情况
        schemeData.value.scheme[schemeData.value.checkedIndex].orderBy.forEach((sort) => {
          const index = columns.findIndex((item) => item.key === sort.key);
          if (index === -1) {
            columns.push({
              key: sort.key,
              caption: sort.caption,
              entityKey: sort.entityKey || '',
            });
            schemeData.value.scheme[schemeData.value.checkedIndex].columns = columns;
          }
        });
      }

      // 拖动位置触发
      function onReorder(e) {
        const newTasks = [...schemeData.value.scheme[schemeData.value.checkedIndex].orderBy];
        newTasks.splice(e.fromIndex, 1);
        newTasks.splice(e.toIndex, 0, e.itemData);
        schemeData.value.scheme[schemeData.value.checkedIndex].orderBy = newTasks;
      }

      // 点击删除触发
      function onDel(data) {
        const temp = [...schemeData.value.scheme[schemeData.value.checkedIndex].orderBy];
        temp.splice(data.rowIndex, 1);
        schemeData.value.scheme[schemeData.value.checkedIndex].orderBy = temp;
      }

      function getFieldList(allColumns: IColumnItem[]) {
        const data: IFieldItem[] = [];
        allColumns.forEach((item) => {
          if (item.allowSort !== false && !item.relationKey && !item.hide) {
            data.push({
              key: item.key,
              caption: item.caption,
              checked: false,
              entityKey: item.entityKey || '',
            });
          }
        });
        fieldList.value = data;
      }

      function handleOrderByChange(orderBy: IOrderByItem[]) {
        dataSourceTemp = [...orderBy];
        fieldList.value.forEach((field) => {
          const index = orderBy.findIndex((item) => item.key === field.key);
          if (index !== -1) {
            field.checked = true;
          } else {
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
          !schemeData.value.scheme[schemeData.value.checkedIndex]['orderBy'] &&
            (schemeData.value.scheme[schemeData.value.checkedIndex]['orderBy'] = []);
          handleOrderByChange(schemeData.value.scheme[schemeData.value.checkedIndex]['orderBy']);
        },
        {
          immediate: true,
          deep: true,
        }
      );

      return {
        prefixCls,
        fieldList,
        schemeData,
        sortOptions,
        onRowClick,
        onAddCol,
        onReorder,
        onDel,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-content-sort';

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
        background: #5eb2ff;
      }
      &:focus {
        background: #1165b2;
      }
    }

    &__table {
      flex: 1;
      height: 100%;
      border: 1px solid @border-color-primary;

      // 重置表格行高，解决行不垂直居中
      .dx-datagrid-content .dx-datagrid-table .dx-row > td {
        line-height: 35px;
      }
      .dx-datagrid-headers .dx-datagrid-table .dx-row > td {
        line-height: inherit !important;
      }
    }

    &__table__handle {
      span {
        margin-right: 20px;
        color: @color-primary;
        cursor: pointer;
      }
    }
  }
</style>
