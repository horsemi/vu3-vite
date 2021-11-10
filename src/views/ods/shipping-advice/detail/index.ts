import type { IDetailItem } from '/@/utils/bill/types';
import type { IColumnItem } from '/@/model/types';

import { getDetailDataSource } from '/@/api/ods/detail';
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
    key: 'BatchCode',
    caption: '发货批次',
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
    key: 'IsGatheringOrder',
    caption: '集货订单',
  },
  {
    key: 'IsMergeLockOrder',
    caption: '合并锁单',
  },
  {
    key: 'IsAgencyOrder',
    caption: '经销商订单',
    colSpan: 2,
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
  // {
  //   key: 'IsRecycling',
  //   caption: '回收服务',
  // },
  {
    key: 'Memo',
    caption: '备注',
    colSpan: 4,
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
    showProperty: 'GroupName',
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
    caption: '三包服务商',
  },
  {
    key: 'SmallCarGroup',
    caption: '小挂组合',
    showProperty: 'GroupName',
  },
  {
    key: 'SendGoodsMode',
    caption: '发货模式',
  },
  {
    key: 'ServiceItemCode',
    caption: '服务项目',
  },
  {
    key: 'LogisticCode',
    caption: '物流单号',
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
    key: 'ThreeServiceFeeTypeCode',
    caption: '三包费用类型',
  },
  {
    key: 'BranchLineType',
    caption: '支装类型',
  },
  {
    key: 'LogisticsLine',
    caption: '物流专线',
  },
  {
    key: 'FreightTypeCode',
    caption: '运费类型',
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
    caption: '快递号信息',
  },
  {
    key: 'LogisticNoStatus',
    caption: '快递号状态',
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
    caption: '大头笔信息',
  },
  {
    key: 'PaintMarkerStatus',
    caption: '大头笔状态',
  },
  {
    key: 'TotalWeight',
    caption: '重量',
  },
];

export const task: IDetailItem[] = [
  {
    key: 'LockBatchTime',
    caption: '锁定批次时间',
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
    key: 'LockBatchUserCode',
    caption: '锁定批次人',
    keyProperty: 'Id',
    showProperty: 'AccountName',
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
    key: 'DetailRowsCount',
    caption: '明细行数',
  },
  {
    key: 'SendGoodsTime',
    caption: '发货时间',
  },
  {
    key: 'CancellerId',
    caption: '作废人',
    keyProperty: 'Id',
    showProperty: 'AccountName',
  },
  {
    key: 'InterceptTypeCode',
    caption: '截货类型',
  },
  {
    key: 'AreaName',
    caption: '区域',
  },
  {
    key: 'IsEntry',
    caption: '进场',
    hide: true,
  },
  // {
  //   key: 'IsTransfer',
  //   caption: '交接',
  //   hide: true,
  // },
  // {
  //   key: 'IsClean',
  //   caption: '清货',
  //   hide: true,
  // },
  {
    key: 'IsInstall',
    caption: '上门服务',
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
    key: 'CreatorId',
    caption: '创建人',
    keyProperty: 'Id',
    showProperty: 'AccountName',
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
    key: 'UpdatedTime',
    caption: '修改时间',
  },
  {
    key: 'UpdaterId',
    caption: '修改人',
    keyProperty: 'Id',
    showProperty: 'AccountName',
  },
  {
    key: 'Group',
    caption: '分组',
  },
  {
    key: 'OutSourceBillCode',
    caption: '原单编号',
  },
  {
    key: 'AppliedTime',
    caption: '审核时间',
  },
  {
    key: 'ApplierId',
    caption: '审核人',
    keyProperty: 'Id',
    showProperty: 'AccountName',
  },
  {
    key: 'CustomerSalesman',
    caption: '业务员',
  },
  {
    key: 'OutSaleBillCode',
    caption: '销售单号',
  },
  {
    key: 'SentStatus',
    caption: '发送状态',
  },
  {
    key: 'TotalMarble',
    caption: '大理石数量',
  },
  {
    key: 'TaoBaoCode',
    caption: '平台单号',
  },
  {
    key: 'OutBillFormCode',
    caption: '原单标识',
  },
  {
    key: 'SentMemo',
    caption: '发送备注',
    colSpan: 6,
  },
  {
    key: 'OutSourceBillType',
    caption: '原单类型',
  },
];

export const definite: IColumnItem[] = [
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

export const record: IColumnItem[] = [
  {
    key: 'BillId',
    caption: '单据ID',
  },
  {
    key: 'BillCode',
    caption: '单据编码',
  },
  {
    key: 'BillTypeCode',
    caption: '单据类型',
  },
  {
    key: 'DocumentStatus',
    caption: '操作类型',
  },
  {
    key: 'OperatedTime',
    caption: '操作时间',
  },
  {
    key: 'Operator_AccountName',
    caption: '操作人',
    expand: 'Operator',
    relationKey: 'OperatorId',
  },
  {
    key: 'IpAddress',
    caption: '操作IP',
  },
  {
    key: 'Description',
    caption: '操作描述',
  },
];

export const getDetailData = async (filter: any[], columnsData: any) => {
  if (!columnsData) return;
  const { columnList } = columnsData;

  const [
    baseList,
    receiverList,
    logisticsList,
    expressList,
    taskList,
    otherList,
  ] = getFormList(columnList, [base, receiver, logistics, express, task, other]);

  const select: string[] = [];
  const expand: string[] = [];

  [baseList, receiverList, logisticsList, expressList, taskList, otherList].forEach((list) => {
    list.forEach((item) => {
      if (isFoundationType(item)) {
        expand.push(item.expand as string);
      }
      select.push(item.key);
    });
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

export const getDefiniteData = async (columnsData: any) => {
  if (!columnsData) return;
  const { columnList } = columnsData;

  return {
    columnList,
    definite,
  };
};

export const getRecordData = async (columnsData: any) => {
  if (!columnsData) return;
  const { columnList } = columnsData;
  return {
    columnList,
    record,
  };
};
