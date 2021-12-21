import type { IColumnItem } from './types';

import { getColumnList } from './common';

export const customColumns: IColumnItem[] = [
  {
    key: 'billCode',
    caption: '单据编码',
    cellTemplate: 'billCode',
    mustKey: true,
  },
  {
    key: 'gatheringParentCode',
    caption: '父单号',
    mustKey: true,
  },
  {
    key: 'billDate',
    caption: '单据日期',
    type: 'date',
  },
  {
    key: 'batchCode',
    caption: '发货批次',
  },
  {
    key: 'totalPackage',
    caption: '总包件数',
  },
  {
    key: 'billType',
    caption: '单据类型',
    relationKey: 'billTypeCode',
    filter: [
      {
        groupCodes: ['ZD_WMS_SendNotice'],
      },
    ],
    foundationList: [
      {
        key: 'billType_name',
        caption: '单据类型',
      },
    ],
    datatypekeies: 'bill-types',
  },
  {
    key: 'billTypeCode',
    caption: '单据类型编码',
    datatypekeies: 'bill-types',
  },
  {
    key: 'branchLineType',
    caption: '支装类型',
  },
  {
    key: 'sendGoodsMode',
    caption: '发货模式',
  },
  {
    key: 'totalPack',
    caption: '总包裹数',
  },
  {
    key: 'documentStatus',
    caption: '单据状态',
  },
  {
    key: 'markStatus',
    caption: '标记状态',
  },
  {
    key: 'totalVolume',
    caption: '总体积数',
  },
  {
    key: 'operationStatus',
    caption: '业务状态',
  },
  {
    key: 'deliveryWarehouse',
    caption: '发货仓库',
    relationKey: 'deliveryWarehouseCode',
    foundationList: [
      {
        key: 'deliveryWarehouse_name',
        caption: '发货仓库',
      },
      {
        key: 'deliveryWarehouse_groupName',
        caption: '发货仓库分组',
      },
    ],
    datatypekeies: 'stocks',
  },
  {
    key: 'deliveryWarehouseCode',
    caption: '发货仓库编码',
    datatypekeies: 'stocks',
  },
  {
    key: 'sentStatus',
    caption: '发送状态',
  },
  {
    key: 'sentMemo',
    caption: '发送备注',
  },
  {
    key: 'totalOrderCount',
    caption: '总订单数',
  },
  {
    key: 'isPicking',
    caption: '拣货',
  },
  {
    key: 'isGatheringOrder',
    caption: '集货订单',
  },
  {
    key: 'isSmallMode',
    caption: '小挂',
  },
  {
    key: 'isMergeLockOrder',
    caption: '合并锁单',
  },
  {
    key: 'nickname',
    caption: '买家昵称',
  },
  {
    key: 'receiver',
    caption: '收货人',
  },
  {
    key: 'telephone',
    caption: '电话',
  },
  {
    key: 'totalActualPrice',
    caption: '实际售价汇总',
  },
  {
    key: 'province',
    caption: '省',
    relationKey: 'provinceCode',
    foundationList: [
      {
        key: 'province_name',
        caption: '省',
      },
    ],
    datatypekeies: 'provinces',
  },
  {
    key: 'provinceCode',
    caption: '省编码',
    datatypekeies: 'provinces',
  },
  {
    key: 'city',
    caption: '市',
    relationKey: 'cityCode',
    foundationList: [
      {
        key: 'city_name',
        caption: '市',
      },
    ],
    datatypekeies: 'cities',
  },
  {
    key: 'cityCode',
    caption: '市编码',
    datatypekeies: 'cities',
  },
  {
    key: 'district',
    caption: '区',
    relationKey: 'districtCode',
    foundationList: [
      {
        key: 'district_name',
        caption: '区',
      },
    ],
    datatypekeies: 'districts',
  },
  {
    key: 'districtCode',
    caption: '区编码',
    datatypekeies: 'districts',
  },
  {
    key: 'StreetCode',
    caption: '街道',
  },
  {
    key: 'agency',
    caption: '经销商',
    relationKey: 'agencyCode',
    foundationList: [
      {
        key: 'agency_name',
        caption: '经销商',
      },
    ],
    datatypekeies: 'customers',
  },
  {
    key: 'agencyCode',
    caption: '经销商编码',
    datatypekeies: 'customers',
  },
  {
    key: 'promisedDeliveryDate',
    caption: '承诺发货时间',
  },
  {
    key: 'detailAddress',
    caption: '详细地址',
  },
  {
    key: 'showroomContacts',
    caption: '展厅联系人',
  },
  {
    key: 'showroomTelephone',
    caption: '展厅电话',
  },
  {
    key: 'showroomAddress',
    caption: '展厅提货地址',
  },
  {
    key: 'isAgencyOrder',
    caption: '经销商订单',
  },
  {
    key: 'isInstall',
    caption: '上门服务',
  },
  {
    key: 'isRecycling',
    caption: '回收服务',
  },
  {
    key: 'isExistMarble',
    caption: '大理石',
  },
  {
    key: 'gatheringPoint',
    caption: '集货点',
    relationKey: 'gatheringPointCode',
    foundationList: [
      {
        key: 'gatheringPoint_name',
        caption: '集货点',
      },
    ],
    datatypekeies: 'gathering-points',
  },
  {
    key: 'gatheringPointCode',
    caption: '集货点编码',
    datatypekeies: 'gathering-points',
  },
  {
    key: 'nonstopContractor',
    caption: '直达承运商',
    relationKey: 'nonstopContractorCode',
    foundationList: [
      {
        key: 'nonstopContractor_name',
        caption: '直达承运商',
      },
    ],
    datatypekeies: 'suppliers',
  },
  {
    key: 'nonstopContractorCode',
    caption: '直达承运商编码',
    datatypekeies: 'suppliers',
  },
  {
    key: 'handCarsLine',
    caption: '挂车路线',
    relationKey: 'handCarLine',
    foundationList: [
      {
        key: 'handCarsLine_name',
        caption: '挂车路线',
      },
    ],
    datatypekeies: 'line-circuits',
  },
  {
    key: 'handCarLine',
    caption: '挂车路线编码',
    datatypekeies: 'line-circuits',
  },
  {
    key: 'trainCode',
    caption: '车次',
  },
  {
    key: 'deliveryPoint',
    caption: '提货点',
    relationKey: 'deliveryPointCode',
    foundationList: [
      {
        key: 'deliveryPoint_name',
        caption: '提货点',
      },
    ],
    datatypekeies: 'delivery-points',
  },
  {
    key: 'deliveryPointCode',
    caption: '提货点编码',
    datatypekeies: 'delivery-points',
  },
  {
    key: 'transitContractor',
    caption: '转运承运商',
    relationKey: 'transitContractorCode',
    foundationList: [
      {
        key: 'transitContractor_name',
        caption: '转运承运商',
      },
    ],
    datatypekeies: 'suppliers',
  },
  {
    key: 'transitContractorCode',
    caption: '转运承运商编码',
    datatypekeies: 'suppliers',
  },
  {
    key: 'smallCarsLine',
    caption: '小挂路线',
    relationKey: 'smallCarLine',
    foundationList: [
      {
        key: 'smallCarsLine_name',
        caption: '小挂路线',
      },
    ],
    datatypekeies: 'line-circuits',
  },
  {
    key: 'smallCarLine',
    caption: '小挂路线编码',
    datatypekeies: 'line-circuits',
  },
  {
    key: 'carModeCode',
    caption: '车型',
  },
  {
    key: 'threeServicePoint',
    caption: '三包点',
    relationKey: 'threeServicePointCode',
    foundationList: [
      {
        key: 'threeServicePoint_name',
        caption: '三包点',
      },
    ],
    datatypekeies: 'three-service-points',
  },
  {
    key: 'threeServicePointCode',
    caption: '三包点编码',
    datatypekeies: 'three-service-points',
  },
  {
    key: 'contractor',
    caption: '中转承运商',
    relationKey: 'contractorCode',
    foundationList: [
      {
        key: 'contractor_name',
        caption: '中转承运商',
      },
    ],
    datatypekeies: 'suppliers',
  },
  {
    key: 'contractorCode',
    caption: '中转承运商编码',
    datatypekeies: 'suppliers',
  },
  {
    key: 'handCarsGroup',
    caption: '挂车组合',
    relationKey: 'handCarGroup',
    foundationList: [
      {
        key: 'handCarsGroup_groupName',
        caption: '挂车组合分组',
      },
    ],
    datatypekeies: 'line-areas',
  },
  {
    key: 'handCarGroup',
    caption: '挂车组合编码',
    datatypekeies: 'line-areas',
  },
  {
    key: 'loadType',
    caption: '配载方式',
  },
  {
    key: 'lineArea',
    caption: '线路区域',
    relationKey: 'lineAreaCode',
    foundationList: [
      {
        key: 'lineArea_name',
        caption: '线路区域',
      },
    ],
    datatypekeies: 'line-areas',
  },
  {
    key: 'lineAreaCode',
    caption: '线路区域编码',
    datatypekeies: 'line-areas',
  },
  {
    key: 'threeServiceSupplier',
    caption: '三包服务商',
    relationKey: 'threeServiceSupplierCode',
    foundationList: [
      {
        key: 'threeServiceSupplier_name',
        caption: '三包服务商',
      },
    ],
    datatypekeies: 'suppliers',
  },
  {
    key: 'threeServiceSupplierCode',
    caption: '三包服务商编码',
    datatypekeies: 'suppliers',
  },
  {
    key: 'smallCarsGroup',
    caption: '小挂组合',
    relationKey: 'smallCarGroup',
    foundationList: [
      {
        key: 'smallCarsGroup_groupName',
        caption: '小挂组合分组',
      },
    ],
    datatypekeies: 'line-areas',
  },
  {
    key: 'smallCarGroup',
    caption: '小挂组合编码',
    datatypekeies: 'line-areas',
  },
  {
    key: 'deliveryCos',
    caption: '提货费',
  },
  {
    key: 'logisticCode',
    caption: '物流单号',
  },
  {
    key: 'logisticsLines',
    caption: '物流专线',
    relationKey: 'logisticsLine',
    foundationList: [
      {
        key: 'logisticsLines_name',
        caption: '物流专线',
      },
    ],
    datatypekeies: 'logistics-lines',
  },
  {
    key: 'logisticsLine',
    caption: '物流专线编码',
    datatypekeies: 'logistics-lines',
  },
  {
    key: 'threeServiceCostPrice',
    caption: '三包成本',
  },
  {
    key: 'logisticsCostPrice',
    caption: '物流成本',
  },
  {
    key: 'freightTypeCode',
    caption: '运费类型编码',
    datatypekeies: 'freight-types',
  },
  {
    key: 'freightType',
    caption: '运费类型',
    relationKey: 'freightTypeCode',
    foundationList: [
      {
        key: 'freightType_name',
        caption: '运费类型',
      },
    ],
    datatypekeies: 'freight-types',
  },
  {
    key: 'threeServiceCostType',
    caption: '三包费用类型',
    relationKey: 'threeServiceFeeTypeCode',
    foundationList: [
      {
        key: 'threeServiceCostType_name',
        caption: '三包费用类型',
      },
    ],
    datatypekeies: 'three-service-cost-types',
  },
  {
    key: 'threeServiceFeeTypeCode',
    caption: '三包费用类型编码',
    datatypekeies: 'three-service-cost-types',
  },
  {
    key: 'serviceContent',
    caption: '服务项目',
    relationKey: 'serviceItemCode',
    foundationList: [
      {
        key: 'serviceContent_name',
        caption: '服务项目',
      },
    ],
    datatypekeies: 'service-contents',
  },
  {
    key: 'serviceItemCode',
    caption: '服务项目编码',
    datatypekeies: 'service-contents',
  },
  {
    key: 'lockBatchTime',
    caption: '锁定批次时间',
  },
  {
    key: 'lockBatchUserCode',
    caption: '锁定批次人ID',
    notAllowQuery: true,
  },
  {
    key: 'lockBatchUser',
    caption: '锁定批次人',
    relationKey: 'lockBatchUserCode',
    notAllowQuery: true,
    foundationList: [
      {
        key: 'lockBatchUser_accountName',
        caption: '锁定批次人',
      },
    ],
  },
  {
    key: 'expressSiteName',
    caption: '快递点名称',
  },
  {
    key: 'paintMarkerStatus',
    caption: '大头笔状态',
  },
  {
    key: 'returnGoodsStatus',
    caption: '退货状态',
  },
  {
    key: 'planSendGoodsDate',
    caption: '计划发货日期',
  },
  {
    key: 'expressStandard',
    caption: '快递规格',
  },
  {
    key: 'paintMarkerMsg',
    caption: '大头笔信息',
  },
  {
    key: 'isCancelled',
    caption: '作废状态',
  },
  {
    key: 'sendGoodsTimeOut',
    caption: '发货超时时间',
  },
  {
    key: 'bagsCentralizeAddress',
    caption: '集包地',
  },
  {
    key: 'logisticNoStatus',
    caption: '快递号状态',
  },
  {
    key: 'cancelledTime',
    caption: '作废时间',
  },
  {
    key: 'sendGoodsTime',
    caption: '发货时间',
  },
  {
    key: 'paintMarker',
    caption: '大头笔',
  },
  {
    key: 'logisticNoMsg',
    caption: '快递号信息',
  },
  {
    key: 'cancellerId',
    caption: '作废人ID',
    notAllowQuery: true,
  },
  {
    key: 'canceller',
    caption: '作废人',
    relationKey: 'cancellerId',
    notAllowQuery: true,
    foundationList: [
      {
        key: 'canceller_accountName',
        caption: '作废人',
      },
    ],
  },
  {
    key: 'sentDate',
    caption: '发送时间',
  },
  {
    key: 'interceptReasonCode',
    caption: '截货原因',
  },
  {
    key: 'interceptTypeCode',
    caption: '截货类型',
  },
  {
    key: 'createdTime',
    caption: '创建时间',
  },
  {
    key: 'creatorId',
    caption: '创建人ID',
    notAllowQuery: true,
  },
  {
    key: 'creator',
    caption: '创建人',
    relationKey: 'creatorId',
    notAllowQuery: true,
    foundationList: [
      {
        key: 'creator_accountName',
        caption: '创建人',
      },
    ],
  },
  {
    key: 'outSourceBillType',
    caption: '原单类型',
  },
  {
    key: 'appliedTime',
    caption: '审核时间',
  },
  {
    key: 'applierId',
    caption: '审核人ID',
    notAllowQuery: true,
  },
  {
    key: 'applier',
    caption: '审核人',
    relationKey: 'applierId',
    notAllowQuery: true,
    foundationList: [
      {
        key: 'applier_accountName',
        caption: '审核人',
      },
    ],
  },
  {
    key: 'outBillFormCode',
    caption: '原单标识',
  },
  {
    key: 'outSourceBillCode',
    caption: '原单编号',
  },
  {
    key: 'updatedTime',
    caption: '修改时间',
  },
  {
    key: 'updaterId',
    caption: '修改人ID',
    notAllowQuery: true,
  },
  {
    key: 'updater',
    caption: '修改人',
    relationKey: 'updaterId',
    notAllowQuery: true,
    foundationList: [
      {
        key: 'updater_accountName',
        caption: '修改人',
      },
    ],
  },
  {
    key: 'customer',
    caption: '客户',
    relationKey: 'customerCode',
    foundationList: [
      {
        key: 'customer_name',
        caption: '客户',
      },
    ],
    datatypekeies: 'customers',
  },
  {
    key: 'customerCode',
    caption: '客户编码',
    datatypekeies: 'customers',
  },
  {
    key: 'outSaleBillCode',
    caption: '销售单号',
  },
  {
    key: 'totalWeight',
    caption: '重量',
  },
  {
    key: 'areaName',
    caption: '区域',
  },
  {
    key: 'group',
    caption: '分组',
  },
  {
    key: 'memo',
    caption: '备注',
  },
  {
    key: 'totalMarble',
    caption: '大理石数量',
  },
  {
    key: 'taoBaoCode',
    caption: '平台单号',
  },
  {
    key: 'customerSalesman',
    caption: '业务员',
  },
  {
    key: 'isTally',
    caption: '理货',
  },
  {
    key: 'isEntry',
    caption: '进场',
  },
  {
    key: 'isTransfer',
    caption: '交接',
  },
  {
    key: 'isClean',
    caption: '清货',
  },
  {
    key: 'detailRowsCount',
    caption: '明细行数',
  },
];

export const getColumns = async () => {
  return await getColumnList({ code: 'shipping-advices', customColumns });
};
