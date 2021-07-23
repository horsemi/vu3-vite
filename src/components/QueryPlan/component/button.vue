<template>
  <div :class="prefixCls">
    <DxButton :width="76" text="查询" type="default" @click="onSearch" />
    <DxButton :width="76" text="重置" @click="onReset" />
    <DxButton :width="100" text="查询方案" @click="onQueryPlan" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';

  import DxButton from 'devextreme-vue/button';

  export default defineComponent({
    components: {
      DxButton,
    },
    emits: ['on-search', 'on-queryPlan', 'on-reset'],
    setup(props, ctx) {
      const { prefixCls } = useDesign('query-btn');

      const onSearch = () => {
        ctx.emit('on-search');
      };
      const onReset = () => {
        ctx.emit('on-reset');
      };
      const onQueryPlan = () => {
        ctx.emit('on-queryPlan');
      };

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
