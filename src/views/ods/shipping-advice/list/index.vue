<template>
  <div :class="prefixCls">
    <QueryPlan v-loading="planLoading" />
    <div v-loading="tableLoading" class="table__container">
      <div class="operation-btn__container">
        <div class="operation-btn__inner">
          <DxButton
            :width="76"
            text="提交"
            :disabled="!permissionStore.hasPermission(shippingAdviceType.shippingAdviceSumit)"
            type="default"
            @click="onSubmitClick"
          />
          <DxButton
            :width="76"
            text="审核"
            :disabled="!permissionStore.hasPermission(shippingAdviceType.shippingAdviceApply)"
            @click="onApplyClick"
          />
          <DxButton
            text="导出"
            icon="download"
            :disabled="!permissionStore.hasPermission(shippingAdviceType.shippingAdviceExport)"
            @click="onExport"
          />
        </div>
        <div class="operation-btn__inner">
          <SummaryButton
            :order-code="ORDER_CODE"
            :all-columns="allColumns"
            :scheme="filterScheme"
            :odata-params="odataParams"
          />
          <DxButton
            icon="refresh"
            :disabled="!permissionStore.hasPermission(shippingAdviceType.shippingAdviceQueryList)"
            text="刷新"
            @click="onRefresh"
          />
        </div>
      </div>
      <OdsTable
        ref="dataGrid"
        height="calc(100vh - 276px)"
        :order-code="ORDER_CODE"
        :query-list-permission="shippingAdviceType.shippingAdviceQueryList"
        :all-columns="allColumns"
        :filter-scheme="filterScheme"
        :table-key="tableKey"
        @handle-bill-code-click="handleBillCodeClick"
        @onLoad="tableLoading = true"
        @onLoaded="tableLoading = false"
      >
      </OdsTable>
    </div>
  </div>
</template>

