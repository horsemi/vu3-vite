import type { ISchemeItem } from '/@/components/QueryPopup/content/types';

import { useUserStore } from '/@/store/modules/user';
import { SchemeApi } from '/@/api/user/schemes';

export async function getSchemesData(orderCode: string) {
  const userStore = useUserStore();
  const userInfo = userStore.getUserInfo;
  let checkedIndex = 0;

  const schemesData = await SchemeApi.getSchemes({
    applicationId: userInfo.applicationId,
    creatorId: userInfo.accountId,
    businessCode: orderCode,
  });

  const scheme = schemesData.map((item, index) => {
    const { requirement, orderBy, columns, fast } = JSON.parse(item.queryData);
    if (item.isUseScheme) {
      checkedIndex = index;
    }

    return {
      id: item.id,
      businessQuerySchemeId: item.businessQuerySchemeId,
      title: item.title,
      applicationId: item.applicationId,
      businessCode: item.businessCode,
      creatorId: item.creatorId,
      isUseScheme: item.isUseScheme,
      isShare: item.isShare,
      requirement,
      orderBy,
      columns,
      fast,
    };
  });

  return {
    scheme,
    checkedIndex,
  };
}

export async function saveSchemesData(scheme: ISchemeItem): Promise<ISchemeItem | void> {
  const userStore = useUserStore();
  const userInfo = userStore.getUserInfo;

  if (scheme) {
    const queryData = JSON.stringify({
      requirement: scheme.requirement,
      orderBy: scheme.orderBy,
      columns: scheme.columns,
      fast: scheme.fast,
    });

    const schemeData = {
      id: scheme.id,
      title: scheme.title,
      businessCode: scheme.businessCode as string,
      applicationId: userInfo.applicationId,
      creatorId: userInfo.accountId,
      isShare: false,
      queryData: queryData,
    };

    if (scheme.id === '0') {
      const response = await SchemeApi.saveSchemes(schemeData);

      const queryData = JSON.parse(response.queryData);

      const result: ISchemeItem = {
        id: response.id,
        title: response.title,
        businessCode: response.businessCode,
        creatorId: response.creatorId,
        isUseScheme: response.isUseScheme,
        requirement: queryData.requirement,
        orderBy: queryData.orderBy,
        columns: queryData.columns,
        fast: queryData.fast,
      };

      return result;
    } else if (scheme.id && scheme.id !== '0') {
      SchemeApi.updateSchemes(schemeData);
      return;
    }
  }
}

export async function deleteSchemes(id: string) {
  return await SchemeApi.deleteSchemes(id);
}

export async function saveDefaultScheme(schemeData: ISchemeItem, checkedStatue: boolean) {
  const userStore = useUserStore();
  const userInfo = userStore.getUserInfo;

  const data = {
    id: schemeData.id || '0',
    applicationId: userInfo.applicationId,
    businessCode: schemeData.businessCode || '',
    creatorId: userInfo.accountId,
    isUseScheme: checkedStatue,
  };

  SchemeApi.saveDefaultSchemes(data);
}
