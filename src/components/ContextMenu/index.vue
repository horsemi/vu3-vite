<template>
  <div
    v-click-outside="closeBox"
    v-context-menu-outside="closeBox"
    :class="`${prefixCls}`"
    @contextmenu="openBox"
  >
    <slot></slot>
    <div v-show="visible" class="contentBox" @click="closeBox">
      <slot name="content"></slot>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    name: 'ContextMenu',
    setup() {
      const { prefixCls } = useDesign('context-menu');
      const visible = ref(false);
      const xoffset = ref('');
      const yoffset = ref('');

      function openBox(e) {
        xoffset.value = e.pageX + 'px';
        yoffset.value = e.pageY + 'px';
        e.preventDefault();
        visible.value = true;
      }

      function closeBox() {
        visible.value = false;
      }

      return {
        prefixCls,
        visible,
        openBox,
        closeBox,
        xoffset,
        yoffset,
      };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-context-menu';
  .@{prefix-cls} {
    position: relative;
    .contentBox {
      position: fixed;
      top: v-bind(yoffset);
      left: v-bind(xoffset);
      z-index: 200;
      width: 150px;
      padding: 5px;
      color: #333;
      cursor: pointer;
      background-color: #fff;
      border: 1px solid #ccc;
      &:active {
        background-color: #e8e8e9;
      }
      &:hover {
        background-color: #e8e8e9;
      }
    }
  }
</style>
