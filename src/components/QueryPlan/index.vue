<template>
  <div :class="prefixCls">
    <QueryFrom ref="queryForm" />
    <QueryButton @on-queryPlan="onQueryPlan" />
    <QueryQuick />
    <QueryPopup ref="popup" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, provide, ref } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';

  import QueryFrom from './component/form.vue';
  import QueryButton from './component/button.vue';
  import QueryQuick from './component/quick.vue';
  import QueryPopup from '/@/components/QueryPopup/index.vue';

  export default defineComponent({
    components: {
      QueryFrom,
      QueryButton,
      QueryQuick,
      QueryPopup,
    },
    setup() {
      const { prefixCls } = useDesign('query-plan');

      // 弹窗的dom
      const popup = ref();
      // 左侧搜索组件
      const queryForm = ref();

      provide('queryForm', queryForm);

      const onQueryPlan = () => {
        popup.value.openPopup();
      };

      return {
        prefixCls,
        popup,
        queryForm,
        onQueryPlan,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-query-plan';

  .@{prefix-cls} {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 64px;
    margin-bottom: 16px;
    background-color: #fff;
    box-sizing: border-box;
    .disabled_mask {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2000;
      width: 100%;
      height: 100%;
      cursor: not-allowed;
      background: #fff;
      opacity: 0.5;
    }
  }
</style>
