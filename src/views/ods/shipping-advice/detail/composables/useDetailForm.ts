import type { IColumnItem } from '/@/model/types';
import type { IDetailItem } from '/@/utils/bill/types';

import { getFormList } from '/@/utils/bill';
import { getColumns } from '/@/model/entity/shipping-advices';
import { Ref, ref } from 'vue';
import { getOdataList } from '/@/api/ods/common';

export function useDetailForm(
  Id: string,
  multiViewItems: Ref<
    {
      title: string;
      key: string;
      rowCount: number;
    }[]
  >,
  callback: () => void
) {
  const base: IDetailItem[] = [
    {
      key: 'BillCode',
      caption: '单据编码',
    },
    {
      key: 'BillType',
      caption: '单据类型',
    },
    {
      key: 'DeliveryWarehouse',
      caption: '发货仓库',
    },
    {
      key: 'TotalPackage',
      caption: '总包件数',
    },
    {
      key: 'DocumentStatus',
      caption: '单据状态',
    },
    {
      key: 'BillDate',
      caption: '单据日期',
    },
    {
      key: 'BatchCode',
      caption: '发货批次',
    },
    {
      key: 'TotalPack',
      caption: '总包裹数',
    },
    {
      key: 'OperationStatus',
      caption: '业务状态',
    },
    {
      key: 'MarkStatus',
      caption: '标记状态',
    },
    {
      key: 'TotalOrderCount',
      caption: '总订单数',
    },
    {
      key: 'TotalVolume',
      caption: '总体积数',
    },
    {
      key: 'IsGatheringOrder',
      caption: '集货订单',
    },
    {
      key: 'IsMergeLockOrder',
      caption: '合并锁单',
    },
    {
      key: 'IsAgencyOrder',
      caption: '经销商订单',
      colSpan: 2,
    },
  ];

  const receiver: IDetailItem[] = [
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
    },
    {
      key: 'City',
      caption: '市',
    },
    {
      key: 'District',
      caption: '区',
    },
    {
      key: 'StreetCode',
      caption: '街道',
    },
    {
      key: 'Agency',
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
    // {
    //   key: 'IsRecycling',
    //   caption: '回收服务',
    // },
    {
      key: 'Memo',
      caption: '备注',
      colSpan: 4,
    },
  ];

  const logistics: IDetailItem[] = [
    {
      key: 'GatheringPoint',
      caption: '集货点',
    },
    {
      key: 'NonstopContractor',
      caption: '直达承运商',
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
    },
    {
      key: 'TransitContractor',
      caption: '转运承运商',
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
    },
    {
      key: 'Contractor',
      caption: '中转承运商',
    },
    {
      key: 'HandCarGroup',
      caption: '挂车组合',
      showProperty: 'GroupName',
    },
    {
      key: 'LoadType',
      caption: '配载方式',
    },
    {
      key: 'ThreeServiceCostPrice',
      caption: '三包成本',
    },
    {
      key: 'ThreeServiceSupplier',
      caption: '三包服务商',
    },
    {
      key: 'SmallCarGroup',
      caption: '小挂组合',
      showProperty: 'GroupName',
    },
    {
      key: 'SendGoodsMode',
      caption: '发货模式',
    },
    {
      key: 'ServiceContent', // 原为 ServiceItemCode 但是 expand 为 ServiceContent
      caption: '服务项目',
    },
    {
      key: 'LogisticCode',
      caption: '物流单号',
    },
    {
      key: 'LineArea',
      caption: '线路区域',
    },
    {
      key: 'LogisticsCostPrice',
      caption: '物流成本',
    },
    {
      key: 'ThreeServiceCostType', // 原为 ThreeServiceFeeType 但是 expand 为 ThreeServiceCostType
      caption: '三包费用类型',
    },
    {
      key: 'BranchLineType',
      caption: '支装类型',
    },
    {
      key: 'LogisticsLine',
      caption: '物流专线',
    },
    {
      key: 'FreightType',
      caption: '运费类型',
    },
  ];

  const express: IDetailItem[] = [
    {
      key: 'BagsCentralizeAddress',
      caption: '集包地',
    },
    {
      key: 'ExpressSiteName',
      caption: '快递点名称',
    },
    {
      key: 'LogisticNoMsg',
      caption: '快递号信息',
    },
    {
      key: 'LogisticNoStatus',
      caption: '快递号状态',
    },
    {
      key: 'PaintMarker',
      caption: '大头笔',
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
      key: 'PaintMarkerStatus',
      caption: '大头笔状态',
    },
    {
      key: 'TotalWeight',
      caption: '重量',
    },
  ];

  const task: IDetailItem[] = [
    {
      key: 'LockBatchTime',
      caption: '锁定批次时间',
    },
    {
      key: 'PromisedDeliveryDate',
      caption: '承诺发货时间',
    },
    {
      key: 'SentDate',
      caption: '发送时间',
    },
    {
      key: 'ReturnGoodsStatus',
      caption: '退货状态',
    },
    {
      key: 'LockBatchUser',
      caption: '锁定批次人',
      keyProperty: 'Id',
      showProperty: 'AccountName',
    },
    {
      key: 'SendGoodsTimeOut',
      caption: '发货超时时间',
    },
    {
      key: 'CancelledTime',
      caption: '作废时间',
    },
    {
      key: 'InterceptReasonCode',
      caption: '截货原因',
    },
    {
      key: 'DetailRowsCount',
      caption: '明细行数',
    },
    {
      key: 'SendGoodsTime',
      caption: '发货时间',
    },
    {
      key: 'Canceller',
      caption: '作废人',
      keyProperty: 'Id',
      showProperty: 'AccountName',
    },
    {
      key: 'InterceptTypeCode',
      caption: '截货类型',
    },
    {
      key: 'AreaName',
      caption: '区域',
    },
    {
      key: 'IsEntry',
      caption: '进场',
      hide: true,
    },
    // {
    //   key: 'IsTransfer',
    //   caption: '交接',
    //   hide: true,
    // },
    // {
    //   key: 'IsClean',
    //   caption: '清货',
    //   hide: true,
    // },
    {
      key: 'IsInstall',
      caption: '上门服务',
    },
    {
      key: 'IsCancelled',
      caption: '作废状态',
    },
  ];

  const other: IDetailItem[] = [
    {
      key: 'CreatedTime',
      caption: '创建时间',
    },
    {
      key: 'Creator',
      caption: '创建人',
      keyProperty: 'Id',
      showProperty: 'AccountName',
    },
    {
      key: 'Customer',
      caption: '客户',
    },
    {
      key: 'GatheringParentCode',
      caption: '父单号',
    },
    {
      key: 'UpdatedTime',
      caption: '修改时间',
    },
    {
      key: 'Updater',
      caption: '修改人',
      keyProperty: 'Id',
      showProperty: 'AccountName',
    },
    {
      key: 'Group',
      caption: '分组',
    },
    {
      key: 'OutSourceBillCode',
      caption: '原单编号',
    },
    {
      key: 'AppliedTime',
      caption: '审核时间',
    },
    {
      key: 'Applier',
      caption: '审核人',
      keyProperty: 'Id',
      showProperty: 'AccountName',
    },
    {
      key: 'CustomerSalesman',
      caption: '业务员',
    },
    {
      key: 'OutSaleBillCode',
      caption: '销售单号',
    },
    {
      key: 'SentStatus',
      caption: '发送状态',
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
      key: 'OutBillFormCode',
      caption: '原单标识',
    },
    {
      key: 'SentMemo',
      caption: '发送备注',
      colSpan: 6,
    },
    {
      key: 'OutSourceBillType',
      caption: '原单类型',
    },
  ];

  const formData = ref();

  const formLoading = ref(true);

  const baseFormData = ref<Record<string, unknown>>({});
  const receiverFormData = ref<Record<string, unknown>>({});
  const logisticsFormData = ref<Record<string, unknown>>({});
  const expressFormData = ref<Record<string, unknown>>({});
  const taskFormData = ref<Record<string, unknown>>({});
  const otherFormData = ref<Record<string, unknown>>({});

  const baseInformation = ref<IDetailItem[]>([]);
  const receiverInformation = ref<IDetailItem[]>([]);
  const logisticsInformation = ref<IDetailItem[]>([]);
  const expressListInformation = ref<IDetailItem[]>([]);
  const taskInformation = ref<IDetailItem[]>([]);
  const otherInformation = ref<IDetailItem[]>([]);

  let columnList: IColumnItem[] = [];

  function getRowCount(data: IDetailItem[]) {
    const rowSpan = 8;
    let len = 0;
    data.forEach((item) => {
      if (!item.hide) {
        if (item.colSpan) {
          len += item.colSpan;
        } else if (item.editorType === 'dxSwitch') {
          len += 1;
        } else {
          len += 2;
        }
      }
    });
    return Math.ceil(len / rowSpan);
  }

  const refreshDetailForm = async (callback) => {
    if (!columnList || columnList.length === 0) return;
    formLoading.value = true;
    const [
      baseList,
      receiverList,
      logisticsList,
      expressList,
      taskList,
      otherList,
    ] = getFormList(columnList, [base, receiver, logistics, express, task, other]);

    const select: string[] = [];
    const expand: string[] = [];

    [baseList, receiverList, logisticsList, expressList, taskList, otherList].forEach((list) => {
      list.forEach((item) => {
        if (item.expand && item.expand === item.key) {
          const { key, keyProperty, showProperty } = item;
          const _keyProperty = keyProperty ?? 'Code';
          const _showProperty = showProperty ?? 'Name';
          expand.push(key);
          select.push(`${key}.${_keyProperty}`);
          select.push(`${key}.${_showProperty}`);
        } else {
          select.push(item.key);
        }
      });
    });

    const detailRes = await getOdataList('shipping-advices', {
      $select: select.join(','),
      $expand: expand.join(','),
      $filter: `Id eq '${Id}'`,
    });

    const data = detailRes[0];

    formData.value = {
      GatheringParentCode: (data as Record<string, unknown>).GatheringParentCode,
    };

    /** 实验性功能 */
    [
      { list: baseList, refData: baseFormData },
      { list: receiverList, refData: receiverFormData },
      { list: logisticsList, refData: logisticsFormData },
      { list: expressList, refData: expressFormData },
      { list: taskList, refData: taskFormData },
      { list: otherList, refData: otherFormData },
    ].forEach(({ list, refData }) => {
      list.forEach((item) => {
        if (item.expand && item.expand === item.key) {
          const { key, keyProperty, showProperty } = item;
          const _keyProperty = keyProperty ?? 'Code';
          const _showProperty = showProperty ?? 'Name';
          refData.value[`${key}_${_keyProperty}`] = (data as Record<string, unknown>)[
            `${key}_${_keyProperty}`
          ];
          refData.value[`${key}_${_showProperty}`] = (data as Record<string, unknown>)[
            `${key}_${_showProperty}`
          ];
        } else {
          refData.value[item.key!] = (data as Record<string, unknown>)[item.key!];
        }
        refData.value[item.key!] = (data as Record<string, unknown>)[item.key!];
      });
    });

    baseInformation.value = baseList;
    receiverInformation.value = receiverList;
    logisticsInformation.value = logisticsList;
    expressListInformation.value = expressList;
    taskInformation.value = taskList;
    otherInformation.value = otherList;
    [
      baseInformation.value,
      receiverInformation.value,
      logisticsInformation.value,
      expressListInformation.value,
      taskInformation.value,
      otherInformation.value,
    ].forEach((data, index) => {
      multiViewItems.value[index].rowCount = getRowCount(data);
    });
    callback();
    formLoading.value = false;
  };

  getColumns().then((res) => {
    if (res) {
      columnList = res.columnList;
      refreshDetailForm(callback);
    }
  });

  return {
    formData,
    formLoading,
    baseFormData,
    receiverFormData,
    logisticsFormData,
    expressFormData,
    taskFormData,
    otherFormData,
    baseInformation,
    receiverInformation,
    logisticsInformation,
    expressListInformation,
    taskInformation,
    otherInformation,
    refreshDetailForm,
  };
}
