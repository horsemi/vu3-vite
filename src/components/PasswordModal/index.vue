<template>
  <div :class="`${prefixCls}`">
    <DxPopup
      :visible="popupVisable"
      :drag-enabled="dragEnabled"
      :close-on-outside-click="closeOnOutsideClick"
      :show-close-button="showCloseButton"
      :show-title="false"
      :width="460"
      height="auto"
      @hidden="onClose"
    >
      <img
        class="header-img"
        src="http://file.otwb.linshimuye.com:30011/file/ods/webclient/img/update-password.png"
      />
      <i class="dx-icon-close close-icon" @click="onClose"></i>
      <DxForm
        :form-data="changePasswordData"
        label-location="top"
        :col-count="1"
        show-colon-after-label
        :show-required-mark="false"
      >
        <DxItem
          data-field="oldPassword"
          :editor-options="{
            mode: 'password',
            cssClass: 'test',
            showClearButton: true,
            placeholder: '请输入旧密码',
          }"
        >
          <DxLabel text="旧密码"></DxLabel>
          <DxRequiredRule message="请输入旧密码" />
        </DxItem>
        <DxItem
          data-field="newPassword"
          :editor-options="{
            mode: 'password',
            showClearButton: true,
            placeholder: '请输入新密码',
          }"
        >
          <DxLabel text="新密码"></DxLabel>
          <DxRequiredRule message="请输入新密码" />
          <DxPatternRule :pattern="passwordPattern" :message="passwordMessage" />
        </DxItem>
        <DxItem
          data-field="newPasswordRe"
          :editor-options="{
            mode: 'password',
            showClearButton: true,
            placeholder: '请再次输入新密码',
          }"
        >
          <DxLabel text="确认密码"></DxLabel>
          <DxRequiredRule message="请再次输入新密码" />
          <DxPatternRule :pattern="passwordPattern" :message="passwordMessage" />
          <DxCompareRule :comparison-target="passwordComparison" message="两次输入密码不一致!" />
        </DxItem>
      </DxForm>
      <DxButton
        style="margin: 24px 40px 12px 40px"
        :width="340"
        :height="48"
        text="Contained"
        type="default"
        styling-mode="Contained"
        @click="onChangePassword"
        >确定</DxButton
      >
    </DxPopup>
  </div>
</template>

<script lang="ts">
  import type { ISumbitPassword, IUpdatePassword } from '/@/api/user';
  import { defineComponent, reactive, ref } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { useUserStore } from '/@/store/modules/user';
  import { DxPopup } from 'devextreme-vue/popup';
  import DxButton from 'devextreme-vue/button';
  import { DxRequiredRule, DxCompareRule, DxPatternRule } from 'devextreme-vue/validator';
  import { DxForm, DxItem, DxLabel } from 'devextreme-vue/form';
  import { odsMessage } from '/@/components/Message';

  export default defineComponent({
    name: 'PasswordModal',
    components: {
      DxPopup,
      DxButton,
      DxRequiredRule,
      DxCompareRule,
      DxPatternRule,
      DxForm,
      DxItem,
      DxLabel,
    },
    props: {
      popupVisable: {
        type: Boolean,
        default: false,
      },
      dragEnabled: {
        type: Boolean,
        default: false,
      },
      closeOnOutsideClick: {
        type: Boolean,
        default: true,
      },
      showCloseButton: {
        type: Boolean,
        default: false,
      },
      showTextClose: {
        type: Boolean,
        default: false,
      },
      loginUserName: {
        type: String,
        default: '',
      },
      passwordPattern: {
        type: String,
        default: '',
      },
      passwordMessage: {
        type: String,
        default: '',
      },
    },
    emits: ['closePopup'],
    setup(prop, context) {
      const userStore = useUserStore();
      const { prefixCls } = useDesign('password-modal');
      const passwordForm = ref(null);
      const changePasswordData: IUpdatePassword = reactive({
        oldPassword: '',
        newPassword: '',
        newPasswordRe: '',
      });
      const passwordComparison = () => changePasswordData.newPassword;
      const onChangePassword = async () => {
        const params: ISumbitPassword = {
          userName: prop.loginUserName || userStore.getUserInfo.userName,
          oldPassword: window.btoa(changePasswordData.oldPassword),
          newPassword: window.btoa(changePasswordData.newPassword),
          newPasswordRe: window.btoa(changePasswordData.newPasswordRe),
        };
        userStore.changePassword(params).then(() => {
          odsMessage({
            type: 'success',
            message: '修改成功',
          });
          onClose();
          // if (prop.loginUserName) {
          //   router.replace('/');
          // }
        });
      };
      const onClose = () => {
        context.emit('closePopup', false);
      };
      return {
        prefixCls,
        changePasswordData,
        onChangePassword,
        passwordComparison,
        onClose,
        passwordForm,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-password-modal';

  .@{prefix-cls} {
    display: inline-block;
    width: 100%;
  }

  .header-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 460px;
    height: 201px;
  }

  .dx-form {
    padding: 0 40px;
    margin-top: 206px;

    /* stylelint-disable-next-line */
    :deep(.dx-texteditor-container) {
      height: 48px;
    }

    /* stylelint-disable-next-line */
    :deep(.dx-field-item-label-location-top) {
      margin-bottom: 4px;
    }

    /* stylelint-disable-next-line */
    :deep(.dx-layout-manager .dx-field-item:not(.dx-first-row)) {
      padding-top: 24px;
    }
  }

  .close-icon {
    position: absolute;
    top: 0;
    right: 0;
    z-index: @page-popup-z-index;
    padding: 16px;
    cursor: pointer;
  }
</style>
