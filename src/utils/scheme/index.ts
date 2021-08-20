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

export async function saveSchemesData(scheme: ISchemeItem) {
  const userStore = useUserStore();
  const userInfo = userStore.getUserInfo;

  if (scheme) {
    const { requirement, orderBy, columns, fast } = scheme;
    const queryData = JSON.stringify({ requirement, orderBy, columns, fast });

    const schemeData = {
      id: scheme.id,
      title: scheme.title,
      businessCode: scheme.businessCode as string,
      applicationId: userInfo.applicationId,
      creatorId: userInfo.accountId,
      isShare: false,
      queryData: queryData,
    };

    let result;
    if (scheme.id === '0') {
      result = await SchemeApi.saveSchemes(schemeData);
    } else if (scheme.id && scheme.id !== '0') {
      result = await SchemeApi.updateSchemes(schemeData);
    }

    return result;
  }
}

export async function deleteSchemes(id: string) {
  return await SchemeApi.deleteSchemes(id);
}
