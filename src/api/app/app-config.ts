import type { GlobalEnumType } from '/@/store/types';

import { defHttp } from '/@/utils/http/axios';

enum apiUrl {
  getGlobalEnumUrl = '/api/odata/enums',
}

export class AppConfigApi {
  static getGlobalEnum() {
    return defHttp.get<GlobalEnumType[]>({ url: apiUrl.getGlobalEnumUrl });
  }
}
