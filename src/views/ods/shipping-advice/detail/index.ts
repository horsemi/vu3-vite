import type { ITableOptions } from '/@/components/Table/types';
import type { IDetailItem } from '/@/utils/bill/types';

import { getDefiniteDataSource, getDetailDataSource } from '/@/api/ods/detail';
import { getColumns } from '/@/model/shipping-advices';
import { getDefiniteColumns } from '/@/model/shipping-advice-items';
import { getFormList } from '/@/utils/bill';
import { isFoundationType } from '/@/model/common';

export const base: IDetailItem[] = [
  {
    key: 'BillCode',
    caption: '单据编码',
  },
  {
    key: 'BillTypeCode',
    caption: '单据类型',
  },
  {
    key: 'DeliveryWarehouseCode',
    caption: '发货仓库',
  },
  {
    key: 'TotalPackage',
    caption: '总包件数',
  },
  {
    key: 'DocumentStatus',
    caption: '单据状态',
  },
  {
    key: 'BillDate',
    caption: '单据日期',
  },
  {
    key: 'BranchLineType',
    caption: '支装类型',
  },
  {
    key: 'TotalPack',
    caption: '总包裹数',
  },
  {
    key: 'OperationStatus',
    caption: '业务状态',
  },
  {
    key: 'MarkStatus',
    caption: '标记状态',
  },
  {
    key: 'TotalOrderCount',
    caption: '总订单数',
  },
  {
    key: 'TotalVolume',
    caption: '总体积数',
  },
  {
    key: 'Memo',
    caption: '备注',
    colSpan: 4,
  },
  {
    key: 'SentStatus',
    caption: '发送状态',
  },
  {
    key: 'IsGatheringOrder',
    caption: '集货订单',
  },
  {
    key: 'IsMergeLockOrder',
    caption: '合并锁单',
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
    caption: '电话:',
  },
  {
    key: 'TotalActualPrice',
    caption: '实际售价汇总',
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
  {
    key: 'IsAgencyOrder',
    caption: '经销商订单',
  },
  {
    key: 'IsInstall',
    caption: '上门服务',
  },
  {
    key: 'IsRecycling',
    caption: '回收服务',
  },
  {
    key: 'IsExistMarble',
    caption: '大理石',
  },
];

export const logistics: IDetailItem[] = [
  {
    key: 'GatheringPointCode',
    caption: '集货点',
  },
  {
    key: 'NonstopContractorCode',
    caption: '直达承运商',
  },
  {
    key: 'HandCarLine',
    caption: '挂车路线',
  },
  {
    key: 'TrainCode',
    caption: '车次',
  },
  {
    key: 'DeliveryPointCode',
    caption: '提货点',
  },
  {
    key: 'TransitContractorCode',
    caption: '转运承运商',
  },
  {
    key: 'SmallCarLine',
    caption: '小挂路线',
  },
  {
    key: 'CarModeCode',
    caption: '车型',
  },
  {
    key: 'ThreeServicePointCode',
    caption: '三包点',
  },
  {
    key: 'ContractorCode',
    caption: '中转承运商',
  },
  {
    key: 'HandCarGroup',
    caption: '挂车组合',
  },
  {
    key: 'LoadType',
    caption: '配载方式',
  },
  {
    key: 'ThreeServiceCostPrice',
    caption: '三包成本',
  },
  {
    key: 'ThreeServiceSupplierCode',
    caption: '三包承运商',
  },
  {
    key: 'SmallCarGroup',
    caption: '小挂组合',
  },
  {
    key: 'SendGoodsMode',
    caption: '发货模式',
  },
  {
    key: 'ThreeServiceFeeTypeCode',
    caption: '三包费用类型',
  },
  {
    key: 'LineAreaCode',
    caption: '线路区域',
  },
  {
    key: 'LogisticsCostPrice',
    caption: '物流成本',
  },
  {
    key: 'LogisticCode',
    caption: '物流单号',
  },
  {
    key: 'FreightTypeCode',
    caption: '运费类型',
  },
  {
    key: 'LogisticsLine',
    caption: '物流专线',
  },
  {
    key: 'ServiceItemCode',
    caption: '服务项目',
  },
];

export const express: IDetailItem[] = [
  {
    key: 'BagsCentralizeAddress',
    caption: '集包地',
  },
  {
    key: 'ExpressSiteName',
    caption: '快递点名称',
  },
  {
    key: 'LogisticNoMsg',
    caption: '快递号接口信息',
  },
  {
    key: 'LogisticNoStatus',
    caption: '快递号接口状态',
  },
  {
    key: 'PaintMarker',
    caption: '大头笔',
  },
  {
    key: 'ExpressStandard',
    caption: '快递规格',
  },
  {
    key: 'PaintMarkerMsg',
    caption: '大头笔接口信息',
  },
  {
    key: 'PaintMarkerStatus',
    caption: '大头笔接口状态',
  },
  {
    key: 'TotalWeight',
    caption: '重量',
  },
];

export const task: IDetailItem[] = [
  {
    key: 'BatchCode',
    caption: '发货批次',
  },
  {
    key: 'PromisedDeliveryDate',
    caption: '承诺发货时间',
  },
  {
    key: 'SentDate',
    caption: '发送时间',
  },
  {
    key: 'ReturnGoodsStatus',
    caption: '退货状态',
  },
  {
    key: 'LockBatchTime',
    caption: '锁定批次时间',
  },
  {
    key: 'SendGoodsTimeOut',
    caption: '发货超时时间',
  },
  {
    key: 'CancelledTime',
    caption: '作废时间',
  },
  {
    key: 'InterceptReasonCode',
    caption: '截货原因',
  },
  {
    key: 'LockBatchUserCode',
    caption: '锁定批次人',
  },
  {
    key: 'SendGoodsTimeOut',
    caption: '发货超时时间',
  },
  {
    key: 'CancellerId',
    caption: '作废人',
  },
  {
    key: 'InterceptTypeCode',
    caption: '截货类型',
  },
  {
    key: 'IsTally',
    caption: '理货',
    template: 'stepBar',
    colSpan: 4,
  },
  {
    key: 'IsEntry',
    caption: '进场',
    hide: true,
  },
  {
    key: 'IsTransfer',
    caption: '交接',
    hide: true,
  },
  {
    key: 'IsClean',
    caption: '清货',
    hide: true,
  },
  {
    key: 'IsCancelled',
    caption: '作废状态',
  },
];

export const other: IDetailItem[] = [
  {
    key: 'CreatedTime',
    caption: '创建时间',
  },
  {
    key: 'UpdatedTime',
    caption: '修改时间',
  },
  {
    key: 'CustomerCode',
    caption: '客户',
  },
  {
    key: 'GatheringParentCode',
    caption: '父单号',
  },
  {
    key: 'CreatorId',
    caption: '创建人',
  },
  {
    key: 'UpdaterId',
    caption: '修改人',
  },
  {
    key: 'Group',
    caption: '分组',
  },
  {
    key: 'OutSourceBillCode',
    caption: '外部原单编号',
  },
  {
    key: 'AppliedTime',
    caption: '审核时间',
  },
  {
    key: 'AreaName',
    caption: '区域',
  },
  {
    key: 'CustomerSalesman',
    caption: '客户业务员',
  },
  {
    key: 'OutSaleBillCode',
    caption: '外部销售单号',
  },
  {
    key: 'ApplierId',
    caption: '审核人',
  },
  {
    key: 'TotalMarble',
    caption: '大理石数量',
  },
  {
    key: 'TaoBaoCode',
    caption: '淘宝单号',
  },
  {
    key: 'OutBillFormCode',
    caption: '外部原单标识',
  },
  {
    key: 'SentMemo',
    caption: '发送备注',
    colSpan: 6,
  },
  {
    key: 'OutSourceBillType',
    caption: '外部原单类型',
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
  expressList.forEach((item) => {
    if (isFoundationType(item)) {
      expand.push(item.expand as string);
    }
    select.push(item.key);
  });
  taskList.forEach((item) => {
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
