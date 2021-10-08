import { useAppStoreWidthOut } from '/@/store/modules/app';

type MessageType = 'success' | 'warning' | 'error' | 'info';

export function errorMessage(msg: string | Error, title?: string) {
  const appStore = useAppStoreWidthOut();
  appStore.showToast('error', title || '错误', msg as string);
}

export function successMessage(msg: string, title?: string) {
  const appStore = useAppStoreWidthOut();
  appStore.showToast('success', title || '操作成功', msg as string);
}

export function warningMessage(msg: string, title?: string) {
  const appStore = useAppStoreWidthOut();
  appStore.showToast('warning', title || '警告', msg as string);
}

export function infoMessage(msg: string, title?: string) {
  const appStore = useAppStoreWidthOut();
  appStore.showToast('info', title || '提示', msg as string);
}

export function useMessage(message: string | Error, type: MessageType, title?: string) {
  switch (type) {
    case 'error': {
      errorMessage(message, title);
      break;
    }
    case 'warning': {
      warningMessage(message as string, title);
      break;
    }
    case 'success': {
      successMessage(message as string, title);
      break;
    }
    case 'info': {
      infoMessage(message as string, title);
      break;
    }
  }
}
