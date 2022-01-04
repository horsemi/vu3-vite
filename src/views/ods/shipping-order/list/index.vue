<template>
  <div class="list">
    <QueryPlan />
    <div v-loading="loading" class="example">
      <div class="btn__wrap">
        <div class="btn__box">
          <DxButton
            :width="76"
            text="提交"
            :disabled="!permissionStore.hasPermission(shippingOrderType.shippingOrderSumit)"
            type="default"
            @click="onSubmitClick"
          />
          <DxButton
            :width="76"
            text="审核"
            :disabled="!permissionStore.hasPermission(shippingOrderType.shippingOrderApply)"
            @click="onApplyClick"
          />
        </div>
        <div class="btn__box">
          <SummaryButton
            :order-code="ORDER_CODE"
            :all-columns="allColumns"
            :scheme="filterScheme"
            :odata-params="odataParams"
          />
          <DxButton
            :width="100"
            icon="refresh"
            :disabled="!permissionStore.hasPermission(shippingOrderType.shippingOrderQueryList)"
            text="刷新"
            @click="onRefresh"
          />
        </div>
      </div>
      <OdsTable
        ref="dataGrid"
        :table-options="options"
        :order-code="ORDER_CODE"
        :data-source="dataSource"
        :columns="columns"
        :query-list-permission="shippingOrderType.shippingOrderQueryList"
        :all-columns="allColumns"
        :filter-scheme="filterScheme"
        :table-key="tableKey"
        @handle-bill-code-click="handleBillCodeClick"
      >
      </OdsTable>
    </div>
  </div>
</template>

