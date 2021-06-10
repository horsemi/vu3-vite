<template>
  <div>
    <ods-table :options="options" :columns="columns"></ods-table>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
import { ITableOptions } from '/@/components/Table/type';
  import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    name: 'Analysis',
    setup() {
      const userStore = useUserStore();
      const columns = [
        {
          key: 'Id',
          caption: 'id',
          type: 'number',
          hide: true,
        },
        {
          key: 'BigGroup',
          caption: 'bigGroup',
          type: 'string',
          cellTemplate: 'test',
        },
        {
          key: 'BillCode',
          caption: 'billCode',
          type: 'string',
        },
        {
          key: 'DetailAddress',
          caption: 'detailAddress',
          type: 'string',
        },
        {
          key: 'Group',
          caption: 'group',
          type: 'string',
        },
        {
          key: 'CustomerSalesman',
          caption: 'customerSalesman',
          type: 'string',
        },
        {
          key: 'CityCode',
          caption: 'cityCode',
          type: 'string',
        }
      ];
      const options: ITableOptions = {
        page: {
          size: 20
        },
        dataSourceOptions: {
          sort: 'Id',
          oDataOptions: {
            url: '/api/odata/shipping-orders',
            key: 'Id',
            keyType: 'int64'
          }
        }
      };
      const { userId, userName } = userStore.getUserInfo;
      // getShippingOrders().then(res => {
      //   tableData.value = res;
      // });
      return {
        userId,
        userName,
        columns,
        options
      };
    },
  });
</script>