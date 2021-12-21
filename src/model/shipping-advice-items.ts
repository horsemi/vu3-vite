import type { IColumnItem } from './types';

import { getColumnList } from './common';

export const customColumns: IColumnItem[] = [
  {
    key: 'shippingAdviceId',
    caption: 'ShippingAdviceId',
    hide: true,
  },
  {
    key: 'materialCode',
    caption: '物料编码',
  },
  {
    key: 'material',
    caption: '物料名称',
    relationKey: 'materialCode',
    foundationList: [
      {
        key: 'material_name',
        caption: '物料',
      },
      {
        key: 'material_groupName',
        caption: '物料分组',
      },
    ],
    datatypekeies: 'materials',
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
    key: 'defaultAreaCode',
    caption: '默认区域',
    foundationList: [
      {
        key: 'defaultArea_name',
        caption: '默认区域',
      },
    ],
    datatypekeies: 'areas',
  },
  {
    key: 'unitCode',
    caption: '单位编码',
  },
  {
    key: 'unit',
    caption: '单位',
    relationKey: 'unitCode',
    foundationList: [
      {
        key: 'unit_name',
        caption: '单位',
      },
    ],
    datatypekeies: 'units',
  },
  {
    key: 'qty',
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
    key: 'warehouseCode',
    caption: '仓库编码',
  },
  {
    key: 'deliveryWarehouse',
    caption: '仓库',
    relationKey: 'warehouseCode',
    foundationList: [
      {
        key: 'deliveryWarehouse_name',
        caption: '仓库',
      },
      {
        key: 'deliveryWarehouse_groupName',
        caption: '仓库分组',
      },
    ],
    datatypekeies: 'stocks',
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
  // {
  //   key: 'CustomerMaterialName',
  //   caption: '客户物料名称',
  // },
  // {
  //   key: 'IsMarble',
  //   caption: '大理石',
  // },
  {
    key: 'isGaAllows',
    caption: '打木架',
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
  // {
  //   key: 'IsVerification',
  //   caption: '是否核销',
  // },
  {
    key: 'channel',
    caption: '渠道',
  },
  // {
  //   key: 'CategoryLCode',
  //   caption: '产品大类',
  // },
  // {
  //   key: 'CategoryMCode',
  //   caption: '产品中类',
  // },
  // {
  //   key: 'CategorySCode',
  //   caption: '产品小类',
  // },
  // {
  //   key: 'CategoryXSCode',
  //   caption: '产品细类',
  // },
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
    key: 'area',
    caption: '区域',
    relationKey: 'areaCode',
    foundationList: [
      {
        key: 'area_name',
        caption: '区域',
      },
    ],
    datatypekeies: 'area',
  },
  {
    key: 'areaCode',
    caption: '区域编码',
    datatypekeies: 'area',
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
  return await getColumnList({ code: 'shipping-advice-items', customColumns });
};
