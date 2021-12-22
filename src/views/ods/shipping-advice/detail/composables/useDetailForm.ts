import type { IColumnItem } from '/@/model/types';
import type { IDetailItem } from '/@/utils/bill/types';

import { getFormList } from '/@/utils/bill';
import { isFoundationType } from '/@/model/common';
import { getColumns } from '/@/model/shipping-advices';
import { Ref, ref } from 'vue';
import { getOdataList } from '/@/api/ods/common';

export function useDetailForm(
  id: string,
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
      key: 'billCode',
      caption: '单据编码',
    },
    {
      key: 'billTypeCode',
      caption: '单据类型',
    },
    {
      key: 'deliveryWarehouseCode',
      caption: '发货仓库',
    },
    {
      key: 'totalPackage',
      caption: '总包件数',
    },
    {
      key: 'documentStatus',
      caption: '单据状态',
    },
    {
      key: 'billDate',
      caption: '单据日期',
    },
    {
      key: 'batchCode',
      caption: '发货批次',
    },
    {
      key: 'totalPack',
      caption: '总包裹数',
    },
    {
      key: 'operationStatus',
      caption: '业务状态',
    },
    {
      key: 'markStatus',
      caption: '标记状态',
    },
    {
      key: 'totalOrderCount',
      caption: '总订单数',
    },
    {
      key: 'totalVolume',
      caption: '总体积数',
    },
    {
      key: 'isGatheringOrder',
      caption: '集货订单',
    },
    {
      key: 'isMergeLockOrder',
      caption: '合并锁单',
    },
    {
      key: 'isAgencyOrder',
      caption: '经销商订单',
      colSpan: 2,
    },
  ];

  const receiver: IDetailItem[] = [
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
      key: 'provinceCode',
      caption: '省',
    },
    {
      key: 'cityCode',
      caption: '市',
    },
    {
      key: 'districtCode',
      caption: '区',
    },
    {
      key: 'streetCode',
      caption: '街道',
    },
    {
      key: 'agencyCode',
      caption: '经销商',
    },
    {
      key: 'promisedDeliveryDate',
      caption: '承诺发货时间',
    },
    {
      key: 'detailAddress',
      caption: '详细地址',
      colSpan: 4,
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
      colSpan: 4,
    },
    // {
    //   key: 'IsRecycling',
    //   caption: '回收服务',
    // },
    {
      key: 'memo',
      caption: '备注',
      colSpan: 4,
    },
  ];

  const logistics: IDetailItem[] = [
    {
      key: 'gatheringPointCode',
      caption: '集货点',
    },
    {
      key: 'nonstopContractorCode',
      caption: '直达承运商',
    },
    {
      key: 'handCarLine',
      caption: '挂车路线',
    },
    {
      key: 'trainCode',
      caption: '车次',
    },
    {
      key: 'deliveryPointCode',
      caption: '提货点',
    },
    {
      key: 'transitContractorCode',
      caption: '转运承运商',
    },
    {
      key: 'smallCarLine',
      caption: '小挂路线',
    },
    {
      key: 'carModeCode',
      caption: '车型',
    },
    {
      key: 'threeServicePointCode',
      caption: '三包点',
    },
    {
      key: 'contractorCode',
      caption: '中转承运商',
    },
    {
      key: 'handCarGroup',
      caption: '挂车组合',
      showProperty: 'GroupName',
    },
    {
      key: 'loadType',
      caption: '配载方式',
    },
    {
      key: 'threeServiceCostPrice',
      caption: '三包成本',
    },
    {
      key: 'threeServiceSupplierCode',
      caption: '三包服务商',
    },
    {
      key: 'smallCarGroup',
      caption: '小挂组合',
      showProperty: 'GroupName',
    },
    {
      key: 'sendGoodsMode',
      caption: '发货模式',
    },
    {
      key: 'serviceItemCode',
      caption: '服务项目',
    },
    {
      key: 'logisticCode',
      caption: '物流单号',
    },

    {
      key: 'lineAreaCode',
      caption: '线路区域',
    },
    {
      key: 'logisticsCostPrice',
      caption: '物流成本',
    },
    {
      key: 'threeServiceFeeTypeCode',
      caption: '三包费用类型',
    },
    {
      key: 'branchLineType',
      caption: '支装类型',
    },
    {
      key: 'logisticsLine',
      caption: '物流专线',
    },
    {
      key: 'freightTypeCode',
      caption: '运费类型',
    },
  ];

  const express: IDetailItem[] = [
    {
      key: 'bagsCentralizeAddress',
      caption: '集包地',
    },
    {
      key: 'expressSiteName',
      caption: '快递点名称',
    },
    {
      key: 'logisticNoMsg',
      caption: '快递号信息',
    },
    {
      key: 'logisticNoStatus',
      caption: '快递号状态',
    },
    {
      key: 'paintMarker',
      caption: '大头笔',
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
      key: 'paintMarkerStatus',
      caption: '大头笔状态',
    },
    {
      key: 'totalWeight',
      caption: '重量',
    },
  ];

  const task: IDetailItem[] = [
    {
      key: 'lockBatchTime',
      caption: '锁定批次时间',
    },
    {
      key: 'promisedDeliveryDate',
      caption: '承诺发货时间',
    },
    {
      key: 'sentDate',
      caption: '发送时间',
    },
    {
      key: 'returnGoodsStatus',
      caption: '退货状态',
    },
    {
      key: 'lockBatchUserCode',
      caption: '锁定批次人',
      keyProperty: 'id',
      showProperty: 'accountName',
    },
    {
      key: 'sendGoodsTimeOut',
      caption: '发货超时时间',
    },
    {
      key: 'cancelledTime',
      caption: '作废时间',
    },
    {
      key: 'interceptReasonCode',
      caption: '截货原因',
    },
    {
      key: 'detailRowsCount',
      caption: '明细行数',
    },
    {
      key: 'sendGoodsTime',
      caption: '发货时间',
    },
    {
      key: 'cancellerId',
      caption: '作废人',
      keyProperty: 'id',
      showProperty: 'accountName',
    },
    {
      key: 'interceptTypeCode',
      caption: '截货类型',
    },
    {
      key: 'areaName',
      caption: '区域',
    },
    {
      key: 'isEntry',
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
      key: 'isInstall',
      caption: '上门服务',
    },
    {
      key: 'isCancelled',
      caption: '作废状态',
    },
  ];

  const other: IDetailItem[] = [
    {
      key: 'createdTime',
      caption: '创建时间',
    },
    {
      key: 'creatorId',
      caption: '创建人',
      keyProperty: 'id',
      showProperty: 'accountName',
    },
    {
      key: 'customerCode',
      caption: '客户',
    },
    {
      key: 'gatheringParentCode',
      caption: '父单号',
    },
    {
      key: 'updatedTime',
      caption: '修改时间',
    },
    {
      key: 'updaterId',
      caption: '修改人',
      keyProperty: 'id',
      showProperty: 'accountName',
    },
    {
      key: 'group',
      caption: '分组',
    },
    {
      key: 'outSourceBillCode',
      caption: '原单编号',
    },
    {
      key: 'appliedTime',
      caption: '审核时间',
    },
    {
      key: 'applierId',
      caption: '审核人',
      keyProperty: 'id',
      showProperty: 'accountName',
    },
    {
      key: 'customerSalesman',
      caption: '业务员',
    },
    {
      key: 'outSaleBillCode',
      caption: '销售单号',
    },
    {
      key: 'sentStatus',
      caption: '发送状态',
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
      key: 'outBillFormCode',
      caption: '原单标识',
    },
    {
      key: 'sentMemo',
      caption: '发送备注',
      colSpan: 6,
    },
    {
      key: 'outSourceBillType',
      caption: '原单类型',
    },
  ];

  const formData = ref();

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
        if (isFoundationType(item)) {
          expand.push(item.expand as string);
        }
        select.push(item.key);
      });
    });

    const detailRes = await getOdataList('shipping-advices', {
      $select: select.join(','),
      $expand: expand.join(','),
      $filter: `id eq '${id}'`,
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
        if (isFoundationType(item)) {
          refData.value[item.expand!] = (data as Record<string, unknown>)[item.expand!];
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
  };

  getColumns().then((res) => {
    if (res) {
      columnList = res.columnList;
      refreshDetailForm(callback);
    }
  });

  return {
    formData,
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
