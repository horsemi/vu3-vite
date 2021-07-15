import Cookies from 'js-cookie';

export function setCookie(key: string, value: string) {
  Cookies.set(key, value, { expires: 1 });
}

export function getCookie(key: string) {
  return Cookies.get(key);
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
  Cookies.remove(key);
}
