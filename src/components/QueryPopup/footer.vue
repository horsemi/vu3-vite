<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}__default`">
      <DxCheckBox v-model:value="schemeDefaultIndexComputed" :disabled="isDisabledDefaultIndex" />
      <span>下次以此方案自动进入</span>
      <DxCheckBox
        v-model:value="schemeShareComputed"
        :disabled="!isDisabledComputer"
        style="margin-left: 10px"
      />
      <span>共享方案</span>
    </div>
    <div :class="`${prefixCls}__btn`">
      <DxButton :width="76" text="确认" type="default" @click="onSubmit" />
      <DxButton :width="76" text="取消" @click="onClosePopup" />
    </div>
  </div>
</template>

<script lang="ts">
  import type { Ref } from 'vue';
  import type { ISchemeData } from '../QueryPlan/types';
  import type { ISchemeItem } from './content/types';

  import { defineComponent, inject, computed } from 'vue';

  import { saveSchemesData, saveDefaultScheme } from '/@/utils/scheme/index';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useUserStore } from '/@/store/modules/user';

  import { cloneDeep } from 'lodash-es';

  import { DxCheckBox } from 'devextreme-vue/check-box';
  import DxButton from 'devextreme-vue/button';

  export default defineComponent({
    components: {
      DxCheckBox,
      DxButton,
    },
    emits: ['on-close-popup', 'on-submit', 'on-submit-checked-default'],
    setup(props, ctx) {
      const schemeDefaultIndex = inject('schemeDefaultIndex') as Ref<number>;
      const schemeQuickIndex = inject('schemeQuickIndex') as Ref<number>;
      const schemeData = inject('schemeData') as Ref<ISchemeData>;
      const schemeDataTemp = inject('schemeDataTemp') as Ref<ISchemeData>;
      const onChangeScheme = inject('onChangeScheme') as (data: ISchemeItem) => void;
      const initEntityColumnHandle = inject<(scheme?: ISchemeItem) => Promise<ISchemeItem>>(
        'initEntityColumnHandle'
      );

      const { prefixCls } = useDesign('popup-footer');
      const userStore = useUserStore();

      const schemeDefaultIndexComputed = computed({
        get: () => {
          return schemeDefaultIndex!.value === schemeData.value.checkedIndex;
        },
        set: (value: boolean) => {
          onSubmitCheckedDefault(value);
        },
      });

      const schemeShareComputed = computed({
        get: () => {
          return (
            (schemeData.value.scheme[schemeData.value.checkedIndex] &&
              schemeData.value.scheme[schemeData.value.checkedIndex].isShare) ||
            false
          );
        },
        set: (value: boolean) => {
          updateSchemeIsShareState(value);
        },
      });
      const isDisabledComputer = computed(() => {
        return (
          schemeData.value.scheme[schemeData.value.checkedIndex] &&
          schemeData.value.scheme[schemeData.value.checkedIndex].creatorId ===
            userStore.getUserInfo.accountId
        );
      });

      const isDisabledDefaultIndex = computed(() => {
        return schemeData.value.checkedIndex === 0 && schemeDefaultIndexComputed.value;
      });

      function onSubmitCheckedDefault(value: boolean) {
        if (value) {
          schemeDefaultIndex.value = schemeData.value.checkedIndex;
        } else {
          schemeDefaultIndex.value = 0;
        }
        if (schemeDataTemp.value.scheme[schemeData.value.checkedIndex]) {
          saveDefaultScheme(schemeData.value.scheme[schemeData.value.checkedIndex], value);
        }
      }

      function updateSchemeIsShareState(value: boolean) {
        schemeData.value.scheme[schemeData.value.checkedIndex].isShare = value;
        saveSchemesData(schemeData.value.scheme[schemeData.value.checkedIndex]).then((data) => {
          if (data) {
            schemeData.value.scheme[schemeData.value.checkedIndex] = cloneDeep(data);
          }
          schemeDataTemp.value.scheme[schemeData.value.checkedIndex] = cloneDeep(
            schemeData.value.scheme[schemeData.value.checkedIndex]
          );
        });
      }

      function onSubmit() {
        schemeQuickIndex.value = schemeData.value.checkedIndex;
        initEntityColumnHandle!(schemeData.value.scheme[schemeData.value.checkedIndex]).then(() => {
          onChangeScheme(schemeData.value.scheme[schemeData.value.checkedIndex]);
        });
        onClosePopup();
      }

      function onClosePopup() {
        ctx.emit('on-close-popup');
      }

      return {
        prefixCls,
        schemeDefaultIndex,
        schemeDefaultIndexComputed,
        schemeShareComputed,
        isDisabledComputer,
        isDisabledDefaultIndex,
        onSubmit,
        onClosePopup,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-popup-footer';

  .@{prefix-cls} {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    &__default {
      display: flex;
      span {
        margin-left: 10px;
      }
    }

    &__btn {
      & > * {
        margin-right: 10px;
      }
    }
  }
</style>
