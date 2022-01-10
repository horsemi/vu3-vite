import type { Ref } from 'vue';

import type { IRelationShipItem } from '/@/model/types';
import type { IRelationShip } from '/@/components/QueryPopup/content/types';
import type { ISchemeData } from '/@/components/QueryPlan/types';

/**
 * @description 过滤方案关联条件初始化
 */
export function initRelationShip(relationShips: IRelationShipItem[], schemeData: Ref<ISchemeData>) {
  const _relationShips: IRelationShip[] = [];

  relationShips.forEach((item) => {
    _relationShips.push({
      value: item.isMainEntity ? true : false,
      ...item,
    });
  });

  schemeData.value.scheme[schemeData.value.checkedIndex].relationShips = _relationShips;
}
