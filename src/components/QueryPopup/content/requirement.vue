<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}__header`">
      <span style="width: 140px">字段</span>
      <span style="width: 105px">比较</span>
      <span style="width: 188px">值</span>
      <span style="width: 140px">逻辑</span>
      <span>操作</span>
    </div>
    <DxScrollView height="calc(100% - 33px)">
      <div>
        <div v-for="(item, index) in dataSource" :key="index" :class="`${prefixCls}__item`">
          <DynamicSelect
            v-model:value="item.value"
            v-model:paramKey="item.requirement"
            v-model:operation="item.operator"
            v-model:paramDataType="item.type"
            v-model:paramOperations="item.operatorList"
            v-model:paramDatatypekeies="item.datatypekeies"
            :param-list="allColumns"
          />
          <DxSelectBox
            v-model:value="item.logic"
            :data-source="logicOptions"
            display-expr="name"
            value-expr="value"
            width="130"
            style="margin-left: 10px"
          ></DxSelectBox>
          <div :class="`${prefixCls}__handle`">
            <span @click="onUpAdd(index)">上加</span>
            <span @click="onDownAdd(index)">下加</span>
            <span v-if="dataSource.length > 1" @click="onDel(index)">删除</span>
          </div>
        </div>
      </div>
    </DxScrollView>
  </div>
</template>

<script lang="ts">
import DynamicSelect from '/@/components/DynamicSelect/index.vue';
import { defineComponent, PropType, ref, watch } from 'vue';
import { useDesign } from '/@/hooks/web/useDesign';
import DxSelectBox from 'devextreme-vue/select-box';
import { IRequirementItem } from './types';
import { IColumnItem } from '/@/model/types';
import { DxScrollView } from 'devextreme-vue/scroll-view';

export default defineComponent({
  components: {
    DynamicSelect,
    DxSelectBox,
    DxScrollView,
  },
  props: {
    requirement: {
      type: Array as PropType<IRequirementItem[]>,
      default: () => {
        return [];
      },
    },
    allColumns: {
      type: Array as PropType<IColumnItem[]>,
      default: () => {
        return [];
      },
    },
  },
  emits: ['on-change-requirement'],
  setup(props, ctx) {
    const { prefixCls } = useDesign('content-requirement');
    const requirementItem = {
      requirement: '',
      operator: '=',
      operatorList: [],
      value: '',
      type: '',
      datatypekeies: '',
      logic: '',
    };
    const dataSource = ref<IRequirementItem[]>([]);
    const logicOptions = [
      {
        name: '并且',
        value: 'and',
      },
      {
        name: '或',
        value: 'or',
      },
    ];

    const onUpAdd = (index) => {
      const oldDataSource = [...dataSource.value];
      oldDataSource.splice(index, 0, requirementItem);
      dataSource.value = oldDataSource;
      ctx.emit('on-change-requirement', dataSource.value);
    };
    const onDownAdd = (index) => {
      const oldDataSource = [...dataSource.value];
      oldDataSource.splice(index + 1, 0, requirementItem);
      dataSource.value = oldDataSource;
      ctx.emit('on-change-requirement', dataSource.value);
    };
    const onDel = (index) => {
      if (index >= 0 && dataSource.value.length > 1) {
        const oldDataSource = [...dataSource.value];
        oldDataSource.splice(index, 1);
        dataSource.value = oldDataSource;
        ctx.emit('on-change-requirement', dataSource.value);
      }
    };

    watch(
      () => props.requirement,
      (val) => {
        dataSource.value = [...val];
      },
      {
        immediate: true,
      }
    );

    return {
      dataSource,
      prefixCls,
      logicOptions,
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

  &__header {
    display: flex;
    align-items: center;
    padding: 7px;
    color: #333;
    background-color: #fafafa;
  }

  &__item {
    display: flex;
    align-items: center;
    padding: 7px 0;
  }

  &__handle {
    margin-left: 10px;
    span {
      margin-right: 20px;
      color: @color-primary;
      cursor: pointer;
    }
  }
}
</style>
