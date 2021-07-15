import type { ITableOptions } from '/@/components/Table/types';
import type { IDetailItem } from '/@/utils/detail/types';

import { getDefiniteDataSource, getDetailDataSource } from '/@/api/ods/detail';
import { getColumns } from '/@/model/shipping-orders';
import { getDefiniteColumns } from '/@/model/shipping-order-items';
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
  const columnsData = await getDefiniteColumns();
  if (!columnsData) return;
  const { columnList } = columnsData;
  const select = columnList.map((item) => item.key);
  const data = await getDefiniteDataSource('shipping-order-items', select, filter, options);
  return {
    columnList,
    data,
  };
};
