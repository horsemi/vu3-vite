<template>
  <div :class="`${prefixCls}`">
    <DxPopup 
        :visible="popupVisable"
        :drag-enabled="dragEnabled"
        :close-on-outside-click="closeOnOutsideClick"
        :show-close-button="showCloseButton"
        :show-title="true"
        :width="500"
        :height="370"
        title="修改密码"
        @hidden="onClose"
      >
        <DxForm
          :form-data="changePasswordData"
          label-location="top"
          :col-count="1"
          show-colon-after-label
        >
          <DxItem
            data-field="oldPassword"
            :editor-options="{
              mode: 'password',
              showClearButton: true,
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
              }"
            >
              <DxLabel text="新密码"></DxLabel>
              <DxRequiredRule message="请输入新密码" />
              <DxPatternRule
              :pattern="passwordPattern"
              message="密码至少包含字母和数字，不少于6位"
            /> 
            </DxItem>
              <DxItem
              data-field="newPasswordRe"
              :editor-options="{
                mode: 'password',
                showClearButton: true,
              }"
            >
            <DxLabel text="确认密码"></DxLabel>
            <DxRequiredRule message="请再次输入密码" />
              <DxPatternRule
            :pattern="passwordPattern"
            message="密码至少包含字母和数字，不少于6位"
            />
              <DxCompareRule
              :comparison-target="passwordComparison"
              message="两次输入密码不一致!"
            />
            </DxItem>
          </DxForm>
          <DxButton 
            style="margin:15px 0"
            :width="500"
            :height="30"
            text="Contained"
            type="default"
            styling-mode="Contained" @click="onChangePassword">提交</DxButton>
          <DxButton 
            :width="500"
            :height="30"
            style="margin:3px 0"
            text="Text"
            type="default"
            styling-mode="text" :disabled="showTextClose" @click="onClose">关闭</DxButton>
      </DxPopup>
  </div>
</template>

<script lang="ts">

  import { defineComponent ,reactive } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { useUserStore } from '/@/store/modules/user';
  import { DxPopup} from 'devextreme-vue/popup';
  import DxButton from 'devextreme-vue/button';
  import {
  DxRequiredRule,
  DxCompareRule,
  DxPatternRule
} from 'devextreme-vue/validator';
  import { DxForm, DxItem ,DxLabel} from 'devextreme-vue/form';
  import { successMessage } from '/@/hooks/web/useMessage';
  import router from '/@/router/index';

  interface updatePassword {
    oldPassword:string;
    newPassword:string;
    newPasswordRe:string;
  }
  interface sumbitPassword extends updatePassword{
    userName:string
  }
  export default defineComponent({
    name: 'PasswordModal',
    components: { 
      DxPopup ,
      DxButton , 
      DxRequiredRule , 
      DxCompareRule , 
      DxPatternRule , 
      DxForm , 
      DxItem , 
      DxLabel
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
        default: false,
      },
      showCloseButton: {
        type: Boolean,
        default: false,
      },
      showTextClose: {
        type: Boolean,
        default: false,
      },
      loginUserName:{
        type: String,
        default: '',
      },
      passwordPattern:{
         type: String,
        default: '',
      }
    },
    emits: ['closePopup'],
    setup(prop,context) {
      const userStore = useUserStore();
      const { prefixCls } = useDesign('password-modal');
      const changePasswordData:updatePassword = reactive({ oldPassword: '', newPassword: '',newPasswordRe:'' });
      const passwordComparison = ()=>changePasswordData.newPassword;
      const onChangePassword = async ()=>{
        const params:sumbitPassword= {
          userName: prop.loginUserName || userStore.getUserInfo.userName,
          oldPassword: changePasswordData.oldPassword,
          newPassword: changePasswordData.newPassword,
          newPasswordRe: changePasswordData.newPasswordRe,
        };
       userStore.changePassword(params).then(()=>{
          successMessage('修改成功');
          onClose();
          if(prop.loginUserName){
            router.replace('/'); 
          }
        });
      };
      const onClose = ()=>{
        context.emit('closePopup',false);
      };
      return {
       prefixCls,
       changePasswordData,
       onChangePassword,
       passwordComparison,
       onClose
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
</style>
