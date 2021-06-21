<template>
  <div :class="prefixCls">
    <DxDataGrid
      height="100%"
      :data-source="dataSource"
      :show-borders="false"
      :show-column-lines="false"
      :show-row-lines="true"
    >
      <DxEditing :allow-updating="true" mode="cell" />
      <DxPaging :enabled="false" />
      <DxColumn data-field="field" caption="字段" />
      <DxColumn data-field="compare" caption="比较" />
      <DxColumn data-field="val" caption="值" />
      <DxColumn data-field="logic" caption="逻辑" />
      <DxColumn caption="操作" cell-template="handle" />
      <template #handle="{ data }">
        <div>
          <span @click="onUpAdd(data)">上加</span>
          <span @click="onDownAdd(data)">下加</span>
          <span @click="onDel(data)">删除</span>
        </div>
      </template>
    </DxDataGrid>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { DxDataGrid, DxColumn, DxPaging, DxEditing } from 'devextreme-vue/data-grid';

  interface IRequirementTableItem {
    field: string;
    compare: string;
    val: string;
    logic: string;
  }

  export default defineComponent({
    components: {
      DxDataGrid,
      DxColumn,
      DxPaging,
      DxEditing,
    },
    setup() {
      const { prefixCls } = useDesign('content-requirement');
      const dataSource = ref<IRequirementTableItem[]>([
        {
          field: '',
          compare: '',
          val: '',
          logic: '',
        },
      ]);

      const onUpAdd = (data) => {
        const dataObj: IRequirementTableItem = {
          field: '',
          compare: '',
          val: '',
          logic: '',
        };
        const oldDataSource = [...dataSource.value];
        oldDataSource.splice(data.rowIndex, 0, dataObj);
        dataSource.value = oldDataSource;
      };
      const onDownAdd = (data) => {
        const dataObj: IRequirementTableItem = {
          field: '',
          compare: '',
          val: '',
          logic: '',
        };
        const oldDataSource = [...dataSource.value];
        oldDataSource.splice(data.rowIndex + 1, 0, dataObj);
        dataSource.value = oldDataSource;
      };
      const onDel = (data) => {
        if (data.rowIndex >= 0) {
          const oldDataSource = [...dataSource.value];
          oldDataSource.splice(data.rowIndex, 1);
          dataSource.value = oldDataSource;
        }
      };

      return {
        dataSource,
        prefixCls,
        onUpAdd,
        onDownAdd,
        onDel,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-content-requirement';

  .@{prefix-cls} {
    height: 100%;
    span {
      margin-right: 20px;
      color: @color-primary;
      cursor: pointer;
    }
  }
</style>