<script lang="ts">
  import type { IColumnItem } from '/@/model/types';
  import type { ISchemeItem } from '/@/components/QueryPopup/content/types';
  import type { ISchemeData } from '/@/components/QueryPlan/types';

  import { defineComponent, ref, provide, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { cloneDeep } from 'lodash-es';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { usePermissionStore } from '/@/store/modules/permission';
  import { shippingAdviceType } from '/@/enums/actionPermission/shipping-advice';
  import { relationShips } from '/@/model/entity/shipping-advices';
  import { isArrayEmpty } from '/@/utils/bill/index';
  import { initEntityColumn } from '/@/utils/bill/relationship';
  import { ShippingAdviceApi } from '/@/api/ods/shipping-advices';
  import { getSchemesData } from '/@/utils/scheme/index';
  import { ExportApi } from '/@/api/export';

  import DxButton from 'devextreme-vue/button';

  import QueryPlan from '/@/components/QueryPlan/index.vue';
  import SummaryButton from '/@/components/SummaryButton/index.vue';
  import { odsMessage } from '/@/components/Message';

  export default defineComponent({
    name: 'OdsShippingAdviceList',
    components: {
      QueryPlan,
      SummaryButton,
      DxButton,
    },
    setup() {
      const { prefixCls } = useDesign('ods-shipping-advice-list');
      const router = useRouter();
      const permissionStore = usePermissionStore();

      const dataGrid = ref();
      const tableLoading = ref(true);
      const planLoading = ref(true);

      const ORDER_CODE = 'shipping-advices';
      const filterScheme = ref<ISchemeItem>();
      const tableKey = ref<string[]>([]);
      const allColumns = ref<IColumnItem[]>([]);

      const schemeData = ref<ISchemeData>({
        scheme: [],
        checkedIndex: 0,
      });
      const schemeDataTemp = ref<ISchemeData>({
        scheme: [],
        checkedIndex: 0,
      });
      const schemeDefaultIndex = ref<number>(0);
      const schemeQuickIndex = ref<number>(0);

      const odataParams = computed(() => {
        return dataGrid.value && dataGrid.value.odataParams;
      });

      const onRefresh = () => {
        tableLoading.value = true;
        dataGrid.value.search();
      };

      const onExport = () => {
        const templateModels = dataGrid.value.tableColumns.map((item) => {
          return {
            name: item.key,
            title: item.caption,
          };
        });
        ExportApi.reportExport({ queryParameter: odataParams.value, templateModels }).then(() => {
          odsMessage({
            type: 'success',
            dangerouslyUseHTMLString: true,
            message:
              '<strong>导出任务已添加 <a style="color: #52c41a; text-decoration: underline;" href="#/basic-management/export-configuration/export/list">请点击查看</a> </strong>',
          });
        });
      };

      const handleBillCodeClick = (data) => {
        router.push({
          name: 'OdsShippingAdviceDetail',
          query: {
            Id: data.data.Id,
            BillCode: data.data.BillCode,
          },
        });
      };

      const onSubmitClick = () => {
        const selectionData = dataGrid.value.getSelectedRowsData() as {
          GatheringParentCode: string;
        }[];
        if (isArrayEmpty(selectionData)) {
          tableLoading.value = true;
          ShippingAdviceApi.onShippingAdviceSubmit(
            selectionData.map((item) => item.GatheringParentCode)
          )
            .then(() => {
              tableLoading.value = false;
              onRefresh();
            })
            .catch(() => {
              tableLoading.value = false;
            });
        }
      };

      const onApplyClick = () => {
        const selectionData = dataGrid.value.getSelectedRowsData() as {
          GatheringParentCode: string;
        }[];
        if (isArrayEmpty(selectionData)) {
          tableLoading.value = true;
          ShippingAdviceApi.onShippingAdviceApply(
            selectionData.map((item) => item.GatheringParentCode)
          )
            .then(() => {
              tableLoading.value = false;
              onRefresh();
            })
            .catch(() => {
              tableLoading.value = false;
            });
        }
      };

      const onChangeScheme = (data: ISchemeItem) => {
        tableLoading.value = true;
        filterScheme.value = cloneDeep(data);
      };

      /**
       * @description 根据关联实体获取字段
       */
      const initEntityColumnHandle = (
        scheme: ISchemeItem = schemeData.value.scheme[schemeData.value.checkedIndex]
      ): Promise<void> => {
        return new Promise((resolve) => {
          initEntityColumn(scheme, relationShips).then(({ _allColumns, _tableKey }) => {
            tableKey.value = _tableKey;
            allColumns.value = _allColumns;
            resolve();
          });
        });
      };

      const getTableData = async () => {
        const schemeResult = await getSchemesData(ORDER_CODE);
        initEntityColumnHandle(schemeResult.scheme[schemeResult.checkedIndex]).then(() => {
          schemeData.value.checkedIndex = schemeResult.checkedIndex;
          schemeData.value.scheme = schemeResult.scheme;
          schemeDataTemp.value = cloneDeep(schemeData.value);
          schemeDefaultIndex.value = schemeData.value.checkedIndex;
          schemeQuickIndex.value = schemeData.value.checkedIndex;
          filterScheme.value = schemeData.value.scheme[schemeData.value.checkedIndex];
          planLoading.value = false;
        });
      };

      getTableData();

      provide('allColumns', allColumns);
      provide('schemeData', schemeData);
      provide('schemeDataTemp', schemeDataTemp);
      provide('schemeDefaultIndex', schemeDefaultIndex);
      provide('schemeQuickIndex', schemeQuickIndex);
      provide('onChangeScheme', onChangeScheme);
      provide('initEntityColumnHandle', initEntityColumnHandle);
      provide('relationShips', relationShips);

      return {
        prefixCls,
        ORDER_CODE,
        tableLoading,
        planLoading,
        dataGrid,
        tableKey,
        allColumns,
        filterScheme,
        odataParams,
        handleBillCodeClick,
        onSubmitClick,
        onApplyClick,
        onRefresh,
        onExport,
        shippingAdviceType,
        permissionStore,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-ods-shipping-advice-list';

  .@{prefix-cls} {
    overflow: hidden;

    .table__container {
      width: 100%;
      padding: 16px;
      padding-bottom: 0;
      background-color: #fff;

      .operation-btn__container {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-bottom: 16px;

        .operation-btn__inner {
          & > * {
            margin-right: 8px;
          }
          :nth-last-child(1) {
            margin-right: 0;
          }
        }
      }
    }
  }
</style>
