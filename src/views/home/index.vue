<template>
  <div style="width: 100%; text-align: center; background: #fff">
    <img style="height: 400px" :src="pic" />
    <h2>披星戴月开发中, 敬请期待!</h2>
    <DxToast
      v-model:visible="isVisible"
      type="custom"
      position="top center"
      :content-template="contentTemplate"
      :display-time="10000"
    >
      <template #success>
        <div class="success">
          <SvgIcon
            color="#52c41a"
            name="system-checkCircleFill"
            style="margin-right: 5px"
          ></SvgIcon>
          <span>调整中</span>
        </div>
      </template>
    </DxToast>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';

  import { DxToast } from 'devextreme-vue/toast';

  import pic from '/@/assets/developing.png';
  import SvgIcon from '/@/components/Icon/SvgIcon.vue';

  export default defineComponent({
    name: 'Home',
    components: {
      DxToast,
      SvgIcon,
    },
    setup() {
      const isVisible = ref(false);
      const contentTemplate = ref('success');

      return {
        isVisible,
        contentTemplate,
        pic,
      };
    },
  });
</script>

<style lang="less" scoped>
  .success {
    width: 300px;
    padding: 8px 15px;
    align-items: center;
    color: #000000d9;
    word-wrap: break-word;
    background-color: #f6ffed;
    border: 1px solid #b7eb8f;
  }
</style>
