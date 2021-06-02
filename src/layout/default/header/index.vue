<template>
  <header :class="[prefixCls]">
    <AppLogo />
    <button @click="logout">Logout</button>
  </header>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import AppLogo from '/@/layout/default/header/component/app-logo.vue';
  import { useUserStore } from '/@/store/modules/user';
  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    name: 'LayoutHeader',
    components: {
      AppLogo,
    },
    setup() {
      const userStore = useUserStore();
      const { prefixCls } = useDesign('layout-header');
      return {
        userStore,
        prefixCls,
      };
    },
    methods: {
      logout() {
        this.userStore.logout(true);
      },
    },
  });
</script>

<style lang="less" scoped>
  @header-prefix-cls: ~'@{namespace}-layout-header';

  .@{header-prefix-cls} {
    display: flex;
    background-color: #1890ff;
  }
</style>
