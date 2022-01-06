<template>
  <div :class="prefixCls">
    <DxButton :width="76" text="查询" type="default" @click="onSearch" />
    <DxButton :width="76" text="重置" @click="onReset" />
    <DxButton :width="100" text="查询方案" @click="onQueryPlan" />
  </div>
</template>

<script lang="ts">
  import type { ISchemeData } from '../types';
  import type { ISchemeItem } from '../../QueryPopup/content/types';
  import type { Ref } from 'vue';

  import { defineComponent, inject } from 'vue';

  import { cloneDeep } from 'lodash-es';

  import { useDesign } from '/@/hooks/web/useDesign';

  import DxButton from 'devextreme-vue/button';

  export default defineComponent({
    components: {
      DxButton,
    },
    emits: ['on-queryPlan'],
    setup(props, ctx) {
      const schemeData = inject('schemeData') as Ref<ISchemeData>;
      const schemeDataTemp = inject('schemeDataTemp') as Ref<ISchemeData>;
      const onChangeScheme = inject('onChangeScheme') as (data: ISchemeItem) => void;

      const { prefixCls } = useDesign('query-btn');

      function onSearch() {
        onChangeScheme(schemeData.value.scheme[schemeData.value.checkedIndex]);
      }
      function onReset() {
        if (schemeData.value.checkedIndex < schemeDataTemp.value.scheme.length) {
          const popupListTemp = schemeDataTemp.value.scheme[schemeData.value.checkedIndex];
          schemeData.value.scheme[schemeData.value.checkedIndex] = cloneDeep(popupListTemp);
          onSearch();
        }
      }
      function onQueryPlan() {
        ctx.emit('on-queryPlan');
      }

      return {
        prefixCls,
        onSearch,
        onReset,
        onQueryPlan,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-query-btn';

  .@{prefix-cls} {
    display: flex;
    & > * {
      margin-left: 10px;
    }
  }
</style>
