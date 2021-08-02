<template>
  <svg
    :class="[prefixCls, $attrs.class, spin && 'svg-icon-spin']"
    :style="getStyle"
    aria-hidden="true"
  >
    <use :xlink:href="symbolId" :stroke="color" />
  </svg>
</template>
<script lang="ts">
  import type { CSSProperties } from 'vue';

  import { defineComponent, computed } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    name: 'SvgIcon',
    props: {
      prefix: {
        type: String,
        default: 'icon',
      },
      color: {
        type: String,
        default: '#1890FF',
      },
      name: {
        type: String,
        default: '',
      },
      size: {
        type: [Number, String],
        default: 16,
      },
      spin: {
        type: Boolean,
        default: false,
      },
    },
    setup(props) {
      const { prefixCls } = useDesign('svg-icon');
      const symbolId = computed(() => `#${props.prefix}-${props.name}`);

      const getStyle = computed(
        (): CSSProperties => {
          const { size } = props;
          let s = `${size}`;
          s = `${s.replace('px', '')}px`;
          const sArray = s.split(' ');
          return {
            width: sArray[0],
            height: sArray.length === 2 ? sArray[1] : sArray[0],
          };
        }
      );
      return { symbolId, prefixCls, getStyle };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-svg-icon';

  .@{prefix-cls} {
    display: inline-block;
    overflow: hidden;
    vertical-align: -0.15em;
    fill: currentColor;
  }

  .svg-icon-spin {
    animation: loadingCircle 1s infinite linear;
  }
</style>
