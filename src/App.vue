<template>
  <AppProvider prefix-cls="vue3-vite">
    <RouterView />
    <Toast
      ref="toast"
      :message="visibleData.message"
      :description="visibleData.description"
      :type="visibleData.type"
      :dangerously-use-html-string="visibleData.dangerouslyUseHtmlString"
    />
  </AppProvider>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  import { AppProvider } from '/@/components/Application';
  import { initAppConfigStore } from '/@/logics/initAppConfig';
  import { useAppStore } from '/@/store/modules/app';

  import zhMessages from 'devextreme/localization/messages/zh.json';
  import { locale, loadMessages } from 'devextreme/localization';
  import Toast from '/@/components/Toast/index.vue';
  import IndexedDBService from '/@/utils/indexedDB/index';

  export default defineComponent({
    name: 'App',
    components: {
      AppProvider,
      Toast,
    },
    setup() {
      IndexedDBService.openConnect();
      const appStore = useAppStore();
      const toast = ref();
      const visibleData = computed(() => appStore.toastData);
      const showToast = () => {
        toast.value.showToast();
      };

      appStore.initToast(showToast);
      initAppConfigStore();
      loadMessages(zhMessages);
      locale(navigator.language);
      return {
        toast,
        visibleData,
        showToast,
      };
    },
  });
</script>

<style>
  #app {
    height: 100%;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
</style>
