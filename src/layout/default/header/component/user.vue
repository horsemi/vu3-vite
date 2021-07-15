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
    <PasswordModal
      v-model:popup-visable="popupVisable"
      :show-close-button="true"
      :password-pattern="passwordPattern"
      @closePopup="ClosePopup"
    />
  </div>
</template>

<script lang="ts">
  import DxDropDownButton from 'devextreme-vue/drop-down-button';
  import { defineComponent, ref } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useUserStore } from '/@/store/modules/user';
  import PasswordModal from '/@/components/PasswordModal/index.vue';
  import { CHANGE_PASSWORD_FLAG_KEY , USERNAME_KEY} from '/@/enums/cacheEnum';
  import { removeCookie } from '/@/utils/cache/cookies';

  export default defineComponent({
    components: {
      DxDropDownButton,
      PasswordModal,
    },
    setup() {
      const { prefixCls } = useDesign('header-user');
      const userStore = useUserStore();
      const { userName } = userStore.getUserInfo;
      const popupVisable = ref<boolean>(false);
      let passwordPattern = ref<string>('');
      const items = [
        {
          name: '登录记录',
          onClick: () => {
            //
          },
        },
        {
          name: '修改密码',
          onClick: async () => {
            passwordPattern.value = await userStore.getPasswordPolicy();
            popupVisable.value = true;
          },
        },
        {
          name: '退出登录',
          onClick: () => {
            removeCookie(CHANGE_PASSWORD_FLAG_KEY);
            removeCookie(USERNAME_KEY);
            userStore.logout();
          },
        },
      ];

      const ClosePopup = (value: boolean) => {
        popupVisable.value = value;
      };

      return {
        prefixCls,
        items,
        userName,
        popupVisable,
        ClosePopup,
        passwordPattern,
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
