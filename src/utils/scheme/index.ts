import type { ISchemeItem } from '/@/components/QueryPopup/content/types';

import { useUserStore } from '/@/store/modules/user';
import { SchemeApi } from '/@/api/user/schemes';
import { isArray } from 'lodash';

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
    const { requirement, orderBy, columns, summary, fast, relationShips } = JSON.parse(
      item.queryData
    );
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
      relationShips,
      orderBy,
      columns,
      summary,
      fast,
    };
  });

  return {
    scheme,
    checkedIndex,
  };
}

export function saveSchemesData(scheme: ISchemeItem): Promise<ISchemeItem | void> {
  return new Promise((resolve, reject) => {
    const userStore = useUserStore();
    const userInfo = userStore.getUserInfo;

    if (scheme) {
      const queryData = JSON.stringify({
        requirement: scheme.requirement,
        orderBy: scheme.orderBy,
        columns: scheme.columns,
        summary: scheme.summary,
        fast: scheme.fast,
        relationShips: scheme.relationShips,
      });

      const schemeData = {
        id: scheme.id,
        title: scheme.title,
        businessCode: scheme.businessCode as string,
        applicationId: userInfo.applicationId,
        creatorId: userInfo.accountId,
        isShare: scheme.isShare || false,
        queryData: queryData,
      };

      if (scheme.id === '0') {
        SchemeApi.saveSchemes(schemeData)
          .then((response) => {
            const queryData = JSON.parse(response.queryData);

            const result: ISchemeItem = {
              id: response.id,
              title: response.title,
              businessCode: response.businessCode,
              creatorId: response.creatorId,
              isUseScheme: response.isUseScheme,
              isShare: response.isShare,
              requirement: queryData.requirement,
              orderBy: queryData.orderBy,
              columns: queryData.columns,
              summary: queryData.summary,
              fast: queryData.fast,
              relationShips: queryData.relationShips,
            };

            resolve(result);
          })
          .catch((err) => {
            reject(err);
          });
      } else if (scheme.id && scheme.id !== '0') {
        SchemeApi.updateSchemes(schemeData)
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      }
    }
  });
}

export async function deleteSchemes(id: string, creatorId: string) {
  return await SchemeApi.deleteSchemes(id, creatorId);
}

export async function saveDefaultSchemes(scheme: ISchemeItem) {
  if (scheme) {
    const userStore = useUserStore();
    const userInfo = userStore.getUserInfo;

    const queryData = JSON.stringify({
      requirement: scheme.requirement,
      orderBy: scheme.orderBy,
      columns: scheme.columns,
      summary: scheme.summary,
      fast: scheme.fast,
      relationShips: scheme.relationShips,
    });

    const schemeData = {
      id: scheme.id,
      title: scheme.title,
      businessCode: scheme.businessCode as string,
      applicationId: userInfo.applicationId,
      creatorId: '0',
      isShare: true,
      queryData: queryData,
    };

    const schemeResult = await getSchemesData(scheme.businessCode!);

    if (schemeResult.scheme && isArray(schemeResult.scheme) && schemeResult.scheme.length > 0) {
      schemeData.id = schemeResult.scheme.filter((item) => item.creatorId === '0')[0].id;
      SchemeApi.updateDefaultSchemes(schemeData);
      return;
    } else {
      SchemeApi.addDefaultSchemes(schemeData);
      return;
    }
  }
}

export async function setDefaultScheme(schemeData: ISchemeItem, checkedStatue: boolean) {
  const userStore = useUserStore();
  const userInfo = userStore.getUserInfo;

  const data = {
    id: schemeData.id || '0',
    applicationId: userInfo.applicationId,
    businessCode: schemeData.businessCode || '',
    creatorId: userInfo.accountId,
    isUseScheme: checkedStatue,
  };

  SchemeApi.setDefaultScheme(data);
}