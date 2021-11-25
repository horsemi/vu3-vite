import { defHttp } from '/@/utils/http/axios';

enum apiUrl {
  exprot = '/api/exportation/v2/listv2',
}
export class ExportApi {
  static exprotList(data) {
    return defHttp.post({
      url: apiUrl.exprot,
      params: data,
    });
  }
}
