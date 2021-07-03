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
            <div
              ref="formBox"
              class="form-box"
              :style="{ maxHeight: opened ? '50vh' : closeHeight + 'px' }"
            >
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
            <OdsTable
              class="ods-table"
              :table-options="tableOptions"
              :data-source="dataSource"
              :columns="columns"
              :style="{ height: opened ? tableOpenedHeight : tableCloseHeight }"
            >
            </OdsTable>
          </div>
        </template>
      </DxTabPanel>
    </div>
  </div>
</template>

<script lang="ts">
import type { EditorType } from '/@/model/detail/types';
import type { ITableOptions } from '/@/components/Table/types';

import { defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { cloneDeep } from 'lodash-es';

import {
  getDetailData,
  getDefiniteData,
  customDetail,
  customDefinite,
} from '/@/model/detail/shipping-orders';
import { defaultTableOptions } from '/@/components/Table/common';
import { deepMerge } from '/@/utils';

import DxTabPanel from 'devextreme-vue/tab-panel';
import { DxForm, DxItem } from 'devextreme-vue/form';
import { DxSwitch } from 'devextreme-vue/switch';
import DxButton from 'devextreme-vue/button';
import DxDropDownButton from 'devextreme-vue/drop-down-button';


export default defineComponent({
  components: {
    DxTabPanel,
    DxForm,
    DxItem,
    DxSwitch,
    DxButton,
    DxDropDownButton,
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
    const formBox = ref();
    const tableOpenedHeight = ref<string>('1px');
    const tableCloseHeight = 'calc(100vh - 36px - 384px)';

    const route = useRoute();
    const Id = parseInt(route.query.Id as string);
    const formData = ref();
    const detail = customDetail;

    const options: Partial<ITableOptions> = {
      useScrolling: true,
      page: {
        size: 10
      }
    };
    const tableOptions: ITableOptions = deepMerge(cloneDeep(defaultTableOptions), options);
    const dataSource = ref();
    const columns = customDefinite;

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
    const getTableOpenedHeight = () => {
      tableOpenedHeight.value = `calc(100vh - ${formBox.value.offsetHeight}px - 384px)`;
    };

    onMounted(async () => {
      formData.value = await getDetailData(['Id', '=', Id]);
      getTableOpenedHeight();
      dataSource.value = await getDefiniteData(tableOptions, ['ShippingOrderId', '=', Id]);
    });

    return {
      formBox,
      opened,
      multiViewItems,
      multiEntityItems,
      tableData,
      closeHeight,
      formData,
      dataSource,
      detail,
      tableOptions,
      columns,
      tableOpenedHeight,
      tableCloseHeight,
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
  .ods-table {
    transition: all 500ms;
  }
}
</style>
