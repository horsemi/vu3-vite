import type { GlobalEnumType } from '/@/store/types';

import { defHttp } from '/@/utils/http/axios';

enum apiUrl {
  getGlobalEnumUrl = '/api/odata/enums',
}

export class AppConfigApi {
  static getGlobalEnum(systemCode = 'ods') {
    return defHttp.get<GlobalEnumType[]>({ url: `/${systemCode}${apiUrl.getGlobalEnumUrl}` });
  }
}
