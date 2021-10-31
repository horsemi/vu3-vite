<template>
  <div :class="prefixCls">
    <DxForm
      :form-data="formData"
      :col-count="8"
      :show-colon-after-label="false"
      :read-only="readOnly"
      :disabled="disabled"
      :items="[]"
    >
      <template v-for="(item, index) in formList" :key="index">
        <DxItem
          v-if="!item.hide"
          :label="{ text: item.caption }"
          :data-field="item.key"
          :editor-type="item.editorType"
          :disabled="item.disabled"
          :editor-options="handleEditorOptions(item)"
          :col-span="item.colSpan ? item.colSpan : item.editorType === 'dxSwitch' ? 1 : 2"
          :template="
            item.template
              ? item.template
              : item.editorType === 'dxSwitch'
              ? 'OdsSwitch'
              : item.expand
              ? 'expand'
              : ''
          "
        />
      </template>
      <template #OdsSwitch="{ data }">
        <Switch
          :style="{ opacity: !data.editorType.disabled ? 0.6 : 1, margin: '2.5px 0' }"
          :read-only="readOnly"
          :value="formData[data.dataField]"
          @update:value="onChangeData($event, data.dataField)"
        />
      </template>
      <!-- <template #stepBar>
        <StepBar :step-data="stepData" :step-active-index="stepActiveIndex" />
      </template> -->
      <template #expand="{ data }">
        <EnumSelect
          v-if="data.editorOptions.type === 'enum'"
          :value="formData[data.dataField]"
          :read-only="readOnly"
          width="100%"
          :expand="data.editorOptions.expand"
          @update:value="onChangeData($event, data.dataField)"
        />
        <FoundationSelect
          v-else
          width="100%"
          :value="formData[data.dataField]"
          :select-disabled="readOnly"
          :show-property="data.editorOptions.showProperty"
          :key-property="data.editorOptions.keyProperty"
          :foundation-code="data.editorOptions.datatypekeies"
          :default-options="formData[data.editorOptions.expand]"
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
  // import StepBar from '/@/components/StepBar/index.vue';
  import Switch from '/@/components/Switch/index.vue';
  import { camelCaseToHyphenCase } from '/@/utils/helper/dataHelper';

  export default defineComponent({
    components: {
      DxForm,
      DxItem,
      FoundationSelect,
      EnumSelect,
      // StepBar,
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
      // stepData: {
      //   type: Array as PropType<string[]>,
      //   default: () => [],
      // },
      // stepActiveIndex: {
      //   type: Number,
      //   default: 0,
      // },
    },
    setup(props) {
      const { prefixCls } = useDesign('detail-form');

      let data = {};

      const handleEditorOptions = (item: IDetailItem) => {
        let editorOptions;
        if (item.editorType === 'dxNumberBox') {
          editorOptions = {
            showSpinButtons: true,
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
      };

      function onChangeData($event, key) {
        data = props.formData;
        data[key] = $event;
      }

      return {
        prefixCls,
        handleEditorOptions,
        camelCaseToHyphenCase,
        onChangeData,
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
