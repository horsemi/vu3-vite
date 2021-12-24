<template>
  <div v-click-outside="closePopup" :class="prefixCls">
    <div
      :class="`${prefixCls}__wrap`"
      :style="{
        boxShadow: opened ? '0 10px 12px 0 rgb(0 0 0 / 10%)' : '',
        height: opened ? 'auto' : '64px',
      }"
    >
      <span :class="`${prefixCls}__title`">快捷过滤：</span>
      <div v-for="(item, index) in schemeListTemp" :key="index" :class="`${prefixCls}__item`">
        <span
          :class="[
            `${prefixCls}__span`,
            checkedIndex === index ? `${prefixCls}__span--active` : '',
          ]"
          @click="onActive(index)"
          >{{ item.title }}</span
        >
      </div>
      <div :class="`${prefixCls}__iconbox`" @click="opened = !opened">
        <span :class="`${prefixCls}__icon`"></span>
        <span :class="`${prefixCls}__icon`"></span>
        <span :class="`${prefixCls}__icon`"></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import type { ISchemeData } from '../types';
  import type { ISchemeItem } from '../../QueryPopup/content/types';
  import type { Ref } from 'vue';

  import { defineComponent, inject, ref, computed } from 'vue';

  import { cloneDeep } from 'lodash-es';

  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    emits: ['on-change-checked-index'],
    setup() {
      const schemeData = inject('schemeData') as Ref<ISchemeData>;
      const schemeDataTemp = inject('schemeDataTemp') as Ref<ISchemeData>;
      const onChangeScheme = inject('onChangeScheme') as (data: ISchemeItem) => void;

      const schemeListTemp = computed(() => {
        return (schemeDataTemp.value && schemeDataTemp.value.scheme) || [];
      });

      const checkedIndex = computed(() => {
        return schemeData.value.checkedIndex;
      });

      const { prefixCls } = useDesign('query-quick');
      const quick = ref();
      const opened = ref<boolean>(false);

      const onActive = (index: number): void => {
        schemeData.value.checkedIndex = index;

        // 共享方案状态更新
        const scheme = cloneDeep(schemeListTemp.value[checkedIndex.value]);
        schemeData.value.scheme[checkedIndex.value].fast = scheme.fast || [];
        scheme.fast &&
          scheme.fast.forEach((item) => {
            if (item.key) {
              scheme.requirement.push(item);
            }
          });
        onChangeScheme(scheme);
      };

      const closePopup = () => {
        opened.value = false;
      };

      return {
        prefixCls,
        quick,
        opened,
        schemeListTemp,
        checkedIndex,
        onActive,
        closePopup,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-query-quick';

  .@{prefix-cls} {
    position: relative;
    flex: 1;
    min-width: 134px;
    margin-left: 15px;

    &__wrap {
      position: absolute;
      top: -32px;
      right: 0;
      z-index: @page-popup-z-index;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      width: 100%;
      padding-right: 64px;
      padding-left: 10px;
      overflow: hidden;
      background-color: #fff;
      box-sizing: border-box;
      transition: all 300ms ease-in-out;
    }

    span {
      flex-shrink: 0;
    }

    &__title {
      display: flex;
      align-items: center;
      width: 70px;
      height: 64px;
    }

    &__item {
      display: flex;
      align-items: center;
      height: 64px;
    }

    &__span {
      padding: 6.5px 18px;
      margin-right: 5px;
      color: @color-primary;
      cursor: pointer;
      border-radius: 4px;
      &--active {
        background: #e8f7ff;
      }
      &:hover {
        background: #e8f7ff;
      }
    }

    &__iconbox {
      position: absolute;
      top: 16px;
      right: 20px;
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
  }
</style>
