import type { IColumnItem } from './types';

import { getColumnList } from './common';

export const customColumns: IColumnItem[] = [
  {
    key: 'billCode',
    caption: '单据编号',
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
    key: 'documentStatus',
    caption: '单据状态',
  },
  {
    key: 'deliveryWarehouse',
    caption: '仓库',
    relationKey: 'deliveryWarehouseCode',
    foundationList: [
      {
        key: 'deliveryWarehouse_name',
        caption: '仓库',
      },
      {
        key: 'deliveryWarehouse_groupName',
        caption: '仓库分组',
      },
    ],
    datatypekeies: 'stocks',
  },
  {
    key: 'deliveryWarehouseCode',
    caption: '仓库编码',
    datatypekeies: 'stocks',
  },
  {
    key: 'nickname',
    caption: '买家昵称',
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
    key: 'totalVolume',
    caption: '总体积数',
  },
  {
    key: 'markStatus',
    caption: '标记状态',
  },
  {
    key: 'billType',
    caption: '单据类型',
    relationKey: 'billTypeCode',
    filter: [
      {
        groupCodes: ['ZD_OMS_DeliveryOrder'],
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
    key: 'totalPackage',
    caption: '总包件数',
  },
  {
    key: 'group',
    caption: '分组',
  },
  {
    key: 'totalOrderCount',
    caption: '订单总数',
  },
  {
    key: 'customerSalesman',
    caption: '业务员',
  },
  {
    key: 'memo',
    caption: '备注',
  },
  {
    key: 'operationStatus',
    caption: '业务状态',
  },
  {
    key: 'detailRowsCount',
    caption: '明细行数',
  },
  {
    key: 'isGatheringOrder',
    caption: '集货订单',
  },
  {
    key: 'isAgencyOrder',
    caption: '经销商订单',
  },
  {
    key: 'isRecycling',
    caption: '回收服务',
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
    key: 'recyclingMemo',
    caption: '回收备注',
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
    key: 'streetCode',
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
    key: 'lineArea',
    caption: '线路区域',
    relationKey: 'lineAreaCode',
    foundationList: [
      {
        key: 'lineArea_Name',
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
    key: 'logisticsCostPrice',
    caption: '物流成本',
  },
  {
    key: 'threeServiceCostPrice',
    caption: '三包成本',
  },
  {
    key: 'logisticCode',
    caption: '物流单号',
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
    key: 'customerType',
    caption: '客户类型',
    relationKey: 'customerTypeCode',
    foundationList: [
      {
        key: 'customerType_name',
        caption: '客户类型',
      },
    ],
    datatypekeies: 'customer-types',
  },
  {
    key: 'customerTypeCode',
    caption: '客户类型编码',
    datatypekeies: 'customer-types',
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
    key: 'outBillFormCode',
    caption: '原单标识',
  },
  {
    key: 'outSaleBillCode',
    caption: '销售单号',
  },
  {
    key: 'cancelledTime',
    caption: '作废时间',
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
    key: 'isCancelled',
    caption: '作废状态',
  },
  {
    key: 'outSourceBillType',
    caption: '原单类型',
  },
  {
    key: 'pushDownStatus',
    caption: '下推状态',
  },
  {
    key: 'pushDownTime',
    caption: '下推时间',
  },
];

export const getColumns = async () => {
  return await getColumnList({ code: 'shipping-orders', customColumns });
};
