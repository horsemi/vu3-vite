import { getDefiniteDataSource, getDetailDataSource } from './common';
import { IDefiniteItem, IDetailItem } from './types';

export const customDetail: IDetailItem[] = [
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
  const select = customDetail.map((item) => item.dataField);
  select.push('Id');
  const data = await getDetailDataSource('shipping-orders', select, filter);
  return data[0];
};

export const getDefiniteData = async (filter: any[]) => {
  const select = customDefinite.map((item) => item.key);
  return await getDefiniteDataSource('shipping-order-items', select, filter);
};
