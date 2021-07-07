
import type { ITableOptions } from '/@/components/Table/types';
import type { IDefiniteItem, IDetailItem } from '/@/utils/detail/types';

import { getDefiniteDataSource, getDetailDataSource } from '/@/api/ods/detail';
import { getColumns } from '/@/model/shipping-orders';
import { getFormList } from '/@/utils/detail';

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
    dataField: 'MarkStatus',
  },
  {
    dataField: 'BillTypeCode',
  },
  {
    dataField: 'ServiceItemCode',
  },
  {
    dataField: 'Group',
  },
  {
    dataField: 'DocumentStatus',
  },
  {
    dataField: 'TotalOrderCount',
  },
  {
    dataField: 'TotalVolume',
  },
  {
    dataField: 'CustomerSalesman',
  },
  {
    dataField: 'OperationStatus',
  },
  {
    dataField: 'DetailRowsCount',
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

export const consignee: IDetailItem[] = [
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
  },
  {
    dataField: 'ShowroomContacts',
  },
  {
    dataField: 'ShowroomTelephone',
  },
  {
    dataField: 'ShowroomAddress',
  },
];

export const logistics: IDetailItem[] = [
  {
    dataField: 'GatheringPointCode',
  },
  {
    dataField: 'ThreeServicePointCode',
  },
  {
    dataField: 'ContractorCode',
  },
  {
    dataField: 'ThreeServiceFeeTypeCode',
  },
  {
    dataField: 'DeliveryPointCode',
  },
  {
    dataField: 'LineAreaCode',
  },
  {
    dataField: 'ThreeServiceSupplierCode',
  },
  {
    dataField: 'FreightTypeCode',
  },
  {
    dataField: 'LogisticsCostPrice',
  },
  {
    dataField: 'ThreeServiceCostPrice',
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
  {
    key: 'BomCode',
    caption: 'BOM版本',
  },
  {
    key: 'CustomerMaterialName',
    caption: '客户物料名称',
  },
  {
    key: 'Qty',
    caption: '数量',
  },
  {
    key: 'PackageQuantity',
    caption: '包件数',
  },
  {
    key: 'Shop',
    caption: '店铺',
  },
  {
    key: 'Channel',
    caption: '渠道',
  },
  {
    key: 'ProvideSalePrice',
    caption: '供货售价',
  },
  {
    key: 'ActualSalePrice',
    caption: '实际售价',
  },
];

export const getDetailData = async (filter: any[]) => {
  const columnsData = await getColumns();
  if (!columnsData) return;
  const { columnList } = columnsData;
  const { baseList, consigneeList, logisticsList, otherList } = await getFormList(
    base,
    consignee,
    logistics,
    other,
    columnList
  );
  const baseKey = baseList.map((item) => item.dataField);
  const consigneeKey = consigneeList.map((item) => item.dataField);
  const logisticsKey = logisticsList.map((item) => item.dataField);
  const otherKey = otherList.map((item) => item.dataField);
  const select = baseKey.concat(consigneeKey).concat(logisticsKey).concat(otherKey);
  const data = await getDetailDataSource('shipping-orders', select, filter);
  return {
    baseList,
    consigneeList,
    logisticsList,
    otherList,
    data: data[0],
  };
};

export const getDefiniteData = async (options: ITableOptions, filter: any[]) => {
  const select = customDefinite.map((item) => item.key);
  return await getDefiniteDataSource('shipping-order-items', select, filter, options);
};
