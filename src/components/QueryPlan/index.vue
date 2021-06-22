<template>
  <div :class="prefixCls">
    <QueryFrom :columns="allColumns" />
    <QueryButton @on-search="onSearch" @on-reset="onReset" @on-queryPlan="onQueryPlan" />
    <QueryQuick />
    <QueryPopup ref="popup" :code="code" :all-columns="allColumns" />
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
      allColumns: {
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

      const onReset = () => {
        //
      };
      const onQueryPlan = () => {
        popup.value.openPopup();
      };

      return {
        prefixCls,
        popup,
        onReset,
        onQueryPlan,
      };
    },
    methods: {
      onSearch() {
        const queryList = (this.$refs.queryForm as any).getQueryList();
        console.log(queryList);
        this.$emit('on-change-filter-value', queryList);
      },
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
