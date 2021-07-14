import type { ITableOptions } from '/@/components/Table/types';
import type { IDefiniteItem, IDetailItem } from '/@/utils/detail/types';

import { getDefiniteDataSource, getDetailDataSource } from '/@/api/ods/detail';
import { getColumns } from '/@/model/shipping-advices';
import { getFormList } from '/@/utils/detail';
import { isFoundationType } from '/@/model/common';

export const base: IDetailItem[] = [
  {
    dataField: 'BillCode',
  },
  {
    dataField: 'BillTypeCode',
  },
  {
    dataField: 'DeliveryWarehouseCode',
  },
  {
    dataField: 'TotalPackage',
  },
  {
    dataField: 'DocumentStatus',
  },
  {
    dataField: 'BillDate',
  },
  {
    dataField: 'BranchLineType',
  },
  {
    dataField: 'TotalPack',
  },
  {
    dataField: 'OperationStatus',
  },
  {
    dataField: 'MarkStatus',
  },
  {
    dataField: 'TotalOrderCount',
  },
  {
    dataField: 'TotalVolume',
  },
  {
    dataField: 'Memo',
    colSpan: 4,
  },
  {
    dataField: 'SentStatus',
  },
  {
    dataField: 'IsGatheringOrder',
  },
  {
    dataField: 'IsMergeLockOrder',
  },
];

export const receiver: IDetailItem[] = [
  {
    dataField: 'Nickname',
  },
  {
    dataField: 'Receiver',
  },
  {
    dataField: 'Telephone',
  },
  {
    dataField: 'TotalActualPrice',
  },
  {
    dataField: 'ProvinceCode',
  },
  {
    dataField: 'CityCode',
  },
  {
    dataField: 'DistrictCode',
  },
  {
    dataField: 'StreetCode',
  },
  {
    dataField: 'AgencyCode',
  },
  {
    dataField: 'PromisedDeliveryDate',
  },
  {
    dataField: 'DetailAddress',
    colSpan: 4,
  },
  {
    dataField: 'ShowroomContacts',
  },
  {
    dataField: 'ShowroomTelephone',
  },
  {
    dataField: 'ShowroomAddress',
    colSpan: 4,
  },
  {
    dataField: 'IsAgencyOrder',
  },
  {
    dataField: 'IsInstall',
  },
  {
    dataField: 'IsRecycling',
  },
  {
    dataField: 'IsExistMarble',
  },
];

export const logistics: IDetailItem[] = [
  {
    dataField: 'GatheringPointCode',
  },
  {
    dataField: 'NonstopContractorCode',
  },
  {
    dataField: 'HandCarLine',
  },
  {
    dataField: 'TrainCode',
  },
  {
    dataField: 'DeliveryPointCode',
  },
  {
    dataField: 'TransitContractorCode',
  },
  {
    dataField: 'SmallCarLine',
  },
  {
    dataField: 'CarModeCode',
  },
  {
    dataField: 'ThreeServicePointCode',
  },
  {
    dataField: 'ContractorCode',
  },
  {
    dataField: 'HandCarGroup',
  },
  {
    dataField: 'LoadType',
  },
  {
    dataField: 'ThreeServiceCostPrice',
  },
  {
    dataField: 'ThreeServiceSupplierCode',
  },
  {
    dataField: 'SmallCarGroup',
  },
  {
    dataField: 'SendGoodsMode',
  },
  {
    dataField: 'ThreeServiceFeeTypeCode',
  },
  {
    dataField: 'LineAreaCode',
  },
  {
    dataField: 'LogisticsCostPrice',
  },
  {
    dataField: 'LogisticCode',
  },
  {
    dataField: 'FreightTypeCode',
  },
  {
    dataField: 'LogisticsLine',
  },
  {
    dataField: 'ServiceItemCode',
  },
];

export const express: IDetailItem[] = [
  {
    dataField: 'BagsCentralizeAddress',
  },
  {
    dataField: 'ExpressSiteName',
  },
  {
    dataField: 'LogisticNoMsg',
  },
  {
    dataField: 'LogisticNoStatus',
  },
  {
    dataField: 'PaintMarker',
  },
  {
    dataField: 'ExpressStandard',
  },
  {
    dataField: 'PaintMarkerMsg',
  },
  {
    dataField: 'PaintMarkerStatus',
  },
  {
    dataField: 'TotalWeight',
  },
];

