<template>
  <div>
    <div>
      <span>账号</span>
      <input v-model="userName" />
    </div>
    <div>
      <span>密码</span>
      <input v-model="password" />
    </div>
    <div>
      <button @click="onLogin"> Login In </button>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { userStore } from '/@/store/modules/user';

  export default defineComponent({
    name: 'Login',
    setup() {
      let userName = ref('');
      let password = ref('');

      return {
        userName,
        password,
      };
    },
    methods: {
      onLogin() {
        userStore.login();
        this.$router.push({ name: 'Dashboard' });
      },
    },
  });
</script>
