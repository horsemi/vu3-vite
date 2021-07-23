<template>
  <div :class="prefixCls">
    <div class="container__wrap">
      <div class="top-logo__wrap">
        <SvgIcon size="130 30" name="logo-large"></SvgIcon>
      </div>
      <div class="form-container__wrap">
        <div class="image-container__wrap">
          <img
            class="image-container__inner"
            src="http://file.otwb.linshimuye.com:30011/file/tms/frontend/login/loginLeftMap.png"
          />
        </div>
        <div class="login-form-container__wrap">
          <div class="login-form-container__inner">
            <div class="login-form-title__wrap">林氏订单调度中心</div>
            <DxForm
              :form-data="loginData"
              label-location="top"
              :col-count="1"
              show-colon-after-label
            >
              <DxItem
                data-field="userName"
                :editor-options="{
                  placeholder: '请输入账号',
                }"
              >
                <DxLabel text="账号"></DxLabel>
                <DxRequiredRule message="请输入账号" />
              </DxItem>
              <DxItem
                data-field="password"
                :editor-options="{
                  mode: 'password',
                  placeholder: '请输入密码',
                  showClearButton: true,
                }"
              >
                <DxLabel text="密码"></DxLabel>
                <DxRequiredRule message="请输入密码" />
              </DxItem>
            </DxForm>
            <DxButton class="login-btn__inner" @click="onLogin">登入</DxButton>
          </div>
        </div>
      </div>
      <div class="foot-container__wrap">
        <div class="foot-line__inner"></div>
        <div class="foot-title__wrap">让生活过得更好</div>
        <div class="foot-line__inner"></div>
      </div>
      <PasswordModal
        v-if="popupVisable"
        :popup-visable="popupVisable"
        :show-close-button="true"
        :show-text-close="false"
        :login-user-name="loginData.userName"
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
<<<<<<< HEAD
  import { removeCookie } from '/@/utils/cache/cookies';
=======
>>>>>>> a05ff255416b1d417313494d38e0e2f81c93480c

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
      const loginData = reactive({ userName: '', password: '' });

      return {
        prefixCls,
        userStore,
        loginData,
        passwordPattern,
        popupVisable,
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
          this.passwordPattern = await this.userStore.getPasswordPolicy();
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

<style lang="less">
  @prefix-cls: ~'@{namespace}-login';
  @fileService: 'http://file.otwb.linshimuye.com:30011/file/tms/frontend';

  @proportion: 0.69; //小屏比例

  .@{prefix-cls} {
    display: flex;
    height: 100%;
    min-height: 624px;
    background: url('@{fileService}/login/backgroupMap.png') bottom right no-repeat;
    -webkit-background-size: cover;
    -o-background-size: cover;
    background-size: cover;

    .container__wrap {
      @media screen and (max-width: 992px) {
        width: unset;
        margin: 3.5% 4%;
      }

      width: 833.25px;
      margin: auto;
    }

    .top-logo__wrap {
      width: 149.984px;
      height: 30.797px;
      margin-bottom: 4%; // 50px * $proportion;
    }

    .form-container__wrap {
      @media screen and (max-width: 992px) {
        width: 60%;
        height: unset;
      }

      position: relative;
      width: 833.25px;
      height: 472.688px;
      background-color: #fff;
      border-radius: 20px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }

    .image-container__wrap {
      @media screen and (max-width: 992px) {
        width: 0%;
      }

      display: inline-block;
      width: 55%; //695.3px * $proportion;

      .image-container__inner {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .login-form-container__wrap {
      @media screen and (max-width: 992px) {
        width: 100%;
      }

      display: inline-block;
      width: 45%;
      height: 100%;
      min-height: 472.688px;
      vertical-align: top;

      .login-form-container__inner {
        width: 72%; // 460px * $proportion;
        margin: 22% auto 0 auto; // 130px * $proportion;
      }

      .login-form-title__wrap {
        margin-bottom: 14%; //65px * $proportion;
        font-size: 38px * @proportion;
        font-weight: 500;
        color: #00596e;
        text-align: left;
      }

      .login-btn__inner {
        width: 100%;
        height: 65px * @proportion;
        margin-top: 20px;
        font-weight: normal;
        color: rgba(58, 239, 208, 1);
        background-color: #00596e;
        border-radius: 10px;
      }
    }

    .foot-container__wrap {
      width: 733.1px * @proportion;
      margin: 4% auto 1% auto;
      text-align: center;
    }

    .foot-line__inner {
      display: inline-block;
      width: 20.83333%;
      height: 16px * @proportion;
      border-bottom: 1px solid rgba(196, 255, 242, 1);
      opacity: 0.4;
    }

    .foot-title__wrap {
      @media screen and (max-width: 992px) {
        width: 25%;
      }

      display: inline-block;
      width: 41.66667%;
      height: 16px * @proportion;
      font-size: 16px * @proportion;
      font-weight: 400;
      color: rgba(254, 255, 255, 1);
      opacity: 0.4;
    }
  }
</style>
