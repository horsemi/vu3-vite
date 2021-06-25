<template>
  <DxPopup v-model:visible="popupVisible" :close-on-outside-click="true" :show-title="false">
    <div :class="prefixCls">
      <Header @on-close-popup="closePopup" />
      <Content
        :checked-index="checkedIndex"
        :all-columns="allColumns"
        :scheme-list="schemeList"
        @on-change-checked-index="onChangeCheckedIndex"
        @on-change-requirement="onChangeRequirement"
        @on-change-sort="onChangeSort"
        @on-change-column="onChangeColumn"
        @on-title-change="onTitleChange"
        @on-submit-scheme="onSubmitScheme"
        @on-save-scheme="onSaveScheme"
        @on-del-scheme="onDelScheme"
        @on-reset-scheme="onResetScheme"
      />
      <Footer @on-submit="onSubmit" @on-close-popup="closePopup" />
    </div>
  </DxPopup>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { useDesign } from '/@/hooks/web/useDesign';
import { DxPopup } from 'devextreme-vue/popup';
import Header from './header.vue';
import Content from './content/index.vue';
import Footer from './footer.vue';
import { IColumnItem } from '/@/model/types';
import { IOrderByItem, IRequirementItem, ISchemeColumnsItem, ISchemeItem } from './content/types';

export default defineComponent({
  components: {
    DxPopup,
    Header,
    Content,
    Footer,
  },
  props: {
    allColumns: {
      type: Array as PropType<IColumnItem[]>,
      default: () => {
        return [];
      },
    },
    schemeList: {
      type: Array as PropType<ISchemeItem[]>,
      default: () => {
        return [];
      },
    },
    checkedIndex: {
      type: Number,
      default: 0,
    },
  },
  emits: [
    'on-change-checked-index',
    'on-change-requirement',
    'on-change-sort',
    'on-change-column',
    'on-title-change',
    'on-submit-scheme',
    'on-save-scheme',
    'on-del-scheme',
    'on-reset-scheme', 'on-submit',
  ],
  setup(props, ctx) {
    const { prefixCls } = useDesign('query-popup');
    // 弹窗是否打开
    const popupVisible = ref(false);

    // 打开弹窗
    const openPopup = () => {
      popupVisible.value = true;
    };
    // 关闭弹窗
    const closePopup = () => {
      popupVisible.value = false;
    };
    // 外派选中下标更新
    const onChangeCheckedIndex = (index: number) => {
      ctx.emit('on-change-checked-index', index);
    };
    // 外派条件数据更新
    const onChangeRequirement = (data: IRequirementItem[]) => {
      ctx.emit('on-change-requirement', data);
    };
    // 外派排序数据更新
    const onChangeSort = (data: IOrderByItem[]) => {
      ctx.emit('on-change-sort', data);
    };
    // 外派显示隐藏列更新
    const onChangeColumn = (data: ISchemeColumnsItem[]) => {
      ctx.emit('on-change-column', data);
    };
    // 外派标题更新
    const onTitleChange = (title: string) => {
      ctx.emit('on-title-change', title);
    };
    // 外派保存事件
    const onSubmitScheme = () => {
      ctx.emit('on-submit-scheme');
    };
    // 外派另存事件
    const onSaveScheme = () => {
      ctx.emit('on-save-scheme');
    };
    // 外派删除事件
    const onDelScheme = () => {
      ctx.emit('on-del-scheme');
    };
    // 外派重置事件
    const onResetScheme = () => {
      ctx.emit('on-reset-scheme');
    };
    // 外派确认事件
    const onSubmit = () => {
      ctx.emit('on-submit');
      closePopup();
    };

    return {
      prefixCls,
      popupVisible,
      onSubmit,
      openPopup,
      closePopup,
      onChangeCheckedIndex,
      onChangeRequirement,
      onChangeSort,
      onChangeColumn,
      onTitleChange,
      onSubmitScheme,
      onSaveScheme,
      onDelScheme,
      onResetScheme,
    };
  },
});
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-query-popup';

.@{prefix-cls} {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
</style>
