import type { IColumnItem } from '/@/model/types';
import type { ISchemeItem, IRequirementItem } from '/@/components/QueryPopup/content/types';

import { ref } from 'vue';
import { getDefiniteColumns } from '/@/model/shipping-advice-items';

export function useDefinite(requirement: IRequirementItem[]) {
  const definiteCustomColumns: IColumnItem[] = [
    {
      key: 'shippingOrderId',
      caption: 'shippingOrderId',
    },
    {
      key: 'materialCode',
      caption: '物料编码',
    },
    {
      key: 'material_name',
      caption: '物料名称',
      expand: 'material',
      relationKey: 'materialCode',
    },
    {
      key: 'unitCode',
      caption: '单位编码',
    },
    {
      key: 'unit_name',
      caption: '单位名称',
      expand: 'unit',
      relationKey: 'unitCode',
    },
    {
      key: 'qty',
      caption: '数量',
    },
    {
      key: 'lotCode',
      caption: '批号',
    },
    {
      key: 'bomCode',
      caption: 'BOM版本',
    },
    {
      key: 'warehouseCode',
      caption: '仓库编码',
    },
    {
      key: 'deliveryWarehouse_name',
      caption: '仓库名称',
      expand: 'deliveryWarehouse',
      relationKey: 'warehouseCode',
    },
    {
      key: 'packageQuantity',
      caption: '包件数',
    },
    {
      key: 'packageCount',
      caption: '总包件数',
    },
    {
      key: 'volumeQuantity',
      caption: '体积',
    },
    {
      key: 'volumeCount',
      caption: '总体积',
    },
    {
      key: 'customerMaterialName',
      caption: '客户物料名称',
    },
    {
      key: 'parentMaterialCode',
      caption: '父项物料编码',
    },
    {
      key: 'outSourceBillCode',
      caption: '原单编号',
    },
    {
      key: 'actualSalePrice',
      caption: '实际售价',
    },
    {
      key: 'memo',
      caption: '备注',
    },
    {
      key: 'taoBaoCode',
      caption: '平台单号',
    },
    {
      key: 'taoBaoSubCode',
      caption: '平台子单号',
    },
    {
      key: 'shop',
      caption: '店铺',
    },
    {
      key: 'buyShop',
      caption: '收入店铺',
    },
    {
      key: 'provideSalePrice',
      caption: '供货售价',
    },
    {
      key: 'inWarehouseCode',
      caption: '进仓编号',
    },
    {
      key: 'productName',
      caption: '品名',
    },
    {
      key: 'sku',
      caption: 'SKU',
    },
    {
      key: 'skuCode',
      caption: 'SKUID',
    },
    {
      key: 'texture',
      caption: '材质',
    },
    {
      key: 'sourceMaterialCode',
      caption: '来源商品编码',
    },
    {
      key: 'sourceProductBomCode',
      caption: '来源商品BOM',
    },
    {
      key: 'sourceProductLotCode',
      caption: '来源商品批号',
    },
  ];

  const definiteScheme = ref<ISchemeItem>();
  const definiteAllColumns = ref<IColumnItem[]>([]);
  getDefiniteColumns().then((res) => {
    if (res) {
      definiteAllColumns.value = res.columnList;
      definiteScheme.value = {
        id: '',
        title: '',
        requirement,
        orderBy: [],
        columns: definiteCustomColumns,
        summary: [],
      };
    }
  });

  function refreshDefinite() {
    definiteScheme.value = {
      id: '',
      title: '',
      requirement,
      orderBy: [],
      columns: definiteCustomColumns,
      summary: [],
    };
  }

  return {
    definiteScheme,
    definiteAllColumns,
    definiteCustomColumns,
    refreshDefinite,
  };
}
