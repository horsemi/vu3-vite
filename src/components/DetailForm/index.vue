<template>
  <DxForm :form-data="formData" :col-count="8">
    <template v-for="(item, index) in formList" :key="index">
      <DxItem
        v-if="!item.hide"
        :label="{ text: item.label }"
        :data-field="item.dataField"
        :editor-type="item.editorType"
        :disabled="item.disabled"
        :editor-options="handleEditorOptions(item)"
        :col-span="item.editorType === 'dxSwitch' ? 1 : 2"
        :template="item.datatypekeies ? 'datatypekeies' : ''"
      />
      <DxSwitch />
    </template>
    <template #datatypekeies="{ data }">
      <EnumSelect
        v-if="data.editorOptions.datatypekeies && data.editorOptions.datatypekeies.startsWith('enum_')"
        width="100%"
        :value="formData[data.dataField]"
        :datatypekeies="data.editorOptions.datatypekeies"
      />
      <FoundationSelect
        v-else
        width="100%"
        :value="formData[data.dataField]"
        :foundation-code="data.editorOptions.datatypekeies"
      />
    </template>
  </DxForm>
</template>

<script lang="ts">
import type { IDetailItem } from '/@/utils/detail/types';

import { defineComponent, PropType } from 'vue';

import { DxForm, DxItem } from 'devextreme-vue/form';
import { DxSwitch } from 'devextreme-vue/switch';

import FoundationSelect from '/@/components/FoundationSelect/index.vue';
import EnumSelect from '/@/components/EnumSelect/index.vue';

export default defineComponent({
  components: {
    DxForm,
    DxItem,
    DxSwitch,
    FoundationSelect,
    EnumSelect,
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
  },
  setup() {
    const handleEditorOptions = (item: IDetailItem) => {
      let editorOptions;
      if (item.editorType === 'dxSwitch') {
        editorOptions = {
          switchedOnText: '是',
          switchedOffText: '否',
        };
      } else {
        editorOptions = { ...item };
      }
      return editorOptions;
    };

    return {
      handleEditorOptions,
    };
  },
});
</script>
