export enum ResultEnum {
  SUCCESS = 'ok',
  ERROR = 'error',
  ERR = 'err',
  NOT_FOUND = 404,
  NOT_PERMISSION = 401,
}

export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum ContentTypeEnum {
  JSON = 'application/json',
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}
