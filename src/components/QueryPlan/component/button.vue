<template>
  <div :class="prefixCls">
    <DxButton :width="76" text="查询" type="default" @click="onClick($event)" />
    <DxButton :width="76" text="重置" @click="onClick($event)" />
    <DxButton :width="100" text="查询方案" @click="onClick($event)" />
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
  setup() {
    const { prefixCls } = useDesign('query-btn');

    return {
      prefixCls,
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
