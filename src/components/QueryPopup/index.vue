<template>
  <DxPopup v-model:visible="popupVisible" :close-on-outside-click="true" :show-title="false">
    <div :class="prefixCls">
      <Header @on-close-popup="closePopup" />
      <Content />
      <Footer @on-close-popup="closePopup" />
    </div>
  </DxPopup>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';

  import { DxPopup } from 'devextreme-vue/popup';

  import Header from './header.vue';
  import Content from './content/index.vue';
  import Footer from './footer.vue';

  export default defineComponent({
    components: {
      DxPopup,
      Header,
      Content,
      Footer,
    },
    setup() {
      const { prefixCls } = useDesign('query-popup');

      // 弹窗是否打开
      const popupVisible = ref(false);

      // 打开弹窗
      const openPopup = () => {
        popupVisible.value = true;
      };
      // 关闭弹窗
      const closePopup = () => {
        popupVisible.value = false;
      };

      return {
        prefixCls,
        popupVisible,
        openPopup,
        closePopup,
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
