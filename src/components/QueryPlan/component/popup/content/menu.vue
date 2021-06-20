<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}__btn`">
      <span>保存</span>
      <span>另存</span>
      <span>重置</span>
      <span>修改</span>
      <span>删除</span>
    </div>
    <div :class="`${prefixCls}__list`">
      <div
        v-for="(item, index) in list"
        :key="index"
        :class="[`${prefixCls}__list__item`, activeIndex === index && `${prefixCls}__list__item--active`]"
        @click="onSelectedScheme(index)"
        >{{ item.text }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useDesign } from '/@/hooks/web/useDesign';

export default defineComponent({
  setup() {
    const { prefixCls } = useDesign('content-menu');
    const activeIndex = ref(0);
    const list = [
      {
        text: '缺省方案',
      },
      {
        text: '7月16日前未完成',
      },
      {
        text: '8月6日宝安店',
      },
      {
        text: '等待和作业中',
      },
      {
        text: '2019年后订单',
      },
      {
        text: '德邦-作业中',
      },
      {
        text: 'LIS2455666KD3467',
      },
      {
        text: '今天未发货',
      }
    ];

    const onSelectedScheme = (index) => {
      activeIndex.value = index;
    };

    return {
      prefixCls,
      list,
      activeIndex,
      onSelectedScheme,
    };
  },
});
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-content-menu';

.@{prefix-cls} {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-right: 1px solid #E4E7ED;

  &__btn {
    display: flex;
    width: 100%;
    background-color: #FAFAFA;
    border-bottom: 1px solid #E4E7ED;
    span {
      flex: 1;
      height: 37px;
      line-height: 37px;
      text-align: center;
      cursor: pointer;
      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }
  &__list {
    flex: 1;
    overflow: auto;
  }

  &__list__item {
    display: flex;
    align-items: center;
    height: 40px;
    cursor: pointer;
    &--active {
      background-color: #e6f7ff;
    }
    &:hover {
      background-color: #e6f7ff;
    }
    &::before {
      display: inline-block;
      width: 4px;
      height: 4px;
      margin: 0 10px;
      background-color: #d8d8d8;
      border-radius: 100%;
      content: '';
    }
  }
}
</style>