<script lang="ts">
  import type { IColumnItem } from '/@/model/types';
  import type { ISchemeItem, IRelationShip } from '/@/components/QueryPopup/content/types';
  import type { ITableOptions } from '/@/components/Table/types';
  import type { ISchemeData } from '/@/components/QueryPlan/types';

  import { defineComponent, ref, provide, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { cloneDeep } from 'lodash-es';

  import { exceptSpareCriteriaFn } from '/@/utils/odata/index';
  import { usePermissionStore } from '/@/store/modules/permission';
  import { shippingOrderType } from '/@/enums/actionPermission/shipping-order';
  import { relationShips } from '/@/model/entity/shipping-orders';
  import { isArrayEmpty } from '/@/utils/bill/index';
  import { ShippingOrderApi } from '/@/api/ods/shipping-orders';
  import { getOdsListUrlByCode } from '/@/api/ods/common';
  import { getSchemesData } from '/@/utils/scheme/index';
  import { getColumnListByEntityCode } from '/@/model/index';

  import DxButton from 'devextreme-vue/button';

  import QueryPlan from '/@/components/QueryPlan/index.vue';
  import SummaryButton from '/@/components/SummaryButton/index.vue';

  export default defineComponent({
    name: 'OdsShippingOrderList',
    components: {
      QueryPlan,
      SummaryButton,
      DxButton,
    },
    setup() {
      const router = useRouter();
      const permissionStore = usePermissionStore();

      const dataGrid = ref();
      const loading = ref(false);

      const ORDER_CODE = 'shipping-orders';
      const options: Partial<ITableOptions> = {
        height: 'calc(100vh - 276px)',
        dataSourceOptions: {
          oDataOptions: {
            url: getOdsListUrlByCode(ORDER_CODE),
          },
        },
      };
      const filterScheme = ref<ISchemeItem>();
      const tableKey = ref<string>('');
      const dataSource = ref();
      const columns = ref<IColumnItem[]>([]);
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
        dataGrid.value.search();
      };

      const handleBillCodeClick = (data) => {
        router.push({
          name: 'OdsShippingOrderDetail',
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
          loading.value = true;
          ShippingOrderApi.onShippingOrderSubmit(
            selectionData.map((item) => item.GatheringParentCode)
          )
            .then(() => {
              loading.value = false;
              onRefresh();
            })
            .catch(() => {
              loading.value = false;
            });
        }
      };

      const onApplyClick = () => {
        const selectionData = dataGrid.value.getSelectedRowsData() as {
          GatheringParentCode: string;
        }[];
        if (isArrayEmpty(selectionData)) {
          loading.value = true;
          ShippingOrderApi.onShippingOrderApply(
            selectionData.map((item) => item.GatheringParentCode)
          )
            .then(() => {
              loading.value = false;
              onRefresh();
            })
            .catch(() => {
              loading.value = false;
            });
        }
      };

      const onChangeScheme = (data: ISchemeItem) => {
        filterScheme.value = cloneDeep(data);
      };

      /**
       * @description 过滤方案关联条件初始化
       */
      const initRelationShip = () => {
        const _relationShips: IRelationShip[] = [];

        relationShips.forEach((item) => {
          _relationShips.push({
            value: item.isMainEntity ? true : false,
            ...item,
          });
        });

        schemeData.value.scheme[schemeData.value.checkedIndex].relationShips = _relationShips;
      };

      /**
       * @description 根据关联实体获取字段
       */
      const initEntityColumn = (
        scheme: ISchemeItem = schemeData.value.scheme[schemeData.value.checkedIndex]
      ): Promise<ISchemeItem> => {
        return new Promise((resolve) => {
          exceptSpareCriteriaFn(scheme);

          getColumnListByEntityCode(
            // 根据过滤方案中的关联实体获取字段
            scheme.relationShips.map((item) => (item.value ? item.entityCode : ''))
          ).then((relationShipsResolve) => {
            let _allColumns: IColumnItem[] = [];

            // 组装实体字段，把实体名称与key组装到字段的名字与key当中
            schemeData.value.scheme[schemeData.value.checkedIndex].relationShips.forEach(
              (relationItem) => {
                if (relationItem.isMainEntity) {
                  tableKey.value = relationShipsResolve[relationItem.entityCode]!.key;
                }
                if (relationShipsResolve[relationItem.entityCode]) {
                  // 主实体字段不需要对key与expand进行实体名组装
                  if (relationItem.isMainEntity) {
                    _allColumns.push(
                      ...relationShipsResolve[relationItem.entityCode]!.columnList.map<IColumnItem>(
                        (item) => {
                          item.caption = `${relationItem.caption}_${item.caption}`;
                          item.entityKey = relationItem.entityCode;
                          item.foundationList &&
                            item.foundationList.forEach((foundationItem) => {
                              foundationItem.caption = `${relationItem.caption}_${foundationItem.caption}`;
                            });
                          return item;
                        }
                      )
                    );
                  } else {
                    _allColumns.push(
                      ...relationShipsResolve[relationItem.entityCode]!.columnList.map<IColumnItem>(
                        (item) => {
                          item.caption = `${relationItem.caption}_${item.caption}`;
                          item.entityKey = relationItem.entityCode;
                          item.key = `${relationItem.key}_${item.key}`;
                          item.expand && (item.expand = `${relationItem.key}_${item.expand}`);
                          item.relationKey &&
                            (item.relationKey = `${relationItem.key}_${item.relationKey}`);
                          item.foundationList &&
                            item.foundationList.forEach((foundationItem) => {
                              foundationItem.caption = `${relationItem.caption}_${foundationItem.caption}`;
                              foundationItem.key = `${relationItem.key}_${foundationItem.key}`;
                            });
                          return item;
                        }
                      )
                    );
                  }
                }
              }
            );

            allColumns.value = _allColumns;
            resolve(scheme);
          });
        });
      };

      const getTableData = async () => {
        const schemeResult = await getSchemesData(ORDER_CODE);

        schemeData.value.checkedIndex = schemeResult.checkedIndex;
        schemeData.value.scheme = schemeResult.scheme;
        schemeDataTemp.value = cloneDeep(schemeData.value);
        schemeDefaultIndex.value = schemeData.value.checkedIndex;
        schemeQuickIndex.value = schemeData.value.checkedIndex;

        if (!Array.isArray(schemeData.value.scheme[schemeDefaultIndex.value].relationShips)) {
          initRelationShip();
        }

        const scheme = cloneDeep(schemeData.value.scheme[schemeDefaultIndex.value]);

        const _fast = scheme.fast || [];
        if (_fast.length > 0) {
          scheme.requirement.push(..._fast);
        }

        initEntityColumn(scheme).then((resolve) => {
          filterScheme.value = resolve;
        });
      };

      getTableData();

      provide('allColumns', allColumns);
      provide('schemeData', schemeData);
      provide('schemeDataTemp', schemeDataTemp);
      provide('schemeDefaultIndex', schemeDefaultIndex);
      provide('schemeQuickIndex', schemeQuickIndex);
      provide('onChangeScheme', onChangeScheme);
      provide('initRelationHandle', initRelationShip);
      provide('initEntityColumnHandle', initEntityColumn);

      return {
        ORDER_CODE,
        loading,
        dataGrid,
        options,
        tableKey,
        dataSource,
        columns,
        allColumns,
        schemeData,
        filterScheme,
        odataParams,
        handleBillCodeClick,
        onChangeScheme,
        onSubmitClick,
        onApplyClick,
        onRefresh,
        shippingOrderType,
        permissionStore,
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
