<template>
  <div
    :class="prefixCls"
    :style="{ boxShadow: opened ? '0 10px 12px 0 rgb(0 0 0 / 10%)' : '' }"
    @click.stop=""
  >
    <span>快捷过滤：</span>
    <span
      v-for="(item, index) in quickList.slice(0, 3)"
      :key="index"
      :class="[`${prefixCls}__span`, activeIndex === index ? `${prefixCls}__span--active` : '']"
      @click="onActive(index)"
      >{{ item.text }}</span
    >
    <div :class="`${prefixCls}__iconbox`" @click="opened = !opened">
      <span :class="`${prefixCls}__icon`"></span>
      <span :class="`${prefixCls}__icon`"></span>
      <span :class="`${prefixCls}__icon`"></span>
    </div>
    <transition name="zoom-in-top">
      <div v-show="opened" :class="`${prefixCls}__overflow`">
        <span
          v-for="(item, index) in quickList.slice(3)"
          :key="index"
          :class="[`${prefixCls}__span`, activeIndex === index + 3 ? `${prefixCls}__span--active` : '']"
          style="margin-bottom: 16px;"
          @click="onActive(index + 3)"
          >{{ item.text }}</span
        >
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, ref } from 'vue';
import { useDesign } from '/@/hooks/web/useDesign';

interface IQuickItem {
  text: string,
}

export default defineComponent({
  setup() {
    const { prefixCls } = useDesign('query-quick');
    const opened = ref<boolean>(false);
    const activeIndex = ref<number>(0);

    const quickList: IQuickItem[] = [
      {
        text: '2020的订单',
      },
      {
        text: '3月订单',
      },
      {
        text: '4月订单',
      },
      {
        text: '5月订单',
      },
      {
        text: '2021的订单',
      },
      {
        text: '2019的订单',
      },
      {
        text: '2018的订单',
      },
    ];

    const onActive = (index: number): void => {
      activeIndex.value = index;
    };

    function closePopup(): void {
      opened.value = false;
    }

    document.addEventListener('click', closePopup, false);

    onBeforeUnmount(() => {
      document.removeEventListener('click', closePopup);
    });

    return {
      prefixCls,
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
