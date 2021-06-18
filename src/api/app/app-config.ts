import type { GlobalEnumType } from '/@/store/types';

import { defHttp } from '/@/utils/http/axios';

enum apiUrl {
  getGlobalEnumUrl = '/api/odata/enums',
}

interface IAppConfigApi {
  getGlobalEnum(): Promise<GlobalEnumType[]>;
}

class AppConfigApi implements IAppConfigApi {
  getGlobalEnum() {
    return defHttp.get<GlobalEnumType[]>({ url: apiUrl.getGlobalEnumUrl });
  }
}

export const appConfigApi = new AppConfigApi();
