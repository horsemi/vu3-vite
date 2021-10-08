import { errorMessage } from '/@/hooks/web/useMessage';
import router from '/@/router';
import { PageEnum } from '/@/enums/pageEnum';
import { useAppStore } from '/@/store/modules/app';

const error = errorMessage;
export function checkStatus(status: number, msg: string): void {
  switch (status) {
    case 400:
      error(`${msg}`);
      break;
    // 401: Not logged in
    // Jump to the login page if not logged in, and carry the path of the current page
    // Return to the current page after successful login. This step needs to be operated on the login page.
    case 401:
      // error('账号已登出，请重新登录');
      console.error('账号已登出，请重新登录');
      useAppStore().resumeAllState();
      router.push(PageEnum.BASE_LOGIN);
      break;
    case 403:
      error('您的账号没有权限访问该页面');
      break;
    // 404请求不存在
    case 404:
      error('您所访问的资源不存在');
      break;
    case 405:
      error('网络请求错误,请求方法未允许!');
      break;
    case 408:
      error('网络请求超时!');
      break;
    case 500:
      error('服务器错误,请联系系统管理员!');
      break;
    case 501:
      error('网络未实现!');
      break;
    case 502:
      error('网络错误!');
      break;
    case 503:
      error('服务不可用，服务器暂时过载或维护!');
      break;
    case 504:
      error('网络超时!');
      break;
    case 505:
      error('http版本不支持该请求!');
      break;
    default:
      error('系统发生错误，请联系系统管理员!');
  }
}
