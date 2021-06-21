<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}__field`">
      <div :class="`${prefixCls}__field__title`">字段</div>
      <DxScrollView height="calc(100% - 33px)">
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
            <DxCheckBox v-model:value="item.checked" @valueChanged="onFieldList" />
          </div>
          <span>{{ item.text }}</span>
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
        <DxEditing :allow-updating="true" mode="cell" />
        <DxPaging :enabled="false" />
        <DxColumn caption="序号" cell-template="index" />
        <DxColumn data-field="field" caption="字段" />
        <DxColumn data-field="sort" caption="排序方式" />
        <DxColumn caption="操作" cell-template="handle" />
        <template #index="{ data }"> {{ data.rowIndex + 1 }} </template>
        <template #handle="{ data }">
          <div>
            <span @click="onUpMove(data)">上移</span>
            <span @click="onDownMove(data)">下移</span>
            <span @click="onDel(data)">删除</span>
          </div>
        </template>
      </DxDataGrid>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { DxCheckBox } from 'devextreme-vue/check-box';
  import { DxDataGrid, DxColumn, DxPaging, DxEditing } from 'devextreme-vue/data-grid';
  import { DxScrollView } from 'devextreme-vue/scroll-view';

  interface ISortTableItem {
    field: string;
    sort: string;
  }

  export default defineComponent({
    components: {
      DxCheckBox,
      DxDataGrid,
      DxColumn,
      DxPaging,
      DxEditing,
      DxScrollView,
    },
    setup() {
      const { prefixCls } = useDesign('content-sort');

      const fieldList = ref([
        {
          text: '单据头-单据日期',
          checked: false,
        },
        {
          text: '单据头-创建人',
          checked: false,
        },
        {
          text: '单据头-单据状态',
          checked: false,
        },
        {
          text: '单据头-业务状态',
          checked: false,
        },
        {
          text: '单据头-运费金额汇总',
          checked: false,
        },
        {
          text: '单据头-创建人',
          checked: false,
        },
        {
          text: '单据头-修改日期',
          checked: false,
        },
        {
          text: '单据头-作废状态',
          checked: false,
        },
        {
          text: '单据头-作废人',
          checked: false,
        },
        {
          text: '单据头-总包件数',
          checked: false,
        },
      ]);

      const dataSource = ref<ISortTableItem[]>([]);

      const onFieldList = () => {
        // console.log(fieldList);
      };
      const onAddCol = () => {
        const addColArr = fieldList.value.filter((item) => item.checked);
        const data: ISortTableItem[] = [];
        addColArr.forEach((item) => {
          data.push({
            field: item.text,
            sort: '升序',
          });
        });
        dataSource.value = data;
      };
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
        }
      };
      const onDel = (data) => {
        if (data.rowIndex >= 0) {
          const oldDataSource = [...dataSource.value];
          oldDataSource.splice(data.rowIndex, 1);
          dataSource.value = oldDataSource;
        }
      };

      return {
        prefixCls,
        fieldList,
        dataSource,
        onFieldList,
        onAddCol,
        onUpMove,
        onDownMove,
        onDel,
      };
    },
  });
</script>

<style lang="less" scoped>
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
      span {
        margin-right: 20px;
        color: @color-primary;
        cursor: pointer;
      }
    }
  }
</style>
