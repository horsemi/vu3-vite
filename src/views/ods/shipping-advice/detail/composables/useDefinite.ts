import type { IColumnItem } from '/@/model/types';
import type { ISchemeItem, IRequirementItem } from '/@/components/QueryPopup/content/types';

import { ref } from 'vue';
import { getDefiniteColumns } from '/@/model/shipping-advice-items';

export function useDefinite(requirement: IRequirementItem[]) {
  const definiteCustomColumns: IColumnItem[] = [
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
      key: 'Material_Name',
      caption: '物料名称',
      expand: 'Material',
      relationKey: 'MaterialCode',
    },
    {
      key: 'DefaultArea_Name',
      caption: '默认区域',
      expand: 'DefaultArea',
      relationKey: 'DefaultAreaCode',
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
      key: 'DeliveryWarehouse_Name',
      caption: '仓库',
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
      key: 'IsMarble',
      caption: '大理石',
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
      key: 'OutRowCode',
      caption: '源单行号',
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
      key: 'IsVerification',
      caption: '是否核销',
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
      key: 'Area_Name',
      caption: '区域',
      expand: 'Area',
      relationKey: 'AreaCode',
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
