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
          <DxColumn caption="名称" data-field="name"> </DxColumn>
          <DxColumn caption="编码" data-field="code"> </DxColumn>
          <DxSelection mode="single" />
          <DxScrolling mode="virtual" row-rendering-mode="virtual" />
        </DxDataGrid>
      </template>
    </DxDropDownBox>
  </div>
</template>

<script lang="ts">
  import type { FoundationMap, FoundationDataType, IFoundationConfig } from '/@/api/app/foundation';

  import { defineComponent, computed, PropType, ref, unref, watch, onBeforeUnmount } from 'vue';
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
        width: 270,
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

            if (unref(gridValue).code !== props.value) {
              ctx.emit('update:value', gridValue.value.code);
            }
          }
        },
      });
      const isGridBoxOpened = ref(false);

      const options = ref<FoundationDataType[]>([]);
      const debounceFn = useDebounceFn(searchFn, 800);

      watch(
        () => props.value,
        (value) => {
          if (value) {
            getFoundationByCode(
              {
                codes: [value as string],
              },
              props.foundationCode,
              true
            );
          } else {
            dropDownValueComputed.value = '';
          }
        },
        {
          immediate: true,
        }
      );

      watch(
        () => props.foundationCode,
        (value) => {
          if (value) {
            getFoundationByCode(
              {
                top: 10,
                isall: props.filter && props.filter.length > 0 ? false : true,
              },
              value
            );
          } else {
            options.value = [];
          }
        },
        {
          immediate: true,
        }
      );

      function onInitialized(e) {
        dataGrid.value = e.component;
      }

      function onDropDownBoxInitialized(e) {
        dropDownBox.value = e.component;
      }

      function getFoundationByCode(
        searchData: IFoundationConfig,
        foundationCode: string,
        isSelectFirstRow = false
      ) {
        let filter = {};
        if (props.filter && props.filter.length > 0) {
          for (let item of props.filter) {
            filter = Object.assign(filter, item);
          }
        }

        dataGrid.value && dataGrid.value.beginCustomLoading();
        FoundationApi.getFoundationByCode(foundationCode as FoundationMap, {
          ...searchData,
          ...filter,
        })
          .then((resolve) => {
            options.value = resolve;

            if (isSelectFirstRow) {
              gridValueComputed.value = resolve;
            } else {
              dataGrid.value.clearSelection();
            }
          })
          .finally(() => {
            dataGrid.value && dataGrid.value.endCustomLoading();
          });
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

      function searchFn(value: unknown) {
        if (typeof value === 'string' && value.trim()) {
          getFoundationByCode(
            {
              names: [value],
              isPrecised: false,
            },
            props.foundationCode
          );
        } else if (!value) {
          getFoundationByCode(
            {
              top: 10,
              isall: props.filter && props.filter.length > 0 ? false : true,
            },
            props.foundationCode
          );
        }
      }

      onBeforeUnmount(() => {
        if (dropDownBox.value) {
          dropDownBox.value.dispose();
        }

        if (dataGrid.value) {
          dataGrid.value.dispose();
        }
      });

      return {
        prefixCls,
        options,
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
