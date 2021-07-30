import notify from 'devextreme/ui/notify';

import { useAppStoreWidthOut } from '/@/store/modules/app';

type MessageType = 'success' | 'warning' | 'error' | 'info';

export function errorMessage(msg: string | Error) {
  const appStore = useAppStoreWidthOut();
  appStore.showToast('error', '系统错误', msg as string);
}

export function successMessage(msg: string) {
  const appStore = useAppStoreWidthOut();
  appStore.showToast('success', '操作成功', msg as string);
}

export function warningMessage(msg: string) {
  notify(
    { message: msg, width: 300, position: { at: 'top center', my: 'top center', offset: '0 50' } },
    'warning',
    5000
  );
}

export function infoMessage(msg: string) {
  notify(
    { message: msg, width: 300, position: { at: 'top center', my: 'top center', offset: '0 50' } },
    'info',
    5000
  );
}

export function useMessage(message: string | Error, type: MessageType) {
  switch (type) {
    case 'error': {
      errorMessage(message);
      break;
    }
    case 'warning': {
      warningMessage(message as string);
      break;
    }
    case 'success': {
      successMessage(message as string);
      break;
    }
    case 'info': {
      infoMessage(message as string);
      break;
    }
  }
}
