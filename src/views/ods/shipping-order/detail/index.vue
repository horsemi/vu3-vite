<template>
  <div class="detail">
    <div v-loading="formLoading" :class="['tab-panel', isFixHeight ? 'fixHeight' : '']">
      <div class="btn-box">
        <DxDropDownButton
          :element-attr="dropDownButtonAttributes"
          :items="dropButtonItems.submit"
          :split-button="true"
          :use-select-mode="false"
          text="提交"
          :disabled="!permissionStore.hasPermission(shippingOrderType.shippingOrderSumit)"
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
          :disabled="!permissionStore.hasPermission(shippingOrderType.shippingOrderApply)"
          display-expr="name"
          key-expr="key"
          @button-click="onApplyClickThrottleFn"
          @item-click="onItemButtonClickThrottleFn"
        />
        <DxDropDownButton
          :items="dropButtonItems.push"
          :split-button="true"
          :use-select-mode="false"
          :disabled="!permissionStore.hasPermission(shippingOrderType.shippingOrderPush)"
          text="下推"
          display-expr="name"
          key-expr="key"
          @button-click="onPushClickThrottleFn"
          @item-click="onItemButtonClickThrottleFn"
        />
        <DxButton
          text="刷新"
          :disabled="!permissionStore.hasPermission(shippingOrderType.shippingOrderQueryItems)"
          @click="getDataThrottleFn"
        />
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
            <div
              class="form-box"
              :style="{
                height: opened ? '' : getColseHeight(data.rowCount),
              }"
            >
              <DetailForm
                :read-only="true"
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
        @titleClick="onTableTitleClick"
      >
        <template #item="{ data }">
          <div class="tab">
            <OdsTable
              ref="dataGrid"
              v-loading="data.key === 'definite' ? definiteLoading : recordLoading"
              :height="tableHeight"
              :order-code="data.key === 'definite' ? 'shipping-order-items' : 'operation-records'"
              :query-list-permission="shippingOrderType.shippingOrderQueryItems"
              :table-options="data.key === 'definite' ? definiteOptions : recordOptions"
              :filter-scheme="data.key === 'definite' ? definiteScheme : recordScheme"
              :all-columns="data.key === 'definite' ? definiteAllColumns : recordAllColumns"
              :table-key="data.key === 'definite' ? definiteTableKey : recordTableKey"
              @onLoad="data.key === 'definite' ? (definiteLoading = true) : (recordLoading = true)"
              @onLoaded="
                data.key === 'definite' ? (definiteLoading = false) : (recordLoading = false)
              "
            >
            </OdsTable>
          </div>
        </template>
      </DxTabPanel>
    </div>
  </div>
</template>

