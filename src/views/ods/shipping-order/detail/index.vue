<template>
  <div class="detail">
    <div class="tab-panel">
      <div class="btn-box">
        <DxDropDownButton
          :items="dropButtonItems.submit"
          :split-button="true"
          :use-select-mode="false"
          :width="56"
          :height="26"
          text="提交"
          display-expr="name"
          key-expr="key"
          @button-click="onSubmitClick"
          @item-click="onItemButtonClick"
        />
        <DxDropDownButton
          :items="dropButtonItems.apply"
          :split-button="true"
          :use-select-mode="false"
          :width="56"
          :height="26"
          text="审核"
          display-expr="name"
          key-expr="key"
          @button-click="onApplyClick"
          @item-click="onItemButtonClick"
        />
        <DxButton :width="56" :height="26" text="下推" @click="onPushClick" />
        <DxButton :width="56" :height="26" text="刷新" @click="onRefresh" />
      </div>
      <DxTabPanel
        v-model:selected-index="selectedIndex"
        :data-source="multiViewItems"
        :loop="true"
        :animation-enabled="true"
        :swipe-enabled="true"
        :focus-state-enabled="false"
      >
        <template #item="{ data }">
          <div class="tab">
            <div ref="formBox" class="form-box" :style="{ height: opened ? '' : '28px' }">
              <DetailForm
                :form-data="formData"
                :form-list="
                  data.title === '基本信息'
                    ? baseInformation
                    : data.title === '收货人信息'
                    ? receiverInformation
                    : data.title === '物流信息'
                    ? logisticsInformation
                    : otherInformation
                "
              />
            </div>
            <div class="icon-box">
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
      <div class="btn-box">
        <DxButton :width="56" :height="26" text="新增" type="default" />
        <DxButton :width="56" :height="26" text="删除" />
      </div>
      <DxTabPanel
        :data-source="multiEntityItems"
        :loop="true"
        :animation-enabled="true"
        :swipe-enabled="true"
        :focus-state-enabled="false"
      >
        <template #item>
          <div class="tab">
            <OdsTable :table-options="tableOptions" :data-source="dataSource" :columns="columns">
            </OdsTable>
          </div>
        </template>
      </DxTabPanel>
    </div>
  </div>
</template>

