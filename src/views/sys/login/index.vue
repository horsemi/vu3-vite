<template>
  <div :class="prefixCls">
    <div class="container__wrap">
      <div class="top-logo__wrap" style="color: #76e9d0">
        <SvgIcon size="175 39" name="logo-large"></SvgIcon>
      </div>
      <div class="container__wrap_left">
        <div class="image-container__wrap">
          <img
            class="image-container__inner"
            src="http://file.otwb.linshimuye.com:30011/file/ods/webclient/img/ods_login.png"
          />
        </div>
      </div>
      <div class="container__wrap_right">
        <div class="login-form-container__wrap">
          <div class="login-form-container__inner">
            <div class="login-form-title__wrap">林氏ODS订单调度中心</div>
            <DxForm
              :form-data="loginData"
              label-location="top"
              :col-count="1"
              show-colon-after-label
            >
              <DxItem
                css-class="login-form-item"
                data-field="userName"
                :editor-options="{
                  placeholder: '请输入账号',
                }"
              >
                <DxLabel :visible="false"></DxLabel>
                <DxRequiredRule message="请输入账号" />
              </DxItem>
              <DxItem
                css-class="login-form-item"
                data-field="password"
                :editor-options="{
                  mode: 'password',
                  placeholder: '请输入密码',
                }"
              >
                <DxLabel :visible="false"></DxLabel>
                <DxRequiredRule message="请输入密码" />
              </DxItem>
            </DxForm>
            <DxButton class="login-btn__inner" @click="onLogin">登录</DxButton>
          </div>
        </div>
      </div>
      <PasswordModal
        v-if="popupVisable"
        :popup-visable="popupVisable"
        :show-close-button="true"
        :show-text-close="false"
        :login-user-name="loginData.userName"
        :password-message="passwordMessage"
        :password-pattern="passwordPattern"
        @closePopup="ClosePopup"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue';

  import DxButton from 'devextreme-vue/button';
  import { DxRequiredRule } from 'devextreme-vue/validator';
  import { DxForm, DxItem, DxLabel } from 'devextreme-vue/form';

  import { TOKEN_KEY } from '/@/enums/cacheEnum';
  import { useUserStore } from '/@/store/modules/user';
  import { useDesign } from '/@/hooks/web/useDesign';
  import SvgIcon from '/@/components/Icon/SvgIcon.vue';
  import PasswordModal from '/@/components/PasswordModal/index.vue';
  import { PasswordStateEnum } from '/@/enums/appEnum';
  import { removeCookie } from '/@/utils/cache/cookies';

  export default defineComponent({
    name: 'Login',
    components: {
      SvgIcon,
      DxButton,
      DxForm,
      DxItem,
      DxLabel,
      DxRequiredRule,
      PasswordModal,
    },
    setup() {
      const userStore = useUserStore();
      const { prefixCls } = useDesign('login');
      const popupVisable = ref<boolean>(false);
      const passwordPattern = ref<string>('');
      const passwordMessage = ref<string>('');
      const loginData = reactive({ userName: '', password: '' });

      return {
        prefixCls,
        userStore,
        loginData,
        passwordPattern,
        popupVisable,
        passwordMessage,
      };
    },
    methods: {
      async onLogin() {
        await this.userStore.login(this.loginData);
        const result = await this.userStore.checkPassword(this.loginData);
        if (
          result.warningType === PasswordStateEnum.EXPIRED ||
          result.warningType === PasswordStateEnum.WEAKPASSWORD
        ) {
          this.loginData.password = '';
          this.popupVisable = true;
          removeCookie(TOKEN_KEY);
          const { regexp, regexpTips } = await this.userStore.getPasswordPolicy();
          this.passwordMessage = regexpTips;
          this.passwordPattern = regexp;
        } else {
          this.$router.replace('/');
        }
      },
      ClosePopup(value: boolean) {
        this.popupVisable = value;
      },
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-login';
  @fileService: 'http://file.otwb.linshimuye.com:30011/file/ods/webclient/img';

  @proportion: 0.69; //小屏比例

  .@{prefix-cls} {
    position: relative;
    display: flex;
    height: 100%;
    // min-height: 624px;
    background: url('@{fileService}/ods_login_background.png') bottom right no-repeat;
    -webkit-background-size: cover;
    -o-background-size: cover;
    background-size: cover;

    .container__wrap {
      @media screen and (max-width: 992px) {
        width: unset;
        margin: auto;
      }

      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      // margin: auto;

      .top-logo__wrap {
        position: absolute;
        top: 49px;
        left: 70px;
      }
      .container__wrap_left {
        @media screen and (max-width: 992px) {
          display: none;
        }

        flex: 1;
        height: 100%;
        margin: auto;

        .image-container__wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          margin: 0 auto auto 10%;

          .image-container__inner {
            width: 37vw;
            height: 52vh;
            object-fit: contain;
          }
        }
      }
      .container__wrap_right {
        flex: 1;
        .login-form-container__wrap {
          @media screen and (max-width: 992px) {
            width: 70%;
            min-width: 349px;
            margin: auto;
          }

          display: inline-block;
          width: 378px;
          height: 410px;
          margin: 7.4% 11.4% 13% 22%;
          vertical-align: middle;
          background-color: #fff;
          border-radius: 4px;

          .login-form-container__inner {
            width: 72%; // 460px * $proportion;
            margin: 10% auto 0 auto; // 130px * $proportion;

            /* stylelint-disable-next-line */
            :deep(.login-form-item) {
              margin-top: 23px;
            }
          }

          .login-form-title__wrap {
            height: 33px;
            margin-top: 76px;
            font-size: 24px;
            font-weight: 500;
            line-height: 33px;
            color: #1890ff;
            text-align: left;
          }

          .login-btn__inner {
            width: 100%;
            height: 48px;
            margin-top: 30px;
            margin-bottom: 115px;
            font-size: 16px;
            color: #e1f0ff;
            background: #1890ff;
            border-radius: 4px;
          }
        }
      }
    }
  }
  .dx-button-mode-contained.dx-state-hover {
    background-color: #5cb1ff !important;
    border-color: #52b7ff !important;
  }
  .dx-button-mode-contained.dx-state-focused {
    color: #fff !important;
    background-color: #1065b3 !important;
    border-color: #0486fe !important;
    .dx-icon {
      color: #0486fe !important;
    }
  }
</style>
