<template>
  <div class="details">
    <div class="content">
      <div class="btn-wrap">
        <DxButton :width="76" text="保存" type="default" @click="onClick($event)" />
        <DxDropDownButton :items="tabList" :width="80" text="提交" />
        <DxDropDownButton :items="tabList" :width="80" text="审核" />
        <DxButton :width="76" text="刷新" @click="onClick($event)" />
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
            <DxForm id="form" :form-data="companies" :col-count="4">
              <DxItem :label="{ text: '单号编码' }" data-field="ID" />
              <DxItem :label="{ text: '单据日期' }" data-field="Name" editor-type="dxDateBox" />
              <DxItem :label="{ text: '发货批次' }" data-field="Address" />
              <DxItem :label="{ text: '总包件数' }" data-field="City" editor-type="dxNumberBox" />
              <DxItem
                :label="{ text: '单据类型' }"
                data-field="State"
                editor-type="dxSelectBox"
                :editor-options="{ value: '', items: positions }"
              />
              <DxItem :label="{ text: '服务项目' }" data-field="ZipCode" />
              <DxItem
                :label="{ text: '发货模式' }"
                data-field="Phone"
                editor-type="dxSelectBox"
                :editor-options="{ value: '', items: positions }"
              />
              <DxItem :label="{ text: '总包裹数' }" data-field="Fax" editor-type="dxNumberBox" />
              <DxItem
                :label="{ text: '单据状态' }"
                data-field="Website"
                editor-type="dxSelectBox"
                :editor-options="{ value: '', items: positions }"
              />
              <DxItem :label="{ text: '支装类型' }" data-field="companyName" />
              <DxItem :label="{ text: '备货区' }" data-field="type" />
              <DxItem
                :label="{ text: '总体积' }"
                data-field="PhoneType"
                editor-type="dxNumberBox"
              />
              <DxItem
                :label="{ text: '业务状态' }"
                data-field="CityType"
                editor-type="dxSelectBox"
                :editor-options="{ value: '', items: positions }"
              />
              <DxItem :label="{ text: '发货仓库' }" data-field="NametType" />
              <DxItem :label="{ text: '标记状态' }" data-field="StateType" />
              <DxItem :label="{ text: '重量' }" data-field="faype" editor-type="dxNumberBox" />
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
        <DxButton :width="76" text="新增" type="default" @click="onClick($event)" />
        <DxButton :width="76" text="保存" @click="onClick($event)" />
      </div>
      <DxTabPanel
        v-model:selected-index="selectedIndex"
        :height="400"
        :data-source="multiViewItems"
        loop
        :animation-enabled="animationEnabled"
        :swipe-enabled="swipeEnabled"
      >
        <template #title="{ data: company }">
          <span>{{ company.CompanyName }}</span>
        </template>
        <template #item>
          <OdsTable :table-options="tableOptions" :data-source="dataSource" :columns="columns">
          </OdsTable>
        </template>
      </DxTabPanel>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import DxTabPanel from 'devextreme-vue/tab-panel';
  import { DxForm, DxItem } from 'devextreme-vue/form';
  import { DxSwitch } from 'devextreme-vue/switch';
  import DxButton from 'devextreme-vue/button';
  import DxDropDownButton from 'devextreme-vue/drop-down-button';
  import { getColumns } from '/@/model/shipping-orders';
  import { IColumnItem } from '/@/model/types';
  import { ITableOptions } from '/@/components/Table/type';
  import { getDataSource } from '/@/components/Table/common';

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
      const multiViewItems = [
        {
          ID: 1,
          CompanyName: 'SuprMart',
          Address: '702 SW 8th Street',
          City: 'Bentonville',
          State: 'Arkansas',
          Zipcode: 72716,
          Phone: '(800) 555-2797',
          Fax: '(800) 555-2171',
          Website: 'http://www.nowebsitesupermart.com',
        },
        {
          ID: 2,
          CompanyName: 'ElDepot',
          Address: '2455 Paces Ferry Road NW',
          City: 'Atlanta',
          State: 'Georgia',
          Zipcode: 30339,
          Phone: '(800) 595-3232',
          Fax: '(800) 595-3231',
          Website: 'http://www.nowebsitedepot.com',
        },
        {
          ID: 3,
          CompanyName: 'K&S Music',
          Address: '1000 Nicllet Mall',
          City: 'Minneapolis',
          State: 'Minnesota',
          Zipcode: 55403,
          Phone: '(612) 304-6073',
          Fax: '(612) 304-6074',
          Website: 'http://www.nowebsitemusic.com',
        },
        {
          ID: 4,
          CompanyName: 'Tom Club',
          Address: '999 Lake Drive',
          City: 'Issaquah',
          State: 'Washington',
          Zipcode: 98027,
          Phone: '(800) 955-2292',
          Fax: '(800) 955-2293',
          Website: 'http://www.nowebsitetomsclub.com',
        },
      ];

      const companies = {
        ID: 1,
        Name: new Date(),
        Address: '702 SW 8th Street',
        City: '12',
        State: 'Arkansas',
        ZipCode: 72716,
        Phone: '(800) 555-2797',
        Fax: '0.5',
        Website: 'http://www.nowebsitesupermart.com',
        companyName: 'Tom Club',
        type: '131',
        PhoneType: '15',
        CityType: '555',
        NametType: 'addakansas',
        StateType: 'a14',
        faype: '1.2',
      };

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

      const options: ITableOptions = {
        height: '360px',
        dataSourceOptions: {
          paginate: false,
          sort: 'BillCode',
          oDataOptions: {
            url: '/api/odata/shipping-orders',
            key: 'BillCode',
          },
        },
      };

      const tableOptions = ref<ITableOptions | undefined>();
      const dataSource = ref();
      const columns = ref<IColumnItem[] | undefined>();

      onMounted(async () => {
        const { customOptions, data, customColumns } = await getDataSource(options, getColumns);
        tableOptions.value = customOptions;
        dataSource.value = data;
        columns.value = customColumns;
      });

      return {
        tableOptions,
        dataSource,
        columns,
        tabList,
        positions,
        companies,
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
