<template>
  <div :class="[prefixCls]">
    <SvgIcon size="24" name="notice"></SvgIcon>
    <span :class="`${prefixCls}-notice-num__wrapper`">5</span>
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
    cursor: pointer;

    &-notice-num__wrapper {
      position: absolute;
      top: -5px;
      right: -5px;
      width: 16px;
      height: 16px;
      font-size: 12px;
      color: #fff;
      text-align: center;
      background-color: #f5222d;
      border-radius: 100%;
    }
  }
</style>
