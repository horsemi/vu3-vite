<template>
  <div class="list">
    <QueryPlan
      ref="queryPlan"
      :order-code="ORDER_CODE"
      :all-columns="allColumns"
      :scheme-data="schemeData"
      :scheme-checked-index="schemeCheckedIndex"
      @on-change-scheme="onChangeScheme"
    />
    <div v-loading="loading" class="example">
      <div class="btn__wrap">
        <div class="btn__box">
          <DxButton :width="76" text="新增" type="default" @click="onAddClickFn" />
          <DxButton :width="76" text="删除" @click="onDeleteClickThrottleFn" />
          <DxButton :width="76" text="生效" @click="onSwitchClickThrottleFn(true)" />
          <DxButton :width="76" text="失效" @click="onSwitchClickThrottleFn(false)" />
          <DxButton :width="76" text="导出" @click="onExportClickThrottleFn" />
          <DxButton :width="76" text="导入" @click="onImportClickThrottleFn" />
        </div>
        <div class="btn__box">
          <DxButton :width="100" icon="refresh" text="刷新" @click="onRefresh" />
        </div>
      </div>
      <OdsTable
        ref="dataGrid"
        :table-options="option"
        :data-source="dataSource"
        :order-code="ORDER_CODE"
        system-code="policy-manage"
        :columns="columns"
        :all-columns="allColumns"
        :filter-scheme="filterScheme"
        :table-key="tableKey"
        :table-key-type="tableKeyType"
        @handle-bill-code-click="handleBillCodeClick"
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
  import type { IColumnItem, IKeyType } from '/@/model/types';
  import type { ISchemeItem } from '/@/components/QueryPopup/content/types';
  import type { ITableOptions } from '/@/components/Table/types';
  import type { ISchemeData } from '/@/components/QueryPlan/types';
  import { DEFAULT_THROTTLE_TIME } from '/@/settings/encryptionSetting';
  import { ShippingRulesApi } from '/@/api/policy-manage/shipping-rules';

  import { defineComponent, ref, onActivated, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { cloneDeep } from 'lodash-es';
  import { deepMerge } from '/@/utils';
  import { useThrottleFn } from '@vueuse/core';
  import { defaultTableOptions } from '/@/components/Table/common';
  import { getOdataQuery } from '/@/utils/odata';

  import { getColumns } from '/@/model/shipping-rules';
  import { isArrayEmpty } from '/@/utils/bill/index';
  import { getOdsListUrlByCode } from '/@/api/ods/common';
  import { getSchemesData } from '/@/utils/scheme/index';

  import DxButton from 'devextreme-vue/button';

  import QueryPlan from '/@/components/QueryPlan/index.vue';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'PolicyManageShippingRulesList',
    components: {
      QueryPlan,
      DxButton,
    },
    setup() {
      const router = useRouter();

      const dataGrid = ref();
      const queryPlan = ref();
      const fileUploadInput = ref();
      const loading = ref(false);

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
      const tableKeyType = ref<IKeyType[]>([]);
      const dataSource = ref();
      const columns = ref<IColumnItem[]>([]);
      const allColumns = ref<IColumnItem[]>([]);
      const schemeData = ref<ISchemeData>({
        scheme: [],
        checkedIndex: 0,
      });
      const schemeCheckedIndex = ref<number>(0);

      const onRefresh = () => {
        dataGrid.value.search();
      };

      const handleBillCodeClick = (data) => {
        router.push({
          name: 'PolicyManageShippingRulesDetail',
          query: {
            Id: data.data.Id,
            RuleCode: data.data.RuleCode,
          },
        });
      };

      const onAddClickFn = () => {
        router.push({
          name: 'PolicyManageShippingRulesDetail',
          query: {
            Id: '',
            RuleCode: '',
          },
        });
      };

      const onDeleteClick = () => {
        const selectionData = dataGrid.value.getSelectedRowsData();
        if (isArrayEmpty(selectionData)) {
          loading.value = true;
          ShippingRulesApi.onShippingRulesDelete(selectionData.map((item) => item.Id))
            .then(() => {
              useMessage('操作成功', 'success');
              onRefresh();
            })
            .catch(() => {
              onRefresh();
            })
            .finally(() => {
              loading.value = false;
            });
        }
      };

      const onSwitchClick = (switchStatus: boolean) => {
        const selectionData = dataGrid.value.getSelectedRowsData();
        if (isArrayEmpty(selectionData)) {
          loading.value = true;
          ShippingRulesApi.onShippingRulesSwitch({
            ids: selectionData.map((item) => item.Id),
            isEnabled: switchStatus,
          })
            .then(() => {
              useMessage('操作成功', 'success');
              onRefresh();
            })
            .catch(() => {
              onRefresh();
            })
            .finally(() => {
              loading.value = false;
            });
        }
      };

      const onExportClick = () => {
        ShippingRulesApi.onShippingRulesExport(
          getOdataQuery(
            options.value,
            filterScheme.value as ISchemeItem,
            allColumns.value,
            tableKey.value
          )
        ).then(() => {
          useMessage(
            '<a href="#/basic-management/export-configuration/export/list">请点击查看</a>',
            'success',
            '导出成功',
            true
          );
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
          useMessage('导入成功', 'success');
          onRefresh();
        });
      };

      const onDeleteClickThrottleFn = useThrottleFn(onDeleteClick, DEFAULT_THROTTLE_TIME);

      const onSwitchClickThrottleFn = useThrottleFn(onSwitchClick, DEFAULT_THROTTLE_TIME);

      const onExportClickThrottleFn = useThrottleFn(onExportClick, DEFAULT_THROTTLE_TIME);

      const onImportClickThrottleFn = useThrottleFn(onImportClick, DEFAULT_THROTTLE_TIME);

      const onChangeScheme = (data: ISchemeItem) => {
        filterScheme.value = cloneDeep(data);
        onRefresh();
      };

      const getTableData = async () => {
        const schemeResult = await getSchemesData(ORDER_CODE);

        schemeData.value.checkedIndex = schemeResult.checkedIndex;
        schemeData.value.scheme = schemeResult.scheme;
        schemeCheckedIndex.value = schemeData.value.checkedIndex;
        const scheme = cloneDeep(schemeData.value.scheme[schemeCheckedIndex.value]);

        const fast = scheme && scheme.fast ? scheme.fast : [];
        if (fast.length > 0) {
          scheme.requirement.push(...fast);
        }
        getColumns().then((res) => {
          if (res) {
            const { columnList, key, keyType } = res;
            allColumns.value = columnList;
            filterScheme.value = scheme;
            tableKey.value = key;
            tableKeyType.value = keyType;
          }
        });
        queryPlan.value.handleData();
      };

      onMounted(() => {
        getTableData();
      });

      onActivated(() => {
        onRefresh();
      });

      return {
        ORDER_CODE,
        loading,
        dataGrid,
        fileUploadInput,
        queryPlan,
        option,
        options,
        tableKey,
        tableKeyType,
        dataSource,
        columns,
        allColumns,
        schemeData,
        filterScheme,
        schemeCheckedIndex,
        handleBillCodeClick,
        onChangeScheme,
        onAddClickFn,
        onRefresh,
        onDeleteClickThrottleFn,
        onSwitchClickThrottleFn,
        onExportClickThrottleFn,
        onImportClickThrottleFn,
        uploadHandle,
      };
    },
  });
</script>

<style lang="less" scoped>
  .list {
    overflow: hidden;
  }

  .example {
    width: 100%;
    padding: 16px;
    padding-bottom: 0;
    background-color: #fff;
    .btn__wrap {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 16px;
      .btn__box {
        & > * {
          margin-right: 8px;
        }
        :nth-last-child(1) {
          margin-right: 0;
        }
      }
    }
  }
</style>
