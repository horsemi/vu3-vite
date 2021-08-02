<template>
  <div style="width: 100%; text-align: center; background: #fff">
    <img style="height: 400px" :src="pic" />
    <h2>披星戴月开发中, 敬请期待!</h2>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import pic from '/@/assets/developing.png';

  export default defineComponent({
    name: 'Home',
    components: {
      //
    },
    setup() {
      return {
        pic,
      };
    },
  });
</script>
