import type { IColumnItem } from './types';

import { baseDataPre, enumDataPre, getColumnList } from './common';

export const customColumns: IColumnItem[] = [
  {
    key: 'BillCode',
    caption: '单据编码',
    cellTemplate: 'billCode',
    mustKey: true,
  },
  {
    key: 'GatheringParentCode',
    caption: '父单号',
    mustKey: true,
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
    key: 'TotalPackage',
    caption: '总包件数',
  },
  {
    key: 'BillTypeCode',
    caption: '单据类型',
    datatypekeies: `${enumDataPre}shippingAdviceTypes`,
  },
  {
    key: 'BranchLineType',
    caption: '支装类型',
    datatypekeies: `${enumDataPre}branchlinetypes`,
  },
  {
    key: 'SendGoodsMode',
    caption: '发货模式',
    datatypekeies: `${enumDataPre}sendgoodsmodes`,
  },
  {
    key: 'TotalPack',
    caption: '总包裹数',
  },
  {
    key: 'DocumentStatus',
    caption: '单据状态',
    datatypekeies: `${enumDataPre}documentstatuses`,
  },
  {
    key: 'MarkStatus',
    caption: '标记状态',
    datatypekeies: `${enumDataPre}markstatuses`,
  },
  // {
  //   key: 'ServiceItemCode',
  //   caption: '备货区',
  // },
  {
    key: 'TotalVolume',
    caption: '总体积',
  },
  {
    key: 'OperationStatus',
    caption: '业务状态',
    datatypekeies: `${enumDataPre}operationstatuses`,
  },
  {
    key: 'DeliveryWarehouseCode',
    caption: '发货仓库',
  },
  {
    key: 'SentStatus',
    caption: '发送状态',
    datatypekeies: `${enumDataPre}sentstatuses`,
  },
  {
    key: 'SentMemo',
    caption: '发送备注',
  },
  {
    key: 'IsPicking',
    caption: '拣货',
  },
  {
    key: 'IsGatheringOrder',
    caption: '集货订单',
  },
  {
    key: 'IsSmallMode',
    caption: '小挂',
  },
  {
    key: 'IsMergeLockOrder',
    caption: '合并锁单',
  },
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
    datatypekeies: `${baseDataPre}customers`,
  },
  {
    key: 'PromisedDeliveryDate',
    caption: '承诺发货时间',
  },
  {
    key: 'DetailAddress',
    caption: '详细地址',
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
  {
    key: 'GatheringPointCode',
    caption: '集货点',
    datatypekeies: `${baseDataPre}gathering-points`,
  },
  {
    key: 'NonstopContractorCode',
    caption: '直达承运商',
    datatypekeies: `${baseDataPre}suppliers`,
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
    datatypekeies: `${baseDataPre}delivery-points`,
  },
  {
    key: 'TransitContractorCode',
    caption: '转运承运商',
    datatypekeies: `${baseDataPre}suppliers`,
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
    datatypekeies: `${baseDataPre}three-service-points`,
  },
  {
    key: 'ContractorCode',
    caption: '中转承运商',
    datatypekeies: `${baseDataPre}suppliers`,
  },
  {
    key: 'HandCarGroup',
    caption: '挂车组合',
  },
  {
    key: 'LoadType',
    caption: '配载方式',
    datatypekeies: `${enumDataPre}loadtypes`,
  },
  {
    key: 'LineAreaCode',
    caption: '线路区域',
  },
  {
    key: 'ThreeServiceSupplierCode',
    caption: '三包服务商',
    datatypekeies: `${baseDataPre}suppliers`,
  },
  {
    key: 'SmallCarGroup',
    caption: '小挂组合',
  },
  {
    key: 'DeliveryCos',
    caption: '提货费',
  },
  {
    key: 'LogisticCode',
    caption: '物流单号',
  },
  {
    key: 'LogisticsLine',
    caption: '物流专线',
  },
  {
    key: 'ThreeServiceCostPrice',
    caption: '三包成本',
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
    key: 'ThreeServiceFeeTypeCode',
    caption: '三包费用类型',
    datatypekeies: `${baseDataPre}three-service-cost-types`,
  },
  {
    key: 'ServiceItemCode',
    caption: '服务项目',
  },
  {
    key: 'LockBatchTime',
    caption: '锁定批次时间',
  },
  {
    key: 'LockBatchUserCode',
    caption: '锁定批次人',
  },
  {
    key: 'ExpressSiteName',
    caption: '快递点名称',
  },
  {
    key: 'PaintMarkerStatus',
    caption: '大头笔接口状态',
    datatypekeies: `${enumDataPre}paintmarkerstatuses`,
  },
  {
    key: 'ReturnGoodsStatus',
    caption: '退货状态',
    datatypekeies: `${enumDataPre}returngoodsstatuses`,
  },
  {
    key: 'PlanSendGoodsDate',
    caption: '计划发货日期',
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
    key: 'IsCancelled',
    caption: '作废状态',
  },
  {
    key: 'SendGoodsTimeOut',
    caption: '发货超时时间',
  },
  {
    key: 'BagsCentralizeAddress',
    caption: '集包地',
  },
  {
    key: 'LogisticNoStatus',
    caption: '快递号接口状态',
    datatypekeies: `${enumDataPre}logisticnostatuses`,
  },
  {
    key: 'CancelledTime',
    caption: '作废时间',
  },
  {
    key: 'SendGoodsTime',
    caption: '发货时间',
  },
  {
    key: 'PaintMarker',
    caption: '大头笔',
  },
  {
    key: 'PushDownTime',
    caption: '快递号接口信息',
  },
  {
    key: 'CancellerId',
    caption: '作废人',
  },
  {
    key: 'SentDate',
    caption: '发送时间',
  },
  {
    key: 'InterceptReasonCode',
    caption: '截货原因',
  },
  {
    key: 'InterceptTypeCode',
    caption: '截货类型',
  },
  {
    key: 'CreatedTime',
    caption: '创建时间',
  },
  {
    key: 'CreatorId',
    caption: '创建人',
  },
  {
    key: 'OutSourceBillType',
    caption: '外部原单类型',
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
    key: 'OutBillFormCode',
    caption: '外部原单标识',
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
    key: 'CustomerCode',
    caption: '客户',
  },
  {
    key: 'OutSaleBillCode',
    caption: '外部销售单号',
  },
  {
    key: 'TotalWeight',
    caption: '重量',
  },
  {
    key: 'AreaName',
    caption: '区域',
  },
  {
    key: 'Group',
    caption: '分组',
  },
  {
    key: 'PushDownTime',
    caption: '备注',
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
    key: 'CustomerSalesman',
    caption: '客户业务员',
  },
  {
    key: 'IsTally',
    caption: '理货',
  },
  {
    key: 'IsEntry',
    caption: '进场',
  },
  {
    key: 'IsTransfer',
    caption: '交接',
  },
  {
    key: 'IsClean',
    caption: '清货',
  },
];

export const getColumns = async () => {
  return await getColumnList('shipping-advices', customColumns);
};
