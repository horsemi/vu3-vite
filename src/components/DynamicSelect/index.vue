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
        @itemClick="handleItemClick"
        @update:value="$emit('update:paramKey', $event)"
      ></DxSelectBox>
    </div>
    <div :class="`${prefixCls}-operation-box__container`">
      <DxSelectBox
        :value="operation"
        :data-source="paramOperations"
        width="110"
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
        v-if="paramDataType === 'int32' || paramDataType === 'int64' || paramDataType === 'decimal'"
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
        v-else-if="paramDataType === 'datetime' || paramDataType === 'date'"
        :value="value"
        :type="paramDataType"
        apply-value-mode="useButtons"
        :display-format="paramDataType === 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"
        :show-analog-clock="false"
        :show-clear-button="true"
        width="180"
        @update:value="$emit('update:value', $event)"
      >
      </DxDateBox>
      <DxSelectBox
        v-else-if="paramDataType === 'enum'"
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
        v-else-if="paramDatatypekeies"
        width="180"
        :value="value"
        :foundation-code="paramDatatypekeies"
        :filter="paramFilter"
        @update:value="$emit('update:value', $event)"
      >
      </FoundationSelect>
      <DxTextBox
        v-else
        :value="value"
        :show-clear-button="true"
        width="180"
        placeholder="请输入"
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
        default: undefined,
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
      paramRelationKey: {
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
      'update:paramRelationKey',
      'update:paramDatatypekeies',
    ],
    setup(props, context) {
      const appStore = useAppStore();
      const { prefixCls } = useDesign('dynamic-select');
      let options = ref<{ key: string; value: string }[]>([]);
      let operatorOptions = ref<{ key: string; value: string }[]>([]);
      let dataType = ref<string>('');
      let paramFilter = ref();

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
        (paramKey) => {
          initData(paramKey);
        },
        {
          immediate: true,
        }
      );

      function initData(paramKey: string) {
        if (paramKey) {
          if (props.paramList.length === 0) return;
          let {
            type,
            operations,
            datatypekeies,
            relationKey,
            expand,
            filter,
          } = (props.paramList as IColumnItem[]).filter((item) => paramKey === item.key)[0];

          paramFilter.value = filter;

          if (operations && operations.length > 0) {
            operatorOptions.value = initOperatorMap(operations);
            context.emit('update:paramOperations', operatorOptions.value);
          }

          context.emit('update:paramDataType', type);
          context.emit('update:paramDatatypekeies', datatypekeies);
          context.emit('update:paramRelationKey', relationKey);
          if (!props.operation) {
            context.emit('update:operation', '=');
          }
          initOption(type!, datatypekeies!, expand!);
        } else {
          operatorOptions.value = [];
          context.emit('update:paramOperations', operatorOptions.value);
          context.emit('update:operation', '');
          context.emit('update:paramDataType', '');
          context.emit('update:paramDatatypekeies', '');
          context.emit('update:paramRelationKey', '');
          context.emit('update:value', undefined);
        }
      }

      function initOption(type: string, datatypekeies: string, expand: string) {
        options.value.splice(0, options.value.length);
        dataType.value = type;
        if (type === 'enum' && expand) {
          options.value.push(...appStore.getGlobalEnumDataByCode(expand));
        }

        operatorOptions.value = getOperatorByType(datatypekeies || type);
        context.emit('update:paramOperations', operatorOptions.value);
      }

      function handleItemClick() {
        context.emit('update:value', undefined);
      }

      return {
        prefixCls,
        options,
        dataType,
        paramFilter,
        operatorOptions,
        booleanOptions,
        handleItemClick,
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
