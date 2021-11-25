import { useAppStoreWidthOut } from '/@/store/modules/app';

type MessageType = 'success' | 'warning' | 'error' | 'info';

export function errorMessage(
  msg: string | Error,
  title?: string,
  dangerouslyUseHtmlString?: boolean
) {
  const appStore = useAppStoreWidthOut();
  appStore.showToast('error', title || '错误', msg as string, dangerouslyUseHtmlString);
}

export function successMessage(msg: string, title?: string, dangerouslyUseHtmlString?: boolean) {
  const appStore = useAppStoreWidthOut();
  appStore.showToast('success', title || '操作成功', msg as string, dangerouslyUseHtmlString);
}

export function warningMessage(msg: string, title?: string, dangerouslyUseHtmlString?: boolean) {
  const appStore = useAppStoreWidthOut();
  appStore.showToast('warning', title || '警告', msg as string, dangerouslyUseHtmlString);
}

export function infoMessage(msg: string, title?: string, dangerouslyUseHtmlString?: boolean) {
  const appStore = useAppStoreWidthOut();
  appStore.showToast('info', title || '提示', msg as string, dangerouslyUseHtmlString);
}

export function useMessage(
  message: string | Error,
  type: MessageType,
  title?: string,
  dangerouslyUseHtmlString?: boolean
) {
  switch (type) {
    case 'error': {
      errorMessage(message, title, dangerouslyUseHtmlString);
      break;
    }
    case 'warning': {
      warningMessage(message as string, title, dangerouslyUseHtmlString);
      break;
    }
    case 'success': {
      successMessage(message as string, title, dangerouslyUseHtmlString);
      break;
    }
    case 'info': {
      infoMessage(message as string, title, dangerouslyUseHtmlString);
      break;
    }
  }
}
