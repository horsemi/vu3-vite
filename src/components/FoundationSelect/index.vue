<template>
  <div :class="`${prefixCls}`">
    <DxDropDownBox
      v-model:value="dropDownValueComputed"
      v-model:opened="isGridBoxOpened"
      :accept-custom-value="true"
      placeholder="请输入"
      :open-on-field-click="false"
      :defer-rendering="false"
      :show-clear-button="true"
      width="180"
      :drop-down-options="dropDownOptions"
      :on-initialized="onDropDownBoxInitialized"
      @focus-in="onFocusIn"
      @input="onInput"
      @closed="onDropDownBoxClosed"
    >
      <template #content>
        <DxDataGrid
          v-model:selected-row-keys="gridValueComputed"
          :data-source="options"
          :hover-state-enabled="true"
          height="100%"
          :on-initialized="onInitialized"
          @row-click="onDataGridRowClick"
        >
          <DxColumn caption="编码" data-field="code"> </DxColumn>
          <DxColumn caption="名称" data-field="name"> </DxColumn>
          <DxSelection mode="single" />
          <DxScrolling mode="virtual" row-rendering-mode="virtual" />
        </DxDataGrid>
      </template>
    </DxDropDownBox>
  </div>
</template>

<script lang="ts">
  import type { FoundationMap, FoundationDataType } from '/@/api/app/foundation';

  import { defineComponent, computed, PropType, ref, unref } from 'vue';
  import { useDebounceFn } from '@vueuse/core';
  import DxDropDownBox from 'devextreme-vue/drop-down-box';
  import { DxDataGrid, DxColumn, DxSelection, DxScrolling } from 'devextreme-vue/data-grid';

  import { FoundationApi } from '/@/api/app';

  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    name: 'FoundationSelect',
    components: { DxDropDownBox, DxDataGrid, DxColumn, DxSelection, DxScrolling },
    props: {
      value: {
        type: [String, Number, Boolean],
        default: '',
      },
      width: {
        type: String,
        default: '200',
      },
      foundationCode: {
        type: String,
        default: '',
      },
      filter: {
        type: Array as PropType<Record<string, unknown>[]>,
        default: () => [],
      },
    },
    emits: ['update:value'],
    setup(props, ctx) {
      const { prefixCls } = useDesign('foundation-select');

      const dropDownBox = ref();
      const dropDownOptions = {
        width: 250,
        maxHeight: 400,
      };

      const dataGrid = ref();

      // 下拉框组件文本框绑定的文本
      const dropDownValue = ref('');

      const dropDownValueComputed = computed({
        get: () => {
          return unref(dropDownValue);
        },
        set: (val) => {
          dropDownValue.value = val;

          if (val === null) {
            dataGrid.value.clearSelection();
            options.value = [];
          }
        },
      });

      // 下拉框列表组件选择列
      const gridValue = ref();

      const gridValueComputed = computed({
        get: () => {
          return [unref(gridValue)];
        },
        set: (val) => {
          gridValue.value = val[0];

          // 列表选中一列后更改下拉框文本框内容，并同步 value 值
          if (gridValue.value && gridValue.value.name && gridValue.value.code) {
            dropDownValueComputed.value = gridValue.value.name;
            ctx.emit('update:value', gridValue.value.code);
          } else {
            ctx.emit('update:value', '');
          }
        },
      });
      const isGridBoxOpened = ref(false);
      const gridColumns = ['code', 'name'];

      const options = ref<FoundationDataType[]>([]);
      const debounceFn = useDebounceFn(searchData, 800);

      function onInitialized(e) {
        dataGrid.value = e.component;
      }

      function onDropDownBoxInitialized(e) {
        dropDownBox.value = e.component;
      }

      function getFoundationByCode(value: string, foundationCode: string) {
        if (value.trim()) {
          let filter = {};
          if (props.filter && props.filter.length > 0) {
            for (let item of props.filter) {
              filter = Object.assign(filter, item);
            }
          }

          FoundationApi.getFoundationByCode(foundationCode as FoundationMap, {
            ...filter,
            names: [value],
            isPrecised: false,
          }).then((resolve) => {
            options.value = resolve;
            dataGrid.value.clearSelection();
          });
        }
      }

      function onFocusIn() {
        isGridBoxOpened.value = true;
      }

      function onDataGridRowClick() {
        isGridBoxOpened.value = false;
      }

      function onInput(e) {
        const value = e.event.target.value;
        debounceFn(value);
      }

      // 下拉框关闭事件
      function onDropDownBoxClosed() {
        // 列表没有任何一列选中时，清空下拉框文本框内容
        if (!gridValue.value) {
          dropDownValueComputed.value = '';
        }
      }

      function searchData(value: string) {
        if (typeof value === 'string') {
          getFoundationByCode(value, props.foundationCode);
        } else if (!value) {
          options.value = [];
        }
      }

      return {
        prefixCls,
        options,
        gridColumns,
        dropDownBox,
        isGridBoxOpened,
        dropDownValue,
        dropDownValueComputed,
        dropDownOptions,
        gridValue,
        gridValueComputed,
        onInitialized,
        onDropDownBoxInitialized,
        onDropDownBoxClosed,
        onDataGridRowClick,
        onFocusIn,
        onInput,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-foundation-select';

  .@{prefix-cls} {
    display: inline-block;
    width: 100%;
  }
</style>
