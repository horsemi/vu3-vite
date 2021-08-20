import { defHttp } from '/@/utils/http/axios';

export interface ISchemeData {
  id: string;
  businessQuerySchemeId?: string;
  title: string;
  applicationId: string;
  businessCode: string;
  creatorId: string;
  isUseScheme?: boolean;
  isShare: boolean;
  queryData: string;
  createdTime?: Date;
  updatedTime?: Date;
}

enum apiUrl {
  schemeSearch = '/api/schemes/search',
  schemeSave = '/api/schemes/save',
  schemeUpdate = '/api/schemes/update',
  schemeDelete = '/api/schemes/delete',
}

export class SchemeApi {
  static getSchemes(data: { applicationId: string; businessCode: string; creatorId: string }) {
    return defHttp.post<ISchemeData[]>({
      url: apiUrl.schemeSearch,
      params: data,
    });
  }

  static saveSchemes(data: ISchemeData) {
    return defHttp.post<ISchemeData[]>({
      url: apiUrl.schemeSave,
      params: data,
    });
  }

  static updateSchemes(data: ISchemeData) {
    return defHttp.post<ISchemeData[]>({
      url: apiUrl.schemeUpdate,
      params: data,
    });
  }

  static deleteSchemes(id: string) {
    return defHttp.post<ISchemeData[]>({
      url: apiUrl.schemeDelete,
      params: { id },
    });
  }
}
