<template>
  <DxPopup
    v-model:visible="popupVisible"
    :close-on-outside-click="true"
    :show-title="false"
    @hidden="onHidden"
  >
    <div :class="prefixCls">
      <Header @on-close-popup="closePopup" />
      <Content
        ref="content"
        :checked-index="checkedIndex"
        :all-columns="allColumns"
        :filter-list="filterList"
        @on-change-schemedata="onChangeSchemedata"
        @on-change-checked-index="onChangeCheckedIndex"
      />
      <Footer ref="footer" @on-submit="onSubmit" @on-close-popup="closePopup" />
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
import { ISchemeItem } from './content/types';
import { Persistent } from '/@/utils/cache/persistent';
import { SCHEME_CHECKED_INDE_KEY } from '/@/enums/cacheEnum';

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
    filterList: {
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
  emits: ['on-filter-scheme', 'on-change-schemedata', 'on-change-checked-index'],
  setup(props, ctx) {
    const { prefixCls } = useDesign('query-popup');
    const popupVisible = ref(false);
    const content = ref();
    const footer = ref();

    const openPopup = () => {
      popupVisible.value = true;
    };
    const closePopup = () => {
      popupVisible.value = false;
    };
    const onChangeSchemedata = (data) => {
      ctx.emit('on-change-schemedata', data);
    };
    const onChangeCheckedIndex = (index) => {
      ctx.emit('on-change-checked-index', index);
    };
    const handleTitleEmpty = (data) => {
      if (!data.title) {
        const schemeList = content.value.schemeList;
        const index = props.checkedIndex;
        schemeList.splice(index, 1);
        ctx.emit('on-change-checked-index', index - 1);
        content.value.handleMenuList();
        const newData = schemeList[index - 1];
        return newData;
      } else {
        return data;
      }
    };
    const handleSchemeCheckedIndex = () => {
      if (footer.value.checkDefault) {
        Persistent.setLocal(SCHEME_CHECKED_INDE_KEY, props.checkedIndex);
      }
    };
    const handleScheme = () => {
      const scheme = handleTitleEmpty(content.value.schemeList[props.checkedIndex]);
      const orderBy = scheme.orderBy;
      const columns = scheme.columns;
      if (orderBy && orderBy.length > 0) {
        orderBy.forEach((sort) => {
          columns.forEach((col) => {
            if (sort.key === col.key) {
              col.show = true;
            }
          });
        });
      }
      ctx.emit('on-filter-scheme', scheme);
    };
    const onSubmit = () => {
      handleScheme();
      closePopup();
    };
    const onHidden = () => {
      handleTitleEmpty(content.value.schemeList[props.checkedIndex]);
      handleSchemeCheckedIndex();
    };

    return {
      prefixCls,
      popupVisible,
      content,
      footer,
      openPopup,
      closePopup,
      onSubmit,
      onChangeSchemedata,
      onHidden,
      onChangeCheckedIndex,
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
