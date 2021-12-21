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
          <DxCheckBox :value="data.data.checked" />
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
        :data-source="schemeData.scheme[schemeData.checkedIndex]['summary']"
        :hover-state-enabled="true"
        :show-borders="true"
        :show-column-lines="false"
        :show-row-lines="true"
      >
        <DxFilterRow :visible="true" />
        <DxPaging :enabled="false" />
        <DxColumn data-field="caption" caption="汇总字段" alignment="center" />
        <DxColumn
          data-field="mode"
          caption="汇总方式"
          cell-template="summaryMode"
          alignment="center"
          :allow-filtering="false"
        />
        <DxColumn
          data-field="type"
          caption="汇总类型"
          cell-template="summaryType"
          alignment="center"
          :allow-filtering="false"
        />
        <DxColumn caption="操作" alignment="center" cell-template="handle" />
        <template #summaryMode="{ data }">
          <DxSelectBox
            v-model:value="data.data.mode"
            style="padding: 0"
            :data-source="summaryModeOptions"
            display-expr="name"
            value-expr="mode"
          />
        </template>
        <template #summaryType="{ data }">
          <DxSelectBox
            v-model:value="data.data.type"
            style="padding: 0"
            :data-source="summaryTypeOptions"
            display-expr="name"
            value-expr="type"
          />
        </template>
        <template #handle="{ data }">
          <span :class="`${prefixCls}__table__del`" @click="onDel(data)">删除</span>
        </template>
      </DxDataGrid>
    </div>
  </div>
</template>

<script lang="ts">
  import type { IFieldItem, ISummaryItem } from './types';
  import type { IColumnItem } from '/@/model/types';
  import type { ISchemeData } from '../../QueryPlan/types';
  import type { Ref } from 'vue';

  import { defineComponent, inject, ref, watch } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';

  import { DxDataGrid, DxColumn, DxPaging, DxFilterRow } from 'devextreme-vue/data-grid';
  import { DxCheckBox } from 'devextreme-vue/check-box';
  import DxSelectBox from 'devextreme-vue/select-box';

  export default defineComponent({
    components: {
      DxDataGrid,
      DxColumn,
      DxCheckBox,
      DxPaging,
      DxFilterRow,
      DxSelectBox,
    },
    setup() {
      const allColumns = inject('allColumns') as Ref<IColumnItem[]>;
      const schemeData = inject('schemeData') as Ref<ISchemeData>;

      const { prefixCls } = useDesign('content-summary');

      // 显示字段数据副本，用于记录点击箭头前的数据
      let dataSourceTemp: ISummaryItem[] = [];

      // 全部字段数据
      const fieldList = ref<IFieldItem[]>([]);

      // 汇总方式
      const summaryModeOptions = [
        {
          name: '当前页面',
          mode: 'page',
        },
        {
          name: '全部页面',
          mode: 'all',
        },
      ];

      // 汇总类型
      const summaryTypeOptions = [
        {
          name: '总和',
          type: 'sum',
        },
        {
          name: '最小值',
          type: 'min',
        },
        {
          name: '最大值',
          type: 'max',
        },
        {
          name: '平均值',
          type: 'avg',
        },
        {
          name: '计数',
          type: 'count',
        },
      ];

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
              mode: 'page',
              type: 'sum',
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
        if (value) {
          fieldList.value.forEach((item) => {
            if (!item.checked) {
              item.checked = true;
              dataSourceTemp.push({
                key: item.key,
                caption: item.caption,
                mode: 'page',
                type: 'sum',
              });
            }
          });
        } else {
          fieldList.value.forEach((item) => {
            if (item.checked && !item.mustKey) {
              item.checked = false;
              const index = dataSourceTemp.findIndex((el) => item.key === el.key);
              dataSourceTemp.splice(index, 1);
            }
          });
        }
      }

      // 点击中间箭头触发
      function onAddCol() {
        // 更新显示字段数据
        schemeData.value.scheme[schemeData.value.checkedIndex].summary = [...dataSourceTemp];

        const columns = [...schemeData.value.scheme[schemeData.value.checkedIndex].columns];

        // 处理字段有汇总但是没有显示的情况
        schemeData.value.scheme[schemeData.value.checkedIndex].summary.forEach((sum) => {
          const index = columns.findIndex((item) => item.key === sum.key);
          if (index === -1) {
            columns.push({
              key: sum.key,
              caption: sum.caption,
            });
            schemeData.value.scheme[schemeData.value.checkedIndex].columns = columns;
          }
        });
      }

      // 点击删除触发
      function onDel(data) {
        const temp = [...schemeData.value.scheme[schemeData.value.checkedIndex].summary];
        temp.splice(data.rowIndex, 1);
        schemeData.value.scheme[schemeData.value.checkedIndex].summary = temp;
      }

      function getFieldList(allColumns: IColumnItem[]) {
        const data: IFieldItem[] = [];
        allColumns.forEach((item) => {
          if (item.foundationList && item.foundationList.length > 0) {
            item.foundationList.forEach((field) => {
              data.push({
                ...field,
                caption: field.caption,
                expand: item.expand,
                relationKey: item.relationKey,
                mustKey: item.mustKey,
                checked: false,
              });
            });
          } else if (!item.hide) {
            data.push({
              ...item,
              caption: item.caption,
              checked: false,
            });
          }
        });
        fieldList.value = data;
      }

      function handleColumnsChange(summary: ISummaryItem[]) {
        dataSourceTemp = [...summary];
        fieldList.value.forEach((field) => {
          const index = summary.findIndex((item) => item.key === field.key);
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
          !schemeData.value.scheme[schemeData.value.checkedIndex]['summary'] &&
            (schemeData.value.scheme[schemeData.value.checkedIndex]['summary'] = []);
          handleColumnsChange(schemeData.value.scheme[schemeData.value.checkedIndex]['summary']);
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
        schemeData,
        summaryModeOptions,
        summaryTypeOptions,
        onAddCol,
        onDel,
        onRowClick,
        onChangeCheckAll,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-content-summary';

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

      // 重置表格行高，解决行不垂直居中
      .dx-datagrid-content .dx-datagrid-table .dx-row > td {
        line-height: 35px;
      }
      .dx-datagrid-headers .dx-datagrid-table .dx-row > td {
        line-height: inherit !important;
      }

      &__del {
        color: @color-primary;
        cursor: pointer;
      }
    }
  }
</style>
