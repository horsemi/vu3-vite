<template>
  <div :class="prefixCls">
    <DxForm :form-data="formData" :col-count="8">
      <template v-for="(item, index) in formList" :key="index">
        <DxItem
          v-if="!item.hide"
          :label="{ text: item.label, visible: !item.template }"
          :data-field="item.dataField"
          :editor-type="item.editorType"
          :disabled="!item.disabled"
          :editor-options="handleEditorOptions(item)"
          :col-span="item.colSpan ? item.colSpan : item.editorType === 'dxSwitch' ? 1 : 2"
          :template="
            item.template
              ? item.template
              : item.editorType === 'dxSwitch'
              ? 'switch'
              : item.expand
              ? 'expand'
              : ''
          "
        />
        <DxSwitch />
      </template>
      <template #switch="{ data }">
        <Switch
          :style="{ opacity: !data.editorType.disabled ? 0.6 : 1, margin: '4px 0' }"
          :value="formData[data.dataField]"
          @update:value="onChangeData($event, data.dataField)"
        />
      </template>
      <template #stepBar>
        <StepBar :step-data="stepData" :step-active-index="stepActiveIndex" />
      </template>
      <template #expand="{ data }">
        <FoundationText
          v-if="isFoundationType(data.editorOptions)"
          width="100%"
          :value="formData[data.dataField]"
          :foundation-data="formData[data.editorOptions.expand]"
        />
        <EnumSelect
          v-else
          :value="formData[data.dataField]"
          width="100%"
          :expand="data.editorOptions.expand"
          @update:value="onChangeData($event, data.dataField)"
        />
      </template>
    </DxForm>
  </div>
</template>

<script lang="ts">
  import type { IDetailItem } from '/@/utils/detail/types';

  import { defineComponent, PropType } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { isFoundationType } from '/@/model/common';

  import { DxForm, DxItem } from 'devextreme-vue/form';
  import { DxSwitch } from 'devextreme-vue/switch';

  import FoundationText from '/@/components/FoundationText/index.vue';
  import EnumSelect from '/@/components/EnumSelect/index.vue';
  import StepBar from '/@/components/StepBar/index.vue';
  import Switch from '/@/components/Switch/index.vue';

  export default defineComponent({
    components: {
      DxForm,
      DxItem,
      DxSwitch,
      FoundationText,
      EnumSelect,
      StepBar,
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
      stepData: {
        type: Array as PropType<string[]>,
        default: () => [],
      },
      stepActiveIndex: {
        type: Number,
        default: 0,
      },
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
        } else {
          editorOptions = { ...item };
        }
        return editorOptions;
      };

      function onChangeData($event, dataField) {
        data = props.formData;
        data[dataField] = $event;
      }

      return {
        prefixCls,
        handleEditorOptions,
        isFoundationType,
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
      opacity: 0.6;
      &.dx-texteditor.dx-editor-outlined {
        background: #f5f7fa;
        opacity: 1;
      }
    }
  }
</style>
