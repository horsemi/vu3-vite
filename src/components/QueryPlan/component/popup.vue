<template>
  <div :class="prefixCls">
    <DxPopup
      v-model:visible="popupVisible"
      :drag-enabled="false"
      :close-on-outside-click="true"
      :show-close-button="false"
      :show-title="true"
      :width="300"
      :height="280"
      title="Information"
    >
    </DxPopup>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useDesign } from '/@/hooks/web/useDesign';
import { DxPopup } from 'devextreme-vue/popup';

export default defineComponent({
  components: {
    DxPopup,
  },
  setup(props, ctx) {
    const { prefixCls } = useDesign('query-popup');
    const popupVisible = ref(false);

    const openPopup = () => {
      popupVisible.value = true;
    };

    const closePopup = () => {
      popupVisible.value = false;
    };

    return {
      prefixCls,
      popupVisible,
      openPopup,
      closePopup
    };
  },
});
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-query-popup';

.@{prefix-cls} {
  display: flex;
  & > * {
    margin-left: 10px;
  }
}
</style>
