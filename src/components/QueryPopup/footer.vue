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

  import { defineComponent, ref, inject, computed } from 'vue';

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
      const schemeData = inject('schemeData') as Ref<ISchemeData>;
      const schemeDataTemp = inject('schemeDataTemp') as Ref<ISchemeData>;
      const queryForm = inject('queryForm') as Ref<any>;
      const onChangeScheme = inject('onChangeScheme') as (data: ISchemeItem) => void;

      const currentSchemeItem = computed(() => {
        const _currentSchemeItem = {
          creatorId:
            (schemeData.value.scheme[schemeData.value.checkedIndex] &&
              schemeData.value.scheme[schemeData.value.checkedIndex].creatorId) ||
            '',
          isShare:
            (schemeData.value.scheme[schemeData.value.checkedIndex] &&
              schemeData.value.scheme[schemeData.value.checkedIndex].isShare) ||
            false,
        };
        return _currentSchemeItem;
      });

      const { prefixCls } = useDesign('popup-footer');
      const userStore = useUserStore();
      const checkDefault = ref(false);

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
          return currentSchemeItem.value.isShare;
        },
        set: (value: boolean) => {
          updateSchemeIsShareState && updateSchemeIsShareState(value);
        },
      });
      const isDisabledComputer = computed(() => {
        return currentSchemeItem.value.creatorId === userStore.getUserInfo.accountId;
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
        saveDefaultScheme(schemeData.value.scheme[schemeData.value.checkedIndex], value);
      }

      function updateSchemeIsShareState(value: boolean) {
        schemeData.value.scheme[schemeData.value.checkedIndex].isShare = value;
        schemeDataTemp.value.scheme[schemeData.value.checkedIndex].isShare = value;
        saveSchemesData(schemeDataTemp.value.scheme[schemeData.value.checkedIndex]).then(
          (resolve) => {
            if (resolve) {
              schemeDataTemp.value.scheme[schemeData.value.checkedIndex] = resolve;
            }
          }
        );
      }

      function onSubmit() {
        const scheme = cloneDeep(schemeData.value.scheme[schemeData.value.checkedIndex]);
        queryForm.value.queryList.forEach((item) => {
          if (item.requirement) {
            scheme.requirement.push(item);
          }
        });
        onChangeScheme(scheme);
        onClosePopup();
      }
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
