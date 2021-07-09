import type { ITableOptions } from '/@/components/Table/types';
import type { IDefiniteItem, IDetailItem } from '/@/utils/detail/types';

import { getDefiniteDataSource, getDetailDataSource } from '/@/api/ods/detail';
import { getColumns } from '/@/model/shipping-advices';
import { getFormList } from '/@/utils/detail';

export const base: IDetailItem[] = [
  {
    dataField: 'BillCode',
  },
  {
    dataField: 'BillDate',
  },
  {
    dataField: 'BatchCode',
  },
  {
    dataField: 'TotalPackage',
  },
  {
    dataField: 'BillTypeCode',
  },
  {
    dataField: 'BranchLineType',
  },
  {
    dataField: 'SendGoodsMode',
  },
  {
    dataField: 'TotalPack',
  },
  {
    dataField: 'DocumentStatus',
  },
  {
    dataField: 'MarkStatus',
  },
  {
    dataField: 'ServiceItemCode',
  },
  {
    dataField: 'TotalVolume',
  },
  {
    dataField: 'OperationStatus',
  },
  {
    dataField: 'DeliveryWarehouseCode',
  },
  {
    dataField: 'SentStatus',
  },
  {
    dataField: 'SentMemo',
  },
  {
    dataField: 'IsPicking',
  },
  {
    dataField: 'IsGatheringOrder',
  },
  {
    dataField: 'IsSmallMode',
  },
  {
    dataField: 'IsMergeLockOrder',
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
    dataField: 'TotalActualPrice',
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
  {
    dataField: 'IsAgencyOrder',
  },
  {
    dataField: 'IsInstall',
  },
  {
    dataField: 'IsRecycling',
  },
  {
    dataField: 'IsExistMarble',
  },
];

export const logistics: IDetailItem[] = [
  {
    dataField: 'GatheringPointCode',
  },
  {
    dataField: 'NonstopContractorCode',
  },
  {
    dataField: 'HandCarLine',
  },
  {
    dataField: 'TrainCode',
  },
  {
    dataField: 'DeliveryPointCode',
  },
  {
    dataField: 'TransitContractorCode',
  },
  {
    dataField: 'SmallCarLine',
  },
  {
    dataField: 'CarModeCode',
  },
  {
    dataField: 'ThreeServicePointCode',
  },
  {
    dataField: 'ContractorCode',
  },
  {
    dataField: 'HandCarGroup',
  },
  {
    dataField: 'LoadType',
  },
  {
    dataField: 'LineAreaCode',
  },
  {
    dataField: 'ThreeServiceSupplierCode',
  },
  {
    dataField: 'SmallCarGroup',
  },
  {
    dataField: 'DeliveryCos',
  },
  {
    dataField: 'LogisticCode',
  },
  {
    dataField: 'LogisticsLine',
  },
  {
    dataField: 'ThreeServiceCostPrice',
  },
  {
    dataField: 'LogisticsCostPrice',
  },
  {
    dataField: 'FreightTypeCode',
  },
  {
    dataField: 'ThreeServiceFeeTypeCode',
  },
  {
    dataField: 'ServiceItemCode',
  },
];

export const task: IDetailItem[] = [
  {
    dataField: 'LockBatchTime',
  },
  {
    dataField: 'LockBatchUserCode',
  },
  {
    dataField: 'ExpressSiteName',
  },
  {
    dataField: 'PaintMarkerStatus',
  },
  {
    dataField: 'ReturnGoodsStatus',
  },
  {
    dataField: 'PlanSendGoodsDate',
  },
  {
    dataField: 'ExpressStandard',
  },
  {
    dataField: 'PaintMarkerMsg',
  },
  {
    dataField: 'IsCancelled',
  },
  {
    dataField: 'SendGoodsTimeOut',
  },
  {
    dataField: 'BagsCentralizeAddress',
  },
  {
    dataField: 'LogisticNoStatus',
  },
  {
    dataField: 'CancelledTime',
  },
  {
    dataField: 'SendGoodsTime',
  },
  {
    dataField: 'PaintMarker',
  },
  {
    dataField: 'PushDownTime',
  },
  {
    dataField: 'CancellerId',
  },
  {
    dataField: 'SentDate',
  },
  {
    dataField: 'InterceptReasonCode',
  },
  {
    dataField: 'InterceptTypeCode',
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
    dataField: 'OutSourceBillType',
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
    dataField: 'OutBillFormCode',
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
    dataField: 'CustomerCode',
  },
  {
    dataField: 'OutSaleBillCode',
  },
  {
    dataField: 'TotalWeight',
  },
  {
    dataField: 'AreaName',
  },
  {
    dataField: 'Group',
  },
  {
    dataField: 'PushDownTime',
  },
  {
    dataField: 'TotalMarble',
  },
  {
    dataField: 'TaoBaoCode',
  },
  {
    dataField: 'CustomerSalesman',
  },
];

export const customDefinite: IDefiniteItem[] = [
  {
    key: 'ShippingOrderDetailId',
    caption: 'ShippingOrderDetailId',
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
  const baseList = getFormList(base, columnList);
  const receiverList = getFormList(receiver, columnList);
  const logisticsList = getFormList(logistics, columnList);
  const taskList = getFormList(task, columnList);
  const otherList = getFormList(other, columnList);
  const baseKey = baseList.map((item) => item.dataField);
  const receiverKey = receiverList.map((item) => item.dataField);
  const taskKey = taskList.map((item) => item.dataField);
  const logisticsKey = logisticsList.map((item) => item.dataField);
  const otherKey = otherList.map((item) => item.dataField);
  const select = baseKey.concat(receiverKey).concat(logisticsKey).concat(taskKey).concat(otherKey);
  const data = await getDetailDataSource('shipping-advices', select, filter);
  return {
    baseList,
    receiverList,
    logisticsList,
    taskList,
    otherList,
    data: data[0],
  };
};

export const getDefiniteData = async (options: ITableOptions, filter: any[]) => {
  const select = customDefinite.map((item) => item.key);
  return await getDefiniteDataSource('shipping-advices-items', select, filter, options);
};
