export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined;

export interface RequestOptions {
  // Splicing request parameters to url
  joinParamsToUrl?: boolean;
  // Format request parameter time
  formatDate?: boolean;
  //  Whether to process the request result
  isTransformRequestResult?: boolean;
  // Error message prompt type
  errorMessageMode?: ErrorMessageMode;
  // Whether to add a timestamp
  joinTime?: boolean;
  ignoreCancelToken?: boolean;
}

export interface Result<T = any> {
  result: string;
  type: 'success' | 'error' | 'warning';
  message: string;
  data: T;
}

// multipart/form-data: upload file
export interface UploadFileParams {
  // Other parameters
  data?: Indexable;
  // File parameter interface field name
  name?: string;
  // file name
  file: File | Blob;
  // file name
  filename?: string;
  [key: string]: any;
}
