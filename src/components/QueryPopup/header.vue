<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}__title`">列表过滤</div>
    <i class="dx-icon-close" @click="onClosePopup"></i>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    emits: ['on-close-popup'],
    setup(props, ctx) {
      const { prefixCls } = useDesign('popup-header');

      const onClosePopup = () => {
        ctx.emit('on-close-popup');
      };

      return {
        prefixCls,
        onClosePopup,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-popup-header';

  .@{prefix-cls} {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    &__title {
      font-weight: bold;
    }

    i {
      color: #909399;
      cursor: pointer;
    }
  }
</style>
