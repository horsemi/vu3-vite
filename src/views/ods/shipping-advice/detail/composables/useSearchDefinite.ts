import type { IColumnItem } from '/@/model/types';
import type { ISchemeItem, IRequirementItem } from '/@/components/QueryPopup/content/types';

import { Ref, ref } from 'vue';

export function useSearchDefinite(
  requirement: IRequirementItem[],
  definiteCustomColumns: IColumnItem[],
  definiteScheme: Ref<ISchemeItem | undefined>
) {
  const queryForm = ref();

  const fast = [
    {
      requirement: 'Material',
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
  ];

  function onSearch() {
    const queryList = queryForm.value.queryList;
    definiteScheme.value = {
      id: '',
      title: '',
      requirement: [...requirement, ...queryList],
      orderBy: [],
      columns: definiteCustomColumns,
    };
  }

  function onReset() {
    queryForm.value.changeQueryList(fast);
  }

  return {
    queryForm,
    fast,
    onSearch,
    onReset,
  };
}