<script lang="ts">
  import type { ITableOptions } from '/@/components/Table/types';
  import type { IRequirementItem } from '/@/components/QueryPopup/content/types';

  import { defineComponent, ref, watch, nextTick, onActivated, onDeactivated } from 'vue';
  import { useRoute } from 'vue-router';
  import { usePermissionStore } from '/@/store/modules/permission';
  import { useThrottleFn } from '@vueuse/core';
  import { ShippingOrderApi } from '/@/api/ods/shipping-orders';
  import { getOdsListUrlByCode } from '/@/api/ods/common';
  import { DEFAULT_THROTTLE_TIME } from '/@/settings/encryptionSetting';
  import { shippingOrderType } from '/@/enums/actionPermission/shipping-order';

  import DxTabPanel from 'devextreme-vue/tab-panel';
  import DxDropDownButton from 'devextreme-vue/drop-down-button';
  import DxButton from 'devextreme-vue/button';

  import DetailForm from '/@/components/DetailForm/index.vue';

  import { useDetailForm } from './composables/useDetailForm';
  import { useDefinite } from './composables/useDefinite';
  import { useRecord } from './composables/useRecord';
  import { useHeight } from './composables/useHeight';

  export default defineComponent({
    name: 'OdsShippingOrderDetail',
    components: {
      DxTabPanel,
      DxButton,
      DxDropDownButton,
      DetailForm,
    },
    setup() {
      const permissionStore = usePermissionStore();
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
            disabled: !permissionStore.hasPermission(shippingOrderType.shippingOrderRedraft),
          },
        ],
        submit: [
          {
            key: 'revoke',
            name: '撤销',
            disabled: !permissionStore.hasPermission(shippingOrderType.shippingOrderRevoke),
          },
        ],
        push: [
          {
            key: 'recall',
            name: '撤回',
            disabled: !permissionStore.hasPermission(shippingOrderType.shippingOrderRecall),
          },
        ],
      };
      const opened = ref(false);
      const route = useRoute();
      const Id = route.query.Id as string;
      const BillCode = route.query.BillCode as string;
      const selectedIndex = ref(0);
      const tableIndex = ref(0);
      const isFixHeight = ref<boolean>(true);

      const definiteRequirement: IRequirementItem[] = [
        {
          key: 'ShippingOrderId',
          operator: '=',
          value: Id,
          operatorList: [],
          type: 'string',
          relationKey: '',
          datatypekeies: '',
          logic: 'and',
          entityKey: '',
        },
      ];

      function detailFormCallBack() {
        handleHeight(
          multiViewItems.value[selectedIndex.value].rowCount,
          tableIndex.value,
          opened.value
        );
        nextTick(() => {
          isFixHeight.value = false;
        });
      }

      const {
        formData,
        formLoading,
        baseFormData,
        receiverFormData,
        logisticsFormData,
        otherFormData,
        baseInformation,
        receiverInformation,
        logisticsInformation,
        otherInformation,
        refreshDetailForm,
      } = useDetailForm(Id, multiViewItems, detailFormCallBack);

      const {
        definiteScheme,
        definiteLoading,
        definiteTableKey,
        definiteAllColumns,
        refreshDefinite,
      } = useDefinite(definiteRequirement);

      const {
        recordScheme,
        recordLoading,
        recordTableKey,
        recordAllColumns,
        refreshRecord,
      } = useRecord(BillCode);

      const {
        tableHeight,
        defaultDefiniteHeight,
        defaultRecordHeight,
        handleHeight,
        getColseHeight,
      } = useHeight();

      const definiteOptions = ref<Partial<ITableOptions>>({
        height: defaultDefiniteHeight,
        dataSourceOptions: {
          oDataOptions: {
            url: getOdsListUrlByCode('shipping-order-items'),
          },
        },
        useScrolling: true,
      });

      const recordOptions = ref<Partial<ITableOptions>>({
        height: defaultRecordHeight,
        dataSourceOptions: {
          oDataOptions: {
            url: getOdsListUrlByCode('operation-records'),
          },
        },
        useScrolling: true,
      });

      const onRefresh = () => {
        refreshDetailForm(detailFormCallBack);
        refreshDefinite();
        refreshRecord();
      };

      const onSubmitClick = () => {
        ShippingOrderApi.onShippingOrderSubmit([formData.value.GatheringParentCode]).finally(() => {
          onRefresh();
        });
      };

      const onApplyClick = () => {
        ShippingOrderApi.onShippingOrderApply([formData.value.GatheringParentCode]).finally(() => {
          onRefresh();
        });
      };

      const onPushClick = () => {
        ShippingOrderApi.onShippingOrderPush([formData.value.GatheringParentCode]).finally(() => {
          onRefresh();
        });
      };

      const onRedraftClick = () => {
        ShippingOrderApi.onShippingOrderRedraft([formData.value.GatheringParentCode]).finally(
          () => {
            onRefresh();
          }
        );
      };

      const onRevokeClick = () => {
        ShippingOrderApi.onShippingOrderRevoke([formData.value.GatheringParentCode]).finally(() => {
          onRefresh();
        });
      };

      const onRecallClick = () => {
        ShippingOrderApi.onShippingOrderRecall([formData.value.GatheringParentCode]).finally(() => {
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
          case 'recall': {
            onRecallClick();
            break;
          }
        }
      };

      const onTableTitleClick = () => {
        handleHeight(
          multiViewItems.value[selectedIndex.value].rowCount,
          tableIndex.value,
          opened.value
        );
      };
      const onChangeOpened = () => {
        opened.value = !opened.value;
        handleHeight(
          multiViewItems.value[selectedIndex.value].rowCount,
          tableIndex.value,
          opened.value
        );
      };

      // 所有操作设置为节流
      const getDataThrottleFn = useThrottleFn(onRefresh, DEFAULT_THROTTLE_TIME, false);

      const onSubmitClickThrottleFn = useThrottleFn(onSubmitClick, DEFAULT_THROTTLE_TIME, false);

      const onApplyClickThrottleFn = useThrottleFn(onApplyClick, DEFAULT_THROTTLE_TIME, false);

      const onPushClickThrottleFn = useThrottleFn(onPushClick, DEFAULT_THROTTLE_TIME, false);

      const onItemButtonClickThrottleFn = useThrottleFn(
        onItemButtonClick,
        DEFAULT_THROTTLE_TIME,
        false
      );

      watch(selectedIndex, (sIndex) => {
        handleHeight(multiViewItems.value[sIndex].rowCount, tableIndex.value, opened.value);
      });

      const dataGrid = ref();

      onActivated(() => {
        dataGrid.value?.scrollToTable();
      });
      onDeactivated(() => {
        dataGrid.value?.resetTableScrollable();
      });

      return {
        dataGrid,
        tableHeight,
        definiteOptions,
        definiteTableKey,
        definiteScheme,
        definiteAllColumns,
        recordOptions,
        recordTableKey,
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

        formLoading,
        definiteLoading,
        recordLoading,

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
        onTableTitleClick,
        dropDownButtonAttributes: {
          class: 'first-dropButton',
        },
        shippingOrderType,
        permissionStore,
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

    .dx-texteditor-input,
    .dx-placeholder::before {
      min-height: 0;
      padding: 4px 8px 4px;
    }
  }
</style>
