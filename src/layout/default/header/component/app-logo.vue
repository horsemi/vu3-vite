<template>
  <div :class="[prefixCls]">
    <SvgIcon size="130 30" name="logo-large"></SvgIcon>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import SvgIcon from '/@/components/Icon/SvgIcon.vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    components: { SvgIcon },
    setup() {
      const { prefixCls } = useDesign('app-logo');

      return {
        prefixCls,
      };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-app-logo';

  .@{prefix-cls} {
    display: flex;
    align-items: center;
  }
</style>
