<template>
  <div class="detail">
    <div class="tab-panel">
      <div class="btn-box">
        <DxButton :width="76" text="保存" type="default" />
        <DxDropDownButton :width="80" text="提交" />
        <DxDropDownButton :width="80" text="审核" />
        <DxButton :width="76" text="刷新" />
      </div>
      <DxTabPanel
        :data-source="multiViewItems"
        :loop="true"
        :animation-enabled="true"
        :swipe-enabled="true"
        :focus-state-enabled="false"
      >
        <template #item>
          <div class="tab">
            <div class="form-box" :style="{ maxHeight: opened ? '50vh' : closeHeight + 'px' }">
              <DxForm id="form" :form-data="formData" :col-count="4">
                <template v-for="(item, index) in detail" :key="index">
                  <DxItem
                    v-if="!item.hide"
                    :label="{ text: item.label }"
                    :data-field="item.dataField"
                    :editor-type="item.editorType"
                    :disabled="item.disabled"
                    :editor-options="handleEditorOptions(item.editorType, item.dataField)"
                  />
                </template>
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
        <DxButton :width="76" text="删除" />
      </div>
      <DxTabPanel
        class="table-wrap"
        :data-source="multiEntityItems"
        :loop="true"
        :animation-enabled="true"
        :swipe-enabled="true"
        :focus-state-enabled="false"
      >
        <template #item>
          <div class="tab">
            <DxDataGrid :data-source="dataSource" height="100%">
              <DxSelection mode="multiple" />
              <DxColumn caption="序号" cell-template="index" />
              <template v-for="(item, index) in definite" :key="index">
                <DxColumn v-if="!item.hide" :data-field="item.key" :caption="item.caption">
                </DxColumn>
              </template>
              <template #index="{ data }">
                <div>{{ data.rowIndex }}</div>
              </template>
              <DxScrolling mode="infinite" />
            </DxDataGrid>
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
import { DxDataGrid, DxColumn, DxScrolling, DxSelection } from 'devextreme-vue/data-grid';
import DxButton from 'devextreme-vue/button';
import DxDropDownButton from 'devextreme-vue/drop-down-button';
import { useRoute } from 'vue-router';
import {
  getDetailData,
  getDefiniteData,
  customDetail,
  customDefinite,
} from '/@/model/detail/shipping-orders';
import { EditorType } from '/@/model/detail/types';

export default defineComponent({
  components: {
    DxTabPanel,
    DxForm,
    DxItem,
    DxSwitch,
    DxDataGrid,
    DxButton,
    DxDropDownButton,
    DxScrolling,
    DxColumn,
    DxSelection,
  },
  setup() {
    const opened = ref(true);
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
    const dataSource = ref();
    const detail = customDetail;
    const definite = customDefinite;

    const handleEditorOptions = (editorType: EditorType, dataField: string) => {
      let editorOptions;
      if (editorType === 'dxSwitch') {
        editorOptions = {
          switchedOnText: '是',
          switchedOffText: '否',
        };
      }
      return editorOptions;
    };

    onMounted(async () => {
      formData.value = await getDetailData(['BillCode', '=', billcode]);
      dataSource.value = await getDefiniteData(['ShippingOrderId', '=', formData.value.Id]);
    });

    return {
      opened,
      multiViewItems,
      multiEntityItems,
      tableData,
      closeHeight,
      formData,
      dataSource,
      detail,
      definite,
      handleEditorOptions,
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
    padding: 20px;
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
    padding-top: 20px;
    .icon {
      cursor: pointer;
      transform: rotate(0);
      transition: transform 500ms;
      &--translate {
        transform: rotate(-180deg);
        transition: transform 500ms;
      }
    }
  }
  .table-wrap {
    flex: 1;
  }
}
</style>
