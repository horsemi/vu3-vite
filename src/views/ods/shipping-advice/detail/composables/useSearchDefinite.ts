import type { IColumnItem } from '/@/model/types';
import type { ISchemeItem, IRequirementItem } from '/@/components/QueryPopup/content/types';

import { Ref, ref } from 'vue';

export function useSearchDefinite(
  requirement: IRequirementItem[],
  definiteCustomColumns: IColumnItem[],
  definiteScheme: Ref<ISchemeItem | undefined>,
  definiteLoading: Ref<boolean>
) {
  const schemeData = ref({
    checkedIndex: 0,
    scheme: [
      {
        fast: [
          {
            key: 'Material',
            operator: '=',
            operatorList: [
              {
                key: '=',
                name: 'equal',
                value: '等于',
              },
              {
                key: '<>',
                name: 'notEqual',
                value: '不等于',
              },
              {
                key: 'isNull',
                name: 'isNull',
                value: '为空',
              },
              {
                key: 'isNotNull',
                name: 'isNotNull',
                value: '不为空',
              },
            ],
            value: '',
            type: 'string',
            datatypekeies: 'materials',
            relationKey: 'MaterialCode',
            logic: 'and',
          },
        ],
      },
    ],
  });

  function onSearch() {
    definiteLoading.value = true;
    definiteScheme.value = {
      id: '',
      title: '',
      requirement: [...requirement, ...schemeData.value.scheme[schemeData.value.checkedIndex].fast],
      orderBy: [],
      columns: definiteCustomColumns,
      summary: [],
      relationShips: [],
    };
  }

  function onReset() {
    definiteLoading.value = true;
    schemeData.value.scheme[schemeData.value.checkedIndex] = {
      fast: [
        {
          key: 'Material',
          operator: '=',
          operatorList: [
            {
              key: '=',
              name: 'equal',
              value: '等于',
            },
            {
              key: '<>',
              name: 'notEqual',
              value: '不等于',
            },
            {
              key: 'isNull',
              name: 'isNull',
              value: '为空',
            },
            {
              key: 'isNotNull',
              name: 'isNotNull',
              value: '不为空',
            },
          ],
          value: '',
          type: 'string',
          datatypekeies: 'materials',
          relationKey: 'MaterialCode',
          logic: 'and',
        },
      ],
    };
    definiteLoading.value = false;
  }

  return {
    schemeData,
    onSearch,
    onReset,
  };
}
