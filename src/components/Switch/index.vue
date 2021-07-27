<template>
  <div :class="[`${prefixCls}`, value && `${prefixCls}-is-checked`]" @click="onChange">
    <span>{{ value ? '是' : '否' }}</span>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    name: 'Switch',
    props: {
      value: Boolean,
    },
    emits: ['update:value'],
    setup(props, ctx) {
      const { prefixCls } = useDesign('switch');

      function onChange() {
        ctx.emit('update:value', !props.value);
      }

      return {
        prefixCls,
        onChange,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-switch';

  .@{prefix-cls} {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 48px;
    height: 24px;
    margin: 0;
    font-size: 14px;
    line-height: 24px;
    color: #fff;
    text-align: right;
    cursor: pointer;
    background: #bfbfbf;
    border: 1px solid #bfbfbf;
    border-radius: 12px;
    box-sizing: border-box;
    transition: border-color 0.3s, background-color 0.3s;

    &::after {
      position: absolute;
      top: 2px;
      left: 1px;
      width: 18px;
      height: 18px;
      background-color: #fff;
      border-radius: 100%;
      content: '';
      transition: all 0.3s;
    }

    &-is-checked {
      justify-content: flex-start;
      background-color: @color-primary;
      border-color: @color-primary;
      &::after {
        left: 100%;
        margin-left: -19px;
      }
    }

    span {
      padding: 0 6px;
    }
  }
</style>
