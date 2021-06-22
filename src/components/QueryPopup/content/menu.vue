<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}__btn`">
      <span @click="onSubmitScheme">保存</span>
      <span @click="onSaveScheme">另存</span>
      <span @click="onResetScheme">重置</span>
      <span @click="onEditScheme">修改</span>
      <span @click="onDelScheme">删除</span>
    </div>
    <DxScrollView>
      <div>
        <div
          v-for="(item, index) in list"
          :key="index"
          :class="[
            `${prefixCls}__list__item`,
            activeIndex === index && `${prefixCls}__list__item--active`,
          ]"
          @click="onSelectedScheme(index)"
        >
          <input
            v-if="activeIndex === index && edit"
            ref="textBox"
            :value="item"
            placeholder="请输入方案名称"
            @change="onTextChange"
          />
          <span v-else>{{ item }}</span>
        </div>
      </div>
    </DxScrollView>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick } from 'vue';
import { useDesign } from '/@/hooks/web/useDesign';
import { DxScrollView } from 'devextreme-vue/scroll-view';

export default defineComponent({
  components: {
    DxScrollView,
  },
  props: {
    checkedSchemeIndex: {
      type: Number,
      required: true,
    },
    menuList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  emits: ['on-change-scheme'],
  setup(props, ctx) {
    const { prefixCls } = useDesign('content-menu');
    const activeIndex = ref(props.checkedSchemeIndex);
    const edit = ref(false);
    const textBox = ref();
    const list = ref(props.menuList);

    const onTextFocusInput = () => {
      nextTick(() => {
        if (textBox.value) {
          textBox.value.focus();
        }
      });
    };
    const onSelectedScheme = (index) => {
      activeIndex.value = index;
      onTextFocusInput();
      ctx.emit('on-change-scheme', index);
    };
    const onSubmitScheme = () => {
      console.log('执行保存');
    };
    const onSaveScheme = () => {
      console.log('执行另存');
    };
    const onResetScheme = () => {
      console.log('执行重置');
    };
    const onDelScheme = () => {
      const oldList = [...list.value];
      oldList.splice(activeIndex.value, 1);
      list.value = oldList;
    };
    const onEditScheme = () => {
      edit.value = true;
      onTextFocusInput();
    };
    const onTextChange = (e) => {
      if (e.target.value) {
        list.value[activeIndex.value] = e.target.value;
      }
      edit.value = false;
    };

    return {
      prefixCls,
      list,
      activeIndex,
      edit,
      textBox,
      onSubmitScheme,
      onSaveScheme,
      onResetScheme,
      onEditScheme,
      onDelScheme,
      onSelectedScheme,
      onTextChange,
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
  border-right: 1px solid #e4e7ed;

  &__btn {
    display: flex;
    width: 100%;
    background-color: #fafafa;
    border-bottom: 1px solid @border-color-primary;
    span {
      flex: 1;
      height: 44px;
      line-height: 44px;
      text-align: center;
      cursor: pointer;
      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }

  &__list__item {
    display: flex;
    align-items: center;
    height: 40px;
    cursor: pointer;
    &--active,
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
    input {
      width: 80%;
      padding: 3px 8px;
      border: 1px solid @border-color-primary;
      border-radius: 4px;
      outline: none;
      &:focus {
        border-color: #337ab7;
      }
    }
  }
}
</style>
