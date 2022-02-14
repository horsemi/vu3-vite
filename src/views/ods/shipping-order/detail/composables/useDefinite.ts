import type { IColumnItem } from '/@/model/types';
import type { ISchemeItem, IRequirementItem } from '/@/components/QueryPopup/content/types';

import { ref } from 'vue';
import { getDefiniteColumns } from '/@/model/entity/shipping-order-items';

export function useDefinite(requirement: IRequirementItem[]) {
  const definiteCustomColumns: IColumnItem[] = [
    {
      key: 'ShippingOrderId',
      caption: 'ShippingOrderId',
    },
    {
      key: 'MaterialCode',
      caption: '物料编码',
    },
    {
      key: 'Material_Name',
      caption: '物料名称',
      expand: 'Material',
      relationKey: 'MaterialCode',
    },
    {
      key: 'UnitCode',
      caption: '单位编码',
    },
    {
      key: 'Unit_Name',
      caption: '单位名称',
      expand: 'Unit',
      relationKey: 'UnitCode',
    },
    {
      key: 'Qty',
      caption: '数量',
    },
    {
      key: 'LotCode',
      caption: '批号',
    },
    {
      key: 'BomCode',
      caption: 'BOM版本',
    },
    {
      key: 'WarehouseCode',
      caption: '仓库编码',
    },
    {
      key: 'DeliveryWarehouse_Name',
      caption: '仓库名称',
      expand: 'DeliveryWarehouse',
      relationKey: 'WarehouseCode',
    },
    {
      key: 'PackageQuantity',
      caption: '包件数',
    },
    {
      key: 'PackageCount',
      caption: '总包件数',
    },
    {
      key: 'VolumeQuantity',
      caption: '体积',
    },
    {
      key: 'VolumeCount',
      caption: '总体积',
    },
    {
      key: 'CustomerMaterialName',
      caption: '客户物料名称',
    },
    {
      key: 'ParentMaterialCode',
      caption: '父项物料编码',
    },
    {
      key: 'OutSourceBillCode',
      caption: '原单编号',
    },
    {
      key: 'ActualSalePrice',
      caption: '实际售价',
    },
    {
      key: 'Memo',
      caption: '备注',
    },
    {
      key: 'TaoBaoCode',
      caption: '平台单号',
    },
    {
      key: 'TaoBaoSubCode',
      caption: '平台子单号',
    },
    {
      key: 'Shop',
      caption: '店铺',
    },
    {
      key: 'BuyShop',
      caption: '收入店铺',
    },
    {
      key: 'ProvideSalePrice',
      caption: '供货售价',
    },
    {
      key: 'InWarehouseCode',
      caption: '进仓编号',
    },
    {
      key: 'ProductName',
      caption: '品名',
    },
    {
      key: 'Sku',
      caption: 'SKU',
    },
    {
      key: 'SkuCode',
      caption: 'SKUID',
    },
    {
      key: 'Texture',
      caption: '材质',
    },
    {
      key: 'SourceMaterialCode',
      caption: '来源商品编码',
    },
    {
      key: 'SourceProductBomCode',
      caption: '来源商品BOM',
    },
    {
      key: 'SourceProductLotCode',
      caption: '来源商品批号',
    },
  ];

  const definiteLoading = ref(true);

  const definiteScheme = ref<ISchemeItem>();
  const definiteAllColumns = ref<IColumnItem[]>([]);
  const definiteTableKey = ref<string[]>([]);
  getDefiniteColumns().then((res) => {
    if (res) {
      definiteTableKey.value = [res.key];
      definiteAllColumns.value = res.columnList;
      definiteScheme.value = {
        id: '',
        title: '',
        requirement,
        orderBy: [],
        columns: definiteCustomColumns,
        summary: [],
        relationShips: [],
      };
    }
  });

  function refreshDefinite() {
    definiteLoading.value = true;
    definiteScheme.value = {
      id: '',
      title: '',
      requirement,
      orderBy: [],
      columns: definiteCustomColumns,
      summary: [],
      relationShips: [],
    };
  }

  return {
    definiteScheme,
    definiteLoading,
    definiteAllColumns,
    definiteCustomColumns,
    definiteTableKey,
    refreshDefinite,
  };
}
