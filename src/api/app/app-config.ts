import type { GlobalEnumType } from '/@/store/types';

import { defHttp } from '/@/utils/http/axios';

enum apiUrl {
  getGlobalEnumUrl = '/ods/api/odata/enums',
  getBillTypesUrl = '/ods/api/odata/billTypes',
}

export class AppConfigApi {
  static getGlobalEnum() {
    return defHttp.get<GlobalEnumType[]>({ url: apiUrl.getGlobalEnumUrl });
  }

  static getBillTypes() {
    return defHttp.get<GlobalEnumType[]>({ url: apiUrl.getBillTypesUrl });
  }
}
