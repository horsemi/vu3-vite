<template>
  <div class="detail">
    <div class="tab-panel">
      <div class="btn-box">
        <DxButton :width="76" text="保存" type="default" />
        <DxDropDownButton :width="80" text="提交" />
        <DxDropDownButton :width="80" text="审核" />
        <DxButton :width="76" text="刷新" />
      </div>
      <DxTabPanel
        ref="tabPanel"
        v-model:selected-index="selectedIndex"
        :data-source="multiViewItems"
        :loop="true"
        :animation-enabled="true"
        :swipe-enabled="true"
        :focus-state-enabled="false"
      >
        <template #item="{ data }">
          <div class="tab">
            <div
              ref="formBox"
              class="form-box"
              :style="{ maxHeight: opened ? '50vh' : closeHeight + 'px' }"
            >
              <DetailForm
                :form-data="formData"
                :form-list="
                  data.title === '基本信息'
                    ? baseInformation
                    : data.title === '收货人信息'
                    ? consigneeInformation
                    : data.title === '物流信息'
                    ? logisticsInformation
                    : data.title === '其他信息'
                    ? otherInformation
                    : ''
                "
              />
            </div>
            <div class="icon-box">
              <SvgIcon
                :class="['icon', opened && 'icon--translate']"
                size="16"
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
        <DxButton :width="76" text="新增" type="default" />
        <DxButton :width="76" text="删除" />
      </div>
      <DxTabPanel
        class="table-wrap"
        :data-source="multiEntityItems"
        :loop="true"
        :animation-enabled="true"
        :swipe-enabled="true"
        :focus-state-enabled="false"
      >
        <template #item>
          <div class="tab">
            <OdsTable
              class="ods-table"
              :table-options="tableOptions"
              :data-source="dataSource"
              :columns="columns"
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
import type { IDetailItem } from '/@/utils/detail/types';

import { defineComponent, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { cloneDeep } from 'lodash-es';

import { defaultTableOptions } from '/@/components/Table/common';
import { deepMerge } from '/@/utils';
import { getDetailData, getDefiniteData, customDefinite } from './index';

import DxTabPanel from 'devextreme-vue/tab-panel';
import DxButton from 'devextreme-vue/button';
import DxDropDownButton from 'devextreme-vue/drop-down-button';

import DetailForm from '/@/components/DetailForm/index.vue';

export default defineComponent({
  components: {
    DxTabPanel,
    DxButton,
    DxDropDownButton,
    DetailForm,
  },
  setup() {
    const opened = ref(true);
    const multiViewItems = [
      {
        title: '基本信息',
      },
      {
        title: '收货人信息',
      },
      {
        title: '物流信息',
      },
      {
        title: '其他信息',
      },
    ];
    const multiEntityItems = [
      {
        title: '明细信息',
      },
    ];
    const tableData = [];
    const closeHeight = 36;
    const formBox = ref();
    const tabPanel = ref();
    const selectedIndex = ref(0);
    let tableOpenedHeight = '';
    const tableCloseHeight = 'calc(100vh - 36px - 370px)';

    const route = useRoute();
    const Id = parseInt(route.query.Id as string);
    const formData = ref();
    const baseInformation = ref<IDetailItem[]>();
    const consigneeInformation = ref<IDetailItem[]>();
    const logisticsInformation = ref<IDetailItem[]>();
    const otherInformation = ref<IDetailItem[]>();

    const options: Partial<ITableOptions> = {
      useScrolling: true,
      page: {
        size: 10,
      },
    };
    const tableOptions = ref<ITableOptions>(deepMerge(cloneDeep(defaultTableOptions), options));
    const dataSource = ref();
    const columns = customDefinite;

    const getTableHeight = () => {
      tableOpenedHeight = `calc(100vh - ${tabPanel.value.$el.offsetHeight}px - 250px)`;
      if (opened.value) {
        tableOptions.value.height = tableOpenedHeight;
      } else {
        tableOptions.value.height = tableCloseHeight;
      }
    };
    const onChangeOpened = () => {
      opened.value = !opened.value;
      getTableHeight();
    };

    watch(selectedIndex, () => {
      getTableHeight();
    });

    onMounted(async () => {
      const detailData = await getDetailData(['Id', '=', Id]);
      if (!detailData) return;
      const { baseList, consigneeList, logisticsList, otherList, data } = detailData;
      formData.value = data;
      baseInformation.value = baseList;
      consigneeInformation.value = consigneeList;
      logisticsInformation.value = logisticsList;
      otherInformation.value = otherList;
      getTableHeight();
      dataSource.value = await getDefiniteData(tableOptions.value, ['ShippingOrderId', '=', Id]);
    });

    return {
      baseInformation,
      consigneeInformation,
      logisticsInformation,
      otherInformation,
      columns,
      selectedIndex,
      formBox,
      tabPanel,
      opened,
      multiViewItems,
      multiEntityItems,
      tableData,
      closeHeight,
      formData,
      dataSource,
      tableOptions,
      tableOpenedHeight,
      tableCloseHeight,
      onChangeOpened,
    };
  },
});
</script>

<style lang="less" scoped>
.detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .tab-panel {
    position: relative;
    display: flex;
    flex-direction: column;
    padding-top: 10px;
    background-color: #fff;
    &:last-child {
      flex: 1;
      margin-top: 20px;
    }
  }

  .tab {
    padding: 20px;
    background-color: #fff;
  }
  .btn-box {
    position: absolute;
    top: 0;
    right: 20px;
    z-index: 100;
    display: flex;
    align-items: center;
    height: 54px;
    & > * {
      margin-left: 10px;
    }
  }
  .form-box {
    padding: 0 20px;
    overflow: hidden;
    transition: all 500ms ease-in-out;
  }
  .icon-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding-top: 20px;
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
  .table-wrap {
    flex: 1;
  }
  .ods-table {
    height: 100%;
  }
}
</style>
