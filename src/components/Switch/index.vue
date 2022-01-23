<template>
  <div :class="`${prefixCls} ${value ? `${prefixCls}-checked` : ''}`" @click="onChange">
    <div :class="`${prefixCls}-handle`"></div>
    <span :class="`${prefixCls}-inner`">{{ value ? activeText : inactiveText }}</span>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    name: 'Switch',
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      readOnly: {
        type: Boolean,
        default: false,
      },
      activeText: {
        type: String,
        default: '是',
      },
      inactiveText: {
        type: String,
        default: '否',
      },
      activeColor: {
        type: String,
        default: '#3694fd',
      },
      inactiveColor: {
        type: String,
        default: '#00000040',
      },
    },
    emits: ['update:value'],
    setup(props, ctx) {
      const { prefixCls } = useDesign('ods-switch');

      const opacityVal = computed(() => {
        return props.readOnly ? 0.6 : 1;
      });

      function onChange() {
        if (props.readOnly) return;
        ctx.emit('update:value', !props.value);
      }

      return {
        prefixCls,
        opacityVal,
        onChange,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-ods-switch';

  .@{prefix-cls} {
    position: relative;
    display: inline-block;
    height: 22px;
    min-width: 44px;
    padding: 0;
    margin: 0;
    font-size: 14px;
    line-height: 1.5715;
    line-height: 22px;
    color: #000000d9;
    vertical-align: middle;
    list-style: none;
    cursor: pointer;
    background-color: v-bind(inactivecolor);
    border: 0;
    border-radius: 100px;
    opacity: v-bind(opacityval);
    box-sizing: border-box;
    transition: all 0.2s;
    user-select: none;

    &-handle {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 18px;
      height: 18px;
      transition: all 0.2s ease-in-out;
      &::before {
        position: absolute;
        background-color: #fff;
        border-radius: 9px;
        content: '';
        box-shadow: 0 2px 4px #00230b33;
        transition: all 0.2s ease-in-out;
        inset: 0;
      }
    }

    &-checked {
      background-color: v-bind(activecolor);
    }

    &-checked &-handle {
      left: calc(100% - 20px);
    }

    &-checked &-inner {
      margin: 0 25px 0 7px;
    }

    &-inner {
      display: block;
      margin: 0 7px 0 25px;
      font-size: 12px;
      color: #fff;
      transition: margin 0.2s;
    }
  }
</style>
