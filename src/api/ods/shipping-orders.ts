import { defHttp } from '/@/utils/http/axios';

enum apiUrl {
  onShippingOrderSubmitUrl = '/ods/api/v1/shipping-orders/submit',
  onShippingOrderApplyUrl = '/ods/api/v1/shipping-orders/apply',
  onShippingOrderPushUrl = '/ods/api/v1/shipping-orders/push',
  onShippingOrderRevokeUrl = '/ods/api/v1/shipping-orders/revoke',
  onShippingOrderRedraftUrl = '/ods/api/v1/shipping-orders/redraft',
  onShippingOrderRecallUrl = '/ods/api/v1/shipping-orders/recall',
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

  static onShippingOrderRecall(codes: string[]) {
    return defHttp.post({
      url: apiUrl.onShippingOrderRecallUrl,
      params: { GatheringParentCodes: codes },
    });
  }
}
