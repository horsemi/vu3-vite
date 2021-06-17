<template>
  <div class="details">
    <DxTabPanel
      v-model:selected-index="selectedIndex"
      :height="260"
      :data-source="multiViewItems"
      :loop="loop"
      :animation-enabled="animationEnabled"
      :swipe-enabled="swipeEnabled"
    >
      <template #title="{ data: company }">
        <span>{{ company.CompanyName }}</span>
      </template>
      <template #item>
        <DxForm id="form" :form-data="companies" :col-count="4">
          <DxItem :label="{ text: '单号编码' }" data-field="ZipCode" />
          <DxItem :label="{ text: '单据日期' }" data-field="ZipCode" />
          <DxItem :label="{ text: '发货批次' }" data-field="ZipCode" />
          <DxItem :label="{ text: '总包件数' }" data-field="ZipCode" />
          <DxItem :label="{ text: '单据类型' }" data-field="ZipCode" />
          <DxItem :label="{ text: '服务项目' }" data-field="ZipCode" />
          <DxItem :label="{ text: '发货模式' }" data-field="ZipCode" />
          <DxItem :label="{ text: '总包裹数' }" data-field="ZipCode" />
          <DxItem :label="{ text: '单据状态' }" data-field="ZipCode" />
        </DxForm>
        <DxSwitch :value="true" />
      </template>
    </DxTabPanel>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DxTabPanel from 'devextreme-vue/tab-panel';
import { DxForm, DxItem } from 'devextreme-vue/form';
import { DxSwitch } from 'devextreme-vue/switch';

export default defineComponent({
  components: {
    DxTabPanel,
    DxForm,
    DxSwitch,
    DxItem,
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
      Name: 'Super Mart of the West',
      Address: '702 SW 8th Street',
      City: 'Bentonville',
      State: 'Arkansas',
      ZipCode: 72716,
      Phone: '(800) 555-2797',
      Fax: '(800) 555-2171',
      Website: 'http://www.nowebsitesupermart.com',
    };

    return {
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
}
</style>
