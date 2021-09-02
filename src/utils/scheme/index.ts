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

export async function saveSchemesData(scheme: ISchemeItem): Promise<ISchemeItem | undefined> {
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

    let responseData;
    if (scheme.id === '0') {
      responseData = await SchemeApi.saveSchemes(schemeData);
    } else if (scheme.id && scheme.id !== '0') {
      responseData = await SchemeApi.updateSchemes(schemeData);
    }

    Object.assign(responseData, JSON.parse(responseData.queryData));

    const result: ISchemeItem = {
      id: responseData.id,
      title: responseData.title,
      businessCode: responseData.businessCode,
      creatorId: responseData.creatorId,
      isUseScheme: responseData.isUseScheme,
      requirement: responseData.requirement,
      orderBy: responseData.orderBy,
      columns: responseData.columns,
      fast: responseData.fast,
    };

    // 更新查询方案则不覆盖
    return scheme.id === '0' ? result : undefined;
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
