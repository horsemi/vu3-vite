import { defHttp } from '/@/utils/http/axios';

import type { UploadFileParams } from '/@/utils/http/axios/types';
import type { OdataQuery } from './type';

enum apiUrl {
  onShippingRulesCreateUrl = '/policy-manage/api/v1/manage/shipping-rules/create',
  onShippingRulesUpdateUrl = '/policy-manage/api/v1/manage/shipping-rules/update',
  onShippingRulesDeleteUrl = '/policy-manage/api/v1/manage/shipping-rules/delete',
  onShippingRulesSwitchUrl = '/policy-manage/api/v1/manage/shipping-rules/switch',
  onShippingRulesExportUrl = '/policy-manage/api/v1/manage/shipping-rules/export/background-export',
  onShippingRulesImportUrl = '/policy-manage/api/v1/manage/shipping-rules/import',
}

export class ShippingRulesApi {
  static onShippingRulesCreate(data: any) {
    return defHttp.post({
      url: apiUrl.onShippingRulesCreateUrl,
      params: data,
    });
  }

  static onShippingRulesUpdate(data: any) {
    return defHttp.post({
      url: apiUrl.onShippingRulesUpdateUrl,
      params: data,
    });
  }

  static onShippingRulesDelete(ids: string[]) {
    return defHttp.post({
      url: apiUrl.onShippingRulesDeleteUrl,
      params: ids,
    });
  }

  static onShippingRulesSwitch(data: { ids: string[]; isEnabled: boolean }) {
    return defHttp.post({
      url: apiUrl.onShippingRulesSwitchUrl,
      params: data,
    });
  }

  static onShippingRulesExport(QueryParameter: OdataQuery) {
    return defHttp.post({
      url: apiUrl.onShippingRulesExportUrl,
      params: { QueryParameter },
    });
  }

  static onShippingRulesImport(fileParams: UploadFileParams) {
    return defHttp.uploadFile(
      {
        url: apiUrl.onShippingRulesImportUrl,
      },
      fileParams
    );
  }
}
