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
          v-for="(item, index) in menuList"
          :key="index"
          :class="[
            `${prefixCls}__list__item`,
            checkedSchemeIndex === index && `${prefixCls}__list__item--active`,
          ]"
          @click="onSelectedScheme(index)"
        >
          <input
            v-if="checkedSchemeIndex === index && (edit || item === '')"
            ref="textBox"
            :value="item"
            placeholder="请输入方案名称"
            @blur="onTextBlur"
            @change="onTextChange"
          />
          <span v-else>{{ item }}</span>
        </div>
      </div>
    </DxScrollView>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, nextTick, PropType } from 'vue';
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
        type: Array as PropType<string[]>,
        default: () => {
          return [];
        },
      },
    },
    emits: [
      'on-change-scheme',
      'on-submit-scheme',
      'on-save-scheme',
      'on-reset-scheme',
      'on-title-change',
      'on-del-scheme',
    ],
    setup(props, ctx) {
      const { prefixCls } = useDesign('content-menu');
      const edit = ref(false);
      const textBox = ref();

      const onTextFocusInput = () => {
        nextTick(() => {
          if (textBox.value) {
            textBox.value.focus();
          }
        });
      };
      const onSelectedScheme = (index) => {
        if (!props.menuList[props.checkedSchemeIndex]) return;
        ctx.emit('on-change-scheme', index);
      };
      const onSubmitScheme = () => {
        ctx.emit('on-submit-scheme');
      };
      const onSaveScheme = () => {
        ctx.emit('on-save-scheme');
      };
      const onResetScheme = () => {
        ctx.emit('on-reset-scheme');
      };
      const onDelScheme = () => {
        ctx.emit('on-del-scheme');
      };
      const onEditScheme = () => {
        edit.value = true;
        onTextFocusInput();
      };
      const handleText = (text) => {
        if (text) {
          ctx.emit('on-title-change', text);
        }
        edit.value = false;
      };
      const onTextBlur = (e) => {
        handleText(e.target.value);
      };
      const onTextChange = (e) => {
        handleText(e.target.value);
      };

      return {
        prefixCls,
        edit,
        textBox,
        onSubmitScheme,
        onSaveScheme,
        onResetScheme,
        onEditScheme,
        onTextBlur,
        onDelScheme,
        onSelectedScheme,
        onTextChange,
        onTextFocusInput,
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
