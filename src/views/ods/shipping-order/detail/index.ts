import type { ITableOptions } from '/@/components/Table/types';
import type { IDetailItem } from '/@/utils/bill/types';

import { getDefiniteDataSource, getDetailDataSource } from '/@/api/ods/detail';
import { getColumns } from '/@/model/shipping-orders';
import { getDefiniteColumns } from '/@/model/shipping-order-items';
import { getFormList } from '/@/utils/bill';
import { isFoundationType } from '/@/model/common';

export const base: IDetailItem[] = [
  {
    key: 'BillCode',
    caption: '单据编码',
  },
  {
    key: 'BillDate',
    caption: '单据日期',
  },
  {
    key: 'TotalPackage',
    caption: '总包件数',
  },
  {
    key: 'Group',
    caption: '分组',
  },
  {
    key: 'BillTypeCode',
    caption: '单据类型',
  },
  {
    key: 'ServiceItemCode',
    caption: '服务项目',
  },
  {
    key: 'TotalVolume',
    caption: '总体积数',
  },
  {
    key: 'CustomerSalesman',
    caption: '客户业务员',
  },
  {
    key: 'DocumentStatus',
    caption: '单据状态',
  },
  {
    key: 'OperationStatus',
    caption: '业务状态',
  },
  {
    key: 'TotalOrderCount',
    caption: '订单总数',
  },
  {
    key: 'DetailRowsCount',
    caption: '明细行数',
  },
  {
    key: 'DeliveryWarehouseCode',
    caption: '仓库',
  },
  {
    key: 'MarkStatus',
    caption: '标记状态',
  },
  {
    key: 'Memo',
    caption: '备注',
    colSpan: 4,
  },
  {
    key: 'IsGatheringOrder',
    caption: '集货订单',
  },
  {
    key: 'IsRecycling',
    caption: '回收服务',
  },
  {
    key: 'IsAgencyOrder',
    caption: '经销商订单',
  },
];

export const receiver: IDetailItem[] = [
  {
    key: 'Nickname',
    caption: '买家昵称',
  },
  {
    key: 'Receiver',
    caption: '收货人',
  },
  {
    key: 'Telephone',
    caption: '电话',
  },
  {
    key: 'RecyclingMemo',
    caption: '回收备注',
  },
  {
    key: 'ProvinceCode',
    caption: '省',
  },
  {
    key: 'CityCode',
    caption: '市',
  },
  {
    key: 'DistrictCode',
    caption: '区',
  },
  {
    key: 'StreetCode',
    caption: '街道',
  },
  {
    key: 'AgencyCode',
    caption: '经销商',
  },
  {
    key: 'PromisedDeliveryDate',
    caption: '承诺发货时间',
  },
  {
    key: 'DetailAddress',
    caption: '详细地址',
    colSpan: 4,
  },
  {
    key: 'ShowroomContacts',
    caption: '展厅联系人',
  },
  {
    key: 'ShowroomTelephone',
    caption: '展厅电话',
  },
  {
    key: 'ShowroomAddress',
    caption: '展厅提货地址',
    colSpan: 4,
  },
];

export const logistics: IDetailItem[] = [
  {
    key: 'GatheringPointCode',
    caption: '集货点',
  },
  {
    key: 'LineAreaCode',
    caption: '线路区域',
  },
  {
    key: 'ThreeServiceCostPrice',
    caption: '三包成本',
  },
  {
    key: 'ThreeServiceFeeTypeCode',
    caption: '三包费用类型',
  },
  {
    key: 'DeliveryPointCode',
    caption: '提货点',
  },
  {
    key: 'ContractorCode',
    caption: '中转承运商',
  },
  {
    key: 'LogisticsCostPrice',
    caption: '物流成本',
  },
  {
    key: 'FreightTypeCode',
    caption: '运费类型',
  },
  {
    key: 'ThreeServicePointCode',
    caption: '三包点',
  },
  {
    key: 'ThreeServiceSupplierCode',
    caption: '三包服务商',
  },
  {
    key: 'LogisticCode',
    caption: '物流单号',
  },
];

export const other: IDetailItem[] = [
  {
    key: 'CreatedTime',
    caption: '创建时间',
  },
  {
    key: 'CreatorId',
    caption: '创建人',
  },
  {
    key: 'CustomerTypeCode',
    caption: '客户类型',
  },
  {
    key: 'GatheringParentCode',
    caption: '父单号',
  },
  {
    key: 'AppliedTime',
    caption: '审核时间',
  },
  {
    key: 'ApplierId',
    caption: '审核人',
  },
  {
    key: 'CustomerCode',
    caption: '客户',
  },
  {
    key: 'OutSourceBillCode',
    caption: '外部原单编号',
  },
  {
    key: 'UpdatedTime',
    caption: '修改时间',
  },
  {
    key: 'UpdaterId',
    caption: '修改人',
  },
  {
    key: 'OutBillFormCode',
    caption: '外部原单标识',
  },
  {
    key: 'OutSaleBillCode',
    caption: '外部销售单号',
  },
  {
    key: 'CancelledTime',
    caption: '作废时间',
  },
  {
    key: 'CancellerId',
    caption: '作废人',
  },
  {
    key: 'PushDownTime',
    caption: '下推时间',
  },
  {
    key: 'OutSourceBillType',
    caption: '外部原单类型',
  },
  {
    key: 'IsCancelled',
    caption: '作废状态',
  },
  {
    key: 'PushDownStatus',
    caption: '下推状态',
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
    select.push(item.key);
  });
  receiverList.forEach((item) => {
    if (isFoundationType(item)) {
      expand.push(item.expand as string);
    }
    select.push(item.key);
  });
  logisticsList.forEach((item) => {
    if (isFoundationType(item)) {
      expand.push(item.expand as string);
    }
    select.push(item.key);
  });
  otherList.forEach((item) => {
    if (isFoundationType(item)) {
      expand.push(item.expand as string);
    }
    select.push(item.key);
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
  const data = getDefiniteDataSource('shipping-order-items', select, filter, options);
  return {
    columnList,
    data,
  };
};
