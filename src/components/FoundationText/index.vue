<template>
  <div :class="`${prefixCls}`">
    <DxTextBox :value="foundationName" :read-only="readOnly" :show-clear-button="true"> </DxTextBox>
  </div>
</template>

<script lang="ts">
  import type { FoundationDataType } from '/@/api/app/foundation';

  import { defineComponent, ref, onMounted } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';

  import DxTextBox from 'devextreme-vue/text-box';

  export default defineComponent({
    name: 'FoundationText',
    components: { DxTextBox },
    props: {
      value: {
        type: [String, Number, Boolean],
        default: '',
      },
      width: {
        type: String,
        default: '200',
      },
      foundationData: {
        type: Object,
        default: () => {
          return {};
        },
      },
      showProperty: {
        type: String,
        default: 'Name',
      },
      readOnly: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:value'],
    setup(prop, content) {
      const { prefixCls } = useDesign('foundation-text');
      const options = ref<FoundationDataType[]>([]);
      const foundationName = ref('');

      onMounted(() => {
        if (prop.foundationData) {
          foundationName.value = prop.foundationData[prop.showProperty];
          content.emit('update:value', prop.foundationData[prop.showProperty]);
        }
      });

      return {
        prefixCls,
        foundationName,
        options,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-foundation-text';

  .@{prefix-cls} {
    display: inline-block;
    width: 100%;
  }
</style>
