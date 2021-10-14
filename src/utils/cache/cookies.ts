import Cookies from 'js-cookie';

export function setCookie(key: string, value: string) {
  Cookies.set(`${process.env.NODE_ENV}-${key}`, value, { expires: 1, domain: 'linshimuye.com' });
}

export function getCookie(key: string) {
  return Cookies.get(`${process.env.NODE_ENV}-${key}`);
}

export function checkCookie(): boolean {
  const cookieEnabledKey = 'cookieEnabled';
  Cookies.set(cookieEnabledKey, '1', {
    expires: 1,
  });
  const cookieEnabled = Cookies.get(cookieEnabledKey);
  if (cookieEnabled) {
    Cookies.remove(cookieEnabledKey);
    return true;
  } else {
    return false;
  }
}
export function removeCookie(key: string) {
  Cookies.remove(`${process.env.NODE_ENV}-${key}`, { domain: 'linshimuye.com' });
}
