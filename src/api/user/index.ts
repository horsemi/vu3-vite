import { defHttp } from '/@/utils/http/axios';

export interface IUserData {
  userName: string;
  password: string;
}
export interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
  newPasswordRe: string;
}
export interface ISumbitPassword extends IUpdatePassword {
  userName: string;
}
export interface INoticeData {
  Application: string;
  PageIndex: number;
  PageSize: number;
}

enum apiUrl {
  login = '/passport/api/login',
  logout = '/passport/api/logout',
  menus = '/passport/api/menus',
  permission = '/passport/api/authenticate-for-web',
  queryPasswordPolicy = '/passport/api/password-policy/search',
  changePassword = '/passport/api/change-password-cipher',
  passwordPolicy = '/passport/api/password-policy',
  noticeList = '/noticication/api/message/list/v1',
}
export class UserApi {
  static login(data: IUserData) {
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
  static changePassword(data: ISumbitPassword) {
    return defHttp.post({
      url: apiUrl.changePassword,
      params: data,
    });
  }
  static checkPassword(data: IUserData) {
    return defHttp.post({
      url: apiUrl.passwordPolicy,
      params: data,
    });
  }

  static getNoticeList(data: INoticeData) {
    return defHttp.get({
      url: apiUrl.noticeList,
      params: data,
    });
  }
}
