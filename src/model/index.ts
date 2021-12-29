import type { IColumnItem, IKeyType } from './types';

type EntityType = {
  caption: string;
  getColumnFn: () => Promise<
    | {
        columnList: IColumnItem[];
        key: string[];
        keyType: IKeyType[];
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
        key: string[];
        keyType: IKeyType[];
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
        entityColumnList[result.caption] = await result.getColumnFn();
      } catch (error) {
        console.error(error);
      }
    }
  }

  return entityColumnList;
};
