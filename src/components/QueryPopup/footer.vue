<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}__default`">
      <DxCheckBox v-model:value="checkDefault" @valueChanged="onChangeCheckDefault" />
      <span @click="checkDefault = !checkDefault">下次以此方案自动进入</span>
    </div>
    <div :class="`${prefixCls}__btn`">
      <DxButton :width="76" text="确认" type="default" @click="onSubmit" />
      <DxButton :width="76" text="取消" @click="onClosePopup" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useDesign } from '/@/hooks/web/useDesign';
import { DxCheckBox } from 'devextreme-vue/check-box';
import DxButton from 'devextreme-vue/button';

export default defineComponent({
  components: {
    DxCheckBox,
    DxButton,
  },
emits: ['on-close-popup', 'on-submit'],
  setup(props, ctx) {
    const { prefixCls } = useDesign('popup-footer');
    const checkDefault = ref(false);

    const onChangeCheckDefault = () => {
      console.log(checkDefault.value);
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
      onChangeCheckDefault,
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
    cursor: pointer;
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
