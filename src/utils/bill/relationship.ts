import type { IRelationShipItem, IColumnItem } from '/@/model/types';
import type { IRelationShip, ISchemeItem } from '/@/components/QueryPopup/content/types';

import { exceptSpareCriteriaFn } from '/@/utils/odata/index';
import { getColumnListByEntityCode } from '/@/model/index';

/**
 * @description 过滤方案关联条件初始化
 */
export function initRelationShip(relationShips: IRelationShipItem[], scheme: ISchemeItem) {
  if (!Array.isArray(scheme.relationShips)) {
    const _relationShips: IRelationShip[] = [];

    relationShips.forEach((item) => {
      _relationShips.push({
        value: item.isMainEntity ? true : false,
        ...item,
      });
    });

    scheme['relationShips'] = _relationShips;
  }
}

export function initEntityColumn(
  scheme: ISchemeItem,
  relationShips: IRelationShipItem[]
): Promise<{
  _allColumns: IColumnItem[];
  _tableKey: string[];
}> {
  return new Promise((resolve) => {
    initRelationShip(relationShips, scheme);
    exceptSpareCriteriaFn(scheme);
    getColumnListByEntityCode(
      // 根据过滤方案中的关联实体获取字段
      scheme.relationShips.map((item) => (item.value ? item.entityCode : ''))
    ).then((relationShipsResolve) => {
      const _allColumns: IColumnItem[] = [];
      const _tableKey: string[] = [];

      // 组装实体字段，把实体名称与key组装到字段的名字与key当中
      scheme.relationShips.forEach((relationItem) => {
        if (relationShipsResolve[relationItem.entityCode]) {
          relationItem.isMainEntity
            ? _tableKey.unshift(relationShipsResolve[relationItem.entityCode]!.key)
            : _tableKey.push(
                `${relationItem.key}_${relationShipsResolve[relationItem.entityCode]!.key}`
              );
          // 主实体字段不需要对key与expand进行实体名组装
          if (relationItem.isMainEntity) {
            _allColumns.push(
              ...relationShipsResolve[relationItem.entityCode]!.columnList.map<IColumnItem>(
                (item) => {
                  item.caption = `${relationItem.caption}_${item.caption}`;
                  item.entityKey = relationItem.entityCode;
                  item.foundationList &&
                    item.foundationList.forEach((foundationItem) => {
                      foundationItem.caption = `${relationItem.caption}_${foundationItem.caption}`;
                    });
                  return item;
                }
              )
            );
          } else {
            _allColumns.push(
              ...relationShipsResolve[relationItem.entityCode]!.columnList.map<IColumnItem>(
                (item) => {
                  item.caption = `${relationItem.caption}_${item.caption}`;
                  item.entityKey = relationItem.entityCode;
                  item.key = `${relationItem.key}_${item.key}`;
                  item.expand && (item.expand = `${relationItem.key}_${item.expand}`);
                  item.relationKey &&
                    (item.relationKey = `${relationItem.key}_${item.relationKey}`);
                  item.foundationList &&
                    item.foundationList.forEach((foundationItem) => {
                      foundationItem.caption = `${relationItem.caption}_${foundationItem.caption}`;
                      foundationItem.key = `${relationItem.key}_${foundationItem.key}`;
                    });
                  return item;
                }
              )
            );
          }
        }
      });

      resolve({ _allColumns, _tableKey });
    });
  });
}
