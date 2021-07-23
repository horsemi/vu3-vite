<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}__header`">
      <span style="width: 180px">字段</span>
      <span style="width: 95px">比较</span>
      <span style="width: 180px">值</span>
      <span style="width: 130px">逻辑</span>
      <span style="width: 120px">操作</span>
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
  import type { ILogicOptions, IRequirementItem } from './types';
  import type { IColumnItem } from '/@/model/types';

  import { defineComponent, PropType, ref, watch } from 'vue';
  import { cloneDeep } from 'lodash-es';

  import { useDesign } from '/@/hooks/web/useDesign';

  import DxSelectBox from 'devextreme-vue/select-box';
  import { DxScrollView } from 'devextreme-vue/scroll-view';

  import DynamicSelect from '/@/components/DynamicSelect/index.vue';

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
      // 逻辑下拉框配置项
      const logicOptions: ILogicOptions[] = [
        {
          name: '并且',
          value: 'and',
        },
        {
          name: '或',
          value: 'or',
        },
      ];

      // 条件列表数据
      const dataSource = ref<IRequirementItem[]>([]);

      // 外派条件更新事件
      const onChangeRequirement = (data: IRequirementItem[]) => {
        ctx.emit('on-change-requirement', data);
      };

      // 点击上加触发
      const onUpAdd = (index) => {
        const temp = cloneDeep(dataSource.value);
        temp.splice(index, 0, {
          requirement: '',
          operator: '',
          operatorList: [],
          value: undefined,
          type: '',
          datatypekeies: '',
          logic: 'and',
        });
        dataSource.value = temp;
        onChangeRequirement(dataSource.value);
      };
      // 点击下加触发
      const onDownAdd = (index) => {
        const temp = cloneDeep(dataSource.value);
        temp.splice(index + 1, 0, {
          requirement: '',
          operator: '',
          operatorList: [],
          value: undefined,
          type: '',
          datatypekeies: '',
          logic: 'and',
        });
        dataSource.value = temp;
        onChangeRequirement(dataSource.value);
      };
      // 点击删除触发
      const onDel = (index) => {
        // 删除到只剩下一个不能删除
        if (dataSource.value.length > 1) {
          const temp = cloneDeep(dataSource.value);
          temp.splice(index, 1);
          dataSource.value = temp;
          onChangeRequirement(dataSource.value);
        }
      };

      // 实时更新条件列表数据
      watch(
        () => props.requirement,
        (val) => {
          dataSource.value = val;
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
        onChangeRequirement,
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
      padding: 7px 0;
      color: #333;
      background-color: #fafafa;
      span {
        margin-right: 10px;
        text-align: center;
      }
    }

    &__item {
      display: flex;
      align-items: center;
      padding: 7px 0;
    }

    &__handle {
      display: flex;
      justify-content: space-around;
      width: 120px;
      margin-left: 10px;

      span {
        color: @color-primary;
        cursor: pointer;
      }
    }
  }
</style>
