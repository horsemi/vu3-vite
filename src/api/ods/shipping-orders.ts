import { defHttp } from '/@/utils/http/axios';

enum apiUrl {
  onShippingOrderSubmitUrl = '/api/v1/shipping-orders/submit',
  onShippingOrderApplyUrl = '/api/v1/shipping-orders/apply',
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
}
