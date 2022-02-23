import { defHttp } from '/@/utils/http/axios';

enum apiUrl {
  exprotList = '/api/exportation/v2/listv2',
  reportExport = '/ods/api/v1/export/advices-export',
}
export class ExportApi {
  static exprotList(data) {
    return defHttp.post({
      url: apiUrl.exprotList,
      params: data,
    });
  }

  static reportExport(data) {
    return defHttp.post({
      url: apiUrl.reportExport,
      params: data,
    });
  }
}
