import type { IColumnItem } from './types';

import { getColumnList } from './common';

export const customColumns: IColumnItem[] = [
  {
    key: 'BillCode',
    caption: '单据编号',
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
    key: 'DocumentStatus',
    caption: '单据状态',
  },
  {
    key: 'DeliveryWarehouse',
    caption: '仓库',
    relationKey: 'DeliveryWarehouseCode',
    foundationList: [
      {
        key: 'DeliveryWarehouse_Name',
        caption: '仓库',
      },
      {
        key: 'DeliveryWarehouse_GroupName',
        caption: '仓库分组',
      },
    ],
    datatypekeies: 'stocks',
  },
  {
    key: 'DeliveryWarehouseCode',
    caption: '仓库编码',
  },
  {
    key: 'Nickname',
    caption: '买家昵称',
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
    key: 'TotalVolume',
    caption: '总体积数',
  },
  {
    key: 'MarkStatus',
    caption: '标记状态',
  },
  {
    key: 'BillType',
    caption: '单据类型',
    relationKey: 'BillTypeCode',
    filter: [
      {
        groupCodes: ['ZD_OMS_DeliveryOrder'],
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
    key: 'TotalPackage',
    caption: '总包件数',
  },
  {
    key: 'Group',
    caption: '分组',
  },
  {
    key: 'TotalOrderCount',
    caption: '订单总数',
  },
  {
    key: 'CustomerSalesman',
    caption: '业务员',
  },
  {
    key: 'Memo',
    caption: '备注',
  },
  {
    key: 'OperationStatus',
    caption: '业务状态',
  },
  {
    key: 'DetailRowsCount',
    caption: '明细行数',
  },
  {
    key: 'IsGatheringOrder',
    caption: '集货订单',
  },
  {
    key: 'IsAgencyOrder',
    caption: '经销商订单',
  },
  {
    key: 'IsRecycling',
    caption: '回收服务',
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
    relationKey: 'ThreeServiceSupplier',
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
    key: 'FreightTypeCode',
    caption: '运费类型编码',
  },
  {
    key: 'FreightType',
    caption: '运费类型',
    relationKey: 'FreightTypeCode',
    foundationList: [
      {
        key: 'FreightType_Name',
        caption: '运费类型',
      },
    ],
    datatypekeies: 'freight-types',
  },
  {
    key: 'LogisticsCostPrice',
    caption: '物流成本',
  },
  {
    key: 'ThreeServiceCostPrice',
    caption: '三包成本',
  },
  {
    key: 'LogisticCode',
    caption: '物流单号',
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
    key: 'CustomerType',
    caption: '客户类型',
    relationKey: 'CustomerTypeCode',
    foundationList: [
      {
        key: 'CustomerType_Name',
        caption: '客户类型',
      },
    ],
    datatypekeies: 'customer-types',
  },
  {
    key: 'CustomerTypeCode',
    caption: '客户类型编码',
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
    key: 'OutBillFormCode',
    caption: '原单标识',
  },
  {
    key: 'OutSaleBillCode',
    caption: '销售单号',
  },
  {
    key: 'CancelledTime',
    caption: '作废时间',
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
    key: 'IsCancelled',
    caption: '作废状态',
  },
  {
    key: 'OutSourceBillType',
    caption: '原单类型',
  },
  {
    key: 'PushDownStatus',
    caption: '下推状态',
  },
  {
    key: 'PushDownTime',
    caption: '下推时间',
  },
];

export const getColumns = async () => {
  return await getColumnList('shipping-orders', customColumns);
};
