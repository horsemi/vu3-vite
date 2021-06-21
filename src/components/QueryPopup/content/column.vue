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
        <DxCheckBox v-model:value="data.value" />
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
import { defineComponent, onMounted, PropType, ref } from 'vue';
import { useDesign } from '/@/hooks/web/useDesign';
import { DxDataGrid, DxColumn } from 'devextreme-vue/data-grid';
import { DxCheckBox } from 'devextreme-vue/check-box';
import { getColumnList } from '/@/model/common';
import { IColumnItem } from '/@/model/types';

export default defineComponent({
  components: {
    DxDataGrid,
    DxColumn,
    DxCheckBox,
  },
  props: {
    code: {
      type: String,
      default: '',
    },
    customColumns: {
      type: Array as PropType<IColumnItem[]>,
      default: () => {
        return [];
      },
    },
  },
  setup(props) {
    const { prefixCls } = useDesign('content-column');
    const dataSource = ref<IColumnItem[] | undefined>([]);

    const onUpMove = (data) => {
      if (dataSource.value && data.rowIndex > 0) {
        const oldDataSource = [...dataSource.value];
        const currentIndex = data.rowIndex;
        const preIndex = data.rowIndex - 1;
        oldDataSource[currentIndex] = oldDataSource.splice(
          preIndex,
          1,
          oldDataSource[currentIndex]
        )[0];
        dataSource.value = oldDataSource;
      }
    };
    const onDownMove = (data) => {
      if (dataSource.value && data.rowIndex < dataSource.value.length - 1) {
        const oldDataSource = [...dataSource.value];
        const currentIndex = data.rowIndex;
        const nextIndex = data.rowIndex + 1;
        oldDataSource[currentIndex] = oldDataSource.splice(
          nextIndex,
          1,
          oldDataSource[currentIndex]
        )[0];
        dataSource.value = oldDataSource;
      }
    };

    onMounted(async () => {
      const columns = await getColumnList(props.code, props.customColumns);
      dataSource.value = columns;
    });

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

