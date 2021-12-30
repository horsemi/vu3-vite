import type { IColumnItem } from '/@/model/types';
import type { IDetailItem } from '/@/utils/bill/types';

import { getFormList } from '/@/utils/bill';
import { getColumns } from '/@/model/entity/shipping-orders';
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
      caption: '单据编号',
    },
    {
      key: 'BillType',
      caption: '单据类型',
    },
    {
      key: 'BillDate',
      caption: '单据日期',
    },
    {
      key: 'DeliveryWarehouse',
      caption: '仓库',
    },
    {
      key: 'DocumentStatus',
      caption: '单据状态',
    },
    {
      key: 'Customer',
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
      key: 'Group',
      caption: '分组',
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
      key: 'Street',
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
  ];

  const logistics: IDetailItem[] = [
    {
      key: 'GatheringPoint',
      caption: '集货点',
    },
    {
      key: 'LineArea',
      caption: '线路区域',
    },
    {
      key: 'ThreeServiceCostPrice',
      caption: '三包成本',
    },
    {
      key: 'ServiceContent', // 原为 ServiceItemCode 但是 expand 为 ServiceContent
      caption: '服务项目',
    },
    {
      key: 'DeliveryPoint',
      caption: '提货点',
    },
    {
      key: 'Contractor',
      caption: '中转承运商',
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
      key: 'ThreeServicePoint',
      caption: '三包点',
    },
    {
      key: 'ThreeServiceSupplier',
      caption: '三包服务商',
    },
    {
      key: 'LogisticCode',
      caption: '物流单号',
    },
    {
      key: 'FreightType',
      caption: '运费类型',
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
      key: 'CustomerType',
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
      key: 'Applier',
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
      key: 'Updater',
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
      key: 'Canceller',
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

  const formData = ref();

  const baseFormData = ref<Record<string, unknown>>({});
  const receiverFormData = ref<Record<string, unknown>>({});
  const logisticsFormData = ref<Record<string, unknown>>({});
  const otherFormData = ref<Record<string, unknown>>({});

  const baseInformation = ref<IDetailItem[]>([]);
  const receiverInformation = ref<IDetailItem[]>([]);
  const logisticsInformation = ref<IDetailItem[]>([]);
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

    const detailRes = await getOdataList('shipping-orders', {
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
      });
    });

    baseInformation.value = baseList;
    receiverInformation.value = receiverList;
    logisticsInformation.value = logisticsList;
    otherInformation.value = otherList;
    [
      baseInformation.value,
      receiverInformation.value,
      logisticsInformation.value,
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
    otherFormData,
    baseInformation,
    receiverInformation,
    logisticsInformation,
    otherInformation,
    refreshDetailForm,
  };
}
