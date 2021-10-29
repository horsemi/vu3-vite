<template>
  <div class="detail">
    <div :class="['tab-panel', isFixHeight ? 'fixHeight' : '']">
      <div class="btn-box">
        <DxDropDownButton
          :element-attr="dropDownButtonAttributes"
          :items="dropButtonItems.submit"
          :split-button="true"
          :use-select-mode="false"
          text="提交"
          display-expr="name"
          key-expr="key"
          @button-click="onSubmitClickThrottleFn"
          @item-click="onItemButtonClickThrottleFn"
        />
        <DxDropDownButton
          :items="dropButtonItems.apply"
          :split-button="true"
          :use-select-mode="false"
          text="审核"
          display-expr="name"
          key-expr="key"
          @button-click="onApplyClickThrottleFn"
          @item-click="onItemButtonClickThrottleFn"
        />
        <DxButton text="下推" @click="onPushClickThrottleFn" />
        <DxButton text="刷新" @click="getDataThrottleFn" />
      </div>
      <DxTabPanel
        v-model:selected-index="selectedIndex"
        :data-source="multiViewItems"
        :loop="true"
        :animation-enabled="true"
        :focus-state-enabled="false"
      >
        <template #item="{ data }">
          <div class="tab">
            <div class="form-box" :style="{ height: opened ? '' : getColseHeight(data.rowCount) }">
              <DetailForm
                :form-data="
                  data.key === 'base'
                    ? baseFormData
                    : data.key === 'receiver'
                    ? receiverFormData
                    : data.key === 'logistics'
                    ? logisticsFormData
                    : otherFormData
                "
                :form-list="
                  data.key === 'base'
                    ? baseInformation
                    : data.key === 'receiver'
                    ? receiverInformation
                    : data.key === 'logistics'
                    ? logisticsInformation
                    : otherInformation
                "
              />
            </div>
            <div v-if="data.rowCount > 3" class="icon-box">
              <SvgIcon
                :class="['icon', opened && 'icon--translate']"
                size="14"
                name="multi-arrow"
                @click="onChangeOpened"
              ></SvgIcon>
            </div>
          </div>
        </template>
      </DxTabPanel>
    </div>
    <div class="tab-panel">
      <DxTabPanel
        v-model:selected-index="tableIndex"
        :data-source="multiEntityItems"
        :loop="true"
        :animation-enabled="true"
        :focus-state-enabled="false"
      >
      </DxTabPanel>
      <div class="tab">
        <OdsTable
          :height="tableHeight"
          :table-options="tableIndex === 0 ? definiteOptions : recordOptions"
          :filter-scheme="tableIndex === 0 ? definiteScheme : recordScheme"
          :all-columns="tableIndex === 0 ? definiteAllColumns : recordAllColumns"
          :table-key="['Id']"
          :table-key-type="[
            {
              key: 'Id',
              type: 'string',
            },
          ]"
        >
        </OdsTable>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import type { ITableOptions } from '/@/components/Table/types';
  import type { IDetailItem } from '/@/utils/bill/types';
  import type { IColumnItem } from '/@/model/types';
  import type { ISchemeItem } from '/@/components/QueryPopup/content/types';

  import { defineComponent, ref, watch, reactive, nextTick } from 'vue';
  import { useRoute } from 'vue-router';
  import { useThrottleFn } from '@vueuse/core';

  import { getColumns } from '/@/model/shipping-orders';
  import { getDefiniteColumns } from '/@/model/shipping-order-items';
  import { getRecordColumns } from '/@/model/operation-record';
  import { ShippingOrderApi } from '/@/api/ods/shipping-orders';
  import { getDetailData, getDefiniteData, getRecordData } from './index';
  import { getOdsListUrlByCode } from '/@/api/ods/common';
  import { DEFAULT_THROTTLE_TIME } from '/@/settings/encryptionSetting';
  import { isFoundationType } from '/@/model/common';

  import DxTabPanel from 'devextreme-vue/tab-panel';
  import DxDropDownButton from 'devextreme-vue/drop-down-button';
  import DxButton from 'devextreme-vue/button';

  import DetailForm from '/@/components/DetailForm/index.vue';

  export default defineComponent({
    name: 'OdsShippingOrderDetail',
    components: {
      DxTabPanel,
      DxButton,
      DxDropDownButton,
      DetailForm,
    },
    setup() {
      const multiViewItems = ref([
        {
          title: '基本信息',
          key: 'base',
          rowCount: 0,
        },
        {
          title: '收货人信息',
          key: 'receiver',
          rowCount: 0,
        },
        {
          title: '物流信息',
          key: 'logistics',
          rowCount: 0,
        },
        {
          title: '其他信息',
          key: 'other',
          rowCount: 0,
        },
      ]);
      const multiEntityItems = [
        {
          title: '明细信息',
          key: 'definite',
        },
        {
          title: '操作记录',
          key: 'record',
        },
      ];
      const dropButtonItems = {
        apply: [
          {
            key: 'redraft',
            name: '反审',
          },
        ],
        submit: [
          {
            key: 'revoke',
            name: '撤销',
          },
        ],
      };
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
      const Id = route.query.Id as string;
      const BillCode = route.query.BillCode as string;
      const formData = ref();

      const baseInformation = ref<IDetailItem[]>([]);
      const receiverInformation = ref<IDetailItem[]>([]);
      const logisticsInformation = ref<IDetailItem[]>([]);
      const otherInformation = ref<IDetailItem[]>([]);

      const baseFormData = ref<Record<string, unknown>>({});
      const receiverFormData = ref<Record<string, unknown>>({});
      const logisticsFormData = ref<Record<string, unknown>>({});
      const otherFormData = ref<Record<string, unknown>>({});

      const isFixHeight = ref<boolean>(true);

      const definiteOptions = ref<Partial<ITableOptions>>({
        height: defaultDefiniteHeight,
        dataSourceOptions: {
          oDataOptions: {
            url: getOdsListUrlByCode('shipping-order-item'),
          },
        },
        useScrolling: true,
      });
      const definiteScheme = ref<ISchemeItem>();
      const definiteAllColumns = ref<IColumnItem[]>([]);
      let columnsData: any = reactive({});
      let recordColumnsData: any = reactive({});
      let definiteColumnsData: any = reactive({});
      const recordOptions = ref<Partial<ITableOptions>>({
        height: defaultRecordHeight,
        dataSourceOptions: {
          oDataOptions: {
            url: getOdsListUrlByCode('operation-record'),
          },
        },
        useScrolling: true,
      });
      const recordScheme = ref<ISchemeItem>();
      const recordAllColumns = ref<IColumnItem[]>([]);

      const onRefresh = () => {
        getData();
        getDefinite();
        getRecord();
      };

      const onSubmitClick = () => {
        ShippingOrderApi.onShippingOrderSubmit([formData.value.GatheringParentCode])
          .then(() => {
            onRefresh();
          })
          .catch(() => {
            onRefresh();
          });
      };

      const onApplyClick = () => {
        ShippingOrderApi.onShippingOrderApply([formData.value.GatheringParentCode])
          .then(() => {
            onRefresh();
          })
          .catch(() => {
            onRefresh();
          });
      };

      const onPushClick = () => {
        ShippingOrderApi.onShippingOrderPush([formData.value.GatheringParentCode])
          .then(() => {
            onRefresh();
          })
          .catch(() => {
            onRefresh();
          });
      };

      const onRedraftClick = () => {
        ShippingOrderApi.onShippingOrderRedraft([formData.value.GatheringParentCode])
          .then(() => {
            onRefresh();
          })
          .catch(() => {
            onRefresh();
          });
      };

      const onRevokeClick = () => {
        ShippingOrderApi.onShippingOrderRevoke([formData.value.GatheringParentCode])
          .then(() => {
            onRefresh();
          })
          .catch(() => {
            onRefresh();
          });
      };

      const onItemButtonClick = (e) => {
        switch (e.itemData.key) {
          case 'redraft': {
            onRedraftClick();
            break;
          }
          case 'revoke': {
            onRevokeClick();
            break;
          }
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
        getDetailData(['Id', '=', Id], columnsData).then((res) => {
          if (res) {
            const { baseList, receiverList, logisticsList, otherList, data } = res;

            // 页面中业务操作需要使用的字段
            formData.value = {
              GatheringParentCode: (data as Record<string, unknown>).GatheringParentCode,
            };

            /** 实验性功能 */
            baseList.forEach((item) => {
              if (isFoundationType(item)) {
                baseFormData.value[item.expand!] = (data as Record<string, unknown>)[item.expand!];
              }
              baseFormData.value[item.key!] = (data as Record<string, unknown>)[item.key!];
            });

            receiverList.forEach((item) => {
              if (isFoundationType(item)) {
                receiverFormData.value[item.expand!] = (data as Record<string, unknown>)[
                  item.expand!
                ];
              }
              receiverFormData.value[item.key!] = (data as Record<string, unknown>)[item.key!];
            });

            logisticsList.forEach((item) => {
              if (isFoundationType(item)) {
                logisticsFormData.value[item.expand!] = (data as Record<string, unknown>)[
                  item.expand!
                ];
              }
              logisticsFormData.value[item.key!] = (data as Record<string, unknown>)[item.key!];
            });

            otherList.forEach((item) => {
              if (isFoundationType(item)) {
                otherFormData.value[item.expand!] = (data as Record<string, unknown>)[item.expand!];
              }
              otherFormData.value[item.key!] = (data as Record<string, unknown>)[item.key!];
            });

            baseInformation.value = baseList;
            receiverInformation.value = receiverList;
            logisticsInformation.value = logisticsList;
            otherInformation.value = otherList;
            [
              baseInformation.value,
              receiverInformation.value,
              logisticsInformation.value,
              otherInformation.value,
            ].forEach((data, index) => {
              multiViewItems.value[index].rowCount = getRowCount(data);
            });
            handleHeight(selectedIndex.value);
            nextTick(() => {
              isFixHeight.value = false;
            });
          }
        });
      };

      const getData = async () => {
        if (JSON.stringify(columnsData) === '{}') {
          columnsData = await getColumns();
        }
        getDetail(columnsData);
      };

      const getDefinite = async () => {
        if (JSON.stringify(definiteColumnsData) === '{}') {
          definiteColumnsData = await getDefiniteColumns();
        }
        getDefiniteData(definiteColumnsData).then((res) => {
          if (res) {
            definiteAllColumns.value = res.columnList;
            definiteScheme.value = {
              id: '',
              title: '',
              requirement: [
                {
                  requirement: 'ShippingOrderId',
                  operator: '=',
                  value: Id,
                  operatorList: [],
                  type: 'string',
                  relationKey: '',
                  datatypekeies: '',
                },
              ],
              orderBy: [],
              columns: res.definite,
            };
          }
        });
      };

      const getRecord = async () => {
        if (JSON.stringify(recordColumnsData) === '{}') {
          recordColumnsData = await getRecordColumns();
        }
        getRecordData(recordColumnsData).then((res) => {
          if (res) {
            recordAllColumns.value = res.columnList;
            recordScheme.value = {
              id: '',
              title: '',
              requirement: [
                {
                  requirement: 'BillCode',
                  operator: '=',
                  value: BillCode,
                  operatorList: [],
                  type: 'string',
                  relationKey: '',
                  datatypekeies: '',
                },
              ],
              orderBy: [],
              columns: res.record,
            };
          }
        });
      };

      // 所有操作设置为节流
      const getDataThrottleFn = useThrottleFn(onRefresh, DEFAULT_THROTTLE_TIME);

      const onSubmitClickThrottleFn = useThrottleFn(onSubmitClick, DEFAULT_THROTTLE_TIME);

      const onApplyClickThrottleFn = useThrottleFn(onApplyClick, DEFAULT_THROTTLE_TIME);

      const onPushClickThrottleFn = useThrottleFn(onPushClick, DEFAULT_THROTTLE_TIME);

      const onItemButtonClickThrottleFn = useThrottleFn(onItemButtonClick, DEFAULT_THROTTLE_TIME);

      watch(selectedIndex, (sIndex) => {
        handleHeight(sIndex);
      });

      onRefresh();

      return {
        tableHeight,
        formRowHeight,
        formRowPaddingTop,
        definiteOptions,
        definiteScheme,
        definiteAllColumns,
        recordOptions,
        recordScheme,
        recordAllColumns,

        baseInformation,
        receiverInformation,
        logisticsInformation,
        otherInformation,

        baseFormData,
        receiverFormData,
        logisticsFormData,
        otherFormData,

        selectedIndex,
        tableIndex,
        opened,
        multiViewItems,
        multiEntityItems,
        dropButtonItems,
        // formData,
        isFixHeight,
        onSubmitClickThrottleFn,
        onApplyClickThrottleFn,
        onPushClickThrottleFn,
        onItemButtonClickThrottleFn,
        getDataThrottleFn,
        onChangeOpened,
        getColseHeight,
        dropDownButtonAttributes: {
          class: 'first-dropButton',
        },
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
      min-height: 255px;
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
