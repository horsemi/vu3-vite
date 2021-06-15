<template>
  <div>
    <QueryPlan />
    <div class="example">
      <div class="btn__wrap">
        <div class="btn__box">
          <DxButton :width="76" text="提交" type="default" @click="onClick($event)" />
          <DxButton :width="76" text="审核" @click="onClick($event)" />
          <DxButton :width="76" text="删除" @click="onClick($event)" />
          <DxDropDownButton :items="tabList" :width="98" text="标记" />
        </div>
        <div class="btn__box">
          <DxButton
            id="link"
            :width="112"
            text="汇总信息"
            @click="defaultVisible = !defaultVisible"
          >
          </DxButton>
          <DxButton :width="100" icon="refresh" text="刷新" @click="onClick($event)" />
        </div>
      </div>
      <OdsTable :options="options" :columns="columns"> </OdsTable>
    </div>
    <DxPopover v-model:visible="defaultVisible" target="#link" position="bottom">
      <div v-for="(item, index) in summary" :key="index" class="summary">
        <span class="summary__text">{{ item.text }}</span>
        <span class="summary__num">{{ item.num }}</span>
      </div>
    </DxPopover>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { ITableOptions } from '/@/components/Table/type';
import { useUserStore } from '/@/store/modules/user';
import QueryPlan from '../../../components/QueryPlan/index.vue';
import DxButton from 'devextreme-vue/button';
import DxDropDownButton from 'devextreme-vue/drop-down-button';
import { DxPopover } from 'devextreme-vue/popover';

export default defineComponent({
  name: 'Analysis',
  components: {
    QueryPlan,
    DxButton,
    DxDropDownButton,
    DxPopover,
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
        key: 'BigGroup',
        caption: 'bigGroup',
        type: 'string',
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
    const tabList = ['加急单', '区分物流', '产品异常', '订单异常', '取消标识'];
    const summary = [
      {
        text: '数量汇总',
        num: 136,
      },
      {
        text: '包件数汇总',
        num: '358',
      },
      {
        text: '总包件数汇总',
        num: '358',
      },
      {
        text: '体积汇总',
        num: '153.52',
      },
      {
        text: '总体积汇总',
        num: '153.52',
      },
    ];
    const defaultVisible = ref(false);

    const { userId, userName } = userStore.getUserInfo;
    // getShippingOrders().then(res => {
    //   tableData.value = res;
    // });
    return {
      userId,
      userName,
      columns,
      options,
      tabList,
      defaultVisible,
      summary,
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
  .btn__wrap {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 20px;
    .btn__box {
      & > * {
        margin-right: 10px;
      }
      :nth-last-child(1) {
        margin-right: 0;
      }
    }
  }
}

.summary {
  display: flex;
  width: 200px;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
  .summary__text,
  .summary__num {
    flex: 1;
    text-align: right;
  }
  .summary__num {
    margin-left: 14px;
    text-align: left;
  }
}
</style>