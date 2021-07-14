import { defHttp } from '/@/utils/http/axios';

export interface UserData {
  userName: string;
  password: string;
}
enum apiUrl {
  login = '/passport/api/login',
  logout = '/passport/api/logout',
  menus = '/passport/api/menus',
  permission = '/passport/api/authenticatev2',
  queryPasswordPolicy = '/api/accounts/password-policy/searchv2',
  changePassword = '/passport/api/change-password',
  passwordPolicy = '/passport/api/password-policy',
}
export class UserApi {
  static login(data: UserData) {
    return defHttp.post({
      url: apiUrl.login,
      params: data,
    });
  }
  static logout() {
    return defHttp.post({
      url: apiUrl.logout,
    });
  }
  static getMenus() {
    return defHttp.get({
      url: apiUrl.menus,
    });
  }
  static getPermission() {
    return defHttp.get({
      url: apiUrl.permission,
    });
  }
  static queryPasswordPolicy() {
    return defHttp.get({
      url: apiUrl.queryPasswordPolicy,
    });
  }
  static changePassword(data: any) {
    return defHttp.post({
      url: apiUrl.changePassword,
      params: data,
    });
  }
  static checkPassword(data: UserData) {
    return defHttp.post({
      url: apiUrl.passwordPolicy,
      params: data,
    });
  }
}
