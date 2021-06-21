<template>
  <DxPopup v-model:visible="popupVisible" :close-on-outside-click="true" :show-title="false">
    <div :class="prefixCls">
      <Header @on-close-popup="closePopup" />
      <Content :code="code" :custom-columns="customColumns" />
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
    setup() {
      const { prefixCls } = useDesign('query-popup');
      const popupVisible = ref(false);

      const openPopup = () => {
        popupVisible.value = true;
      };
      const closePopup = () => {
        popupVisible.value = false;
      };
      const onSubmit = () => {
        closePopup();
      };

      return {
        prefixCls,
        popupVisible,
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
