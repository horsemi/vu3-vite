import notify from 'devextreme/ui/notify';

type MessageType = 'success' | 'warning' | 'error' | 'info';

export function errorMessage(msg: string | Error) {
  notify(
    { message: msg, width: 300, position: { at: 'top center', my: 'top center', offset: '0 50' } },
    'error',
    1000
  );
}

export function successMessage(msg: string) {
  notify(
    { message: msg, width: 300, position: { at: 'top center', my: 'top center', offset: '0 50' } },
    'success',
    1000
  );
}

export function warningMessage(msg: string) {
  notify(
    { message: msg, width: 300, position: { at: 'top center', my: 'top center', offset: '0 50' } },
    'warning',
    1000
  );
}

export function infoMessage(msg: string) {
  notify(
    { message: msg, width: 300, position: { at: 'top center', my: 'top center', offset: '0 50' } },
    'info',
    1000
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
