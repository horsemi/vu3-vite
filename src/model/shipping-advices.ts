import type { IColumnItem } from './types';

import { getColumnList } from './common';

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
    type: 'date',
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
    key: 'BillType',
    caption: '单据类型',
    relationKey: 'BillTypeCode',
    filter: [
      {
        groupCodes: ['ZD_WMS_SendNotice'],
      },
    ],
    foundationList: [
      {
        key: 'BillType_Name',
        caption: '单据类型',
      },
    ],
    datatypekeies: 'bill-types',
  },
  {
    key: 'BillTypeCode',
    caption: '单据类型编码',
  },
  {
    key: 'BranchLineType',
    caption: '支装类型',
  },
  {
    key: 'SendGoodsMode',
    caption: '发货模式',
  },
  {
    key: 'TotalPack',
    caption: '总包裹数',
  },
  {
    key: 'DocumentStatus',
    caption: '单据状态',
  },
  {
    key: 'MarkStatus',
    caption: '标记状态',
  },
  {
    key: 'TotalVolume',
    caption: '总体积数',
  },
  {
    key: 'OperationStatus',
    caption: '业务状态',
  },
  {
    key: 'DeliveryWarehouse',
    caption: '发货仓库',
    relationKey: 'DeliveryWarehouseCode',
    foundationList: [
      {
        key: 'DeliveryWarehouse_Name',
        caption: '发货仓库',
      },
      {
        key: 'DeliveryWarehouse_GroupName',
        caption: '发货仓库分组',
      },
    ],
    datatypekeies: 'stocks',
  },
  {
    key: 'DeliveryWarehouseCode',
    caption: '发货仓库编码',
  },
  {
    key: 'SentStatus',
    caption: '发送状态',
  },
  {
    key: 'SentMemo',
    caption: '发送备注',
  },
  {
    key: 'TotalOrderCount',
    caption: '总订单数',
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
    caption: '电话',
  },
  {
    key: 'TotalActualPrice',
    caption: '实际售价汇总',
  },
  {
    key: 'Province',
    caption: '省',
    relationKey: 'ProvinceCode',
    foundationList: [
      {
        key: 'Province_Name',
        caption: '省',
      },
    ],
    datatypekeies: 'provinces',
  },
  {
    key: 'ProvinceCode',
    caption: '省编码',
  },
  {
    key: 'City',
    caption: '市',
    relationKey: 'CityCode',
    foundationList: [
      {
        key: 'City_Name',
        caption: '市',
      },
    ],
    datatypekeies: 'cities',
  },
  {
    key: 'CityCode',
    caption: '市编码',
  },
  {
    key: 'District',
    caption: '区',
    relationKey: 'DistrictCode',
    foundationList: [
      {
        key: 'District_Name',
        caption: '区',
      },
    ],
    datatypekeies: 'districts',
  },
  {
    key: 'DistrictCode',
    caption: '区编码',
  },
  {
    key: 'StreetCode',
    caption: '街道',
  },
  {
    key: 'Agency',
    caption: '经销商',
    relationKey: 'AgencyCode',
    foundationList: [
      {
        key: 'Agency_Name',
        caption: '经销商',
      },
    ],
    datatypekeies: 'customers',
  },
  {
    key: 'AgencyCode',
    caption: '经销商编码',
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
    key: 'GatheringPoint',
    caption: '集货点',
    relationKey: 'GatheringPointCode',
    foundationList: [
      {
        key: 'GatheringPoint_Name',
        caption: '集货点',
      },
    ],
    datatypekeies: 'gathering-points',
  },
  {
    key: 'GatheringPointCode',
    caption: '集货点编码',
  },
  {
    key: 'NonstopContractor',
    caption: '直达承运商',
    relationKey: 'NonstopContractorCode',
    foundationList: [
      {
        key: 'NonstopContractor_Name',
        caption: '直达承运商',
      },
    ],
    datatypekeies: 'suppliers',
  },
  {
    key: 'NonstopContractorCode',
    caption: '直达承运商编码',
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
    key: 'DeliveryPoint',
    caption: '提货点',
    relationKey: 'DeliveryPointCode',
    foundationList: [
      {
        key: 'DeliveryPoint_Name',
        caption: '提货点',
      },
    ],
    datatypekeies: 'delivery-points',
  },
  {
    key: 'DeliveryPointCode',
    caption: '提货点编码',
  },
  {
    key: 'TransitContractor',
    caption: '转运承运商',
    relationKey: 'TransitContractorCode',
    foundationList: [
      {
        key: 'TransitContractor_Name',
        caption: '转运承运商',
      },
    ],
    datatypekeies: 'suppliers',
  },
  {
    key: 'TransitContractorCode',
    caption: '转运承运商编码',
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
    key: 'ThreeServicePoint',
    caption: '三包点',
    relationKey: 'ThreeServicePointCode',
    foundationList: [
      {
        key: 'ThreeServicePoint_Name',
        caption: '三包点',
      },
    ],
    datatypekeies: 'three-service-points',
  },
  {
    key: 'ThreeServicePointCode',
    caption: '三包点编码',
  },
  {
    key: 'Contractor',
    caption: '中转承运商',
    relationKey: 'ContractorCode',
    foundationList: [
      {
        key: 'Contractor_Name',
        caption: '中转承运商',
      },
    ],
    datatypekeies: 'suppliers',
  },
  {
    key: 'ContractorCode',
    caption: '中转承运商编码',
  },
  {
    key: 'HandCarsGroup',
    caption: '挂车组合',
    relationKey: 'HandCarGroup',
    foundationList: [
      {
        key: 'HandCarsGroup_GroupName',
        caption: '挂车组合分组',
      },
    ],
    datatypekeies: 'line-areas',
  },
  {
    key: 'HandCarGroup',
    caption: '挂车组合编码',
  },
  {
    key: 'LoadType',
    caption: '配载方式',
  },
  {
    key: 'LineArea',
    caption: '线路区域',
    relationKey: 'LineAreaCode',
    foundationList: [
      {
        key: 'LineArea_Name',
        caption: '线路区域',
      },
    ],
    datatypekeies: 'line-areas',
  },
  {
    key: 'LineAreaCode',
    caption: '线路区域编码',
  },
  {
    key: 'ThreeServiceSupplier',
    caption: '三包服务商',
    relationKey: 'ThreeServiceSupplierCode',
    foundationList: [
      {
        key: 'ThreeServiceSupplier_Name',
        caption: '三包服务商',
      },
    ],
    datatypekeies: 'suppliers',
  },
  {
    key: 'ThreeServiceSupplierCode',
    caption: '三包服务商编码',
  },
  {
    key: 'SmallCarsGroup',
    caption: '小挂组合',
    relationKey: 'SmallCarGroup',
    foundationList: [
      {
        key: 'SmallCarsGroup_GroupName',
        caption: '小挂组合分组',
      },
    ],
    datatypekeies: 'line-areas',
  },
  {
    key: 'SmallCarGroup',
    caption: '小挂组合编码',
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
    key: 'LogisticsLines',
    caption: '物流专线',
    relationKey: 'LogisticsLine',
    foundationList: [
      {
        key: 'LogisticsLines_Name',
        caption: '物流专线',
      },
    ],
    datatypekeies: 'logistics-lines',
  },
  {
    key: 'LogisticsLine',
    caption: '物流专线编码',
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
    key: 'ThreeServiceCostType',
    caption: '三包费用类型',
    relationKey: 'ThreeServiceFeeTypeCode',
    foundationList: [
      {
        key: 'ThreeServiceCostType_Name',
        caption: '三包费用类型',
      },
    ],
    datatypekeies: 'three-service-cost-types',
  },
  {
    key: 'ThreeServiceFeeTypeCode',
    caption: '三包费用类型编码',
  },
  {
    key: 'ServiceContent',
    caption: '服务项目',
    relationKey: 'ServiceItemCode',
    foundationList: [
      {
        key: 'ServiceContent_Name',
        caption: '服务项目',
      },
    ],
    datatypekeies: 'service-contents',
  },
  {
    key: 'ServiceItemCode',
    caption: '服务项目编码',
  },
  {
    key: 'LockBatchTime',
    caption: '锁定批次时间',
  },
  {
    key: 'LockBatchUserCode',
    caption: '锁定批次人ID',
    allowQuery: false,
  },
  {
    key: 'LockBatchUser',
    caption: '锁定批次人',
    relationKey: 'LockBatchUserCode',
    allowQuery: false,
    foundationList: [
      {
        key: 'LockBatchUser_AccountName',
        caption: '锁定批次人',
      },
    ],
  },
  {
    key: 'ExpressSiteName',
    caption: '快递点名称',
  },
  {
    key: 'PaintMarkerStatus',
    caption: '大头笔状态',
  },
  {
    key: 'ReturnGoodsStatus',
    caption: '退货状态',
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
    caption: '大头笔信息',
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
    caption: '快递号状态',
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
    key: 'LogisticNoMsg',
    caption: '快递号信息',
  },
  {
    key: 'CancellerId',
    caption: '作废人ID',
    allowQuery: false,
  },
  {
    key: 'Canceller',
    caption: '作废人',
    relationKey: 'CancellerId',
    allowQuery: false,
    foundationList: [
      {
        key: 'Canceller_AccountName',
        caption: '作废人',
      },
    ],
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
    caption: '创建人ID',
    allowQuery: false,
  },
  {
    key: 'Creator',
    caption: '创建人',
    relationKey: 'CreatorId',
    allowQuery: false,
    foundationList: [
      {
        key: 'Creator_AccountName',
        caption: '创建人',
      },
    ],
  },
  {
    key: 'OutSourceBillType',
    caption: '原单类型',
  },
  {
    key: 'AppliedTime',
    caption: '审核时间',
  },
  {
    key: 'ApplierId',
    caption: '审核人ID',
    allowQuery: false,
  },
  {
    key: 'Applier',
    caption: '审核人',
    relationKey: 'ApplierId',
    allowQuery: false,
    foundationList: [
      {
        key: 'Applier_AccountName',
        caption: '审核人',
      },
    ],
  },
  {
    key: 'OutBillFormCode',
    caption: '原单标识',
  },
  {
    key: 'OutSourceBillCode',
    caption: '原单编号',
  },
  {
    key: 'UpdatedTime',
    caption: '修改时间',
  },
  {
    key: 'UpdaterId',
    caption: '修改人ID',
    allowQuery: false,
  },
  {
    key: 'Updater',
    caption: '修改人',
    relationKey: 'UpdaterId',
    allowQuery: false,
    foundationList: [
      {
        key: 'Updater_AccountName',
        caption: '修改人',
      },
    ],
  },
  {
    key: 'Customer',
    caption: '客户',
    relationKey: 'CustomerCode',
    foundationList: [
      {
        key: 'Customer_Name',
        caption: '客户',
      },
    ],
    datatypekeies: 'customers',
  },
  {
    key: 'CustomerCode',
    caption: '客户编码',
  },
  {
    key: 'OutSaleBillCode',
    caption: '销售单号',
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
    key: 'Memo',
    caption: '备注',
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
    key: 'CustomerSalesman',
    caption: '业务员',
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
  {
    key: 'DetailRowsCount',
    caption: '明细行数',
  },
];

export const getColumns = async () => {
  return await getColumnList('shipping-advices', customColumns);
};
