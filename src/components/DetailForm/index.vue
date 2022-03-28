<template>
  <div :class="prefixCls">
    <DxForm
      :form-data="formData"
      :col-count="colCount"
      :show-colon-after-label="false"
      :read-only="readOnly"
      :disabled="disabled"
      :items="[]"
    >
      <template v-for="(item, index) in formList" :key="index">
        <DxItem
          v-if="!item.hide"
          :label="{ text: item.caption }"
          :editor-type="item.editorType"
          :validation-rules="item.validate"
          :disabled="item.disabled"
          :col-span="2"
          :template="
            item.template
              ? item.template
              : item.expand
              ? 'expand'
              : item.editorType === 'dxSwitch'
              ? 'OdsSwitch'
              : ''
          "
          :data-field="getDataField(item)"
          :editor-options="getEditorOptions(item)"
        />
      </template>
      <template #OdsSwitch="{ data }">
        <Switch
          style="margin-bottom: 3px"
          :read-only="readOnly"
          :value="formData[data.dataField]"
          @update:value="onChangeData($event, data.dataField)"
        />
      </template>
      <template #expand="{ data }">
        <EnumSelect
          v-if="data.editorOptions.type === 'enum' || data.editorOptions.customOption"
          :value="formData[data.dataField]"
          :read-only="readOnly"
          width="100%"
          :expand="data.editorOptions.expand"
          :option="data.editorOptions.customOption"
          @update:value="onChangeData($event, data.dataField)"
        />
        <FoundationSelect
          v-else
          :select-disabled="readOnly"
          :value="formData[data.dataField]"
          :show-property="data.editorOptions.showProperty"
          :key-property="data.editorOptions.keyProperty"
          :foundation-code="data.editorOptions.datatypekeies"
          :default-options="getDefaultOptions(data)"
          @update:value="onChangeData($event, data.dataField)"
        />
      </template>
    </DxForm>
  </div>
</template>

<script lang="ts">
  import type { IDetailItem } from '/@/utils/bill/types';

  import { defineComponent, PropType } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';

  import { DxForm, DxItem } from 'devextreme-vue/form';

  import FoundationSelect from '/@/components/FoundationSelect/index.vue';

  import EnumSelect from '/@/components/EnumSelect/index.vue';
  import Switch from '/@/components/Switch/index.vue';
  import { camelCaseToHyphenCase } from '/@/utils/helper/dataHelper';

  export default defineComponent({
    components: {
      DxForm,
      DxItem,
      FoundationSelect,
      EnumSelect,
      Switch,
    },
    props: {
      formData: {
        type: Object,
        default: () => {
          return {};
        },
      },
      formList: {
        type: Array as PropType<IDetailItem[]>,
        default: () => {
          return [];
        },
      },
      readOnly: {
        type: Boolean,
        default: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      colCount: {
        type: Number,
        default: 8,
      },
    },
    setup(props) {
      const { prefixCls } = useDesign('detail-form');

      function onChangeData($event, key) {
        const temp = props.formData;
        temp[key] = $event;
      }

      function getEditorOptions(item: IDetailItem) {
        let editorOptions;

        if (item.editorType === 'dxNumberBox') {
          editorOptions = {
            showSpinButtons: true,
            format: '###,##0.###',
          };
        } else if (item.editorType === 'dxDateBox') {
          editorOptions = {
            displayFormat: 'yyyy-MM-dd HH:mm:ss',
            ...item,
          };
        } else {
          editorOptions = { ...item };
        }

        return editorOptions;
      }

      function getDataField(item) {
        const { key, expand, keyProperty } = item;
        return expand && key === expand ? `${key}_${keyProperty ?? 'Code'}` : key;
      }

      function getDefaultOptions(data) {
        const defaultOptions = {};
        const {
          editorOptions: { key, expand, keyProperty, showProperty },
        } = data;
        if (expand && key === expand) {
          const _keyProperty = keyProperty ?? 'Code';
          const _showProperty = showProperty ?? 'Name';
          defaultOptions[_keyProperty] = props.formData[`${key}_${_keyProperty}`];
          defaultOptions[_showProperty] = props.formData[`${key}_${_showProperty}`];
        }
        return defaultOptions;
      }

      return {
        prefixCls,
        camelCaseToHyphenCase,
        onChangeData,
        getEditorOptions,
        getDataField,
        getDefaultOptions,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-detail-form';

  .@{prefix-cls} {
    // 禁用样式
    .dx-state-disabled .dx-widget,
    .dx-state-disabled.dx-widget {
      &.dx-texteditor.dx-editor-outlined {
        background: @disabled-color;
        opacity: 1;
      }
    }

    .dx-texteditor.dx-state-readonly {
      background: @disabled-color;
      border-style: solid;
    }
  }
</style>
