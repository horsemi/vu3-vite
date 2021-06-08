<template>
  <div :class="[prefixCls]">
    <SvgIcon size="22" name="user"></SvgIcon>
    <DxDropDownButton
      :height="50"
      display-expr="name"
      :items="items"
      :text="`Hi, ${userName}`"
      styling-mode="text"
    >
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
      const { userName } = userStore.getUserInfo;
      const items = [
        {
          name: '登录记录',
          onClick: (e) => {
            //
          },
        },
        {
          name: '退出登录',
          onClick: (e) => {
            userStore.logout(true);
          },
        },
      ];

      function onItemClick(e) {
        console.log(e);
      }

      return {
        prefixCls,
        onItemClick,
        items,
        userName,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-header-user';

  .@{prefix-cls} {
    display: flex;
    align-items: center;

    .dx-button-mode-text {
      & .dx-button-text {
        font-size: 16px;
      }

      & .dx-button-content {
        color: #fff;
      }

      & .dx-icon {
        color: #fff;
      }
    }
  }
</style>
