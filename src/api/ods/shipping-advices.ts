import { defHttp } from '/@/utils/http/axios';

enum apiUrl {
  onShippingAdviceSubmitUrl = '/ods/api/v1/shipping-advices/submit',
  onShippingAdviceApplyUrl = '/ods/api/v1/shipping-advices/apply',
  onShippingAdviceSendUrl = '/ods/api/v1/shipping-advices/send',
  onShippingAdviceRecallUrl = '/ods/api/v1/shipping-advices/recall',
  onShippingAdviceRevokeUrl = '/ods/api/v1/shipping-advices/revoke',
  onShippingAdviceRedraftUrl = '/ods/api/v1/shipping-advices/redraft',
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
}
