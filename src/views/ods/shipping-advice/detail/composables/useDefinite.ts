import type { IColumnItem } from '/@/model/types';
import type { ISchemeItem, IRequirementItem } from '/@/components/QueryPopup/content/types';

import { ref } from 'vue';
import { getDefiniteColumns } from '/@/model/shipping-advice-items';

export function useDefinite(requirement: IRequirementItem[]) {
  const definiteCustomColumns: IColumnItem[] = [
    {
      key: 'shippingAdviceId',
      caption: 'shippingAdviceId',
      hide: true,
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
      key: 'defaultArea_name',
      caption: '默认区域',
      expand: 'defaultArea',
      relationKey: 'defaultAreaCode',
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
      key: 'deliveryWarehouse_name',
      caption: '仓库',
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
      key: 'isMarble',
      caption: '大理石',
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
      key: 'outRowCode',
      caption: '源单行号',
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
      key: 'isVerification',
      caption: '是否核销',
    },
    {
      key: 'categoryLCode',
      caption: '产品大类',
    },
    {
      key: 'categoryMCode',
      caption: '产品中类',
    },
    {
      key: 'categorySCode',
      caption: '产品小类',
    },
    {
      key: 'categoryXSCode',
      caption: '产品细类',
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
      key: 'area_Name',
      caption: '区域',
      expand: 'area',
      relationKey: 'areaCode',
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
