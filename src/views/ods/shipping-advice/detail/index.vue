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
          :disabled="!permissionStore.hasPermission(shippingAdviceType.shippingAdviceSumit)"
          item-template="item"
          display-expr="name"
          key-expr="key"
          @button-click="onSubmitClickThrottleFn"
          @item-click="onItemButtonClickThrottleFn"
        >
        </DxDropDownButton>
        <DxDropDownButton
          :items="dropButtonItems.apply"
          :split-button="true"
          :use-select-mode="false"
          text="审核"
          :disabled="!permissionStore.hasPermission(shippingAdviceType.shippingAdviceApply)"
          display-expr="name"
          key-expr="key"
          @button-click="onApplyClickThrottleFn"
          @item-click="onItemButtonClickThrottleFn"
        />
        <DxDropDownButton
          :items="dropButtonItems.send"
          :split-button="true"
          :use-select-mode="false"
          text="发送"
          :disabled="!permissionStore.hasPermission(shippingAdviceType.shippingAdvicePush)"
          display-expr="name"
          key-expr="key"
          @button-click="onSendClickThrottleFn"
          @item-click="onItemButtonClickThrottleFn"
        />
        <DxButton
          :disabled="!permissionStore.hasPermission(shippingAdviceType.shippingAdviceQueryItems)"
          text="刷新"
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
            <div class="form-box" :style="{ height: opened ? '' : getColseHeight(data.rowCount) }">
              <DetailForm
                :read-only="true"
                :form-data="
                  data.key === 'base'
                    ? baseFormData
                    : data.key === 'receiver'
                    ? receiverFormData
                    : data.key === 'logistics'
                    ? logisticsFormData
                    : data.key === 'expressList'
                    ? expressFormData
                    : data.key === 'task'
                    ? taskFormData
                    : otherFormData
                "
                :form-list="
                  data.key === 'base'
                    ? baseInformation
                    : data.key === 'receiver'
                    ? receiverInformation
                    : data.key === 'logistics'
                    ? logisticsInformation
                    : data.key === 'expressList'
                    ? expressListInformation
                    : data.key === 'task'
                    ? taskInformation
                    : otherInformation
                "
              />
            </div>
            <div v-if="data.rowCount > 3" class="icon-box">
              <SvgIcon
                :class="['icon', opened && 'icon--translate']"
                size="12"
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
      </DxTabPanel>
      <div v-if="tableIndex === 0" class="search-box">
        <QueryForm ref="queryForm" class="query-form" :save-fast="false" @on-search="onSearch" />
        <div class="search-btn">
          <DxButton text="查询" type="default" @click="onSearch" />
          <DxButton text="重置" @click="onReset" />
        </div>
      </div>
      <div class="tab" :style="tableIndex === 0 && 'padding-top: 0'">
        <OdsTable
          :height="tableHeight"
          :order-code="tableIndex === 0 ? 'shipping-advice-items' : 'operation-records'"
          :query-list-permission="shippingAdviceType.shippingAdviceQueryItems"
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
  import type { IRequirementItem } from '/@/components/QueryPopup/content/types';

  import { defineComponent, ref, watch, nextTick, provide } from 'vue';
  import { useRoute } from 'vue-router';
  import { useThrottleFn } from '@vueuse/core';

  import { usePermissionStore } from '/@/store/modules/permission';
  import { ShippingAdviceApi } from '/@/api/ods/shipping-advices';
  import { getOdsListUrlByCode } from '/@/api/ods/common';
  import { DEFAULT_THROTTLE_TIME } from '/@/settings/encryptionSetting';
  import { shippingAdviceType } from '/@/enums/actionPermission/shipping-advice';
  import DxTabPanel from 'devextreme-vue/tab-panel';
  import DxDropDownButton from 'devextreme-vue/drop-down-button';
  import DxButton from 'devextreme-vue/button';

  import DetailForm from '/@/components/DetailForm/index.vue';
  import QueryForm from '/@/components/QueryPlan/component/form.vue';

  import { useDetailForm } from './composables/useDetailForm';
  import { useDefinite } from './composables/useDefinite';
  import { useRecord } from './composables/useRecord';
  import { useSearchDefinite } from './composables/useSearchDefinite';
  import { useHeight } from './composables/useHeight';

  export default defineComponent({
    name: 'OdsShippingAdviceDetail',
    components: {
      DxTabPanel,
      DxButton,
      DxDropDownButton,
      DetailForm,
      QueryForm,
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
          title: '快递信息',
          key: 'expressList',
          rowCount: 0,
        },
        {
          title: '作业信息',
          key: 'task',
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
            disabled: !permissionStore.hasPermission(shippingAdviceType.shippingAdviceRedraft),
          },
        ],
        submit: [
          {
            key: 'revoke',
            name: '撤销',
            disabled: !permissionStore.hasPermission(shippingAdviceType.shippingAdviceRevoke),
          },
        ],
        send: [
          {
            key: 'recall',
            name: '撤回',
            disabled: !permissionStore.hasPermission(shippingAdviceType.shippingAdviceRecall),
          },
        ],
      };

      // const stepData = ['理货', '进场', '交接', '清货'];
      // const stepActiveIndex = ref(0);

      const opened = ref(false);
      const route = useRoute();
      const Id = route.query.Id as string;
      const BillCode = route.query.BillCode as string;
      const selectedIndex = ref(0);
      const tableIndex = ref(0);
      const isFixHeight = ref<boolean>(true);

      const definiteRequirement: IRequirementItem[] = [
        {
          requirement: 'ShippingAdviceId',
          operator: '=',
          value: Id,
          operatorList: [],
          type: 'string',
          relationKey: '',
          datatypekeies: '',
          logic: 'and',
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
        baseFormData,
        receiverFormData,
        logisticsFormData,
        expressFormData,
        taskFormData,
        otherFormData,
        baseInformation,
        receiverInformation,
        logisticsInformation,
        expressListInformation,
        taskInformation,
        otherInformation,
        refreshDetailForm,
      } = useDetailForm(Id, multiViewItems, detailFormCallBack);

      const {
        definiteScheme,
        definiteAllColumns,
        definiteCustomColumns,
        refreshDefinite,
      } = useDefinite(definiteRequirement);

      const { recordScheme, recordAllColumns, refreshRecord } = useRecord(BillCode);
      const { onSearch, onReset, schemeData } = useSearchDefinite(
        definiteRequirement,
        definiteCustomColumns,
        definiteScheme
      );
      provide('allColumns', definiteAllColumns);
      provide('schemeData', schemeData);
      provide('onChangeScheme', onSearch);
      provide('schemeDataTemp', ref({}));

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
            url: getOdsListUrlByCode('shipping-advice-items'),
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
        ShippingAdviceApi.onShippingAdviceSubmit([formData.value.GatheringParentCode]).finally(
          () => {
            onRefresh();
          }
        );
      };
      const onApplyClick = () => {
        ShippingAdviceApi.onShippingAdviceApply([formData.value.GatheringParentCode]).finally(
          () => {
            onRefresh();
          }
        );
      };
      const onSendClick = () => {
        ShippingAdviceApi.onShippingAdviceSend([formData.value.GatheringParentCode]).finally(() => {
          onRefresh();
        });
      };
      const onRecallClick = () => {
        ShippingAdviceApi.onShippingAdviceRecall([formData.value.GatheringParentCode]).finally(
          () => {
            onRefresh();
          }
        );
      };
      const onRedraftClick = () => {
        ShippingAdviceApi.onShippingAdviceRedraft([formData.value.GatheringParentCode]).finally(
          () => {
            onRefresh();
          }
        );
      };
      const onRevokeClick = () => {
        ShippingAdviceApi.onShippingAdviceRevoke([formData.value.GatheringParentCode]).finally(
          () => {
            onRefresh();
          }
        );
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

      // const handleStepActiveIndex = () => {
      //   if (formData.value.isClean) {
      //     stepActiveIndex.value = 3;
      //   } else if (formData.value.isTransfer) {
      //     stepActiveIndex.value = 2;
      //   } else if (formData.value.isEntry) {
      //     stepActiveIndex.value = 1;
      //   }
      // };

      // 所有操作设置为节流
      const getDataThrottleFn = useThrottleFn(onRefresh, DEFAULT_THROTTLE_TIME);

      const onSubmitClickThrottleFn = useThrottleFn(onSubmitClick, DEFAULT_THROTTLE_TIME);

      const onApplyClickThrottleFn = useThrottleFn(onApplyClick, DEFAULT_THROTTLE_TIME);

      const onSendClickThrottleFn = useThrottleFn(onSendClick, DEFAULT_THROTTLE_TIME);

      const onItemButtonClickThrottleFn = useThrottleFn(onItemButtonClick, DEFAULT_THROTTLE_TIME);

      watch(selectedIndex, (sIndex) => {
        handleHeight(multiViewItems.value[sIndex].rowCount, tableIndex.value, opened.value);
      });

      return {
        tableHeight,
        definiteOptions,
        definiteScheme,
        definiteAllColumns,
        recordOptions,
        recordScheme,
        recordAllColumns,

        baseInformation,
        receiverInformation,
        logisticsInformation,
        expressListInformation,
        taskInformation,
        otherInformation,

        baseFormData,
        receiverFormData,
        logisticsFormData,
        expressFormData,
        taskFormData,
        otherFormData,

        selectedIndex,
        tableIndex,
        opened,
        multiViewItems,
        multiEntityItems,
        dropButtonItems,

        // formData,
        // stepData,
        // stepActiveIndex,
        isFixHeight,
        onSubmitClickThrottleFn,
        onApplyClickThrottleFn,
        onSendClickThrottleFn,
        onItemButtonClickThrottleFn,
        onRefresh,
        getDataThrottleFn,
        onChangeOpened,
        getColseHeight,
        onSearch,
        onReset,
        onTableTitleClick,
        dropDownButtonAttributes: {
          class: 'first-dropButton',
        },
        shippingAdviceType,
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
      .dx-button {
        border: none;
      }
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
      .search-box {
        display: flex;

        .query-form {
          .vue3-vite-query-form__box {
            padding-left: 16px;
          }

          &.dx-texteditor-input {
            min-height: 34px;
          }
        }

        .search-btn {
          display: flex;
          align-items: center;
          > * {
            margin-left: 8px;
          }
        }
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

      .dx-texteditor-input {
        min-height: 0;
        padding: 4px 8px 4px;
      }
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
  }
</style>
