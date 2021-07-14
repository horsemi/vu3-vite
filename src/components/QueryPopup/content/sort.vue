<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}__field`">
      <div :class="`${prefixCls}__field__title`">字段</div>
      <DxScrollView height="calc(100% - 33px)">
        <div>
          <div
            v-for="(item, index) in fieldList"
            :key="index"
            :class="[
              `${prefixCls}__field__item`,
              item.checked && `${prefixCls}__field__item--active`,
            ]"
            @click="item.checked = !item.checked"
          >
            <div @click.stop="">
              <DxCheckBox v-model:value="item.checked" />
            </div>
            <span>{{ item.caption }}</span>
          </div>
        </div>
      </DxScrollView>
    </div>
    <div :class="`${prefixCls}__next`" @click="onAddCol">
      <i class="dx-icon-chevronnext" />
    </div>
    <div :class="`${prefixCls}__table`">
      <DxDataGrid
        height="100%"
        :data-source="dataSource"
        :show-borders="false"
        :show-column-lines="false"
        :show-row-lines="true"
      >
        <DxRowDragging :allow-reordering="true" :on-reorder="onReorder" drop-feedback-mode="push" />
        <DxPaging :enabled="false" />
        <DxColumn caption="序号" cell-template="index" alignment="center" />
        <DxColumn data-field="caption" caption="字段" alignment="center" />
        <DxColumn data-field="sort" caption="排序方式" cell-template="sort" alignment="center" />
        <DxColumn caption="操作" cell-template="handle" alignment="center" />
        <template #index="{ data }"> {{ data.rowIndex + 1 }} </template>
        <template #sort="{ data }">
          <DxSelectBox
            v-model:value="data.data.desc"
            style="padding: 0"
            :data-source="sortOptions"
            display-expr="name"
            value-expr="desc"
            @valueChanged="onChangeSort(dataSource)"
          />
        </template>
        <template #handle="{ data }">
          <div :class="`${prefixCls}__table__handle`">
            <span @click="onDel(data.rowIndex)">删除</span>
          </div>
        </template>
      </DxDataGrid>
    </div>
  </div>
</template>

<script lang="ts">
import type { IColumnItem } from '/@/model/types';
import type { IFieldItem, IOrderByItem, ISortOptions } from './types';

import { defineComponent, PropType, ref, watch } from 'vue';
import { cloneDeep } from 'lodash-es';

import { useDesign } from '/@/hooks/web/useDesign';
import { handleArrayTransposition } from '/@/utils';

import { DxCheckBox } from 'devextreme-vue/check-box';
import { DxDataGrid, DxColumn, DxPaging, DxRowDragging } from 'devextreme-vue/data-grid';
import { DxScrollView } from 'devextreme-vue/scroll-view';
import DxSelectBox from 'devextreme-vue/select-box';

export default defineComponent({
  components: {
    DxCheckBox,
    DxDataGrid,
    DxColumn,
    DxScrollView,
    DxSelectBox,
    DxPaging,
    DxRowDragging,
  },
  props: {
    allColumns: {
      type: Array as PropType<IColumnItem[]>,
      default: () => {
        return [];
      },
    },
    columns: {
      type: Array as PropType<string[]>,
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
  emits: ['on-change-sort', 'on-change-column'],
  setup(props, ctx) {
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
    // 右侧排序列表数据
    const dataSource = ref<IOrderByItem[]>([]);

    // 外派排序更新事件
    const onChangeSort = (data: IOrderByItem[]) => {
      ctx.emit('on-change-sort', data);
    };
    // 外派显示隐藏列更新事件
    const onChangeColumn = (data: string[]) => {
      ctx.emit('on-change-column', data);
    };

    // 处理字段有排序但是没有显示的情况
    const handleFieldShow = (data: IOrderByItem[]) => {
      const columns = [...props.columns];
      const length = props.columns.length;
      data.forEach((sort) => {
        let count = 0;
        props.columns.forEach((key) => {
          if (sort.key !== key) {
            count++;
          }
        });
        if (count === length) {
          columns.push(sort.key);
        }
      });
      onChangeColumn(columns);
    };
    // 点击中间箭头触发
    const onAddCol = () => {
      // 更新排序列表数据
      const addColArr = fieldList.value.filter((item) => item.checked);
      const data: IOrderByItem[] = [];
      addColArr.forEach((item) => {
        data.push({
          key: item.key,
          caption: item.caption,
          desc: false,
        });
      });
      dataSource.value = data;
      handleFieldShow(dataSource.value);
      onChangeSort(dataSource.value);
    };
    // 拖动位置触发
    const onReorder = (e) => {
      // 调用数组换位函数
      dataSource.value = handleArrayTransposition(dataSource.value, e.fromIndex, e.toIndex);
      onChangeSort(dataSource.value);
    };
    // 点击删除触发
    const onDel = (index: number) => {
      const temp = cloneDeep(dataSource.value);
      temp.splice(index, 1);
      dataSource.value = temp;
      onChangeSort(dataSource.value);
    };
    // 处理组件数据
    const handleData = (allColumns: IColumnItem[], orderBy: IOrderByItem[]) => {
      const fields: IFieldItem[] = [];
      const sorts: IOrderByItem[] = [];
      allColumns.forEach((item) => {
        if (item.allowSort !== false) {
          fields.push({
            key: item.key,
            caption: item.caption,
            checked: false,
          });
        }
      });
      orderBy.forEach((item) => {
        fields.forEach((field) => {
          if (field.key === item.key) {
            sorts.push({
              key: field.key,
              caption: field.caption,
              desc: item.desc,
            });
          }
        });
      });
      // 排序列表中有的字段，左侧选择框需要选中
      if (fields.length > 0 && sorts.length > 0) {
        fields.forEach((field) => {
          if (sorts.some((item) => field.key === item.key)) {
            field.checked = true;
          }
        });
      }
      fieldList.value = fields;
      dataSource.value = sorts;
    };

    // 监听全部列和排序数据的更新，处理组件数据（全部列指的是前端model中获取到的列）
    watch(
      () => [props.allColumns, props.orderBy],
      ([allColumns, orderBy]) => {
        handleData(allColumns as IColumnItem[], orderBy as IOrderByItem[]);
      },
      {
        immediate: true,
      }
    );

    return {
      prefixCls,
      fieldList,
      dataSource,
      sortOptions,
      onAddCol,
      onReorder,
      onDel,
      onChangeSort,
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
    border: 1px solid @border-color-primary;
  }

  &__field__title {
    height: 33px;
    padding-left: 20px;
    font-weight: bold;
    line-height: 33px;
    background-color: #fafafa;
    border-bottom: 1px solid @border-color-primary;
  }

  &__field__item {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 20px;
    cursor: pointer;
    span {
      padding-left: 10px;
    }
    &--active,
    &:hover {
      background-color: #e6f7ff;
    }
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
    border: 1px solid @border-color-primary;
  }

  &__table__handle {
    span {
      margin-right: 20px;
      color: @color-primary;
      cursor: pointer;
    }
  }

  // 重置表格行高，解决行不垂直居中
  .dx-datagrid-content .dx-datagrid-table .dx-row > td {
    line-height: 35px;
  }
  .dx-datagrid-headers .dx-datagrid-table .dx-row > td {
    line-height: inherit !important;
  }
}
</style>
