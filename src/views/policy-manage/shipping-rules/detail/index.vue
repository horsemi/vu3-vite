<template>
  <div class="detail">
    <div :class="['tab-panel', isFixHeight ? 'fixHeight' : '']">
      <div class="btn-box">
        <DxButton type="default" text="保存" @click="onSaveClickThrottleFn" />
      </div>
      <DetailForm
        :col-count="8"
        :read-only="false"
        :form-data="baseFormData"
        :form-list="baseInformation"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import type { ITableOptions } from '/@/components/Table/types';
  import type { IDetailItem } from '/@/utils/bill/types';
  import type { IColumnItem } from '/@/model/types';
  import type { ISchemeItem } from '/@/components/QueryPopup/content/types';

  import { defineComponent, ref, watch, reactive, nextTick } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useThrottleFn } from '@vueuse/core';
  import { useViewStore } from '/@/store/modules/view';
  import { odsMessage } from '/@/components/Message';

  import { getColumns } from '/@/model/shipping-rules';
  import { ShippingRulesApi } from '/@/api/policy-manage/shipping-rules';
  import { getDetailData, getDetailColumn } from './index';
  import { getOdsListUrlByCode } from '/@/api/ods/common';
  import { DEFAULT_THROTTLE_TIME } from '/@/settings/encryptionSetting';
  import { isFoundationType } from '/@/model/common';

  import DxButton from 'devextreme-vue/button';

  import DetailForm from '/@/components/DetailForm/index.vue';

  type formEditType = 'Edit' | 'Add';

  export default defineComponent({
    name: 'PolicyManageShippingRulesDetail',
    components: {
      DxButton,
      DetailForm,
    },
    setup() {
      const formEditStatus = ref<formEditType>('Edit');

      const multiViewItems = ref([
        {
          title: '基本信息',
          key: 'base',
          rowCount: 0,
        },
      ]);

      const opened = ref(false);
      const selectedIndex = ref(0);
      const tableIndex = ref(0);
      const tableHeight = ref('');
      const rowSpan = 8;
      const formRowHeight = 29;
      const formRowPaddingTop = 12;
      const overHeight = 330;
      const arrowIconHeight = 26;
      const defaultDefiniteHeight = `calc(100vh - ${overHeight}px)`;
      const defaultRecordHeight = `calc(100vh - ${overHeight}px)`;

      const route = useRoute();
      const router = useRouter();
      const viewStore = useViewStore();

      const Id = route.query.Id as string | undefined;
      const RuleCode = route.query.RuleCode as string;
      const formData = ref();

      const baseInformation = ref<IDetailItem[]>([]);

      const baseFormData = ref<Record<string, unknown>>({});

      const isFixHeight = ref<boolean>(true);

      const definiteScheme = ref<ISchemeItem>();
      const definiteAllColumns = ref<IColumnItem[]>([]);
      let columnsData: any = reactive({});

      const recordOptions = ref<Partial<ITableOptions>>({
        height: defaultRecordHeight,
        dataSourceOptions: {
          oDataOptions: {
            url: getOdsListUrlByCode('operation-records'),
          },
        },
        useScrolling: true,
      });
      const recordScheme = ref<ISchemeItem>();
      const recordAllColumns = ref<IColumnItem[]>([]);

      const onRefresh = () => {
        getData();
      };

      const onSaveClick = () => {
        if (formEditStatus.value === 'Add') {
          ShippingRulesApi.onShippingRulesCreate(baseFormData.value).then(() => {
            viewStore.closeViewByKey(route.fullPath, router);
            odsMessage({
              type: 'success',
              message: '保存成功',
            });
            onRefresh();
          });
        } else {
          ShippingRulesApi.onShippingRulesUpdate(Object.assign(baseFormData.value, { Id }))
            .then(() => {
              odsMessage({
                type: 'success',
                message: '保存成功',
              });
              onRefresh();
            })
            .catch(() => {
              onRefresh();
            });
        }
      };

      const onChangeOpened = () => {
        opened.value = !opened.value;
        handleHeight(selectedIndex.value);
      };

      const handleHeight = (sIndex: number) => {
        // 表单行数
        const rowCount = multiViewItems.value[sIndex].rowCount;
        // 展开按钮高度，超出3行才会出现展开按钮
        const iconHeight = rowCount > 3 ? arrowIconHeight : 0;
        // 表格高度
        let formHeight = 0;
        if (opened.value || rowCount < 3) {
          // 表格高度
          formHeight = formRowHeight * rowCount + formRowPaddingTop * (rowCount - 1);
        } else {
          formHeight = formRowHeight * 3 + formRowPaddingTop * 2;
        }
        // 总裁剪高度
        const cutHeight = formHeight + iconHeight + overHeight;
        tableHeight.value = `calc(100vh - ${cutHeight}px)`;
      };

      const getColseHeight = (rowCount) => {
        if (rowCount >= 3) {
          return `${formRowHeight * 3 + formRowPaddingTop * 2}px`;
        } else {
          return `${formRowHeight * rowCount + formRowPaddingTop * (rowCount - 1)}px`;
        }
      };

      const getRowCount = (data: IDetailItem[]) => {
        let len = 0;
        data.forEach((item) => {
          if (!item.hide) {
            if (item.colSpan) {
              len += item.colSpan;
            } else if (item.editorType === 'dxSwitch') {
              len += 1;
            } else {
              len += 2;
            }
          }
        });
        return Math.ceil(len / rowSpan);
      };

      const getDetail = (columnsData: any) => {
        const baseList = getDetailColumn(columnsData);

        baseFormData.value['CreatedTime'] = Date.now();
        baseFormData.value['UpdatedTime'] = Date.now();
        baseFormData.value['IsEnabled'] = true;
        baseFormData.value['MinWeight'] = 0;

        if (formEditStatus.value === 'Edit' && baseList) {
          getDetailData(['Id', '=', Id], columnsData).then((res) => {
            if (res) {
              const data = res;

              /** 实验性功能 */
              baseList.forEach((item) => {
                if (isFoundationType(item)) {
                  baseFormData.value[item.expand!] = (data as Record<string, unknown>)[
                    item.expand!
                  ];
                }
                baseFormData.value[item.key!] = (data as Record<string, unknown>)[item.key!];
              });

              [baseInformation.value].forEach((data, index) => {
                multiViewItems.value[index].rowCount = getRowCount(data);
              });
              handleHeight(selectedIndex.value);
            }
          });
        }
        // nextTick(() => {
        //   isFixHeight.value = false;
        // });
        baseInformation.value = baseList || [];
      };

      const getData = async () => {
        if (JSON.stringify(columnsData) === '{}') {
          columnsData = await getColumns();
        }

        formEditStatus.value = Id ? 'Edit' : 'Add';

        getDetail(columnsData);
      };

      // 所有操作设置为节流
      const getDataThrottleFn = useThrottleFn(onRefresh, DEFAULT_THROTTLE_TIME);

      const onSaveClickThrottleFn = useThrottleFn(onSaveClick, DEFAULT_THROTTLE_TIME);

      watch(selectedIndex, (sIndex) => {
        handleHeight(sIndex);
      });

      onRefresh();

      return {
        tableHeight,
        formRowHeight,
        formRowPaddingTop,
        definiteScheme,
        definiteAllColumns,
        recordOptions,
        recordScheme,
        recordAllColumns,

        baseInformation,

        baseFormData,

        selectedIndex,
        tableIndex,
        opened,
        multiViewItems,
        // formData,
        isFixHeight,
        onSaveClickThrottleFn,
        getDataThrottleFn,
        onChangeOpened,
        getColseHeight,
      };
    },
  });
