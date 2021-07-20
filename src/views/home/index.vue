<template>
  <div style="width: 100%; text-align: center">
    <h1>欢迎来到ODS平台</h1>
    <h1>您的时间很宝贵</h1>
    <h1>现在的时间是: {{ now }}</h1>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    name: 'Home',
    components: {
      //
    },
    setup() {
      const now = ref(new Date().toLocaleString());

      setInterval(() => {
        now.value = new Date().toLocaleString();
      }, 1000);

      return {
        now,
      };
    },
  });
</script>
