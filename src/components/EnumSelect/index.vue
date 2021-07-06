<template>
  <div :class="`${prefixCls}`">
    <DxSelectBox
      :value="value"
      :data-source="options"
      :width="width"
      :search-enabled="true"
      search-mode="contains"
      :search-expr="['description', 'key']"
      display-expr="description"
      value-expr="key"
      @update:value="$emit('update:value', $event)"
    >
    </DxSelectBox>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { useAppStore } from '/@/store/modules/app';
  
  import DxSelectBox from 'devextreme-vue/select-box';

  export default defineComponent({
    name: 'EnumSelect',
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
      type: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    setup(props) {
      const { prefixCls } = useDesign('enum-select');
      const options = ref<{ key: string, value: string, description: string }[]>([]);
      const appStore = useAppStore();
      options.value = appStore.getGlobalEnumDataByCode(props.type);
      return {
        prefixCls,
        options,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-enum-select';

  .@{prefix-cls} {
    display: inline-block;
    width: 100%;
  }
</style>
