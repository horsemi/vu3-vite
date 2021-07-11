import { defHttp } from '/@/utils/http/axios';

enum apiUrl {
  onShippingOrderSubmitUrl = '/api/v1/shipping-orders/submit',
  onShippingOrderApplyUrl = '/api/v1/shipping-orders/apply',
  onShippingOrderPushUrl = '/api/v1/shipping-orders/push',
  onShippingOrderRevokeUrl = '/api/v1/shipping-orders/revoke',
  onShippingOrderRedraftUrl = '/api/v1/shipping-orders/redraft',
}

export class ShippingOrderApi {
  static onShippingOrderSubmit(codes: string[]) {
    return defHttp.post({
      url: apiUrl.onShippingOrderSubmitUrl,
      params: { GatheringParentCodes: codes },
    });
  }

  static onShippingOrderApply(codes: string[]) {
    return defHttp.post({
      url: apiUrl.onShippingOrderApplyUrl,
      params: { GatheringParentCodes: codes },
    });
  }

  static onShippingOrderPush(codes: string[]) {
    return defHttp.post({
      url: apiUrl.onShippingOrderPushUrl,
      params: { GatheringParentCodes: codes },
    });
  }

  static onShippingOrderRevoke(codes: string[]) {
    return defHttp.post({
      url: apiUrl.onShippingOrderRevokeUrl,
      params: { GatheringParentCodes: codes },
    });
  }

  static onShippingOrderRedraft(codes: string[]) {
    return defHttp.post({
      url: apiUrl.onShippingOrderRedraftUrl,
      params: { GatheringParentCodes: codes },
    });
  }
}
