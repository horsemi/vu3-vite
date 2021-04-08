<template>
  <div>
      <img alt="Vue logo" src="../../assets/logo.png" />
      <HelloWorld :msg="'userId: ' + userId + ' userName: ' + userName" />  
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from '/@/components/HelloWorld.vue';

import { userStore } from '/@/store/modules/user';

export default defineComponent({
  name: 'Dashboard',
  components: {
    HelloWorld
  },
  setup() {
    userStore.login();
    const { userId, userName} = userStore.getUserInfo;
    return {
      userId,
      userName
    };
  }
})
</script>

<style>
</style>