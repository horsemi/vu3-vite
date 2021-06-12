<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}__box`" style="padding-bottom: 0">
      <DxSelectBox
        v-model:value="labelLocation"
        disabled
        width="200"
        placeholder="查询字段"
        :items="['left', 'top']"
      />
      <DxSelectBox
        v-model:value="showColon"
        disabled
        width="95"
        :items="['等于', '大于', '小于']"
      />
      <input />
      <SvgIcon
        :class="`${prefixCls}__icon`"
        size="16"
        name="multi-arrow"
        @click="opened = !opened"
      ></SvgIcon>
    </div>
    <transition name="zoom-in-top">
      <div v-show="opened" :class="`${prefixCls}__overflow`">
        <div :class="`${prefixCls}__box`">
          <DxSelectBox
            v-model:value="labelLocation"
            disabled
            width="200"
            placeholder="单据日期"
            :items="['left', 'top']"
          />
          <DxSelectBox
            v-model:value="showColon"
            disabled
            width="95"
            :items="['等于', '大于', '小于']"
          />
          <input />
          <SvgIcon :class="`${prefixCls}__icon`" size="16" name="subtract"></SvgIcon>
        </div>
        <div :class="`${prefixCls}__box`">
          <DxSelectBox
            v-model:value="labelLocation"
            disabled
            width="200"
            placeholder="单据类型"
            :items="['left', 'top']"
          />
          <DxSelectBox
            v-model:value="showColon"
            disabled
            width="95"
            :items="['等于', '大于', '小于']"
          />
          <input />
          <SvgIcon :class="`${prefixCls}__icon`" size="16" name="subtract"></SvgIcon>
        </div>
        <div :class="`${prefixCls}__box`">
          <DxSelectBox
            v-model:value="labelLocation"
            disabled
            width="200"
            placeholder="单据状态"
            :items="['left', 'top']"
          />
          <DxSelectBox
            v-model:value="showColon"
            disabled
            width="95"
            :items="['等于', '大于', '小于']"
          />
          <input />
          <SvgIcon :class="`${prefixCls}__icon`" size="16" name="subtract"></SvgIcon>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useDesign } from '/@/hooks/web/useDesign';
import DxSelectBox from 'devextreme-vue/select-box';

export default defineComponent({
  components: {
    DxSelectBox,
  },
  setup() {
    const { prefixCls } = useDesign('query-form');
    const labelLocation = ref('');
    const showColon = ref('等于');
    const opened = ref(false);

    return {
      prefixCls,
      labelLocation,
      showColon,
      opened,
    };
  },
});
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-query-form';

.@{prefix-cls} {
  position: relative;
  .zoom-animation(top, scaleY(0), scaleY(1), center top);

  &__box {
    display: flex;
    align-items: center;
    padding-bottom: 16px;
    padding-left: 20px;

    & > * {
      margin-right: 10px;
    }

    input {
      width: 200px;
      height: 34px;
      padding: 0 10px;
      cursor: pointer;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
      outline: none;
      box-sizing: border-box;
    }
  }

  &__icon {
    margin-right: 20px;
    margin-left: 10px;
    cursor: pointer;
  }

  &__overflow {
    position: absolute;
    top: 50px;
    z-index: 100;
    background-color: #fff;
    // box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  }
}
</style>
