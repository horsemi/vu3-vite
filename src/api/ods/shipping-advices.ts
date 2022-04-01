import { defHttp } from '/@/utils/http/axios';

enum apiUrl {
  onShippingAdviceSubmitUrl = '/ods/api/shipping-advices/submit',
  onShippingAdviceApplyUrl = '/ods/api/shipping-advices/apply',
  onShippingAdviceSendUrl = '/ods/api/shipping-advices/send',
  onShippingAdviceRecallUrl = '/ods/api/shipping-advices/recall',
  onShippingAdviceRevokeUrl = '/ods/api/shipping-advices/revoke',
  onShippingAdviceRedraftUrl = '/ods/api/shipping-advices/redraft',
  onShippingAdviceExportUrl = '/ods/api/shipping-advices/export',
}

export class ShippingAdviceApi {
  static onShippingAdviceSubmit(codes: string[]) {
    return defHttp.post({
      url: apiUrl.onShippingAdviceSubmitUrl,
      params: { GatheringParentCodes: codes },
    });
  }

  static onShippingAdviceApply(codes: string[]) {
    return defHttp.post({
      url: apiUrl.onShippingAdviceApplyUrl,
      params: { GatheringParentCodes: codes },
    });
  }

  static onShippingAdviceSend(codes: string[]) {
    return defHttp.post({
      url: apiUrl.onShippingAdviceSendUrl,
      params: { GatheringParentCodes: codes },
    });
  }

  static onShippingAdviceRecall(codes: string[]) {
    return defHttp.post({
      url: apiUrl.onShippingAdviceRecallUrl,
      params: { GatheringParentCodes: codes },
    });
  }

  static onShippingAdviceRevoke(codes: string[]) {
    return defHttp.post({
      url: apiUrl.onShippingAdviceRevokeUrl,
      params: { GatheringParentCodes: codes },
    });
  }

  static onShippingAdviceRedraft(codes: string[]) {
    return defHttp.post({
      url: apiUrl.onShippingAdviceRedraftUrl,
      params: { GatheringParentCodes: codes },
    });
  }

  static onShippingAdviceExport(data) {
    return defHttp.post({
      url: apiUrl.onShippingAdviceExportUrl,
      params: data,
    });
  }
}
