<template>
  <div :class="prefixCls">
    <QueryFrom />
    <QueryButton @on-search="onSearch" @on-reset="onReset" @on-queryPlan="onQueryPlan" />
    <QueryQuick />
    <QueryPopup ref="popup" :code="code" :custom-columns="customColumns" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { useDesign } from '/@/hooks/web/useDesign';
import QueryFrom from './component/form.vue';
import QueryButton from './component/button.vue';
import QueryQuick from './component/quick.vue';
import QueryPopup from '/@/components/QueryPopup/index.vue';
import { IColumnItem } from '/@/model/types';

export default defineComponent({
  components: {
    QueryFrom,
    QueryButton,
    QueryQuick,
    QueryPopup,
  },
  props: {
    code: {
      type: String,
      default: '',
    },
    customColumns: {
      type: Array as PropType<IColumnItem[]>,
      default: () => {
        return [];
      },
    },
  },
  emits: ['on-change-filter-value'],
  setup(props, ctx) {
    const { prefixCls } = useDesign('query-plan');
    const popup = ref();

    const onSearch = () => {
      ctx.emit('on-change-filter-value', ['BigGroup', '=', '平台营销部']);
    };
    const onReset = () => {
      //
    };
    const onQueryPlan = () => {
      popup.value.openPopup();
    };

    return {
      prefixCls,
      popup,
      onSearch,
      onReset,
      onQueryPlan,
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