export const task: IDetailItem[] = [
  {
    dataField: 'BatchCode',
  },
  {
    dataField: 'PromisedDeliveryDate',
  },
  {
    dataField: 'SentDate',
  },
  {
    dataField: 'ReturnGoodsStatus',
  },
  {
    dataField: 'LockBatchTime',
  },
  {
    dataField: 'SendGoodsTimeOut',
  },
  {
    dataField: 'CancelledTime',
  },
  {
    dataField: 'InterceptReasonCode',
  },
  {
    dataField: 'LockBatchUserCode',
  },
  {
    dataField: 'SendGoodsTime',
  },
  {
    dataField: 'CancellerId',
  },
  {
    dataField: 'InterceptTypeCode',
  },
  {
    dataField: 'IsTally',
    template: 'stepBar',
    colSpan: 4,
  },
  {
    dataField: 'IsEntry',
    hide: true,
  },
  {
    dataField: 'IsTransfer',
    hide: true,
  },
  {
    dataField: 'IsClean',
    hide: true,
  },
  {
    dataField: 'IsCancelled',
  },
];

export const other: IDetailItem[] = [
  {
    dataField: 'CreatedTime',
  },
  {
    dataField: 'UpdatedTime',
  },
  {
    dataField: 'CustomerCode',
  },
  {
    dataField: 'GatheringParentCode',
  },
  {
    dataField: 'CreatorId',
  },
  {
    dataField: 'UpdaterId',
  },
  {
    dataField: 'Group',
  },
  {
    dataField: 'OutSourceBillCode',
  },
  {
    dataField: 'AppliedTime',
  },
  {
    dataField: 'AreaName',
  },
  {
    dataField: 'CustomerSalesman',
  },
  {
    dataField: 'OutSaleBillCode',
  },
  {
    dataField: 'ApplierId',
  },
  {
    dataField: 'TotalMarble',
  },
  {
    dataField: 'TaoBaoCode',
  },
  {
    dataField: 'OutBillFormCode',
  },
  {
    dataField: 'SentMemo',
    colSpan: 6,
  },
  {
    dataField: 'OutSourceBillType',
  },
];

export const customDefinite: IDefiniteItem[] = [
  {
    key: 'ShippingAdviceId',
    caption: 'ShippingAdviceId',
    hide: true,
  },
  {
    key: 'MaterialCode',
    caption: '物料编码',
  },
  // {
  //   key: 'MaterialName',
  //   caption: '物料名称',
  // },
  // {
  //   key: '',
  //   caption: '规格描述',
  // },
  // {
  //   key: '',
  //   caption: '小商品条码',
  // },
  {
    key: 'DefaultAreaCode',
    caption: '默认区域',
  },
  {
    key: 'UnitCode',
    caption: '单位',
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
    caption: '仓库',
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
  // {
  //   key: '',
  //   caption: '父项物业编码',
  // },
  {
    key: 'IsMarble',
    caption: '大理石',
  },
  {
    key: 'IsGaAllows',
    caption: '打木架',
  },
  {
    key: 'OutSourceBillCode',
    caption: '外部原单编号',
  },
  {
    key: 'ActualSalePrice',
    caption: '实际售价',
  },
  {
    key: 'Memo',
    caption: '备注',
  },
  // {
  //   key: '',
  //   caption: '源单编号',
  // },
  {
    key: 'OutRowCode',
    caption: '源单行号',
  },
  {
    key: 'TaoBaoCode',
    caption: '淘宝单号',
  },
  {
    key: 'TaoBaoSubCode',
    caption: '淘宝子单号',
  },
  {
    key: 'IsVerification',
    caption: '是否核销',
  },
  {
    key: 'Channel',
    caption: '渠道',
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

export const getDetailData = async (filter: any[]) => {
  const columnsData = await getColumns();
  if (!columnsData) return;
  const { columnList } = columnsData;
  const baseList = getFormList(base, columnList);
  const receiverList = getFormList(receiver, columnList);
  const logisticsList = getFormList(logistics, columnList);
  const expressList = getFormList(express, columnList);
  const taskList = getFormList(task, columnList);
  const otherList = getFormList(other, columnList);

  const select: string[] = [];
  const expand: string[] = [];

  baseList.forEach((item) => {
    if (isFoundationType(item)) {
      expand.push(item.expand as string);
    }
    select.push(item.dataField);
  });
  receiverList.forEach((item) => {
    if (isFoundationType(item)) {
      expand.push(item.expand as string);
    }
    select.push(item.dataField);
  });
  logisticsList.forEach((item) => {
    if (isFoundationType(item)) {
      expand.push(item.expand as string);
    }
    select.push(item.dataField);
  });
  expressList.forEach((item) => {
    if (isFoundationType(item)) {
      expand.push(item.expand as string);
    }
    select.push(item.dataField);
  });
  taskList.forEach((item) => {
    if (isFoundationType(item)) {
      expand.push(item.expand as string);
    }
    select.push(item.dataField);
  });
  otherList.forEach((item) => {
    if (isFoundationType(item)) {
      expand.push(item.expand as string);
    }
    select.push(item.dataField);
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

export const getDefiniteData = async (options: ITableOptions, filter: any[]) => {
  const select = customDefinite.map((item) => item.key);
  return await getDefiniteDataSource('shipping-advice-items', select, filter, options);
};
