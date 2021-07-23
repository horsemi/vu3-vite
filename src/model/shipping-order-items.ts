import type { IColumnItem } from './types';

import { baseDataPre, getColumnList } from './common';

export const customColumns: IColumnItem[] = [
  {
    key: 'ShippingOrderId',
    caption: 'ShippingOrderId',
    hide: true,
  },
  {
    key: 'MaterialCode',
    caption: '物料编码',
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
    datatypekeies: `${baseDataPre}material`,
  },
  // {
  //   key: '',
  //   caption: '规格描述',
  // },
  {
    key: 'UnitCode',
    caption: '单位编码',
    foundationList: [
      {
        key: 'Unit_Name',
        caption: '单位',
      },
    ],
    datatypekeies: `${baseDataPre}unit`,
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
    datatypekeies: `${baseDataPre}stocks`,
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
    caption: '外部原单编号',
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
    caption: '淘宝单号',
  },
  {
    key: 'TaoBaoSubCode',
    caption: '淘宝子单号',
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

export const getDefiniteColumns = async () => {
  return await getColumnList('shipping-order-items', customColumns);
};
