import type { IColumnItem } from '/@/model/types';
import type { ISchemeItem, IRequirementItem } from '/@/components/QueryPopup/content/types';

import { Ref, ref } from 'vue';

export function useSearchDefinite(
  requirement: IRequirementItem[],
  definiteCustomColumns: IColumnItem[],
  definiteScheme: Ref<ISchemeItem | undefined>
) {
  const schemeData = ref({
    checkedIndex: 0,
    scheme: [
      {
        fast: [
          {
            requirement: 'material',
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
            relationKey: 'materialCode',
            logic: 'and',
          },
        ],
      },
    ],
  });

  function onSearch() {
    definiteScheme.value = {
      id: '',
      title: '',
      requirement: [...requirement, ...schemeData.value.scheme[schemeData.value.checkedIndex].fast],
      orderBy: [],
      columns: definiteCustomColumns,
      summary: [],
    };
    console.log(definiteScheme.value);
  }

  function onReset() {
    schemeData.value.scheme[schemeData.value.checkedIndex] = {
      fast: [
        {
          requirement: 'material',
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
          relationKey: 'materialCode',
          logic: 'and',
        },
      ],
    };
  }

  return {
    schemeData,
    onSearch,
    onReset,
  };
}
