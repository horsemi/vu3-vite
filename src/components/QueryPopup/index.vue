<template>
  <DxPopup v-model:visible="popupVisible" :close-on-outside-click="true" :show-title="false">
    <div :class="prefixCls">
      <Header @on-close-popup="closePopup" />
      <Content ref="content" :all-columns="allColumns" />
      <Footer @on-submit="onSubmit" @on-close-popup="closePopup" />
    </div>
  </DxPopup>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { useDesign } from '/@/hooks/web/useDesign';
import { DxPopup } from 'devextreme-vue/popup';
import Header from './header.vue';
import Content from './content/index.vue';
import Footer from './footer.vue';
import { IColumnItem } from '/@/model/types';

export default defineComponent({
  components: {
    DxPopup,
    Header,
    Content,
    Footer,
  },
  props: {
    allColumns: {
      type: Array as PropType<IColumnItem[]>,
      default: () => {
        return [];
      },
    },
  },
  emits: ['on-filter-scheme'],
  setup(props, ctx) {
    const { prefixCls } = useDesign('query-popup');
    const popupVisible = ref(false);
    const content = ref();

    const openPopup = () => {
      popupVisible.value = true;
    };
    const closePopup = () => {
      popupVisible.value = false;
    };
    const handleScheme = () => {
      const scheme = content.value.schemeList[content.value.checkedSchemeIndex];
      let orderBy = scheme.orderBy;
      const columns = scheme.columns;
      if (orderBy && orderBy.length > 0) {
        orderBy.forEach((sort) => {
          columns.forEach((col) => {
            if (sort.key === col.key) {
              col.show = true;
            }
          });
        });
      }
      ctx.emit('on-filter-scheme', scheme);
    };
    const onSubmit = () => {
      handleScheme();
      closePopup();
    };

    return {
      prefixCls,
      popupVisible,
      content,
      openPopup,
      closePopup,
      onSubmit,
    };
  },
});
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-query-popup';

.@{prefix-cls} {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
</style>
