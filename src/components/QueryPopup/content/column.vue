<template>
  <div :class="prefixCls">
    <DxDataGrid
      height="100%"
      :data-source="dataSource"
      :show-borders="false"
      :show-column-lines="false"
      :show-row-lines="true"
    >
      <DxColumn caption="序号" cell-template="index" />
      <DxColumn data-field="caption" caption="字段" />
      <DxColumn caption="显示" cell-template="show" />
      <DxColumn caption="操作" cell-template="handle" />
      <template #index="{ data }"> {{ data.rowIndex + 1 }} </template>
      <template #show="{ data }">
        <DxCheckBox v-model:value="data.data.show" />
      </template>
      <template #handle="{ data }">
        <div>
          <span @click="onUpMove(data)">上移</span>
          <span @click="onDownMove(data)">下移</span>
        </div>
      </template>
    </DxDataGrid>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType, ref, watch } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { DxDataGrid, DxColumn } from 'devextreme-vue/data-grid';
  import { DxCheckBox } from 'devextreme-vue/check-box';
  import { IOrderByItem, ISchemeColumnsItem } from './types';

  export default defineComponent({
    components: {
      DxDataGrid,
      DxColumn,
      DxCheckBox,
    },
    props: {
      columns: {
        type: Array as PropType<ISchemeColumnsItem[]>,
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
    emits: ['on-change-column'],
    setup(props, ctx) {
      const { prefixCls } = useDesign('content-column');
      const dataSource = ref<ISchemeColumnsItem[]>([]);

      const onUpMove = (data) => {
        if (data.rowIndex > 0) {
          const oldDataSource = [...dataSource.value];
          const currentIndex = data.rowIndex;
          const preIndex = data.rowIndex - 1;
          oldDataSource[currentIndex] = oldDataSource.splice(
            preIndex,
            1,
            oldDataSource[currentIndex]
          )[0];
          dataSource.value = oldDataSource;
          ctx.emit('on-change-column', dataSource.value);
        }
      };
      const onDownMove = (data) => {
        if (data.rowIndex < dataSource.value.length - 1) {
          const oldDataSource = [...dataSource.value];
          const currentIndex = data.rowIndex;
          const nextIndex = data.rowIndex + 1;
          oldDataSource[currentIndex] = oldDataSource.splice(
            nextIndex,
            1,
            oldDataSource[currentIndex]
          )[0];
          dataSource.value = oldDataSource;
          ctx.emit('on-change-column', dataSource.value);
        }
      };

      watch(
        () => props.columns,
        (val) => {
          dataSource.value = val;
        },
        {
          immediate: true,
        }
      );

      watch(
        () => props.orderBy,
        (val) => {
          val.forEach((sort) => {
            dataSource.value.forEach((item) => {
              if (sort.key === item.key) {
                item.show = true;
              }
            });
          });
        },
        {
          immediate: true,
        }
      );

      return {
        dataSource,
        prefixCls,
        onUpMove,
        onDownMove,
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
