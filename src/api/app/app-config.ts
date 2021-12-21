import type { GlobalEnumType } from '/@/store/types';

import { defHttp } from '/@/utils/http/axios';

enum apiUrl {
  getOdsEnumUrl = '/api/scheme/enumerations',
  getPpolicyManageEnumUrl = '/api/odata/enums',
}

export class AppConfigApi {
  static getOdsEnum() {
    return defHttp.get<GlobalEnumType[]>({
      url: `/ods${apiUrl.getOdsEnumUrl}`,
    });
  }
  static getPolicyManageEnum() {
    return defHttp.get<GlobalEnumType[]>({
      url: `/policy-manage${apiUrl.getPpolicyManageEnumUrl}`,
    });
  }
}
