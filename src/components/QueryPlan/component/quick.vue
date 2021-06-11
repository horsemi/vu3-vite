<template>
  <div :class="prefixCls">
    <span>快建过滤：</span>
    <DxButton text="2020的订单" type="default" styling-mode="text" @click="onClick($event)" />
    <DxButton text="3月订单" type="default" styling-mode="text" @click="onClick($event)" />
    <div :class="`${prefixCls}__iconbox`">
      <span :class="`${prefixCls}__icon`"></span>
      <span :class="`${prefixCls}__icon`"></span>
      <span :class="`${prefixCls}__icon`"></span>
    </div>
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
    const { prefixCls } = useDesign('query-quick');

    return {
      prefixCls,
    };
  },
});
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-query-quick';

.@{prefix-cls} {
  display: flex;
  align-items: center;
  margin-left: 25px;

  span {
    flex-shrink: 0;
  }

  &__iconbox {
    display: flex;
    align-items: center;
    height: 34px;
    cursor: pointer;
  }

  &__icon {
    width: 4px;
    height: 4px;
    margin: 0 2px;
    background: #d8d8d8;
    border-radius: 100%;
  }
}
</style>
