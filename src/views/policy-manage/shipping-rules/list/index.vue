<template>
  <div :class="prefixCls">
    <QueryPlan v-loading="planLoading" />
    <div v-loading="tableLoading" class="table__container">
      <div class="operation-btn__container">
        <div class="operation-btn__inner">
          <DxButton
            :width="76"
            text="新增"
            :disabled="!permissionStore.hasPermission(shippingRuleType.shippingRuleCreate)"
            type="default"
            @click="onAddClickFn"
          />
          <DxButton
            :width="76"
            text="删除"
            :disabled="!permissionStore.hasPermission(shippingRuleType.shippingRuleDelete)"
            @click="onDeleteClick"
          />
          <DxButton
            :width="76"
            text="生效"
            :disabled="!permissionStore.hasPermission(shippingRuleType.shippingRuleSwitch)"
            @click="onSwitchClick(true)"
          />
          <DxButton
            :width="76"
            text="失效"
            :disabled="!permissionStore.hasPermission(shippingRuleType.shippingRuleSwitch)"
            @click="onSwitchClick(false)"
          />
          <DxButton
            :width="76"
            text="导出"
            :disabled="!permissionStore.hasPermission(shippingRuleType.shippingRuleExport)"
            @click="onExportClick"
          />
          <DxButton
            :width="76"
            text="导入"
            :disabled="!permissionStore.hasPermission(shippingRuleType.shippingRuleImport)"
            @click="onImportClick"
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
            :width="100"
            icon="refresh"
            :disabled="!permissionStore.hasPermission(shippingRuleType.shippingRuleQueryList)"
            text="刷新"
            @click="onRefresh"
          />
        </div>
      </div>
      <OdsTable
        ref="dataGrid"
        height="calc(100vh - 276px)"
        :order-code="ORDER_CODE"
        :query-list-permission="shippingRuleType.shippingRuleQueryList"
        system-code="policy-manage"
        :all-columns="allColumns"
        :filter-scheme="filterScheme"
        :table-key="tableKey"
        @handle-bill-code-click="handleBillCodeClick"
        @onLoad="tableLoading = true"
        @onLoaded="tableLoading = false"
      >
      </OdsTable>
    </div>
    <input
      ref="fileUploadInput"
      style="display: none"
      accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      type="file"
      @change="uploadHandle"
    />
  </div>
</template>

<script lang="ts">
  import type { IColumnItem } from '/@/model/types';
  import type { ISchemeItem } from '/@/components/QueryPopup/content/types';
  import type { ITableOptions } from '/@/components/Table/types';
  import type { ISchemeData } from '/@/components/QueryPlan/types';

  import { defineComponent, ref, onActivated, provide, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { cloneDeep } from 'lodash-es';
  import { deepMerge } from '/@/utils';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { usePermissionStore } from '/@/store/modules/permission';
  import { shippingRuleType } from '/@/enums/actionPermission/shipping-rules';
  import { relationShips } from '/@/model/entity/shipping-rules';
  import { isArrayEmpty } from '/@/utils/bill/index';
  import { initEntityColumn } from '/@/utils/bill/relationship';
  import { ShippingRulesApi } from '/@/api/policy-manage/shipping-rules';
  import { getSchemesData } from '/@/utils/scheme/index';
  import { getOdataQuery } from '/@/utils/odata';
  import { getOdsListUrlByCode } from '/@/api/ods/common';
  import { defaultTableOptions } from '/@/components/Table/common';

  import DxButton from 'devextreme-vue/button';

  import QueryPlan from '/@/components/QueryPlan/index.vue';
  import SummaryButton from '/@/components/SummaryButton/index.vue';
  import { odsMessage } from '/@/components/Message';

  export default defineComponent({
    name: 'PolicyManageShippingRulesList',
    components: {
      QueryPlan,
      SummaryButton,
      DxButton,
    },
    setup() {
      const { prefixCls } = useDesign('policy-shipping-rule-list');
      const router = useRouter();
      const permissionStore = usePermissionStore();

      const dataGrid = ref();
      const fileUploadInput = ref();
      const tableLoading = ref(true);
      const planLoading = ref(true);

      const ORDER_CODE = 'shipping-rules';
      const option: Partial<ITableOptions> = {
        height: 'calc(100vh - 276px)',
        dataSourceOptions: {
          oDataOptions: {
            url: getOdsListUrlByCode(ORDER_CODE, 'policy-manage'),
          },
        },
      };
      const options = computed(() => {
        return deepMerge(cloneDeep(defaultTableOptions), option);
      });
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

      const handleBillCodeClick = (data) => {
        router.push({
          name: 'PolicyManageShippingRulesDetail',
          query: {
            Id: data.data.Id,
          },
        });
      };

      const onAddClickFn = () => {
        router.push({
          name: 'PolicyManageShippingRulesDetail',
          query: {
            Id: '',
          },
        });
      };

      const onDeleteClick = () => {
        const selectionData = dataGrid.value.getSelectedRowsData();
        if (isArrayEmpty(selectionData)) {
          tableLoading.value = true;
          ShippingRulesApi.onShippingRulesDelete(selectionData.map((item) => item.Id))
            .then(() => {
              odsMessage({
                type: 'success',
                message: '操作成功',
              });
              onRefresh();
            })
            .catch(() => {
              onRefresh();
            })
            .finally(() => {
              tableLoading.value = false;
            });
        }
      };

      const onSwitchClick = (switchStatus: boolean) => {
        const selectionData = dataGrid.value.getSelectedRowsData();
        if (isArrayEmpty(selectionData)) {
          tableLoading.value = true;
          ShippingRulesApi.onShippingRulesSwitch({
            ids: selectionData.map((item) => item.Id),
            isEnabled: switchStatus,
          })
            .then(() => {
              odsMessage({
                type: 'success',
                message: '操作成功',
              });
              onRefresh();
            })
            .catch(() => {
              onRefresh();
            })
            .finally(() => {
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

      const onExportClick = () => {
        ShippingRulesApi.onShippingRulesExport(
          getOdataQuery({
            scheme: filterScheme.value,
            allColumns: allColumns.value,
            defaultSort: options.value.dataSourceOptions.sort,
            tableKey: ['Id'],
          })
        ).then(() => {
          odsMessage({
            type: 'success',
            title: '导出成功',
            dangerouslyUseHTMLString: true,
            message: '<a href="#/basic-management/export-configuration/export/list">请点击查看</a>',
          });
        });
      };

      const onImportClick = () => {
        fileUploadInput.value.value = null;
        fileUploadInput.value.click();
      };

      const uploadHandle = (ev: DragEvent) => {
        const files = (ev.target as HTMLInputElement).files;
        let postFiles = Array.prototype.slice.call(files);

        ShippingRulesApi.onShippingRulesImport(postFiles[0]).then(() => {
          odsMessage({
            type: 'success',
            message: '导出成功',
          });
          onRefresh();
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

      onActivated(() => {
        onRefresh();
      });

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
        fileUploadInput,
        tableKey,
        allColumns,
        filterScheme,
        odataParams,
        handleBillCodeClick,
        onAddClickFn,
        onDeleteClick,
        onSwitchClick,
        onImportClick,
        onExportClick,
        onRefresh,
        shippingRuleType,
        uploadHandle,
        permissionStore,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-policy-shipping-rule-list';

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
