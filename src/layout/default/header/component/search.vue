<template>
  <div :class="[prefixCls]">
    <input placeholder="请输入搜索关键字" :class="`${prefixCls}__input`"/>
    <SvgIcon size="16" name="sun"></SvgIcon>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRef } from 'vue';
import { useDesign } from '/@/hooks/web/useDesign';

export default defineComponent({
  setup() {
    const { prefixCls } = useDesign('header-search');
    return {
      prefixCls
    };
  }
});
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-header-search";

.@{prefix-cls} {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 210px;
  height: 30px;
  background-color: #e2f1ff;
  border-radius: 20px;
  margin: 0 20px;
  padding: 0 20px;
  font-size: 12px;
  &__input {
    width: 100%;
  }
}
</style>