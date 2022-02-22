<template>
  <div v-loading="loading" :element-loading-svg="loadingSvg" :class="`${prefixCls}`">
    <DxDropDownBox
      v-model:value="dropDownValueComputed"
      v-model:opened="isGridBoxOpened"
      :accept-custom-value="true"
      placeholder="请输入"
      :disabled="selectDisabled"
      :open-on-field-click="false"
      :defer-rendering="false"
      :show-clear-button="true"
      :width="width"
      :drop-down-options="dropDownOptions"
      :on-initialized="onDropDownBoxInitialized"
      @focus-in="onFocusIn"
      @input="onInput"
      @closed="onDropDownBoxClosed"
    >
      <template #content>
        <DxDataGrid
          ref="foundationSelectTable"
          v-model:selected-row-keys="gridValueComputed"
          :data-source="options"
          :hover-state-enabled="true"
          height="100%"
          :on-initialized="onInitialized"
          @row-click="onDataGridRowClick"
          @contentReady="onContentReady"
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
  import type { FoundationMap, IFoundationConfig } from '/@/api/app/foundation';

  import {
    defineComponent,
    computed,
    PropType,
    ref,
    unref,
    watch,
    onMounted,
    onBeforeUnmount,
  } from 'vue';
  import { useDebounceFn } from '@vueuse/core';
  import DxDropDownBox from 'devextreme-vue/drop-down-box';
  import { DxDataGrid, DxColumn, DxSelection, DxScrolling } from 'devextreme-vue/data-grid';

  import { FoundationApi } from '/@/api/app';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { isNullOrUnDef } from '/@/utils/is';

  export default defineComponent({
    name: 'FoundationSelect',
    components: { DxDropDownBox, DxDataGrid, DxColumn, DxSelection, DxScrolling },
    props: {
      value: {
        type: [String, Number, Boolean, Date] as PropType<string | number | boolean | Date>,
        default: '',
      },
      width: {
        type: String,
        default: '',
      },
      foundationCode: {
        type: String,
        default: '',
      },
      filter: {
        type: Array as PropType<Record<string, unknown>[]>,
        default: () => [],
      },
      selectDisabled: {
        type: Boolean,
        default: false,
      },
      defaultOptions: {
        type: Object as PropType<Record<string, unknown>>,
        default: () => undefined,
      },
      showProperty: {
        type: String,
        default: 'Name',
      },
      keyProperty: {
        type: String,
        default: 'Code',
      },
    },
    emits: ['update:value'],
    setup(props, ctx) {
      const { prefixCls } = useDesign('foundation-select');

      const loading = ref(false);
      const loadingSvg = `
          <circle class="path" cx="50" cy="50" r="10" fill="none"/>
        `;

      const dropDownBox = ref();
      const dropDownOptions = {
        width: 270,
      };

      const dataGrid = ref();

      const foundationSelectTable = ref();

      // 下拉框组件文本框绑定的文本
      const dropDownValue = ref('');

      // 用于判断value更改触发方式是否为下拉框点击
      const isDropDownBoxClick = ref(false);

      const dropDownValueComputed = computed({
        get: () => {
          return unref(dropDownValue);
        },
        set: (val) => {
          dropDownValue.value = val;

          if (val === null) {
            dataGrid.value.clearSelection();
            options.value = [];
            ctx.emit('update:value', null);
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
          if (val && val.length) {
            gridValue.value = val[0];

            // 列表选中一列后更改下拉框文本框内容，并同步 value 值
            if (gridValue.value && gridValue.value.name && gridValue.value.code) {
              dropDownValueComputed.value = gridValue.value.name;

              if (unref(gridValue).code !== props.value) {
                ctx.emit('update:value', gridValue.value.code);
              }
            }
          }
        },
      });

      const isGridBoxOpened = ref(false);

      const options = ref<Record<string, unknown>[]>([]);
      const debounceFn = useDebounceFn(searchFn, 800);

      // 选中选项后会调用接口
      watch(
        () => props.value,
        (value) => {
          if (value) {
            // 若为下拉框点击，则不执行
            if (!unref(isDropDownBoxClick)) {
              getFoundationByCode(
                {
                  codes: [value as string],
                  names: [value as string],
                },
                props.foundationCode,
                true
              );
            }
            isDropDownBoxClick.value = false;
          } else {
            dropDownValueComputed.value = '';
          }
        }
      );

      watch(
        () => props.foundationCode,
        (value) => {
          if (value) {
            getFoundationByCode(
              {
                top: 10,
                isall: props.filter && props.filter.length > 0 ? true : false,
              },
              value
            );
          } else {
            options.value = [];
          }
        }
      );

      // 该方法是从两个watch中拆分出来
      function initFoundationList() {
        if (
          props.defaultOptions &&
          Object.keys(props.defaultOptions).length &&
          !isNullOrUnDef(props.defaultOptions[props.showProperty])
        )
          return;

        if (props.value) {
          // 若为下拉框点击或默认下拉列为空，则不执行
          if (
            !unref(isDropDownBoxClick) &&
            props.defaultOptions &&
            Object.keys(props.defaultOptions).length &&
            isNullOrUnDef(props.defaultOptions[props.showProperty])
          ) {
            getFoundationByCode(
              {
                codes: [props.value as string],
              },
              props.foundationCode,
              true
            );
          }
          isDropDownBoxClick.value = false;
        } else {
          dropDownValueComputed.value = '';

          if (
            props.foundationCode &&
            props.defaultOptions &&
            Object.keys(props.defaultOptions).length &&
            isNullOrUnDef(props.defaultOptions[props.showProperty])
          ) {
            getFoundationByCode(
              {
                top: 10,
              },
              props.foundationCode
            );
          } else {
            options.value = [];
          }
        }
      }

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
        loading.value = true;
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
            loading.value = false;
          });
      }

      function handleIsNotEnabled() {
        if (options.value && options.value.length) {
          options.value.forEach((item, index) => {
            if (item.isEnabled === false) {
              const rowEl = foundationSelectTable.value.instance.getRowElement(index);
              rowEl &&
                rowEl.length === 1 &&
                (rowEl[0].className += ' foundation-select-table-is-not-enabled');
            }
          });
        }
      }

      function onContentReady() {
        handleIsNotEnabled();
      }

      function onFocusIn() {
        isGridBoxOpened.value = true;
      }

      function onDataGridRowClick() {
        isDropDownBoxClick.value = true;
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
              codes: [value],
              isPrecised: false,
              allowDisabled: true,
            },
            props.foundationCode
          );
        } else if (!value) {
          getFoundationByCode(
            {
              top: 10,
              isall: true,
            },
            props.foundationCode
          );
        }
      }

      onMounted(() => {
        if (props.defaultOptions) {
          gridValueComputed.value = [
            {
              code: props.defaultOptions[props.keyProperty],
              name: props.defaultOptions[props.showProperty],
            },
          ];

          options.value = [
            {
              code: props.defaultOptions[props.keyProperty],
              name: props.defaultOptions[props.showProperty] as string,
            },
          ];
        }
      });

      onBeforeUnmount(() => {
        if (dropDownBox.value) {
          dropDownBox.value.dispose();
        }

        if (dataGrid.value) {
          dataGrid.value.dispose();
        }
      });

      initFoundationList();

      return {
        prefixCls,
        loading,
        loadingSvg,
        options,
        foundationSelectTable,
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
        onContentReady,
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

<style lang="less">
  .foundation-select-table-is-not-enabled {
    pointer-events: none;
    background-color: @disabled-color;
  }
</style>
