<template>
  <div style="text-align: center">
    <img alt="Vue logo" :src="LogoUrl" />
    <HelloWorld :msg="'userId: ' + userId + ' userName: ' + userName" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import HelloWorld from '/@/components/HelloWorld.vue';
  import LogoUrl from '/@/assets/logo.png';

  import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    name: 'Analysis',
    components: {
      HelloWorld,
    },
    setup() {
      const userStore = useUserStore();
      const { userId, userName } = userStore.getUserInfo;
      return {
        userId,
        userName,
        LogoUrl,
      };
    },
  });
</script>
