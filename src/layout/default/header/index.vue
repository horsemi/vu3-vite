<template>
  <header :class="[prefixCls]">
    <div class="header-item">
      <AppLogo />
    </div>
    <div class="header-item">
      <Search />
      <Notice />
      <User />
    </div>
  </header>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { AppLogo, Notice, Search, User } from './component';
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
      const { prefixCls } = useDesign('layout-header');
      return {
        prefixCls,
      };
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
