import type { IColumnItem } from './types';

import { getColumnList } from './common';

export const customColumns: IColumnItem[] = [
  {
    key: 'ShippingOrderId',
    caption: 'ShippingOrderId',
    hide: true,
  },
  {
    key: 'MaterialCode',
    caption: '物料编码',
  },
  {
    key: 'Material',
    caption: '物料',
    relationKey: 'MaterialCode',
    foundationList: [
      {
        key: 'Material_Name',
        caption: '物料',
      },
      {
        key: 'Material_GroupName',
        caption: '物料分组',
      },
    ],
    datatypekeies: 'materials',
  },
  // {
  //   key: '',
  //   caption: '规格描述',
  // },
  {
    key: 'UnitCode',
    caption: '单位编码',
  },
  {
    key: 'Unit',
    caption: '单位',
    relationKey: 'UnitCode',
    foundationList: [
      {
        key: 'Unit_Name',
        caption: '单位',
      },
    ],
    datatypekeies: 'units',
  },
  {
    key: 'Qty',
    caption: '数量',
  },
  // {
  //   key: 'LotCode',
  //   caption: '批号',
  // },
  // {
  //   key: 'BomCode',
  //   caption: 'BOM版本',
  // },
  {
    key: 'WarehouseCode',
    caption: '仓库编码',
  },
  {
    key: 'DeliveryWarehouse',
    caption: '仓库',
    relationKey: 'WarehouseCode',
    foundationList: [
      {
        key: 'DeliveryWarehouse_Name',
        caption: '仓库名称',
      },
      {
        key: 'DeliveryWarehouse_GroupName',
        caption: '仓库分组',
      },
    ],
    datatypekeies: 'stocks',
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
  // {
  //   key: 'CustomerMaterialName',
  //   caption: '客户物料名称',
  // },
  // {
  //   key: 'ParentMaterialCode',
  //   caption: '父项物料编码',
  // },
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
  // {
  //   key: 'SourceMaterialCode',
  //   caption: '来源商品编码',
  // },
  // {
  //   key: 'SourceProductBomCode',
  //   caption: '来源商品BOM',
  // },
  // {
  //   key: 'SourceProductLotCode',
  //   caption: '来源商品批号',
  // },
];

export const getDefiniteColumns = async () => {
  return await getColumnList({ code: 'shipping-order-items', customColumns, info: 'base_Items' });
};
