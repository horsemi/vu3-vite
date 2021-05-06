<template>
  <AppProvider prefix-cls="vue3-vite">
    <RouterView />
  </AppProvider>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { AppProvider } from '/@/components/Application';
  import { initAppConfigStore } from '/@/logics/initAppConfig';

  export default defineComponent({
    name: 'App',
    components: {
      AppProvider,
    },
    setup() {
      initAppConfigStore();
    },
  });
</script>

<style>
  #app {
    margin-top: 60px;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    text-align: center;
  }
</style>
