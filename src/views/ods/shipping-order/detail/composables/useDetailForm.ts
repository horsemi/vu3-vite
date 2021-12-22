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
      caption: '单据编号',
    },
    {
      key: 'billTypeCode',
      caption: '单据类型',
    },
    {
      key: 'billDate',
      caption: '单据日期',
    },
    {
      key: 'deliveryWarehouseCode',
      caption: '仓库',
    },
    {
      key: 'documentStatus',
      caption: '单据状态',
    },
    {
      key: 'customerCode',
      caption: '客户',
    },
    {
      key: 'totalOrderCount',
      caption: '订单总数',
    },
    {
      key: 'totalPackage',
      caption: '总包件数',
    },
    {
      key: 'operationStatus',
      caption: '业务状态',
    },
    {
      key: 'customerSalesman',
      caption: '业务员',
    },
    {
      key: 'detailRowsCount',
      caption: '明细行数',
    },
    {
      key: 'totalVolume',
      caption: '总体积数',
    },
    {
      key: 'isGatheringOrder',
      caption: '集货订单',
    },
    // {
    //   key: 'IsRecycling',
    //   caption: '回收服务',
    // },
    {
      key: 'isAgencyOrder',
      caption: '经销商订单',
    },
    {
      key: 'pushDownStatus',
      caption: '下推状态',
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
      key: 'group',
      caption: '分组',
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
  ];

  const logistics: IDetailItem[] = [
    {
      key: 'gatheringPointCode',
      caption: '集货点',
    },
    {
      key: 'lineAreaCode',
      caption: '线路区域',
    },
    {
      key: 'threeServiceCostPrice',
      caption: '三包成本',
    },
    {
      key: 'serviceItemCode',
      caption: '服务项目',
    },
    {
      key: 'deliveryPointCode',
      caption: '提货点',
    },
    {
      key: 'contractorCode',
      caption: '中转承运商',
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
      key: 'threeServicePointCode',
      caption: '三包点',
    },
    {
      key: 'threeServiceSupplierCode',
      caption: '三包服务商',
    },
    {
      key: 'logisticCode',
      caption: '物流单号',
    },
    {
      key: 'freightTypeCode',
      caption: '运费类型',
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
      key: 'customerTypeCode',
      caption: '客户类型',
    },
    {
      key: 'gatheringParentCode',
      caption: '父单号',
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
      key: 'outBillFormCode',
      caption: '原单标识',
    },
    {
      key: 'otSourceBillCode',
      caption: '原单编号',
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
      key: 'pushDownTime',
      caption: '下推时间',
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
      caption: '作废人',
      keyProperty: 'id',
      showProperty: 'accountName',
    },
    {
      key: 'markStatus',
      caption: '标记状态',
    },
    {
      key: 'outSourceBillType',
      caption: '原单类型',
    },
    {
      key: 'isCancelled',
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
