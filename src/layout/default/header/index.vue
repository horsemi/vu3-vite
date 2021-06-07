<template>
  <header :class="[prefixCls]">
    <div class="header-item">
      <AppLogo />
    </div>
    <div class="header-item">
      <Search />
      <Notice />
      <User />
      <!-- <button @click="logout">Logout</button> -->
    </div>
  </header>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { AppLogo, Notice, Search, User } from './component';
  import { useUserStore } from '/@/store/modules/user';
  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    name: 'LayoutHeader',
    components: {
      AppLogo,
      Notice,
      Search,
      User,
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
    height: 50px;
    padding: 0 20px;
    background-color: @color-primary;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    .header-item {
      display: flex;
      align-items: center;
    }
  }
</style>
