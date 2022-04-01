import type { IOdataParams } from '/@/components/Table/types';
import { defHttp } from '/@/utils/http/axios';

enum apiUrl {
  onShippingOrderSearchUrl = '/ods/api/odata/shipping-orders/$query',
  onShippingOrderSubmitUrl = '/ods/api/shipping-orders/submit',
  onShippingOrderApplyUrl = '/ods/api/shipping-orders/apply',
  onShippingOrderPushUrl = '/ods/api/shipping-orders/push',
  onShippingOrderRevokeUrl = '/ods/api/shipping-orders/revoke',
  onShippingOrderRedraftUrl = '/ods/api/shipping-orders/redraft',
  onShippingOrderRecallUrl = '/ods/api/shipping-orders/recall',
}

export class ShippingOrderApi {
  static onShippingOrderSearch(QueryParameters: Partial<IOdataParams>) {
    return defHttp.post({
      url: apiUrl.onShippingOrderSearchUrl,
      params: { ...QueryParameters },
    });
  }

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
