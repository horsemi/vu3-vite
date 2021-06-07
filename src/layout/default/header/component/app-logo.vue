<template>
  <div :class="[prefixCls]">
    <SvgIcon size="100 24" name="logo-large"></SvgIcon>
    <span class="logo-title">订单调度中心</span>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
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
    .logo-title {
      color: #fff;
      display: flex;
      align-items: center;
      &::before {
        content: '';
        display: inline-block;
        width: 2px;
        height: 20px;
        background-color: #fff;
        margin: 0 12px;
      }
    }
  }
</style>
