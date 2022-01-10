<template>
  <DxScrollView direction="both">
    <div :class="prefixCls">
      <div v-if="relationShipsCpt.length > 0" class="entity-list__container">
        <DxCheckBox
          v-for="(item, index) in relationShipsCpt"
          :key="index"
          v-model:value="item.value"
          class="entity-item__container"
          :text="item.caption"
          :disabled="item.isMainEntity"
          @valueChanged="onRelationShipChangeHandle"
        />
      </div>
      <div :class="`${prefixCls}__header`">
        <span style="width: 100px">(</span>
        <span style="width: 180px">字段</span>
        <span style="width: 110px">比较</span>
        <span style="width: 180px">值</span>
        <span style="width: 100px">)</span>
        <span style="width: 130px">逻辑</span>
        <span style="width: 120px">操作</span>
      </div>
      <div>
        <div v-for="(item, index) in requirement" :key="index" :class="`${prefixCls}__item`">
          <DxSelectBox
            v-model:value="item.leftParenthesisCount"
            :data-source="leftParenthesisOptions"
            display-expr="name"
            value-expr="value"
            width="100"
            :show-clear-button="true"
            style="margin-right: 10px"
          ></DxSelectBox>
          <DynamicSelect
            v-model:value="item.value"
            v-model:paramKey="item.key"
            v-model:operation="item.operator"
            v-model:paramDataType="item.type"
            v-model:paramOperations="item.operatorList"
            v-model:paramDatatypekeies="item.datatypekeies"
            v-model:paramRelationKey="item.relationKey"
            v-model:entity-key="item.entityKey"
            :param-list="allColumns"
          />
          <DxSelectBox
            v-model:value="item.rightParenthesisCount"
            :data-source="rightParenthesisOptions"
            display-expr="name"
            value-expr="value"
            width="100"
            :show-clear-button="true"
            style="margin-left: 10px"
          ></DxSelectBox>
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
            <span v-if="requirement.length > 1" @click="onDel(index)">删除</span>
          </div>
        </div>
      </div>
    </div>
  </DxScrollView>
</template>

<script lang="ts">
  import type { ILogicOptions } from './types';
  import type { IColumnItem } from '/@/model/types';
  import type { ISchemeData } from '../../QueryPlan/types';

  import type { Ref } from 'vue';

  import { defineComponent, computed, inject } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';

  import DxSelectBox from 'devextreme-vue/select-box';
  import { DxCheckBox } from 'devextreme-vue/check-box';
  import { DxScrollView } from 'devextreme-vue/scroll-view';

  import DynamicSelect from '/@/components/DynamicSelect/index.vue';

  export default defineComponent({
    components: {
      DynamicSelect,
      DxSelectBox,
      DxCheckBox,
      DxScrollView,
    },
    setup() {
      const allColumns = inject<Ref<IColumnItem[]>>('allColumns');
      const initRelationShipHandle = inject<() => void>('initRelationShipHandle');
      const initEntityColumnHandle = inject<() => void>('initEntityColumnHandle');
      const schemeData = inject<Ref<ISchemeData>>('schemeData');

      const requirement = computed(() => {
        if (
          schemeData?.value.scheme[schemeData.value.checkedIndex] &&
          schemeData.value.scheme[schemeData.value.checkedIndex].requirement
        ) {
          return schemeData.value.scheme[schemeData.value.checkedIndex].requirement;
        } else {
          return [];
        }
      });

      const relationShipsCpt = computed(() => {
        if (schemeData?.value.scheme[schemeData.value.checkedIndex]) {
          if (
            !Array.isArray(schemeData.value.scheme[schemeData.value.checkedIndex].relationShips)
          ) {
            initRelationShipHandle!();
          }
          return schemeData.value.scheme[schemeData.value.checkedIndex].relationShips;
        } else {
          return [];
        }
      });

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

      const leftParenthesisOptions = [
        {
          name: '(',
          value: 1,
        },
        {
          name: '((',
          value: 2,
        },
      ];

      const rightParenthesisOptions = [
        {
          name: ')',
          value: 1,
        },
        {
          name: '))',
          value: 2,
        },
      ];

      // 点击上加触发
      const onUpAdd = (index) => {
        schemeData?.value.scheme[schemeData.value.checkedIndex].requirement.splice(index, 0, {
          leftParenthesisCount: undefined,
          rightParenthesisCount: undefined,
          entityKey: '',
          key: '',
          operator: '',
          operatorList: [],
          value: undefined,
          type: '',
          datatypekeies: '',
          relationKey: '',
          logic: 'and',
        });
      };
      // 点击下加触发
      const onDownAdd = (index) => {
        schemeData?.value.scheme[schemeData.value.checkedIndex].requirement.splice(index + 1, 0, {
          leftParenthesisCount: undefined,
          rightParenthesisCount: undefined,
          entityKey: '',
          key: '',
          operator: '',
          operatorList: [],
          value: undefined,
          type: '',
          datatypekeies: '',
          relationKey: '',
          logic: 'and',
        });
      };
      // 点击删除触发
      const onDel = (index) => {
        // 删除到只剩下一个不能删除
        const temp = [...schemeData!.value.scheme[schemeData!.value.checkedIndex].requirement];
        if (temp.length > 1) {
          temp.splice(index, 1);
          schemeData!.value.scheme[schemeData!.value.checkedIndex].requirement = temp;
        }
      };

      const onRelationShipChangeHandle = (e) => {
        if (e.event) {
          // 只有点击行为才执行更新全部列
          initEntityColumnHandle!();
        }
      };

      return {
        requirement,
        relationShipsCpt,
        allColumns,
        prefixCls,
        logicOptions,
        leftParenthesisOptions,
        rightParenthesisOptions,
        onUpAdd,
        onDownAdd,
        onDel,
        onRelationShipChangeHandle,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-content-requirement';

  .@{prefix-cls} {
    height: 100%;

    .entity-list__container {
      padding-bottom: 10px;
      border-bottom: 1px #e4e7ed solid;
      .entity-item__container {
        margin-right: 10px;
      }
    }

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
