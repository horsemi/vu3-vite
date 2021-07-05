import type { IDefiniteItem, IDetailItem } from './types';
import type { ITableOptions } from '/@/components/Table/types';

import { getDefiniteDataSource, getDetailDataSource } from './common';
import { baseDataPre } from '../table/common';

export const base: IDetailItem[] = [
  {
    dataField: 'BillCode',
    label: '单据编号',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'BillDate',
    label: '单据日期',
    editorType: 'dxDateBox',
  },
  {
    dataField: 'TotalPackage',
    label: '总包件数',
    editorType: 'dxNumberBox',
  },
  {
    dataField: 'MarkStatus',
    label: '标记状态',
    editorType: 'dxSelectBox',
  },
  {
    dataField: 'BillTypeCode',
    label: '单据类型',
    editorType: 'dxSelectBox',
  },
  {
    dataField: 'ServiceItemCode',
    label: '服务项目',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'TotalPackage',
    label: '总包裹数',
    editorType: 'dxNumberBox',
  },
  {
    dataField: 'Group',
    label: '分组',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'DocumentStatus',
    label: '单据状态',
    editorType: 'dxSelectBox',
  },
  {
    dataField: 'TotalOrderCount',
    label: '订单总数',
    editorType: 'dxNumberBox',
  },
  {
    dataField: 'TotalVolume',
    label: '总体积',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'CustomerSalesman',
    label: '客户业务员',
    editorType: 'dxTextBox',
    disabled: true,
  },
  {
    dataField: 'OperationStatus',
    label: '业务状态',
    editorType: 'dxSelectBox',
  },
  {
    dataField: 'DetailRowsCount',
    label: '明细行数',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'IsGatheringOrder',
    label: '集货订单',
    editorType: 'dxSwitch',
  },
  {
    dataField: 'IsAgencyOrder',
    label: '经销商订单',
    editorType: 'dxSwitch',
  },
  {
    dataField: 'IsRecycling',
    label: '回收服务',
    editorType: 'dxSwitch',
  },
];

export const consignee: IDetailItem[] = [
  {
    dataField: 'Nickname',
    label: '买家昵称',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'Receiver',
    label: '收货人',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'Telephone',
    label: '电话',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'RecyclingMemo',
    label: '回收备注',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'ProvinceCode',
    label: '省',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'CityCode',
    label: '市',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'DistrictCode',
    label: '区',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'StreetCode',
    label: '街道',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'AgencyCode',
    label: '经销商',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'PromisedDeliveryDate',
    label: '承诺发货时间',
    editorType: 'dxDateBox',
  },
  {
    dataField: 'DetailAddress',
    label: '详细地址',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'ShowroomContacts',
    label: '展厅联系人',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'ShowroomTelephone',
    label: '展厅电话',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'ShowroomAddress',
    label: '展厅提货地址',
    editorType: 'dxTextBox',
  },
];

export const logistics: IDetailItem[] = [
  {
    dataField: 'GatheringPointCode',
    label: '集货点',
    editorType: 'dxTextBox',
    datatypekeies: `${baseDataPre}gathering-points`
  },
  {
    dataField: 'ThreeServicePointCode',
    label: '三包点',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'ContractorCode',
    label: '中转承运商',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'ThreeServiceFeeTypeCode',
    label: '三包费用类型',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'DeliveryPointCode',
    label: '提货点',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'LineAreaCode',
    label: '线路区域',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'ThreeServiceSupplierCode',
    label: '三包服务商',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'FreightTypeCode',
    label: '运费类型',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'LogisticsCostPrice',
    label: '物流成本',
    editorType: 'dxNumberBox',
  },
  {
    dataField: 'ThreeServiceCostPrice',
    label: '三包成本',
    editorType: 'dxNumberBox',
  },
  {
    dataField: 'LogisticCode',
    label: '物流单号',
    editorType: 'dxTextBox',
  },
];

export const other: IDetailItem[] = [
  {
    dataField: 'CreatedTime',
    label: '创建时间',
    editorType: 'dxDateBox',
  },
  {
    dataField: 'CreatorId',
    label: '创建人',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'CustomerTypeCode',
    label: '客户类型',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'GatheringParentCode',
    label: '父单号',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'AppliedTime',
    label: '审核时间',
    editorType: 'dxDateBox',
  },
  {
    dataField: 'ApplierId',
    label: '审核人',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'CustomerCode',
    label: '客户',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'OutSourceBillCode',
    label: '外部原单编号',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'UpdatedTime',
    label: '修改时间',
    editorType: 'dxDateBox',
  },
  {
    dataField: 'UpdaterId',
    label: '修改人',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'OutBillFormCode',
    label: '外部原单标识',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'OutSaleBillCode',
    label: '外部销售单号',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'CancelledTime',
    label: '作废时间',
    editorType: 'dxDateBox',
  },
  {
    dataField: 'CancellerId',
    label: '作废人',
    editorType: 'dxTextBox',
  },
  {
    dataField: 'IsCancelled',
    label: '作废状态',
    editorType: 'dxSelectBox',
  },
  {
    dataField: 'OutSourceBillType',
    label: '外部原单类型',
    editorType: 'dxSelectBox',
  },
  {
    dataField: 'PushDownStatus',
    label: '下推状态',
    editorType: 'dxSelectBox',
  },
  {
    dataField: 'PushDownTime',
    label: '下推时间',
    editorType: 'dxDateBox',
  },
];

export const customDefinite: IDefiniteItem[] = [
  {
    key: 'ShippingOrderId',
    caption: 'ShippingOrderId',
    hide: true,
  },
  {
    key: 'MaterialCode',
    caption: '物料编码',
  },
  {
    key: 'BomCode',
    caption: 'BOM版本',
  },
  {
    key: 'CustomerMaterialName',
    caption: '客户物料名称',
  },
  {
    key: 'Qty',
    caption: '数量',
  },
  {
    key: 'PackageQuantity',
    caption: '包件数',
  },
  {
    key: 'Shop',
    caption: '店铺',
  },
  {
    key: 'Channel',
    caption: '渠道',
  },
  {
    key: 'ProvideSalePrice',
    caption: '供货售价',
  },
  {
    key: 'ActualSalePrice',
    caption: '实际售价',
  },
];

export const getDetailData = async (filter: any[]) => {
  const select = base.concat(consignee).concat(logistics).concat(other).map((item) => item.dataField);
  const data = await getDetailDataSource('shipping-orders', select, filter);
  return data[0];
};

export const getDefiniteData = async (options: ITableOptions, filter: any[]) => {
  const select = customDefinite.map((item) => item.key);
  return await getDefiniteDataSource('shipping-order-items', select, filter, options);
};
