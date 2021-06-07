<template>
  <div :class="[prefixCls]">
    <SvgIcon size="24" name="sun"></SvgIcon>
    <span class="notice-num">5</span>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    setup() {
      const { prefixCls } = useDesign('header-notice');

      return {
        prefixCls,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-header-notice';

  .@{prefix-cls} {
    position: relative;
    margin: 0 20px;
    .notice-num {
      position: absolute;
      top: 0;
      right: 0;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 100%;
      position: absolute;
      color: #fff;
      background-color: #F5222D;
      font-size: 12px;
    }
  }
</style>