import { getDetailDataSource } from './common';
import { IDetailItem } from './types';

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

export const getDetaildata = async (filter: any[]) => {
  const selectArr = customDetail.map(item => item.dataField);
  const select = selectArr.toString();
  const data = await getDetailDataSource('shipping-orders', selectArr[0], select, filter);
  return data[0];
};

