<template>
  <div :class="prefixCls">
    <div v-for="(item, index) in stepData" :key="index" :class="`${prefixCls}__item`">
      <span
        :class="[
          `${prefixCls}__icon`,
          stepActiveIndex === index && `${prefixCls}__icon--active`,
          stepActiveIndex < index && `${prefixCls}__icon--disabled`,
        ]"
      >
        <i v-if="stepActiveIndex > index" class="dx-icon-todo"></i>
        <span v-else>{{ index + 1 }}</span>
      </span>
      <span
        :class="[
          stepActiveIndex === index && `${prefixCls}__title--active`,
          stepActiveIndex < index && `${prefixCls}__title--disabled`,
        ]"
        >{{ item }}</span
      >
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    props: {
      stepData: {
        type: Array as PropType<string[]>,
        default: () => [],
      },
      stepActiveIndex: {
        type: Number,
        default: 0,
      },
    },
    setup() {
      const { prefixCls } = useDesign('step-bar');

      return {
        prefixCls,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-step-bar';

  .@{prefix-cls} {
    display: flex;
    width: 100%;

    &__item {
      flex: 1;
      display: flex;
      align-items: center;
      &::after {
        flex: 1;
        display: inline-block;
        height: 1px;
        margin: 0 14px;
        background-color: rgba(0, 0, 0, 0.15);
        content: '';
      }
      &:last-child {
        &::after {
          display: none;
        }
      }
    }

    &__title {
      font-weight: bold;
      &--active {
        font-weight: bold;
      }
      &--disabled {
        color: rgba(0, 0, 0, 0.32);
      }
    }

    &__icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 24px;
      height: 24px;
      margin-right: 8px;
      border: 1px solid @color-primary;
      border-radius: 100%;
      &--active {
        color: #fff;
        background-color: @color-primary;
      }
      &--disabled {
        color: rgba(0, 0, 0, 0.25);
        border-color: rgba(0, 0, 0, 0.15);
      }
      i {
        color: @color-primary;
      }
    }
  }
</style>
