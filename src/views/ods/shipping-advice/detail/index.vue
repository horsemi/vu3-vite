<template>
  <div class="detail">
    <div class="tab-panel">
      <div class="btn-box">
        <DxButton :width="56" :height="26" type="default" text="提交" @click="onSubmitClick" />
        <DxButton :width="56" :height="26" text="审核" @click="onApplyClick" />
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
                    : data.title === '作业信息'
                    ? taskInformation
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
  import type { IDetailItem } from '/@/utils/detail/types';

  import { defineComponent, nextTick, onMounted, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { cloneDeep } from 'lodash-es';

  import { defaultTableOptions } from '/@/components/Table/common';
  import { deepMerge } from '/@/utils';
  import { ShippingOrderApi } from '/@/api/ods/shipping-orders';
  import { getDetailData, getDefiniteData, customDefinite } from './index';

  import DxTabPanel from 'devextreme-vue/tab-panel';
  import DxButton from 'devextreme-vue/button';

  import DetailForm from '/@/components/DetailForm/index.vue';

  export default defineComponent({
    name: 'OdsShippingOrderDetail',
    components: {
      DxTabPanel,
      DxButton,
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
          title: '作业信息',
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

      const opened = ref(true);
      const selectedIndex = ref(0);
      const formBox = ref();
      let tableOpenedHeight = '';
      const tableCloseHeight = 'calc(100vh - 28px - 260px)';

      const route = useRoute();
      const Id = parseInt(route.query.Id as string);
      const formData = ref();
      const baseInformation = ref<IDetailItem[]>([]);
      const receiverInformation = ref<IDetailItem[]>([]);
      const logisticsInformation = ref<IDetailItem[]>([]);
      const taskInformation = ref<IDetailItem[]>([]);
      const otherInformation = ref<IDetailItem[]>([]);

      const options: Partial<ITableOptions> = {
        height: 'calc(100vh - 28px - 260px)',
        useScrolling: true,
        showBorders: false,
        page: {
          size: 10,
        },
      };
      const tableOptions = ref<ITableOptions>(deepMerge(cloneDeep(defaultTableOptions), options));
      const dataSource = ref();
      const columns = customDefinite;

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

      const onChangeOpened = () => {
        opened.value = !opened.value;
        handleHeight(selectedIndex.value);
      };

      const handleHeight = (index: number) => {
        nextTick(() => {
          if (!multiViewItems.value[index].height && opened.value) {
            multiViewItems.value[index].height = formBox.value.offsetHeight + 'px';
          }
          tableOpenedHeight = `calc(100vh - ${multiViewItems.value[index].height} - 260px)`;
          if (opened.value) {
            tableOptions.value.height = tableOpenedHeight;
          } else {
            tableOptions.value.height = tableCloseHeight;
          }
        });
      };

      const getData = async () => {
        getDefiniteData(tableOptions.value, ['ShippingOrderId', '=', Id]).then((res) => {
          dataSource.value = res;
        });
        const detailData = await getDetailData(['Id', '=', Id]);
        if (!detailData) return;
        const { baseList, receiverList, logisticsList, taskList, otherList, data } = detailData;
        formData.value = data;
        baseInformation.value = baseList;
        receiverInformation.value = receiverList;
        logisticsInformation.value = logisticsList;
        taskInformation.value = taskList;
        otherInformation.value = otherList;
        handleHeight(0);
      };

      watch(selectedIndex, (val) => {
        handleHeight(val);
      });

      onMounted(async () => {
        await getData();
      });

      return {
        baseInformation,
        receiverInformation,
        logisticsInformation,
        taskInformation,
        otherInformation,
        columns,
        selectedIndex,
        formBox,
        opened,
        multiViewItems,
        multiEntityItems,
        formData,
        dataSource,
        tableOptions,
        tableOpenedHeight,
        tableCloseHeight,
        onSubmitClick,
        onApplyClick,
        onRefresh,
        onChangeOpened,
      };
    },
  });
</script>

<style lang="less">
  .detail {
    flex: 1;
    display: flex;
    flex-direction: column;
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
      position: absolute;
      top: 0;
      right: 20px;
      z-index: 100;
      display: flex;
      align-items: center;
      height: 36px;
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
      padding-top: 8px !important;
    }

    .dx-widget {
      font-size: 12px !important;
    }

    .dx-box-item-content {
      font-size: 12px !important;
    }

    .dx-texteditor-input {
      min-height: 0 !important;
      padding: 5px 9px 5px !important;
    }

    .dx-button-has-text .dx-button-content {
      padding: 0 !important;
    }

    .dx-layout-manager .dx-label-h-align .dx-field-item-content .dx-checkbox,
    .dx-layout-manager .dx-label-h-align .dx-field-item-content .dx-switch {
      margin: 0 !important;
    }

    .dx-datagrid-table .dx-freespace-row > td {
      // 去掉空余空间的边框，当指定表格高度时，会出现这个占满空余空间
      border: none !important;
    }
  }
</style>
