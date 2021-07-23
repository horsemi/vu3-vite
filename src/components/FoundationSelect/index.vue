<template>
  <div :class="`${prefixCls}`">
    <DxSelectBox
      ref="foundationSelect"
      :value="value"
      :data-source="options"
      :width="width"
      :search-enabled="true"
      search-mode="contains"
      :search-expr="['name', 'code']"
      display-expr="name"
      value-expr="code"
      @update:value="$emit('update:value', $event)"
      @itemClick="handleItemClick"
    >
    </DxSelectBox>
  </div>
</template>

<script lang="ts">
  import type { FoundationMap, FoundationDataType } from '/@/api/app/foundation';

  import { defineComponent, ref, watch } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';

  import DxSelectBox from 'devextreme-vue/select-box';
  // import DataSource from 'devextreme/data/data_source';

  import { FoundationApi } from '/@/api/app';

  export default defineComponent({
    name: 'FoundationSelect',
    components: { DxSelectBox },
    props: {
      value: {
        type: [String, Number, Boolean],
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
    setup(props) {
      const { prefixCls } = useDesign('foundation-select');
      const options = ref<FoundationDataType[]>([]);

      function getFoundationByCode(foundationCode: string) {
        FoundationApi.getFoundationByCode(
          foundationCode as FoundationMap,
          { isall: true }
        ).then((resolve) => {
          options.value = resolve;
        });
      }

      function handleItemClick(e) {
        e.event.stopPropagation();
      }

      watch(
        () => props.foundationCode,
        (val) => {
          getFoundationByCode(val);
        },
        {
          immediate: true,
        }
      );

      return {
        prefixCls,
        options,
        handleItemClick,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-foundation-select';

  .@{prefix-cls} {
    display: inline-block;
    width: 100%;
  }
</style>
