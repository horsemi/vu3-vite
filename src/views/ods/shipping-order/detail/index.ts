import type { ITableOptions } from '/@/components/Table/types';
import type { IDefiniteItem, IDetailItem } from '/@/utils/detail/types';

import { getDefiniteDataSource, getDetailDataSource } from '/@/api/ods/detail';
import { getColumns } from '/@/model/shipping-orders';
import { getFormList } from '/@/utils/detail';
import { isFoundationType } from '/@/model/common';

export const base: IDetailItem[] = [
  {
    dataField: 'BillCode',
  },
  {
    dataField: 'BillDate',
  },
  {
    dataField: 'TotalPackage',
  },
  {
    dataField: 'Group',
  },
  {
    dataField: 'BillTypeCode',
  },
  {
    dataField: 'ServiceItemCode',
  },
  {
    dataField: 'TotalVolume',
  },
  {
    dataField: 'CustomerSalesman',
  },
  {
    dataField: 'DocumentStatus',
  },
  {
    dataField: 'OperationStatus',
  },
  {
    dataField: 'TotalOrderCount',
  },
  {
    dataField: 'DetailRowsCount',
  },
  {
    dataField: 'DeliveryWarehouseCode',
  },
  {
    dataField: 'MarkStatus',
  },
  {
    dataField: 'Memo',
    colSpan: 4,
  },
  {
    dataField: 'IsGatheringOrder',
  },
  {
    dataField: 'IsRecycling',
  },
  {
    dataField: 'IsAgencyOrder',
  },
];

export const receiver: IDetailItem[] = [
  {
    dataField: 'Nickname',
  },
  {
    dataField: 'Receiver',
  },
  {
    dataField: 'Telephone',
  },
  {
    dataField: 'RecyclingMemo',
  },
  {
    dataField: 'ProvinceCode',
  },
  {
    dataField: 'CityCode',
  },
  {
    dataField: 'DistrictCode',
  },
  {
    dataField: 'StreetCode',
  },
  {
    dataField: 'AgencyCode',
  },
  {
    dataField: 'PromisedDeliveryDate',
  },
  {
    dataField: 'DetailAddress',
    colSpan: 4,
  },
  {
    dataField: 'ShowroomContacts',
  },
  {
    dataField: 'ShowroomTelephone',
  },
  {
    dataField: 'ShowroomAddress',
    colSpan: 4,
  },
];

export const logistics: IDetailItem[] = [
  {
    dataField: 'GatheringPointCode',
  },
  {
    dataField: 'LineAreaCode',
  },
  {
    dataField: 'ThreeServiceCostPrice',
  },
  {
    dataField: 'ThreeServiceFeeTypeCode',
  },
  {
    dataField: 'DeliveryPointCode',
  },
  {
    dataField: 'ContractorCode',
  },
  {
    dataField: 'LogisticsCostPrice',
  },
  {
    dataField: 'FreightTypeCode',
  },
  {
    dataField: 'ThreeServicePointCode',
  },
  {
    dataField: 'ThreeServiceSupplierCode',
  },
  {
    dataField: 'LogisticCode',
  },
];

export const other: IDetailItem[] = [
  {
    dataField: 'CreatedTime',
  },
  {
    dataField: 'CreatorId',
  },
  {
    dataField: 'CustomerTypeCode',
  },
  {
    dataField: 'GatheringParentCode',
  },
  {
    dataField: 'AppliedTime',
  },
  {
    dataField: 'ApplierId',
  },
  {
    dataField: 'CustomerCode',
  },
  {
    dataField: 'OutSourceBillCode',
  },
  {
    dataField: 'UpdatedTime',
  },
  {
    dataField: 'UpdaterId',
  },
  {
    dataField: 'OutBillFormCode',
  },
  {
    dataField: 'OutSaleBillCode',
  },
  {
    dataField: 'CancelledTime',
  },
  {
    dataField: 'CancellerId',
  },
  {
    dataField: 'PushDownTime',
  },
  {
    dataField: 'OutSourceBillType',
  },
  {
    dataField: 'IsCancelled',
  },
  {
    dataField: 'PushDownStatus',
  },
];

export const customDefinite: IDefiniteItem[] = [
  {
    key: 'ShippingOrderId',
    caption: 'ShippingOrderId',
    hide: true,
  },
  {
    key: 'MaterialCode',
    caption: '物料编码',
  },
  // {
  //   key: '',
  //   caption: '物料名称',
  // },
  // {
  //   key: '',
  //   caption: '规格描述',
  // },
  {
    key: 'UnitCode',
    caption: '单位',
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
    caption: '仓库',
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

export const getDetailData = async (filter: any[]) => {
  const columnsData = await getColumns();
  if (!columnsData) return;
  const { columnList } = columnsData;
  const baseList = getFormList(base, columnList);
  const receiverList = getFormList(receiver, columnList);
  const logisticsList = getFormList(logistics, columnList);
  const otherList = getFormList(other, columnList);

  const select: string[] = [];
  const expand: string[] = [];

  baseList.forEach((item) => {
    if (isFoundationType(item)) {
      expand.push(item.expand as string);
    }
    select.push(item.dataField);
  });
  receiverList.forEach((item) => {
    if (isFoundationType(item)) {
      expand.push(item.expand as string);
    }
    select.push(item.dataField);
  });
  logisticsList.forEach((item) => {
    if (isFoundationType(item)) {
      expand.push(item.expand as string);
    }
    select.push(item.dataField);
  });
  otherList.forEach((item) => {
    if (isFoundationType(item)) {
      expand.push(item.expand as string);
    }
    select.push(item.dataField);
  });

  const data = await getDetailDataSource('shipping-orders', select, expand, filter);
  return {
    baseList,
    receiverList,
    logisticsList,
    otherList,
    data: data[0],
  };
};

export const getDefiniteData = async (options: ITableOptions, filter: any[]) => {
  const select = customDefinite.map((item) => item.key);
  return await getDefiniteDataSource('shipping-order-items', select, filter, options);
};
