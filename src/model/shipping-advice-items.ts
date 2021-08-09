import type { IColumnItem } from './types';

import { getColumnList } from './common';

export const customColumns: IColumnItem[] = [
  {
    key: 'ShippingAdviceId',
    caption: 'ShippingAdviceId',
    hide: true,
  },
  {
    key: 'MaterialCode',
    caption: '物料编码',
  },
  {
    key: 'Material',
    caption: '物料编码',
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
    datatypekeies: 'material',
  },
  // {
  //   key: '',
  //   caption: '规格描述',
  // },
  // {
  //   key: '',
  //   caption: '小商品条码',
  // },
  {
    key: 'DefaultAreaCode',
    caption: '默认区域',
  },
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
    datatypekeies: 'unit',
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
    key: 'DeliveryWarehouse',
    caption: '仓库',
    relationKey: 'WarehouseCode',
    foundationList: [
      {
        key: 'DeliveryWarehouse_Name',
        caption: '仓库',
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
  {
    key: 'CustomerMaterialName',
    caption: '客户物料名称',
  },
  {
    key: 'IsMarble',
    caption: '大理石',
  },
  {
    key: 'IsGaAllows',
    caption: '打木架',
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
    caption: '线上平台单号',
  },
  {
    key: 'TaoBaoSubCode',
    caption: '线上平台子单号',
  },
  {
    key: 'IsVerification',
    caption: '是否核销',
  },
  {
    key: 'Channel',
    caption: '渠道',
  },
  {
    key: 'CategoryLCode',
    caption: '产品大类',
  },
  {
    key: 'CategoryMCode',
    caption: '产品中类',
  },
  {
    key: 'CategorySCode',
    caption: '产品小类',
  },
  {
    key: 'CategoryXSCode',
    caption: '产品细类',
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
  return await getColumnList('shipping-advice-items', customColumns);
};
