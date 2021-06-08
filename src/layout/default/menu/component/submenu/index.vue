<template>
  <div :class="prefixCls">
    <div
      v-for="(itemSub, indxeSub) in menuItemData"
      :key="indxeSub"
      :class="`${prefixCls}-col__wrapper`"
    >
      <div v-if="!itemSub.meta.hideMenu">
        <SubMenuItem :sub-menu-data="itemSub"></SubMenuItem>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import SubMenuItem from './item.vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    name: 'MenuPopup',
    components: { SubMenuItem },
    props: {
      menuItemData: {
        type: Object,
        default: () => {
          return {};
        },
      },
      left: {
        type: String,
        default: '0px',
      },
      top: {
        type: String,
        default: '0px',
      },
    },
    setup() {
      const { prefixCls } = useDesign('layout-menu-popup');

      return {
        prefixCls,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-layout-menu-popup';

  .@{prefix-cls} {
    display: flex;
    flex-wrap: wrap;

    &-col__wrapper {
      width: 33.33%;
      padding: 10px 15px;
      overflow: hidden;
      white-space: nowrap;
      box-sizing: border-box;
    }
  }
</style>
