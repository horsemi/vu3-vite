<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}__left`">
      <Menu
        ref="menu"
        :checked-scheme-index="checkedSchemeIndex"
        :menu-list="menuList"
        @on-change-scheme="onChangeScheme"
        @on-submit-scheme="onSubmitScheme"
        @on-save-scheme="onSaveScheme"
        @on-reset-scheme="onResetScheme"
        @on-del-scheme="onDelScheme"
        @on-title-change="onTitleChange"
      />
    </div>
    <div :class="`${prefixCls}__right`">
      <DxTabPanel
        v-model:selected-index="selectedIndex"
        height="calc(100% - 48px)"
        :data-source="multiViewItems"
        :loop="true"
        :animation-enabled="true"
        :swipe-enabled="true"
        :focus-state-enabled="false"
      >
        <template #item="{ data }">
          <div :class="`${prefixCls}__right__item`">
            <component
              :is="data.component"
              :ref="data.component"
              :requirement="checkedScheme.requirement"
              :order-by="checkedScheme.orderBy"
              :columns="checkedScheme.columns"
              :all-columns="allColumns"
              @on-change-requirement="onChangeRequirement"
              @on-change-sort="onChangeSort"
              @on-change-column="onChangeColumn"
            />
          </div>
        </template>
      </DxTabPanel>
    </div>
    <DxToast
      v-model:visible="showToast"
      v-model:message="message"
      width="200"
      :position="{ at: 'top center', my: 'top center', offset: '0 100' }"
      type="success"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType, ref, watch } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import DxTabPanel from 'devextreme-vue/tab-panel';
  import Menu from './menu.vue';
  import Requirement from './requirement.vue';
  import Sort from './sort.vue';
  import Column from './column.vue';
  import { IColumnItem } from '/@/model/types';
  import { ISchemeItem } from './types';
  import { cloneDeep } from 'lodash-es';
  import { Persistent } from '/@/utils/cache/persistent';
  import { SCHEME_LIST_KEY } from '/@/enums/cacheEnum';
  import { DxToast } from 'devextreme-vue/toast';

  export default defineComponent({
    components: {
      DxTabPanel,
      DxToast,
      Menu,
      Requirement,
      Sort,
      Column,
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
    },
    emits: ['on-change-schemedata'],
    setup(props, ctx) {
      const multiViewItems = [
        {
          title: '条件',
          component: 'requirement',
        },
        {
          title: '排序',
          component: 'sort',
        },
        {
          title: '显示隐藏列',
          component: 'column',
        },
      ];
      const { prefixCls } = useDesign('popup-content');
      const message = ref('');
      const showToast = ref(false);
      const selectedIndex = ref(0);
      const checkedSchemeIndex = ref(0);
      const checkedScheme = ref<ISchemeItem>({
        uuid: 0,
        title: '缺省方案',
        requirement: [
          {
            requirement: '',
            operator: '=',
            operatorList: [],
            value: '',
            type: '',
            datatypekeies: '',
            logic: '',
          },
        ],
        orderBy: [],
        columns: [],
      });
      const schemeList = ref<ISchemeItem[]>([]);
      const schemeData = ref<ISchemeItem[]>([]);
      const menuList = ref<string[]>([]);
      const menu = ref();

      const handleData = (val) => {
        schemeList.value = cloneDeep(val);
        schemeData.value = cloneDeep(schemeList.value);
        if (schemeList.value.length > 0) {
          checkedScheme.value = schemeList.value[checkedSchemeIndex.value];
          handleMenuList();
        }
      };
      const handleMenuList = () => {
        const list: string[] = [];
        schemeList.value.forEach((item) => {
          list.push(item.title);
        });
        menuList.value = list;
      };
      const saveData = () => {
        Persistent.setLocal(SCHEME_LIST_KEY, schemeData.value);
        ctx.emit('on-change-schemedata', schemeData.value);
      };
      const onChangeScheme = (index) => {
        checkedSchemeIndex.value = index;
        checkedScheme.value = schemeList.value[checkedSchemeIndex.value];
      };
      const onChangeRequirement = (requirement) => {
        schemeList.value[checkedSchemeIndex.value].requirement = requirement;
      };
      const onChangeSort = (orderBy) => {
        console.log(orderBy);
        schemeList.value[checkedSchemeIndex.value].orderBy = orderBy;
      };
      const onChangeColumn = (columns) => {
        schemeList.value[checkedSchemeIndex.value].columns = columns;
      };
      const onTitleChange = (title) => {
        const index = checkedSchemeIndex.value;
        schemeList.value[index].title = title;
        schemeData.value[index] = cloneDeep(schemeList.value[index]);
        handleMenuList();
        saveData();
        message.value = '保存成功';
        showToast.value = true;
      };
      const onSubmitScheme = () => {
        // 缺省方案保存相当于另存
        const index = checkedSchemeIndex.value;
        schemeData.value[index] = cloneDeep(schemeList.value[index]);
        saveData();
        message.value = '保存成功';
        showToast.value = true;
      };
      const onSaveScheme = () => {
        const index = checkedSchemeIndex.value;
        if (!schemeList.value[index].title) return;
        schemeList.value.push({ ...cloneDeep(schemeList.value[index]), title: '' });
        checkedSchemeIndex.value = schemeList.value.length - 1;
        handleMenuList();
        menu.value.onTextFocusInput();
      };
      const onDelScheme = () => {
        if (checkedSchemeIndex.value === 0) return;
        schemeList.value.splice(checkedSchemeIndex.value, 1);
        if (checkedSchemeIndex.value < schemeData.value.length) {
          schemeData.value.splice(checkedSchemeIndex.value, 1);
          saveData();
          message.value = '删除成功';
          showToast.value = true;
        }
        checkedSchemeIndex.value = checkedSchemeIndex.value - 1;
        handleMenuList();
      };
      const onResetScheme = () => {
        const index = checkedSchemeIndex.value;
        if (index > schemeData.value.length - 1) return;
        schemeList.value[index] = cloneDeep(schemeData.value[index]);
        message.value = '重置成功';
        showToast.value = true;
      };

      watch(
        () => props.filterList,
        (val) => {
          handleData(val);
        },
        {
          immediate: true,
        }
      );

      return {
        prefixCls,
        schemeList,
        menuList,
        multiViewItems,
        selectedIndex,
        checkedSchemeIndex,
        checkedScheme,
        menu,
        message,
        showToast,
        onChangeScheme,
        onChangeRequirement,
        onChangeSort,
        onChangeColumn,
        onSubmitScheme,
        onSaveScheme,
        onResetScheme,
        onDelScheme,
        onTitleChange,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-popup-content';

  .@{prefix-cls} {
    display: flex;
    height: 100%;
    margin: 20px 0;
    overflow: hidden;
    border-top: 1px solid @border-color-primary;
    border-bottom: 1px solid @border-color-primary;

    &__left {
      width: 20%;
      height: 100%;
    }

    &__right {
      flex: 1;
      padding-left: 20px;
    }

    &__right__item {
      padding: 10px 0;
    }
  }
</style>
