<template>
  <div :class="prefixCls">
    <div>
      <DxSelectBox
        :value="paramKey"
        :data-source="paramList"
        :show-clear-button="true"
        value-expr="key"
        width="130"
        display-expr="caption"
        @update:value="$emit('update:paramKey', $event)"
      ></DxSelectBox>
    </div>
    <div :class="`${prefixCls}-operation-box__container`">
      <DxSelectBox
        :value="operation"
        :data-source="operatorOptions"
        width="95"
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
        v-else-if="paramDatatypekeies === 'enum'"
        :value="value"
        :data-source="options"
        :show-clear-button="true"
        value-expr="value"
        display-expr="description"
        width="180"
        @update:value="$emit('update:value', $event)"
      >
      </DxSelectBox>
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

  import DxSelectBox from 'devextreme-vue/select-box';
  import DxTextBox from 'devextreme-vue/text-box';
  import DxNumberBox from 'devextreme-vue/number-box';
  import DxDateBox from 'devextreme-vue/date-box';

  import { useAppStore } from '/@/store/modules/app';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getOperatorByType, initOperatorMap } from '/@/model/global-operator';

  export default defineComponent({
    name: 'DynamicSelect',
    components: { DxSelectBox, DxTextBox, DxNumberBox, DxDateBox },
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
          key: 'true',
          value: '是',
        },
        {
          key: 'false',
          value: '否',
        },
      ];
      watch(
        () => props.paramKey,
        (paramKey, prevParamKey) => {
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
            context.emit('update:operation', '=');
            initData(type!, datatypekeies!);
          } else {
            operatorOptions.value = [];
            context.emit('update:paramOperations', operatorOptions.value);
            context.emit('update:operation', '');
            context.emit('update:paramDataType', '');
            context.emit('update:paramDatatypekeies', '');
            initValue('string');
          }
        }
      );

      function initData(type: string, datatypekeies: string) {
        options.value.splice(0, options.value.length);
        dataType.value = type;
        switch (datatypekeies) {
          case 'enum': {
            options.value.push(...appStore.getGlobalEnumDataByCode(type));
          }
          // case 'foundation': {

          // }
        }
        initValue(datatypekeies || type);
        operatorOptions.value = getOperatorByType(datatypekeies || type);
        context.emit('update:paramOperations', operatorOptions.value);
      }

      function initValue(type: string) {
        let initData: unknown = '';
        switch (type) {
          case 'datetime': {
            initData = new Date();
            break;
          }
          case 'number': {
            initData = 0;
            break;
          }
        }
        context.emit('update:value', initData);
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
