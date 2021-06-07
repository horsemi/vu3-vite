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
      display: flex;
      width: 16px;
      height: 16px;
      font-size: 12px;
      color: #fff;
      background-color: #f5222d;
      border-radius: 100%;
      align-items: center;
      justify-content: center;
    }
  }
</style>
