import type { ITableOptions } from '/@/components/Table/types';
import type { IDetailItem } from '/@/utils/bill/types';

import { getDefiniteDataSource, getDetailDataSource } from '/@/api/ods/detail';
import { getColumns } from '/@/model/shipping-advices';
import { getDefiniteColumns } from '/@/model/shipping-advice-items';
import { getFormList } from '/@/utils/bill';
import { isFoundationType } from '/@/model/common';

export const base: IDetailItem[] = [
  {
    dataField: 'BillCode',
  },
  {
    dataField: 'BillTypeCode',
  },
  {
    dataField: 'DeliveryWarehouseCode',
  },
  {
    dataField: 'TotalPackage',
  },
  {
    dataField: 'DocumentStatus',
  },
  {
    dataField: 'BillDate',
  },
  {
    dataField: 'BranchLineType',
  },
  {
    dataField: 'TotalPack',
  },
  {
    dataField: 'OperationStatus',
  },
  {
    dataField: 'MarkStatus',
  },
  {
    dataField: 'TotalOrderCount',
  },
  {
    dataField: 'TotalVolume',
  },
  {
    dataField: 'Memo',
    colSpan: 4,
  },
  {
    dataField: 'SentStatus',
  },
  {
    dataField: 'IsGatheringOrder',
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
    dataField: 'ThreeServiceCostPrice',
  },
  {
    dataField: 'ThreeServiceSupplierCode',
  },
  {
    dataField: 'SmallCarGroup',
  },
  {
    dataField: 'SendGoodsMode',
  },
  {
    dataField: 'ThreeServiceFeeTypeCode',
  },
  {
    dataField: 'LineAreaCode',
  },
  {
    dataField: 'LogisticsCostPrice',
  },
  {
    dataField: 'LogisticCode',
  },
  {
    dataField: 'FreightTypeCode',
  },
  {
    dataField: 'LogisticsLine',
  },
  {
    dataField: 'ServiceItemCode',
  },
];

export const express: IDetailItem[] = [
  {
    dataField: 'BagsCentralizeAddress',
  },
  {
    dataField: 'ExpressSiteName',
  },
  {
    dataField: 'LogisticNoMsg',
  },
  {
    dataField: 'LogisticNoStatus',
  },
  {
    dataField: 'PaintMarker',
  },
  {
    dataField: 'ExpressStandard',
  },
  {
    dataField: 'PaintMarkerMsg',
  },
  {
    dataField: 'PaintMarkerStatus',
  },
  {
    dataField: 'TotalWeight',
  },
];

export const task: IDetailItem[] = [
  {
    dataField: 'BatchCode',
  },
  {
    dataField: 'PromisedDeliveryDate',
  },
  {
    dataField: 'SentDate',
  },
  {
    dataField: 'ReturnGoodsStatus',
  },
  {
    dataField: 'LockBatchTime',
  },
  {
    dataField: 'SendGoodsTimeOut',
  },
  {
    dataField: 'CancelledTime',
  },
  {
    dataField: 'InterceptReasonCode',
  },
  {
    dataField: 'LockBatchUserCode',
  },
  {
    dataField: 'SendGoodsTime',
  },
  {
    dataField: 'CancellerId',
  },
  {
    dataField: 'InterceptTypeCode',
  },
  {
    dataField: 'IsTally',
    template: 'stepBar',
    colSpan: 4,
  },
  {
    dataField: 'IsEntry',
    hide: true,
  },
  {
    dataField: 'IsTransfer',
    hide: true,
  },
  {
    dataField: 'IsClean',
    hide: true,
  },
  {
    dataField: 'IsCancelled',
  },
];

export const other: IDetailItem[] = [
  {
    dataField: 'CreatedTime',
  },
  {
    dataField: 'UpdatedTime',
  },
  {
    dataField: 'CustomerCode',
  },
  {
    dataField: 'GatheringParentCode',
  },
  {
    dataField: 'CreatorId',
  },
  {
    dataField: 'UpdaterId',
  },
  {
    dataField: 'Group',
  },
  {
    dataField: 'OutSourceBillCode',
  },
  {
    dataField: 'AppliedTime',
  },
  {
    dataField: 'AreaName',
  },
  {
    dataField: 'CustomerSalesman',
  },
  {
    dataField: 'OutSaleBillCode',
  },
  {
    dataField: 'ApplierId',
  },
  {
    dataField: 'TotalMarble',
  },
  {
    dataField: 'TaoBaoCode',
  },
  {
    dataField: 'OutBillFormCode',
  },
  {
    dataField: 'SentMemo',
    colSpan: 6,
  },
  {
    dataField: 'OutSourceBillType',
  },
];

export const getDetailData = async (filter: any[]) => {
  const columnsData = await getColumns();
  if (!columnsData) return;
  const { columnList } = columnsData;
  const baseList = getFormList(base, columnList);
  const receiverList = getFormList(receiver, columnList);
  const logisticsList = getFormList(logistics, columnList);
  const expressList = getFormList(express, columnList);
  const taskList = getFormList(task, columnList);
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
  expressList.forEach((item) => {
    if (isFoundationType(item)) {
      expand.push(item.expand as string);
    }
    select.push(item.dataField);
  });
  taskList.forEach((item) => {
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

  const data = await getDetailDataSource('shipping-advices', select, expand, filter);
  return {
    baseList,
    receiverList,
    logisticsList,
    expressList,
    taskList,
    otherList,
    data: data[0],
  };
};

export const getDefiniteData = async (options: ITableOptions, filter: any[]) => {
  const columnsData = await getDefiniteColumns();
  if (!columnsData) return;
  const { columnList } = columnsData;
  const select = columnList.map((item) => item.key);
  const data = await getDefiniteDataSource('shipping-advice-items', select, filter, options);
  return {
    columnList,
    data,
  };
};
