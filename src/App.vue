<template>
  <AppProvider prefix-cls="vue3-vite">
    <RouterView />
  </AppProvider>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { AppProvider } from '/@/components/Application';
  import { initAppConfigStore, initGlobalEnumData } from '/@/logics/initAppConfig';

  import zhMessages from 'devextreme/localization/messages/zh.json';
  import { locale, loadMessages } from 'devextreme/localization';

  export default defineComponent({
    name: 'App',
    components: {
      AppProvider,
    },
    setup() {
      initAppConfigStore();
      initGlobalEnumData();
      loadMessages(zhMessages);
      locale(navigator.language);
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