<script lang="ts">
  import type { ITableOptions } from '/@/components/Table/types';
  import type { IDetailItem } from '/@/utils/bill/types';
  import type { IColumnItem } from '/@/model/types';

  import { defineComponent, nextTick, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { cloneDeep } from 'lodash-es';

  import { defaultTableOptions } from '/@/components/Table/common';
  import { deepMerge } from '/@/utils';
  import { ShippingOrderApi } from '/@/api/ods/shipping-orders';
  import { getDetailData, getDefiniteData } from './index';

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
          height: '',
        },
        {
          title: '收货人信息',
          height: '',
        },
        {
          title: '物流信息',
          height: '',
        },
        {
          title: '其他信息',
          height: '',
        },
      ]);
      const multiEntityItems = [
        {
          title: '明细信息',
        },
      ];
      const dropButtonItems = {
        apply: [
          {
            key: 'redraft',
            name: '反审核',
          },
        ],
        submit: [
          {
            key: 'revoke',
            name: '撤销',
          },
        ],
      };
      const opened = ref(true);
      const selectedIndex = ref(0);
      const formBox = ref();
      let tableOpenedHeight = '';
      const tableCloseHeight = 'calc(100vh - 28px - 322px)';

      const route = useRoute();
      const Id = route.query.Id as string;
      const formData = ref();
      const baseInformation = ref<IDetailItem[]>([]);
      const receiverInformation = ref<IDetailItem[]>([]);
      const logisticsInformation = ref<IDetailItem[]>([]);
      const otherInformation = ref<IDetailItem[]>([]);

      const options: Partial<ITableOptions> = {
        height: 'calc(100vh - 28px - 322px)',
        useScrolling: true,
        page: {
          size: 20,
        },
      };
      const tableOptions = ref<ITableOptions>(deepMerge(cloneDeep(defaultTableOptions), options));
      const dataSource = ref();
      const columns = ref<IColumnItem[]>([]);

      const onRefresh = () => {
        getData();
      };

      const onSubmitClick = () => {
        ShippingOrderApi.onShippingOrderSubmit([formData.value.GatheringParentCode]).then(() => {
          onRefresh();
        });
      };

      const onApplyClick = () => {
        ShippingOrderApi.onShippingOrderApply([formData.value.GatheringParentCode]).then(() => {
          onRefresh();
        });
      };

      const onPushClick = () => {
        ShippingOrderApi.onShippingOrderPush([formData.value.GatheringParentCode]).then(() => {
          onRefresh();
        });
      };

      const onRedraftClick = () => {
        ShippingOrderApi.onShippingOrderRedraft([formData.value.GatheringParentCode]).then(() => {
          onRefresh();
        });
      };

      const onRevokeClick = () => {
        ShippingOrderApi.onShippingOrderRevoke([formData.value.GatheringParentCode]).then(() => {
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

      const handleHeight = (index: number) => {
        nextTick(() => {
          if (!multiViewItems.value[index].height && opened.value) {
            multiViewItems.value[index].height = formBox.value.offsetHeight + 'px';
          }
          tableOpenedHeight = `calc(100vh - ${multiViewItems.value[index].height} - 322px)`;
          if (opened.value) {
            tableOptions.value.height = tableOpenedHeight;
          } else {
            tableOptions.value.height = tableCloseHeight;
          }
        });
      };

      const getData = () => {
        getDetailData(['Id', '=', Id]).then((res) => {
          if (res) {
            const { baseList, receiverList, logisticsList, otherList, data } = res;
            formData.value = data;
            baseInformation.value = baseList;
            receiverInformation.value = receiverList;
            logisticsInformation.value = logisticsList;
            otherInformation.value = otherList;
            handleHeight(0);
          }
        });
        getDefiniteData(tableOptions.value, ['ShippingOrderId', '=', Id]).then((res) => {
          if (res) {
            columns.value = res.columns;
            dataSource.value = res.data;
          }
        });
      };

      watch(selectedIndex, (val) => {
        handleHeight(val);
      });

      getData();

      return {
        baseInformation,
        receiverInformation,
        logisticsInformation,
        otherInformation,
        columns,
        selectedIndex,
        formBox,
        opened,
        multiViewItems,
        multiEntityItems,
        dropButtonItems,
        formData,
        dataSource,
        tableOptions,
        tableOpenedHeight,
        tableCloseHeight,
        onSubmitClick,
        onApplyClick,
        onPushClick,
        onItemButtonClick,
        onRefresh,
        onChangeOpened,
      };
    },
  });
</script>

<style lang="less">
  .detail {
    overflow: hidden;

    .tab-panel {
      position: relative;
      display: flex;
      flex-direction: column;
      background-color: #fff;
      &:last-child {
        flex: 1;
        margin-top: 10px;
      }
    }

    .tab {
      padding: 8px 20px;
      background-color: #fff;
    }
    .btn-box {
      display: flex;
      justify-content: flex-end;
      flex-wrap: wrap;
      width: 100%;
      padding: 5px 5px 0;
      & > * {
        margin-left: 10px;
      }
    }
    .form-box {
      padding: 0 20px;
      overflow: hidden;
    }
    .icon-box {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      padding-top: 8px;
      .icon {
        cursor: pointer;
        transform: rotate(0);
        transition: transform 500ms;
        &--translate {
          transform: rotate(-180deg);
          transition: transform 500ms;
        }
      }
    }

    .dx-layout-manager .dx-field-item:not(.dx-first-row) {
      padding-top: 8px;
    }

    .dx-widget {
      font-size: 12px;
    }

    .dx-box-item-content {
      font-size: 12px;
    }

    .dx-texteditor-input {
      min-height: 0;
      padding: 5px 9px 5px;
    }

    .dx-button-has-text .dx-button-content {
      padding: 0;
    }

    .dx-button-has-icon .dx-button-content {
      padding: 0;
    }

    .dx-layout-manager .dx-label-h-align .dx-field-item-content .dx-checkbox,
    .dx-layout-manager .dx-label-h-align .dx-field-item-content .dx-switch {
      margin: 0;
    }
  }
</style>
