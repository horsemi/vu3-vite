<template>
  <div
    :class="prefixCls"
    :style="{ boxShadow: opened ? '0 10px 12px 0 rgb(0 0 0 / 10%)' : '' }"
    @click.stop=""
  >
    <span>快捷过滤：</span>
    <span
      v-for="(item, index) in quickList.slice(0, 4)"
      :key="index"
      :class="[`${prefixCls}__span`, activeIndex === index ? `${prefixCls}__span--active` : '']"
      @click="onActive(index)"
      >{{ item.title }}</span
    >
    <div :class="`${prefixCls}__iconbox`" @click="opened = !opened">
      <span :class="`${prefixCls}__icon`"></span>
      <span :class="`${prefixCls}__icon`"></span>
      <span :class="`${prefixCls}__icon`"></span>
    </div>
    <transition name="zoom-in-top">
      <div v-show="opened" :class="`${prefixCls}__overflow`">
        <span
          v-for="(item, index) in quickList.slice(4)"
          :key="index"
          :class="[
            `${prefixCls}__span`,
            activeIndex === index + 3 ? `${prefixCls}__span--active` : '',
          ]"
          style="margin-bottom: 16px"
          @click="onActive(index + 3)"
          >{{ item.title }}</span
        >
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onBeforeUnmount, PropType, ref, watch } from 'vue';
  import { ISchemeItem } from '../../QueryPopup/content/types';
  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    props: {
      quickData: {
        type: Array as PropType<ISchemeItem[]>,
        default: () => {
          return [];
        },
      },
    },
    emits: ['on-filter-scheme'],
    setup(props, ctx) {
      const { prefixCls } = useDesign('query-quick');
      const quick = ref();
      const opened = ref<boolean>(false);
      const activeIndex = ref<number>(0);
      const quickList = ref<ISchemeItem[]>([]);

      const onActive = (index: number): void => {
        activeIndex.value = index;
        onFilterScheme(quickList.value[activeIndex.value]);
      };
      const onFilterScheme = (data) => {
        ctx.emit('on-filter-scheme', data);
      };
      const handleQuickList = (val) => {
        const data: ISchemeItem[] = [];
        if (val.length > 1) {
          val.forEach((item) => {
            data.push(item);
          });
        }
        quickList.value = data;
      };

      function closePopup(): void {
        opened.value = false;
      }

      document.addEventListener('click', closePopup, false);

      onBeforeUnmount(() => {
        document.removeEventListener('click', closePopup);
      });

      watch(
        () => props.quickData,
        (val) => {
          handleQuickList(val);
        },
        {
          immediate: true,
        }
      );

      return {
        prefixCls,
        quick,
        opened,
        activeIndex,
        quickList,
        onActive,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-query-quick';

  .@{prefix-cls} {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 64px;
    padding: 0 10px;
    margin-left: 15px;
    box-sizing: border-box;
    .zoom-animation(top, scaleY(0), scaleY(1), center top);

    span {
      flex-shrink: 0;
    }

    &__span {
      padding: 6.5px 18px;
      margin-right: 5px;
      color: @color-primary;
      cursor: pointer;
      border-radius: 4px;
      &--active {
        background: #e6f7ff;
      }
      &:hover {
        background: #e6f7ff;
      }
    }

    &__iconbox {
      display: flex;
      align-items: center;
      width: 24px;
      height: 34px;
      cursor: pointer;
    }

    &__icon {
      width: 4px;
      height: 4px;
      margin: 0 2px;
      background: #d8d8d8;
      border-radius: 100%;
    }

    &__overflow {
      position: absolute;
      top: 64px;
      left: 0;
      z-index: @page-popup-z-index;
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      padding: 0 10px;
      background-color: #fff;
      box-shadow: 0 10px 12px 0 rgb(0 0 0 / 10%);
    }
  }
</style>
