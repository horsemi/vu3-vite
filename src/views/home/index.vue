<template>
  <div>
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: "Home",
  data: () => {
    return {
      selectData: ""
    }
  },
  setup() {
    
  },
});
</script>
