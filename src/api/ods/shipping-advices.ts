import { defHttp } from '/@/utils/http/axios';

enum apiUrl {
  onShippingAdviceSubmitUrl = '/api/v1/shipping-advices/submit',
  onShippingAdviceApplyUrl = '/api/v1/shipping-advices/apply',
  onShippingAdviceSendUrl = '/api/v1/shipping-advices/send',
  onShippingAdviceRecallUrl = '/api/v1/shipping-advices/recall',
  onShippingAdviceRevokeUrl = '/api/v1/shipping-advices/revoke',
  onShippingAdviceRedraftUrl = '/api/v1/shipping-advices/redraft',
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
