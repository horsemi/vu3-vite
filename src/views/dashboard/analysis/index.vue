<template>
  <div>
    <DynamicSelect
      v-model:value="value"
      v-model:paramKey="requirement"
      v-model:operation="operator"
      v-model:paramDataType="type"
      v-model:paramOperations="operatorList"
      v-model:paramDatatypekeies="datatypekeies"
      v-model:paramRelationKey="relationKey"
      :param-list="columns"
    ></DynamicSelect>
  </div>
</template>

<script lang="ts">
  import type { IColumnItem } from '/@/model/types';

  import { defineComponent, ref } from 'vue';

  import DynamicSelect from '/@/components/DynamicSelect/index.vue';

  export default defineComponent({
    name: 'Analysis',
    components: {
      DynamicSelect,
    },
    setup() {
      const value = ref(undefined);
      const requirement = ref('foundationData');
      const operator = ref('=');
      const type = ref('string');
      const operatorList = ref([
        {
          key: '=',
          value: '=',
        },
        {
          key: '<',
          value: '<',
        },
      ]);
      const datatypekeies = ref('');
      const relationKey = ref('');
      const columns: IColumnItem[] = [
        {
          key: 'id',
          caption: 'id',
          type: 'int32',
        },
        {
          key: 'name',
          caption: 'name',
          type: 'string',
        },
        {
          key: 'number',
          caption: 'number',
          type: 'decimal',
        },
        {
          key: 'date',
          caption: 'date',
          type: 'datetime',
        },
        {
          key: 'foundationData',
          caption: '基础资料',
          type: 'string',
          datatypekeies: 'bill-types',
          relationKey: 'BillTypeCode',
          expand: 'bill-types',
        },
      ];

      return {
        value,
        requirement,
        operator,
        type,
        operatorList,
        datatypekeies,
        relationKey,
        columns,
      };
    },
  });
</script>
