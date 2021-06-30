<template>
  <div class="detail">
    <div class="tab-panel">
      <div class="btn-box">
        <DxButton :width="76" text="保存" type="default" />
        <DxDropDownButton :width="80" text="提交" />
        <DxDropDownButton :width="80" text="审核" />
        <DxButton :width="76" text="刷新" />
      </div>
      <DxTabPanel :data-source="multiViewItems">
        <template #item>
          <div class="tab">
            <div class="form-box" :style="{ maxHeight: opened ? '50vh' : closeHeight + 'px' }">
              <DxForm id="form" :form-data="formData" :col-count="4">
                <DxItem
                  v-for="(item, index) in detail"
                  :key="index"
                  :label="{ text: item.label }"
                  :data-field="item.dataField"
                  :editor-type="item.editorType"
                  :disabled="item.disabled"
                />
                <DxSwitch />
              </DxForm>
            </div>
            <div class="icon-box">
              <SvgIcon
                :class="['icon', opened && 'icon--translate']"
                size="16"
                name="multi-arrow"
                @click="opened = !opened"
              ></SvgIcon>
            </div>
          </div>
        </template>
      </DxTabPanel>
    </div>
    <div class="tab-panel">
      <div class="btn-box">
        <DxButton :width="76" text="新增" type="default" />
        <DxButton :width="76" text="保存" />
      </div>
      <DxTabPanel class="table-wrap" :data-source="multiEntityItems">
        <template #item>
          <div class="tab">
            <DxDataGrid :data-source="tableData" height="100%"></DxDataGrid>
          </div>
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
  import DxDataGrid from 'devextreme-vue/data-grid';
  import DxButton from 'devextreme-vue/button';
  import DxDropDownButton from 'devextreme-vue/drop-down-button';
  import { useRoute } from 'vue-router';
  import { getDetaildata, customDetail } from '/@/model/detail/shipping-orders';

  export default defineComponent({
    components: {
      DxTabPanel,
      DxForm,
      DxItem,
      DxSwitch,
      DxDataGrid,
      DxButton,
      DxDropDownButton,
    },
    setup() {
      const opened = ref(false);
      const multiViewItems = [
        {
          title: '基本信息',
        },
        {
          title: '收货人信息',
        },
        {
          title: '物流信息',
        },
        {
          title: '其他信息',
        },
      ];
      const multiEntityItems = [
        {
          title: '明细信息',
        },
        {
          title: '操作记录',
        },
      ];
      const tableData = [];
      const closeHeight = 36;

      const route = useRoute();
      const { billcode } = route.query;
      const formData = ref();
      const detail = customDetail;

      onMounted(async () => {
        const data = await getDetaildata(['BillCode', '=', billcode]);
        formData.value = data;
      });

      return {
        opened,
        multiViewItems,
        multiEntityItems,
        tableData,
        closeHeight,
        formData,
        detail,
      };
    },
  });
</script>

<style lang="less" scoped>
  .detail {
    flex: 1;
    display: flex;
    flex-direction: column;

    .tab-panel {
      position: relative;
      display: flex;
      flex-direction: column;
      padding-top: 10px;
      background-color: #fff;
      &:last-child {
        flex: 1;
        margin-top: 20px;
      }
    }

    .tab {
      padding-top: 20px;
      background-color: #fff;
    }
    .btn-box {
      position: absolute;
      top: 0;
      right: 20px;
      z-index: 100;
      display: flex;
      align-items: center;
      height: 54px;
      & > * {
        margin-left: 10px;
      }
    }
    .form-box {
      padding: 0 20px;
      overflow: hidden;
      transition: all 500ms ease-in-out;
    }
    .icon-box {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      padding: 20px 0;
      .icon {
        cursor: pointer;
        transform: rotate(-180deg);
        transition: transform 300ms;
        &--translate {
          transform: rotate(0);
          transition: transform 300ms;
        }
      }
    }
    .table-wrap {
      flex: 1;
    }
  }
</style>
