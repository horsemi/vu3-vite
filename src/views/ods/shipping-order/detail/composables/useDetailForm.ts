import type { IColumnItem } from '/@/model/types';
import type { IDetailItem } from '/@/utils/bill/types';

import { getFormList } from '/@/utils/bill';
import { isFoundationType } from '/@/model/common';
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

  const logistics: IDetailItem[] = [
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

  const other: IDetailItem[] = [
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
        if (isFoundationType(item)) {
          expand.push(item.expand as string);
        }
        select.push(item.key);
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
        if (isFoundationType(item)) {
          refData.value[item.expand!] = (data as Record<string, unknown>)[item.expand!];
        }
        refData.value[item.key!] = (data as Record<string, unknown>)[item.key!];
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
