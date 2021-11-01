import type { IDetailItem } from '/@/utils/bill/types';
import type { IColumnItem } from '/@/model/types';

import { getDetailDataSource } from '/@/api/ods/detail';
import { getFormList } from '/@/utils/bill';
import { isFoundationType } from '/@/model/common';

export const base: IDetailItem[] = [
  {
    key: 'BillCode',
    caption: '单据编号',
  },
  {
    key: 'BillTypeCode',
    caption: '单据类型',
  },
  {
    key: 'BillDate',
    caption: '单据日期',
  },
  {
    key: 'DeliveryWarehouseCode',
    caption: '仓库',
  },
  {
    key: 'DocumentStatus',
    caption: '单据状态',
  },
  {
    key: 'CustomerCode',
    caption: '客户',
  },
  {
    key: 'TotalOrderCount',
    caption: '订单总数',
  },
  {
    key: 'TotalPackage',
    caption: '总包件数',
  },
  {
    key: 'OperationStatus',
    caption: '业务状态',
  },
  {
    key: 'CustomerSalesman',
    caption: '业务员',
  },
  {
    key: 'DetailRowsCount',
    caption: '明细行数',
  },
  {
    key: 'TotalVolume',
    caption: '总体积数',
  },
  {
    key: 'IsGatheringOrder',
    caption: '集货订单',
  },
  // {
  //   key: 'IsRecycling',
  //   caption: '回收服务',
  // },
  {
    key: 'IsAgencyOrder',
    caption: '经销商订单',
  },
  {
    key: 'PushDownStatus',
    caption: '下推状态',
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
    key: 'Group',
    caption: '分组',
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
];

export const logistics: IDetailItem[] = [
  {
    key: 'GatheringPointCode',
    caption: '集货点',
  },
  {
    key: 'LineAreaCode',
    caption: '线路区域',
  },
  {
    key: 'ThreeServiceCostPrice',
    caption: '三包成本',
  },
  {
    key: 'ServiceItemCode',
    caption: '服务项目',
  },
  {
    key: 'DeliveryPointCode',
    caption: '提货点',
  },
  {
    key: 'ContractorCode',
    caption: '中转承运商',
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
    key: 'ThreeServicePointCode',
    caption: '三包点',
  },
  {
    key: 'ThreeServiceSupplierCode',
    caption: '三包服务商',
  },
  {
    key: 'LogisticCode',
    caption: '物流单号',
  },
  {
    key: 'FreightTypeCode',
    caption: '运费类型',
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
    key: 'CustomerTypeCode',
    caption: '客户类型',
  },
  {
    key: 'GatheringParentCode',
    caption: '父单号',
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
    caption: '修改人',
    keyProperty: 'Id',
    showProperty: 'AccountName',
  },
  {
    key: 'PushDownTime',
    caption: '下推时间',
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
    caption: '作废人',
    keyProperty: 'Id',
    showProperty: 'AccountName',
  },
  {
    key: 'MarkStatus',
    caption: '标记状态',
  },
  {
    key: 'OutSourceBillType',
    caption: '原单类型',
  },
  {
    key: 'IsCancelled',
    caption: '作废状态',
  },
];

export const definite: IColumnItem[] = [
  {
    key: 'ShippingOrderId',
    caption: 'ShippingOrderId',
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
    key: 'UnitCode',
    caption: '单位编码',
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
    key: 'WarehouseCode',
    caption: '仓库编码',
  },
  {
    key: 'DeliveryWarehouse_Name',
    caption: '仓库名称',
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
    key: 'ParentMaterialCode',
    caption: '父项物料编码',
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
    key: 'TaoBaoCode',
    caption: '平台单号',
  },
  {
    key: 'TaoBaoSubCode',
    caption: '平台子单号',
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
    key: 'ProvideSalePrice',
    caption: '供货售价',
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
  const [baseList, receiverList, logisticsList, otherList] = getFormList(columnList, [
    base,
    receiver,
    logistics,
    other,
  ]);

  const select: string[] = [];
  const expand: string[] = [];

  [baseList, receiverList, logisticsList, otherList].forEach((list) => {
    list.forEach((item) => {
      if (isFoundationType(item)) {
        expand.push(item.expand as string);
      }
      select.push(item.key);
    });
  });

  const data = await getDetailDataSource('shipping-orders', select, expand, filter);

  return {
    baseList,
    receiverList,
    logisticsList,
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
