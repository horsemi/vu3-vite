<template>
  <div v-loading.fullscreen="loading" element-loading-text="拼命加载中" style="text-align: center">
    <h1>HOME</h1>
    <select v-model="selectData">
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
      <option>6</option>
      <option>7</option>
    </select>
    <button @click="loadingChange"> loading </button>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    name: 'Home',
    setup() {
      //
    },
    data: () => {
      return {
        selectData: '',
        loading: false,
      };
    },
  
    methods: {
      loadingChange() {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
        }, 5000);
      },
    },
  });
</script>
