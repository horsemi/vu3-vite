<template>
  <div :class="[prefixCls]">
    <DxDropDownButton
      :items="items"
      :drop-down-options="{ textAlign: center }"
      text="Hi, 秋天"
      styling-mode="text"
    >
      <template #icon>
        <SvgIcon size="24" name="sun"></SvgIcon>
      </template>
    </DxDropDownButton>
  </div>
</template>

<script lang="ts">
  import DxDropDownButton from 'devextreme-vue/drop-down-button';
  import { defineComponent } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    components: {
      DxDropDownButton,
    },
    setup() {
      const { prefixCls } = useDesign('header-user');
      const userStore = useUserStore();
      console.log(userStore.getUserInfo);
      // console.log(userInfo);
      const items = ['登录记录', '退出登录'];
      return {
        prefixCls,
        items,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-header-user';

  .@{prefix-cls} {
    display: flex;
    align-items: center;
  }
</style>
