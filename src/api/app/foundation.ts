import { defHttp } from '/@/utils/http/axios';

export type FoundationMap =
  | 'bom'
  | 'customers'
  | 'customer-types'
  | 'delivery-points'
  | 'freight-types'
  | 'line-areas'
  | 'materials'
  | 'regions'
  | 'stocks'
  | 'suppliers'
  | 'three-service-cost-types'
  | 'three-service-points'
  | 'units'
  | 'service-contents'
  | 'logistics-lines'
  | 'gathering-points'
  | 'line-circuits';

export type FoundationDataType = {
  id: string;
  code: string;
  name: string;
  groupId: Nullable<string>;
  groupCode: Nullable<string>;
  groupName: Nullable<string>;
};

export interface IFoundationConfig {
  isall?: boolean;
  isPrecised?: boolean;
  ids?: string[];
  codes?: string[];
  names?: string[];
  groupCodes?: string[];
  groupIds?: string[];
  top?: number;
}

enum apiUrl {
  getFoundationUrl = '/api/foundation',
}

export class FoundationApi {
  static getFoundationByCode(code: FoundationMap, config: IFoundationConfig) {
    return defHttp.get<FoundationDataType[]>({
      url: `${apiUrl.getFoundationUrl}/${code}/options`,
      params: config,
    });
  }
}
