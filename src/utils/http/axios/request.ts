import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { RequestOptions, Result, UploadFileParams } from './types';
import type { CreateAxiosOptions } from './axiosTransform';

import axios from 'axios';
import { isFunction } from '/@/utils/is';
import { AxiosCanceler } from './axiosCancel';
import qs from 'qs';
import { cloneDeep } from 'lodash-es';

import { ContentTypeEnum, RequestEnum } from '/@/enums/httpEnum';
import { errorResult } from './const';

export class Request {
	private axiosInstance: AxiosInstance;
	private readonly options: CreateAxiosOptions;

	constructor(options: CreateAxiosOptions) {
		this.options = options;
		this.axiosInstance = axios.create(options);
		this.setupInterceptors();
	}

	private setupInterceptors() {
		const transform = this.getTransform();
		if (!transform) {
			return;
		}
		const {
			requestInterceptors,
			requestInterceptorsCatch,
			responseInterceptors,
			responseInterceptorsCatch,
		} = transform;

		const axiosCanceler = new AxiosCanceler();

		// 请求拦截器配置
		this.axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
			// 如果开启重复请求功能, 重复请求就会被禁止
			const {
				headers: { ignoreCancelToken },
			} = config;

			const ignoreCancel =
				ignoreCancelToken !== undefined
					? ignoreCancelToken
					: this.options.requestOptions?.ignoreCancelToken;

			!ignoreCancel && axiosCanceler.addPending(config);
			if (requestInterceptors && isFunction(requestInterceptors)) {
				config = requestInterceptors(config);
			}
			return config;
		}, undefined);

		// 请求错误捕获拦截器
		requestInterceptorsCatch &&
			isFunction(requestInterceptorsCatch) &&
			this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch);

		// 处理响应结果拦截器
		this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
			res && axiosCanceler.removePending(res.config);
			if (responseInterceptors && isFunction(responseInterceptors)) {
				res = responseInterceptors(res);
			}
			return res;
		}, undefined);

		// 响应结果错误捕获拦截器
		responseInterceptorsCatch &&
			isFunction(responseInterceptorsCatch) &&
			this.axiosInstance.interceptors.response.use(undefined, responseInterceptorsCatch);
	}

	private getTransform() {
		const { transform } = this.options;
		return transform;
	}

	/**
	 * @description:  文件上传
	 */
	uploadFile<T = any>(config: AxiosRequestConfig, params: UploadFileParams): Promise<AxiosResponse<T>> {
		const formData = new window.FormData();

		if (params.data) {
			Object.keys(params.data).forEach((key) => {
				if (!params.data) return;
				const value = params.data[key];
				if (Array.isArray(value)) {
					value.forEach((item) => {
						formData.append(`${key}[]`, item);
					});
					return;
				}

				formData.append(key, params.data[key]);
			});
		}

		formData.append(params.name || 'file', params.file, params.filename);

		return this.axiosInstance.request<T>({
			...config,
			method: 'POST',
			data: formData,
			headers: {
				'Content-type': ContentTypeEnum.FORM_DATA,
				ignoreCancelToken: true,
			},
		});
	}

	// support form-data
	supportFormData(config: AxiosRequestConfig): AxiosRequestConfig {
		const headers = this.options?.headers;
		const contentType = headers?.['Content-Type'] || headers?.['content-type'];

		if (
			contentType !== ContentTypeEnum.FORM_URLENCODED ||
			!Reflect.has(config, 'data') ||
			config.method?.toUpperCase() === RequestEnum.GET
		) {
			return config;
		}

		return {
			...config,
			data: qs.stringify(config.data),
		};
	}

	get<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
		return this.request({ ...config, method: 'GET' }, options);
	}

	post<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
		return this.request({ ...config, method: 'POST' }, options);
	}

	put<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
		return this.request({ ...config, method: 'PUT' }, options);
	}

	delete<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
		return this.request({ ...config, method: 'DELETE' }, options);
	}

	request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
		let conf: AxiosRequestConfig = cloneDeep(config);
		const transform = this.getTransform();

		const { requestOptions } = this.options;

		const opt: RequestOptions = Object.assign({}, requestOptions, options);

		const { beforeRequestHook, requestCatchHook, transformRequestHook } = transform || {};
		if (beforeRequestHook && isFunction(beforeRequestHook)) {
			conf = beforeRequestHook(conf, opt);
		}

		conf = this.supportFormData(conf);

		return new Promise((resolve, reject) => {
			this.axiosInstance
				.request<any, AxiosResponse<Result>>(conf)
				.then((res: AxiosResponse<Result>) => {
					if (transformRequestHook && isFunction(transformRequestHook)) {
						const ret = transformRequestHook(res, opt);
						ret !== errorResult ? resolve(ret) : reject(new Error('request error!'));
						return;
					}
					resolve((res as unknown) as Promise<T>);
				})
				.catch((e: Error) => {
					if (requestCatchHook && isFunction(requestCatchHook)) {
						reject(requestCatchHook(e));
						return;
					}
					reject(e);
				});
		});
	}

}