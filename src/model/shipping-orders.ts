import type { IColumnItem } from './types';

import { baseDataPre, enumDataPre, getColumnList } from './common';

export interface IHeader {
  BillCode: string;
  BillDate: string;
  DocumentStatus: string;
  IsCancelled: boolean;
  TotalPackage: number;
  TotalVolume: number;
  Id: number;
}

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
    hide: true,
  },
  {
    key: 'BillDate',
    caption: '单据日期',
  },
  {
    key: 'DocumentStatus',
    caption: '单据状态',
    datatypekeies: `${enumDataPre}documentstatuses`,
  },
  {
    key: 'DeliveryWarehouseCode',
    caption: '仓库',
    datatypekeies: `${baseDataPre}stocks`,
  },
  {
    key: 'Nickname',
    caption: '买家昵称',
  },
  {
    key: 'DeliveryPointCode',
    caption: '提货点',
    datatypekeies: `${baseDataPre}delivery-points`,
  },
  {
    key: 'ThreeServicePointCode',
    caption: '三包点',
    datatypekeies: `${baseDataPre}three-service-points`,
  },
  {
    key: 'TotalVolume',
    caption: '总体积',
  },
  {
    key: 'MarkStatus',
    caption: '标记状态',
    datatypekeies: `${enumDataPre}markstatuses`,
  },
  {
    key: 'BillTypeCode',
    caption: '单据类型',
    datatypekeies: `${enumDataPre}shippingOrderTypes`,
  },
  {
    key: 'ServiceItemCode',
    caption: '服务项目',
    datatypekeies: `${baseDataPre}service-contents`,
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
    caption: '客户业务员',
  },
  {
    key: 'OperationStatus',
    caption: '业务状态',
    datatypekeies: `${enumDataPre}operationstatuses`,
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
    key: 'GatheringPointCode',
    caption: '集货点',
    datatypekeies: `${baseDataPre}gathering-points`,
  },
  {
    key: 'ContractorCode',
    caption: '中转承运商',
    datatypekeies: `${baseDataPre}suppliers`,
  },
  {
    key: 'ThreeServiceFeeTypeCode',
    caption: '三包费用类型',
    datatypekeies: `${baseDataPre}three-service-cost-types`,
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
    key: 'FreightTypeCode',
    caption: '运费类型',
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
    caption: '创建人',
  },
  {
    key: 'CustomerTypeCode',
    caption: '客户类型',
    datatypekeies: `${baseDataPre}customer-types`,
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
    datatypekeies: `${baseDataPre}customers`,
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
    key: 'IsCancelled',
    caption: '作废状态',
  },
  {
    key: 'OutSourceBillType',
    caption: '外部原单类型',
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