</script>

<style lang="less">
  .first-dropButton {
    background-color: @color-primary;
    border-radius: 4px;
    .dx-buttongroup .dx-buttongroup-wrapper {
      border: none;
      .dx-buttongroup-item .dx-button-content .dx-button-text {
        color: #fff !important;
      }
      .dx-icon {
        color: #fff !important;
      }
    }
  }
  .detail {
    overflow: hidden;

    .btn-box {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      padding: 12px 8px 4px 8px;
      & > * {
        margin-left: 8px;
      }
    }
    .fixHeight {
      min-height: 155px;
    }

    .tab-panel {
      position: relative;
      display: flex;
      flex-direction: column;
      background-color: #fff;
      &:last-child {
        flex: 1;
        margin-top: 16px;
      }
      .tab {
        padding: 12px 16px;
        background-color: #fff;
        .tab-btn {
          padding-bottom: 12px;
          & > * {
            margin-right: 8px;
          }
        }
      }
    }
    .form-box {
      overflow: hidden;
    }
    .icon-box {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      padding-top: 12px;
      .icon {
        cursor: pointer;
        transform: rotate(0);
        &--translate {
          transform: rotate(-180deg);
        }
      }
    }

    .dx-layout-manager .dx-field-item:not(.dx-first-row) {
      padding-top: 12px;
    }

    .dx-texteditor-input {
      min-height: 0;
      padding: 4px 8px 4px;
    }
  }
</style>
