<template>
  <div :class="prefixCls">
    <div>
      <DxSelectBox
        :value="paramKey"
        :data-source="paramListComputed"
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
        :disabled="selectDisabled"
        width="180"
        @update:value="$emit('update:value', $event)"
      >
      </DxNumberBox>
      <DxSelectBox
        v-else-if="paramDataType === 'boolean'"
        :value="value"
        :data-source="customOption.length ? customOption : booleanOptions"
        :show-clear-button="true"
        value-expr="key"
        :disabled="selectDisabled"
        display-expr="description"
        width="180"
        @update:value="$emit('update:value', $event)"
      >
      </DxSelectBox>
      <DxDateBox
        v-else-if="paramDataType === 'datetime' || paramDataType === 'date'"
        :value="value"
        :type="paramDataType"
        apply-value-mode="useButtons"
        :disabled="selectDisabled"
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
        :disabled="selectDisabled"
        display-expr="description"
        width="180"
        @update:value="$emit('update:value', $event)"
      >
      </DxSelectBox>
      <FoundationSelect
        v-else-if="paramDatatypekeies"
        width="180"
        :value="value"
        :select-disabled="selectDisabled"
        :foundation-code="paramDatatypekeies"
        :filter="paramFilter"
        @update:value="$emit('update:value', $event)"
      >
      </FoundationSelect>
      <DxTextBox
        v-else
        :value="value"
        :disabled="selectDisabled"
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

  import { defineComponent, watch, PropType, computed, ref, nextTick } from 'vue';

  import { useAppStore } from '/@/store/modules/app';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getOperatorByType, initOperatorMap, isDisabedSelect } from '/@/model/global-operator';

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
        type: [String, Number, Boolean, Date] as PropType<
          string | number | boolean | Date | undefined
        >,
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
        type: Array as PropType<{ key: string; value: string; name: string }[]>,
        default: () => [] as PropType<{ key: string; value: string; name: string }[]>,
      },
      entitykey: {
        type: String,
        default: '',
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
      'update:entityKey',
    ],
    setup(props, context) {
      const appStore = useAppStore();
      const { prefixCls } = useDesign('dynamic-select');
      let selectDisabled = ref(false);
      let options = ref<{ key: string; value: string }[]>([]);
      let operatorOptions = ref<{ key: string; value: string }[]>([]);
      let dataType = ref<string>('');
      let paramFilter = ref();

      const paramListComputed = computed(() =>
        props.paramList.filter((item) => !item.notAllowQuery && !item.hide)
      );

      const customOption = computed(() => {
        const target = props.paramList.filter((item) => item.key === props.paramKey);
        return target[0].customOption || [];
      });

      let booleanOptions = [
        {
          key: true,
          description: '是',
        },
        {
          key: false,
          description: '否',
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
          if (paramListComputed.value.length === 0) return;

          const col = (paramListComputed.value as IColumnItem[]).find(
            (item) => paramKey === item.key
          );

          if (!col) return;

          let { type, operations, datatypekeies, relationKey, expand, filter, entityKey } = col;

          paramFilter.value = filter;

          if (operations && operations.length > 0) {
            operatorOptions.value = initOperatorMap(operations);
            context.emit('update:paramOperations', operatorOptions.value);
          }

          context.emit('update:entityKey', entityKey);
          context.emit('update:paramDataType', type);
          context.emit('update:paramDatatypekeies', datatypekeies);
          context.emit('update:paramRelationKey', relationKey);
          initOption(type!, datatypekeies!, expand!);

          // 初始化运算符，取运算符列表第一个
          nextTick(() => {
            if (
              !props.operation ||
              operatorOptions.value.findIndex((item) => item.key === props.operation) === -1
            ) {
              context.emit('update:operation', operatorOptions.value[0].key);
            }
          });
        } else {
          operatorOptions.value = [];
          context.emit('update:paramOperations', operatorOptions.value);
          context.emit('update:operation', '');
          context.emit('update:paramDataType', '');
          context.emit('update:paramDatatypekeies', '');
          context.emit('update:paramRelationKey', '');
          context.emit('update:value', undefined);
          context.emit('update:entityKey', '');
        }
      }

      function initOption(type: string, datatypekeies: string, expand: string) {
        options.value.splice(0, options.value.length);
        dataType.value = type;
        if (type === 'enum' && expand) {
          options.value.push(...appStore.getGlobalEnumDataByCode(expand.toLowerCase()));
        }

        operatorOptions.value = getOperatorByType(datatypekeies ? 'foundation' : type);
        context.emit('update:paramOperations', operatorOptions.value);
      }

      function handleItemClick() {
        context.emit('update:value', undefined);
      }

      watch(
        () => props.operation,
        (v) => {
          if (isDisabedSelect(v)) {
            (selectDisabled.value = true), context.emit('update:value', undefined);
          } else {
            selectDisabled.value = false;
          }
        },
        {
          immediate: true,
        }
      );

      return {
        prefixCls,
        options,
        dataType,
        paramFilter,
        paramListComputed,
        customOption,
        operatorOptions,
        booleanOptions,
        selectDisabled,
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
