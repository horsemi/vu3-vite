<template>
  <div :class="[prefixCls]">
    <input placeholder="请输入搜索关键字" :class="`${prefixCls}__input`" />
    <SvgIcon size="16" name="sun"></SvgIcon>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    setup() {
      const { prefixCls } = useDesign('header-search');
      return {
        prefixCls,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-header-search';

  .@{prefix-cls} {
    display: flex;
    width: 210px;
    height: 30px;
    padding: 0 20px;
    margin: 0 20px;
    font-size: 12px;
    background-color: #e2f1ff;
    border-radius: 20px;
    justify-content: space-between;
    align-items: center;
    &__input {
      width: 100%;
    }
  }
</style>
