<template>
  <div :class="`${prefixCls}`">
    <DxSelectBox
      :value="value"
      :data-source="options"
      :width="width"
      :min-search-length="2"
      :search-enabled="true"
      search-mode="contains"
      display-expr="name"
      value-expr="code"
      @update:value="$emit('update:value', $event)"
    >
    </DxSelectBox>
  </div>
</template>

<script lang="ts">
  import type { FoundationMap, FoundationDataType } from '/@/api/app/foundation';

  import { defineComponent, ref } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';
  import DxSelectBox from 'devextreme-vue/select-box';
  // import DataSource from 'devextreme/data/data_source';

  import { FoundationApi } from '/@/api/app';

  export default defineComponent({
    name: 'FoundationSelect',
    components: { DxSelectBox },
    props: {
      value: {
        type: String,
        default: '',
      },
      width: {
        type: String,
        default: '200',
      },
      foundationCode: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    setup(prop) {
      const { prefixCls } = useDesign('foundation-select');
      const options = ref<FoundationDataType[]>([]);
      FoundationApi.getFoundationByCode(
        prop.foundationCode.slice(prop.foundationCode.indexOf('_') + 1) as FoundationMap,
        { isall: true }
      ).then((resolve) => {
        options.value = resolve;
      });
      return {
        prefixCls,
        options,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-foundation-select';

  .@{prefix-cls} {
    display: inline-block;
  }
</style>
