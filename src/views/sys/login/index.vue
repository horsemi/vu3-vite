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
  import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    name: 'Login',
    setup() {
      const userStore = useUserStore();
      let userName = ref('');
      let password = ref('');

      return {
        userStore,
        userName,
        password,
      };
    },
    methods: {
      async onLogin() {
        await this.userStore.login();
        this.$router.replace('/');
      },
    },
  });
</script>
