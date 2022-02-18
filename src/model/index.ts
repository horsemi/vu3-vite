import type { IColumnItem } from './types';

import IndexedDBService from '/@/utils/indexedDB/database';

let firstUseEntityColumn = true;

type EntityType = {
  caption: string;
  getColumnFn: () => Promise<
    | {
        columnList: IColumnItem[];
        key: string;
      }
    | undefined
  >;
};

const modules = import.meta.globEager('./entity/**/*.ts');

const entityList: EntityType[] = [];

Object.keys(modules).forEach((key: string) => {
  const regExp = new RegExp(/[\s\S]*(?=\.)/g);
  regExp.lastIndex = key.lastIndexOf('/') + 1;
  const name = regExp.exec(key)![0];
  const getColumnFn = modules[key].default || {};
  entityList.push({
    caption: name,
    getColumnFn: getColumnFn,
  });
});

export const getColumnListByEntityCode = async (entityCodes: string[]) => {
  const entityColumnList: Record<
    string,
    | {
        columnList: IColumnItem[];
        key: string;
      }
    | undefined
  > = {};

  for (const _code of entityCodes) {
    const result = entityList.find((item: EntityType) => {
      if (item.caption === _code) {
        return item.getColumnFn;
      }
    });

    if (result) {
      try {
        if (firstUseEntityColumn) {
          firstUseEntityColumn = false;
          await IndexedDBService.clearEntityColumn();
          // 第一次使用实体数据，直接请求拿
          const entityObj = await result.getColumnFn();
          if (entityObj) {
            // 拿完，记得添加到indexedDB中
            await IndexedDBService.putEntityColumn({ caption: result.caption, ...entityObj });
            // 给返回结果也赋个值
            entityColumnList[result.caption] = entityObj;
          }
        } else {
          // 看一下indexedDB有没有实体数据
          const list = await IndexedDBService.readEntityColumn(result.caption);
          if (!list) {
            // 没有的话，发起请求拿一下
            const entityObj = await result.getColumnFn();
            if (entityObj) {
              // 拿完，记得添加到indexedDB中
              await IndexedDBService.putEntityColumn({ caption: result.caption, ...entityObj });
              // 给返回结果也赋个值
              entityColumnList[result.caption] = entityObj;
            }
          } else {
            // 有就直接赋值吧
            entityColumnList[result.caption] = list;
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  return entityColumnList;
};
