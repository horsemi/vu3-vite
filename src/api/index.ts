import { defHttp } from '/@/utils/http/axios';

export const getShippingOrders = () => {
  return defHttp.get({ url: '/api/odata/shipping-orders' });
};