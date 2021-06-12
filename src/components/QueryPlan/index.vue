<template>
  <div :class="prefixCls">
    <QueryFrom />
    <QueryButton />
    <QueryQuick />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useDesign } from '/@/hooks/web/useDesign';
import QueryFrom from './component/form.vue';
import QueryButton from './component/button.vue';
import QueryQuick from './component/quick.vue';

export default defineComponent({
  components: {
    QueryFrom,
    QueryButton,
    QueryQuick
  },
  setup() {
    const { prefixCls } = useDesign('query-plan');
    return {
      prefixCls,
    };
  },
});
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-query-plan';

.@{prefix-cls} {
  display: flex;
  align-items: center;
  width: 100%;
  height: 64px;
  margin-bottom: 20px;
  background-color: #fff;
  box-sizing: border-box;
}
</style>
