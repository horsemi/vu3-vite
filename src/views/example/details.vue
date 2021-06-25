<template>
  <div class="details">
    <div class="content">
      <div class="btn-wrap">
        <DxButton :width="76" text="保存" type="default" />
        <DxDropDownButton :items="tabList" :width="80" text="提交" />
        <DxDropDownButton :items="tabList" :width="80" text="审核" />
        <DxButton :width="76" text="刷新" />
      </div>
      <DxTabPanel
        v-model:selected-index="selectedIndex"
        :height="260"
        :data-source="multiViewItems"
        loop
        :animation-enabled="animationEnabled"
        :swipe-enabled="swipeEnabled"
      >
        <template #title="{ data: company }">
          <span>{{ company.CompanyName }}</span>
        </template>
        <template #item>
          <div>
            <DxForm id="form" :form-data="formData" :read-only="true" :col-count="4">
              <DxItem :label="{ text: '单号编码' }" data-field="BillCode" />
              <DxItem :label="{ text: '单据日期' }" data-field="BillDate" editor-type="dxDateBox" />
              <DxItem :label="{ text: '发货批次' }" data-field="BatchCode" />
              <DxItem
                :label="{ text: '总包件数' }"
                data-field="TotalPackage"
                editor-type="dxNumberBox"
              />
              <DxItem
                :label="{ text: '单据类型' }"
                data-field="BillTypeCode"
                editor-type="dxSelectBox"
                :editor-options="{ value: '', items: positions }"
              />
              <DxItem :label="{ text: '服务项目' }" data-field="ZipCode" />
              <DxItem
                :label="{ text: '发货模式' }"
                data-field="SendGoodsMode"
                editor-type="dxSelectBox"
                :editor-options="{ value: '', items: positions }"
              />
              <DxItem
                :label="{ text: '总包裹数' }"
                data-field="TotalPack"
                editor-type="dxNumberBox"
              />
              <DxItem
                :label="{ text: '单据状态' }"
                data-field="DocumentStatus"
                editor-type="dxSelectBox"
                :editor-options="{ value: '', items: positions }"
              />
              <DxItem :label="{ text: '支装类型' }" data-field="ThreeServiceFeeTypeCode" />
              <DxItem :label="{ text: '备货区' }" data-field="LineAreaCode" />
              <DxItem
                :label="{ text: '总体积' }"
                data-field="TotalVolume"
                editor-type="dxNumberBox"
              />
              <DxItem
                :label="{ text: '业务状态' }"
                data-field="OperationStatus"
                editor-type="dxSelectBox"
                :editor-options="{ value: '', items: positions }"
              />
              <DxItem :label="{ text: '发货仓库' }" data-field="DeliveryWarehouseCode" />
              <DxItem :label="{ text: '标记状态' }" data-field="MarkStatus" />
              <DxItem
                :label="{ text: '重量' }"
                data-field="TotalWeight"
                editor-type="dxNumberBox"
              />
            </DxForm>
            <div class="information-footer">
              <div class="step-wrap"></div>
              <div class="switch-wrap">
                <div class="switch-box">
                  <span>拣货</span>
                  <DxSwitch :value="true" />
                </div>
                <div class="switch-box">
                  <span>集货订单</span>
                  <DxSwitch :value="true" />
                </div>
                <div class="switch-box">
                  <span>小挂</span>
                  <DxSwitch :value="true" />
                </div>
                <div class="switch-box">
                  <span>合并锁单</span>
                  <DxSwitch :value="true" />
                </div>
              </div>
            </div>
          </div>
        </template>
      </DxTabPanel>
    </div>
    <div class="table-wrap">
      <div class="btn-wrap">
        <DxButton :width="76" text="新增" type="default" />
        <DxButton :width="76" text="保存" />
      </div>
      <DxTabPanel
        v-model:selected-index="selectedIndex"
        :height="400"
        :data-source="multiEntityItems"
        loop
        :animation-enabled="animationEnabled"
        :swipe-enabled="swipeEnabled"
      >
        <template #title="{ data: company }">
          <span>{{ company.CompanyName }}</span>
        </template>
        <template #item>
          <!-- <OdsTable :table-options="tableOptions" :data-source="dataSource" :columns="columns">
          </OdsTable> -->
        </template>
      </DxTabPanel>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, reactive } from 'vue';
  import ODataStore from 'devextreme/data/odata/store';
  import DataSource from 'devextreme/data/data_source';

  import DxTabPanel from 'devextreme-vue/tab-panel';
  import { DxForm, DxItem } from 'devextreme-vue/form';
  import { DxSwitch } from 'devextreme-vue/switch';
  import DxButton from 'devextreme-vue/button';
  import DxDropDownButton from 'devextreme-vue/drop-down-button';
  import { IColumnItem } from '/@/model/types';
  import { ITableOptions } from '/@/components/Table/type';

  import { useRouter } from 'vue-router';

  export default defineComponent({
    components: {
      DxTabPanel,
      DxForm,
      DxSwitch,
      DxItem,
      DxButton,
      DxDropDownButton,
    },
    setup() {
      const router = useRouter();
      const billcode = router.currentRoute.value.query.billcode;
      const data = new DataSource({
        sort: 'BillCode desc',
        filter: ['BillCode', '=', billcode],
        paginate: true,
        pageSize: 1,
        store: new ODataStore({
          url: '/api/odata/shipping-orders',
          key: 'BillCode',
          version: 4,
        }),
        select:
          'BillCode,BillDate,TotalPackage,BillTypeCode,DocumentStatus,ThreeServiceFeeTypeCode,LineAreaCode,TotalVolume,OperationStatus,DeliveryWarehouseCode,MarkStatus',
      });
      let formData = ref({});
      data.load().then((data) => {
        formData.value = data[0];
      });

      const multiViewItems = [
        {
          ID: 1,
          CompanyName: '基本信息',
        },
        {
          ID: 2,
          CompanyName: '收货人信息',
        },
        {
          ID: 3,
          CompanyName: '物流信息',
        },
        {
          ID: 4,
          CompanyName: '其他信息',
        },
      ];

      const multiEntityItems = [
        {
          ID: 1,
          CompanyName: '明细信息',
        },
        {
          ID: 2,
          CompanyName: '操作记录',
        },
      ];

      const positions = [
        'HR Manager',
        'IT Manager',
        'CEO',
        'Controller',
        'Sales Manager',
        'Support Manager',
        'Shipping Manager',
      ];

      const tabList = ['加急单', '区分物流', '产品异常', '订单异常', '取消标识'];

      const tableOptions = ref<ITableOptions | undefined>();
      const dataSource = ref();
      const columns = ref<IColumnItem[] | undefined>();

      onMounted(async () => {
        //
      });

      return {
        formData,
        tableOptions,
        dataSource,
        columns,
        tabList,
        positions,
        multiEntityItems,
        selectedIndex: 0,
        loop: false,
        animationEnabled: true,
        swipeEnabled: true,
        multiViewItems,
      };
    },
  });
</script>

<style lang="less" scoped>
  .details {
    width: 100%;

    .btn-wrap {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 100;
    }

    .content {
      position: relative;

      .information-footer {
        display: flex;
        padding-top: 20px;
        box-sizing: border-box;
        .step-wrap {
          width: 50%;
        }
        .switch-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 50%;
          padding: 0 15px;
          .switch-box {
            span {
              padding: 0 20px;
            }
          }
        }
      }
    }

    .table-wrap {
      position: relative;
    }
  }
</style>
