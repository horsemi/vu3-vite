<template>
  <div>
    <QueryPlan />
    <div class="example">
      <div class="btn-wrap">
        <div class="btn-box">
          <DxButton :width="76" text="提交" type="default" @click="onClick($event)" />
          <DxButton :width="76" text="审核" @click="onClick($event)" />
          <DxButton :width="76" text="删除" @click="onClick($event)" />
          <DxButton :width="76" text="标记" @click="onClick($event)" />
        </div>
        <div class="btn-box">
          <DxButton :width="112" text="汇总信息" @click="onClick($event)" />
          <DxButton :width="76" text="刷新" @click="onClick($event)" />
        </div>
      </div>
      <OdsTable :options="options" :columns="columns" @handle-bill-code-click="handleBillCodeClick">
      </OdsTable>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { ITableOptions } from '/@/components/Table/type';
  import { useUserStore } from '/@/store/modules/user';
  import QueryPlan from '../../../components/QueryPlan/index.vue';
  import DxButton from 'devextreme-vue/button';

  export default defineComponent({
    name: 'Analysis',
    components: {
      QueryPlan,
      DxButton,
    },
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
          key: 'BillCode',
          caption: 'billCode',
          type: 'string',
          cellTemplate: 'billCode',
        },
        {
          key: 'BigGroup',
          caption: 'bigGroup',
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
        },
      ];
      const options: ITableOptions = {
        height: 'calc(100vh - 286px)',
        page: {
          size: 20,
        },
        dataSourceOptions: {
          sort: 'Id',
          oDataOptions: {
            url: '/api/odata/shipping-orders',
            key: 'Id',
            keyType: 'int64',
          },
        },
      };
      const { userId, userName } = userStore.getUserInfo;
      // getShippingOrders().then(res => {
      //   tableData.value = res;
      // });

      function handleBillCodeClick(data) {
        console.log(data);
      }

      return {
        userId,
        userName,
        columns,
        options,
        handleBillCodeClick,
      };
    },
  });
</script>

<style lang="less" scoped>
  .example {
    width: 100%;
    padding: 20px;
    padding-bottom: 0;
    background-color: #fff;
    .btn-wrap {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 20px;
      .btn-box {
        & > * {
          margin-right: 10px;
        }
        :nth-last-child(1) {
          margin-right: 0;
        }
      }
    }
  }
</style>
