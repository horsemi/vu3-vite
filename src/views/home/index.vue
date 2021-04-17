<template>
  <div v-loading.fullscreen="loading" element-loading-text="拼命加载中">
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
    <button @click="loadingChange">loading</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: "Home",
  data: () => {
    return {
      selectData: "",
      loading: false
    }
  },
  setup() {
    //
  },
  methods: {
    loadingChange() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 5000);
    }
  }
});
</script>
