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
              <DxCheckBox v-model:value="item.checked" @valueChanged="onFieldList" />
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
        <DxEditing :allow-updating="true" mode="cell" />
        <DxPaging :enabled="false" />
        <DxColumn caption="序号" cell-template="index" />
        <DxColumn data-field="caption" caption="字段" />
        <DxColumn data-field="desc" caption="排序方式">
          <DxLookup :data-source="sortOptions" display-expr="name" value-expr="desc" />
        </DxColumn>
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
  import { defineComponent, PropType, ref, watch } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { DxCheckBox } from 'devextreme-vue/check-box';
  import { DxDataGrid, DxColumn, DxPaging, DxEditing, DxLookup } from 'devextreme-vue/data-grid';
  import { DxScrollView } from 'devextreme-vue/scroll-view';
  import { IColumnItem } from '/@/model/types';
  import { IFieldItem, IOrderByItem } from './types';

  export default defineComponent({
    components: {
      DxCheckBox,
      DxDataGrid,
      DxColumn,
      DxPaging,
      DxEditing,
      DxScrollView,
      DxLookup,
    },
    props: {
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
    emits: ['on-change-sort'],
    setup(props, ctx) {
      const { prefixCls } = useDesign('content-sort');
      const sortOptions = [
        {
          name: '升序',
          desc: false,
        },
        {
          name: '降序',
          desc: true,
        },
      ];

      const fieldList = ref<IFieldItem[]>([]);

      const dataSource = ref<IOrderByItem[]>([]);

      const onFieldList = () => {
        // console.log(fieldList);
      };
      const onAddCol = () => {
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
        ctx.emit('on-change-sort', dataSource);
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
          ctx.emit('on-change-sort', dataSource.value);
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
          ctx.emit('on-change-sort', dataSource.value);
        }
      };
      const onDel = (data) => {
        if (data.rowIndex >= 0) {
          const oldDataSource = [...dataSource.value];
          oldDataSource.splice(data.rowIndex, 1);
          dataSource.value = oldDataSource;
          ctx.emit('on-change-sort', dataSource.value);
        }
      };
      const handleData = (allColumns, orderBy) => {
        const data: IFieldItem[] = [];
        allColumns?.forEach((item) => {
          data.push({
            key: item.key,
            caption: item.caption,
            checked: false,
          });
        });
        fieldList.value = data;

        if (fieldList.value.length > 0 && orderBy.length > 0) {
          const list = [...fieldList.value];
          list.forEach((field) => {
            orderBy.forEach((item) => {
              if (field.key === item.key) {
                field.checked = true;
                return;
              }
            });
          });
          fieldList.value = list;
        }
        dataSource.value = orderBy;
      };

      watch(
        () => [props.allColumns, props.orderBy],
        ([allColumns, orderBy]) => {
          handleData(allColumns, orderBy);
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
