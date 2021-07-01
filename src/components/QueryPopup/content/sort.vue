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
            <span @click="onUpMove(data.rowIndex)">上移</span>
            <span @click="onDownMove(data.rowIndex)">下移</span>
            <span @click="onDel(data.rowIndex)">删除</span>
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
import { IColumnItem } from '/@/model/table/types';
import { IFieldItem, IOrderByItem, ISortOptions } from './types';
import { cloneDeep } from 'lodash-es';
import { handleArrayTransposition } from '/@/utils';

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
      onChangeSort(dataSource.value);
    };
    // 点击上移触发
    const onUpMove = (index: number) => {
      if (index > 0) {
        // 调用数组换位函数
        dataSource.value = handleArrayTransposition(dataSource.value, index, index - 1);
        onChangeSort(dataSource.value);
      }
    };
    // 点击下移触发
    const onDownMove = (index: number) => {
      if (index < dataSource.value.length - 1) {
        // 调用数组换位函数
        dataSource.value = handleArrayTransposition(dataSource.value, index, index + 1);
        onChangeSort(dataSource.value);
      }
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
