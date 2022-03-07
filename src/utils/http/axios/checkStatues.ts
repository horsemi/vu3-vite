import { odsMessage } from '/@/components/Message';

import { useAppStore } from '/@/store/modules/app';

export function checkStatus(status: number, msg: string): void {
  switch (status) {
    case 400:
      odsMessage({
        type: 'error',
        message: `${msg}`,
      });
      break;
    // 401: Not logged in
    // Jump to the login page if not logged in, and carry the path of the current page
    // Return to the current page after successful login. This step needs to be operated on the login page.
    case 401:
      // error('账号已登出，请重新登录');
      console.error('账号已登出，请重新登录');
      useAppStore().resumeAllState();
      window.location.href = `${import.meta.env.VITE_APP_SSO_SERVERS_URL}#/login?tag=ods`;
      break;
    case 403:
      odsMessage({
        type: 'error',
        title: '您的账号没有权限访问该页面',
        message: msg,
      });
      break;
    // 404请求不存在
    case 404:
      odsMessage({
        type: 'error',
        title: '您所访问的资源不存在',
        message: msg,
      });
      break;
    case 405:
      odsMessage({
        type: 'error',
        title: '网络请求错误,请求方法未允许!',
        message: msg,
      });
      break;
    case 408:
      odsMessage({
        type: 'error',
        title: '网络请求超时!',
        message: msg,
      });
      break;
    case 500:
      odsMessage({
        type: 'error',
        title: '服务器错误,请联系系统管理员!',
        message: msg,
      });
      break;
    case 501:
      odsMessage({
        type: 'error',
        title: '网络未实现',
        message: msg,
      });
      break;
    case 502:
      odsMessage({
        type: 'error',
        title: '网络错误!',
        message: msg,
      });
      break;
    case 503:
      odsMessage({
        type: 'error',
        title: '服务不可用，服务器暂时过载或维护!',
        message: msg,
      });
      break;
    case 504:
      odsMessage({
        type: 'error',
        title: '网络超时!',
        message: msg,
      });
      break;
    case 505:
      odsMessage({
        type: 'error',
        title: 'http版本不支持该请求!',
        message: msg,
      });
      break;
    default:
      odsMessage({
        type: 'error',
        title: '系统发生错误!',
        message: msg,
      });
  }
}
