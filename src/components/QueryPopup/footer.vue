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
  import { defineComponent, ref, inject, computed, Ref } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { useUserStore } from '/@/store/modules/user';
  import { DxCheckBox } from 'devextreme-vue/check-box';
  import DxButton from 'devextreme-vue/button';

  export default defineComponent({
    components: {
      DxCheckBox,
      DxButton,
    },
    emits: ['on-close-popup', 'on-submit', 'on-submit-checked-default'],
    setup(props, ctx) {
      const { prefixCls } = useDesign('popup-footer');
      const userStore = useUserStore();
      const checkDefault = ref(false);

      const schemeDefaultIndex = inject<Ref<number>>('schemeDefaultIndex');
      const checkedIndex = inject<Ref<number>>('checkedIndex');
      const currentSchemeItem = inject<{ creatorId: string; isShare: boolean }>(
        'currentSchemeItem'
      );
      const updateSchemeIsShareState = inject<(isShareState: boolean) => void>(
        'updateSchemeIsShareState'
      );
      const schemeDefaultIndexComputed = computed({
        get: () => {
          return schemeDefaultIndex!.value === checkedIndex!.value;
        },
        set: (value: boolean) => {
          onSubmitCheckedDefault(value);
        },
      });

      const schemeShareComputed = computed({
        get: () => {
          return currentSchemeItem!.isShare;
        },
        set: (value: boolean) => {
          updateSchemeIsShareState && updateSchemeIsShareState(value);
        },
      });
      const isDisabledComputer = computed(() => {
        return currentSchemeItem?.creatorId === userStore.getUserInfo.accountId;
      });

      const isDisabledDefaultIndex = computed(() => {
        return checkedIndex?.value === 0 && schemeDefaultIndexComputed.value;
      });

      const onSubmitCheckedDefault = (value: boolean) => {
        ctx.emit('on-submit-checked-default', value);
      };
      const onSubmit = () => {
        ctx.emit('on-submit');
      };
      const onClosePopup = () => {
        ctx.emit('on-close-popup');
      };

      return {
        prefixCls,
        checkDefault,
        schemeDefaultIndex,
        schemeDefaultIndexComputed,
        schemeShareComputed,
        isDisabledComputer,
        isDisabledDefaultIndex,
        onSubmitCheckedDefault,
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
