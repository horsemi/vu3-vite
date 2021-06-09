<template>
  <div>
    <ods-table :table-data="tableData" :columns="columns"></ods-table>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useUserStore } from '/@/store/modules/user';
  import { getShippingOrders } from '../../../api/index';

  export default defineComponent({
    name: 'Analysis',
    setup() {
      const userStore = useUserStore();
      const tableData = ref();
      const columns = [
        {
          dataField: 'group',
          caption: 'group',
        },
        {
          dataField: 'telephone',
          caption: 'telephone',
        },
        {
          dataField: 'outSourceBillType',
          caption: 'outSourceBillType',
        },
        {
          dataField: 'receiver',
          caption: 'receiver',
        },
        {
          dataField: 'bigGroup',
          caption: 'bigGroup',
        },
        {
          dataField: 'detailAddress',
          caption: 'detailAddress',
        }
      ];
      const { userId, userName } = userStore.getUserInfo;
      getShippingOrders().then(res => {
        tableData.value = res;
      });
      return {
        userId,
        userName,
        tableData,
        columns
      };
    },
  });
</script>