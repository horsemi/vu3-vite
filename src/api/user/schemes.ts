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
  schemeSearch = '/permission/api/schemes/search',
  schemeSave = '/permission/api/schemes/save',
  schemeUpdate = '/permission/api/schemes/update',
  schemeDelete = '/permission/api/schemes/delete',

  schemeDefaultSave = '/permission/api/schemes/default/save',
  schemeDefaultUpdate = '/permission/api/schemes/default/update',

  defaultSchemeSave = '/permission/api/schemes/user/save',
}

export class SchemeApi {
  static getSchemes(data: { applicationId: string; businessCode: string; creatorId: string }) {
    return defHttp.post<ISchemeData[]>({
      url: apiUrl.schemeSearch,
      params: data,
    });
  }

  static saveSchemes(data: ISchemeData) {
    return defHttp.post<ISchemeData>({
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

  static deleteSchemes(id: string, creatorId: string) {
    return defHttp.post<ISchemeData[]>({
      url: apiUrl.schemeDelete,
      params: { id, creatorId },
    });
  }

  static addDefaultSchemes(data: ISchemeData) {
    return defHttp.post<ISchemeData[]>({
      url: apiUrl.schemeDefaultSave,
      params: data,
    });
  }

  static updateDefaultSchemes(data: ISchemeData) {
    return defHttp.post<ISchemeData[]>({
      url: apiUrl.schemeDefaultUpdate,
      params: data,
    });
  }

  static setDefaultScheme(data: {
    id: string;
    applicationId: string;
    businessCode: string;
    creatorId: string;
    isUseScheme: boolean;
  }) {
    return defHttp.post({
      url: apiUrl.defaultSchemeSave,
      params: data,
    });
  }
}
