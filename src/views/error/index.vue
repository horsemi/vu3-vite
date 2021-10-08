<template>
  <div :class="prefixCls">
    <div>
      <div style="font-size: 50px; font-weight: bolder; letter-spacing: 1.5px">404</div>
      <h1>访问页面不存在</h1>
      <div>
        <DxButton
          :width="120"
          text="返回上一页"
          type="default"
          styling-mode="text"
          @click="goBack"
        />
        <DxButton :width="120" text="返回主页" type="default" styling-mode="text" @click="goHome" />
      </div>
    </div>
    <img style="height: 400px" :src="pic" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import pic from '/@/assets/404.png';
  import DxButton from 'devextreme-vue/button';
  import { useRouter } from 'vue-router';
  import { useDesign } from '/@/hooks/web/useDesign';
  export default defineComponent({
    name: 'Error',
    components: {
      DxButton,
    },
    setup() {
      const { prefixCls } = useDesign('error-page');
      const router = useRouter();

      function goBack() {
        router.back();
      }

      function goHome() {
        router.push({ path: '/home' });
      }
      return {
        pic,
        prefixCls,
        goHome,
        goBack,
      };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-error-page';

  .@{prefix-cls} {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
