<template>
  <div :class="prefixCls">
    <div>
      <DxSelectBox
        :value="paramKey"
        :data-source="paramList"
        :show-clear-button="true"
        value-expr="key"
        width="180"
        :search-enabled="true"
        search-mode="contains"
        display-expr="caption"
        @update:value="$emit('update:paramKey', $event)"
      ></DxSelectBox>
    </div>
    <div :class="`${prefixCls}-operation-box__container`">
      <DxSelectBox
        :value="operation"
        :data-source="paramOperations"
        width="95"
        :search-enabled="true"
        search-mode="contains"
        value-expr="key"
        display-expr="value"
        @update:value="$emit('update:operation', $event)"
      >
      </DxSelectBox>
    </div>
    <div>
      <DxNumberBox
        v-if="paramDataType === 'number'"
        :value="value"
        :show-spin-buttons="true"
        format="###,##0.###"
        width="180"
        @update:value="$emit('update:value', $event)"
      >
      </DxNumberBox>
      <DxSelectBox
        v-else-if="paramDataType === 'boolean'"
        :value="value"
        :data-source="booleanOptions"
        :show-clear-button="true"
        value-expr="key"
        display-expr="value"
        width="180"
        @update:value="$emit('update:value', $event)"
      >
      </DxSelectBox>
      <DxDateBox
        v-else-if="paramDataType === 'datetime'"
        :value="value"
        type="datetime"
        display-format="yyyy-MM-dd HH:mm:ss"
        :show-clear-button="true"
        width="180"
        @update:value="$emit('update:value', $event)"
      >
      </DxDateBox>
      <DxSelectBox
        v-else-if="paramDatatypekeies && paramDatatypekeies.startsWith('enum_')"
        :value="value"
        :data-source="options"
        :show-clear-button="true"
        value-expr="key"
        display-expr="description"
        width="180"
        @update:value="$emit('update:value', $event)"
      >
      </DxSelectBox>
      <FoundationSelect
        v-else-if="paramDatatypekeies && paramDatatypekeies.startsWith('foundation_')"
        width="180"
        :value="value"
        :foundation-code="paramDatatypekeies"
        @update:value="$emit('update:value', $event)"
      >
      </FoundationSelect>
      <DxTextBox
        v-else
        :value="value"
        :show-clear-button="true"
        width="180"
        @update:value="$emit('update:value', $event)"
      >
      </DxTextBox>
    </div>
  </div>
</template>

<script lang="ts">
  import type { IColumnItem } from '/@/model/types';

  import { defineComponent, watch, PropType, ref } from 'vue';

  import { useAppStore } from '/@/store/modules/app';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getOperatorByType, initOperatorMap } from '/@/model/global-operator';

  import DxSelectBox from 'devextreme-vue/select-box';
  import DxTextBox from 'devextreme-vue/text-box';
  import DxNumberBox from 'devextreme-vue/number-box';
  import DxDateBox from 'devextreme-vue/date-box';

  import FoundationSelect from '/@/components/FoundationSelect/index.vue';

  export default defineComponent({
    name: 'DynamicSelect',
    components: { DxSelectBox, DxTextBox, DxNumberBox, DxDateBox, FoundationSelect },
    props: {
      value: {
        type: [String, Number, Boolean, Date],
        default: '',
      },
      paramKey: {
        type: String,
        default: '',
      },
      operation: {
        type: String,
        default: '=',
      },
      paramList: {
        type: Array as PropType<IColumnItem[]>,
        default: () => [] as PropType<IColumnItem[]>,
      },
      paramDataType: {
        type: String,
        default: '',
      },
      paramDatatypekeies: {
        type: String,
        default: '',
      },
      paramOperations: {
        type: Array as PropType<string[]>,
        default: () => [] as PropType<string[]>,
      },
    },
    emits: [
      'update:value',
      'update:paramKey',
      'update:operation',
      'update:paramDataType',
      'update:paramOperations',
      'update:paramDatatypekeies',
    ],
    setup(props, context) {
      const appStore = useAppStore();
      const { prefixCls } = useDesign('dynamic-select');
      let options = ref<{ key: string; value: string }[]>([]);
      let operatorOptions = ref<{ key: string; value: string }[]>([]);
      let dataType = ref<string>('');

      let booleanOptions = [
        {
          key: true,
          value: '是',
        },
        {
          key: false,
          value: '否',
        },
      ];
      watch(
        () => props.paramKey,
        (paramKey, prevParamKey) => {
          initData(paramKey);
        },
        {
          immediate: true,
        }
      );

      function initData(paramKey: string) {
        if (paramKey) {
          let { type, operations, datatypekeies } = (props.paramList as IColumnItem[]).filter(
            (item) => paramKey === item.key
          )[0];

          if (operations && operations.length > 0) {
            operatorOptions.value = initOperatorMap(operations);
            context.emit('update:paramOperations', operatorOptions.value);
          }

          context.emit('update:paramDataType', type);
          context.emit('update:paramDatatypekeies', datatypekeies);
          if (!props.operation) {
            context.emit('update:operation', '=');
          }
          initOption(type!, datatypekeies!);

          // TODO 逻辑太恶心 有待优化
          if (
            type === 'datetime' &&
            !props.value &&
            Object.prototype.toString.call(props.value) !== '[object Date]'
          ) {
            context.emit('update:value', new Date());
          }
          if (
            type === 'number' &&
            !props.value &&
            Object.prototype.toString.call(props.value) !== '[object Number]'
          ) {
            context.emit('update:value', 0);
          }
          if (
            (type === 'string' ||
              datatypekeies === 'enum' ||
              type === 'boolean' ||
              datatypekeies?.startsWith('foundation_')) &&
            props.value &&
            Object.prototype.toString.call(props.value) !== '[object String]'
          ) {
            context.emit('update:value', '');
          }
        } else {
          operatorOptions.value = [];
          context.emit('update:paramOperations', operatorOptions.value);
          context.emit('update:operation', '');
          context.emit('update:paramDataType', '');
          context.emit('update:paramDatatypekeies', '');
          context.emit('update:value', '');
        }
      }

      function initOption(type: string, datatypekeies: string) {
        options.value.splice(0, options.value.length);
        dataType.value = type;
        if (datatypekeies && datatypekeies.startsWith('enum_')) {
          options.value.push(...appStore.getGlobalEnumDataByCode(datatypekeies.split('_')[1]));
        } else if (datatypekeies && datatypekeies.startsWith('foundation_')) {
          //
        }

        operatorOptions.value = getOperatorByType(datatypekeies || type);
        context.emit('update:paramOperations', operatorOptions.value);
      }

      return {
        prefixCls,
        options,
        dataType,
        operatorOptions,
        booleanOptions,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-dynamic-select';

  .@{prefix-cls} {
    display: inline-flex;

    &-operation-box__container {
      margin: 0 10px;
    }
  }
</style>
