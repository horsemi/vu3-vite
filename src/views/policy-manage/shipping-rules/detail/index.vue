<template>
  <div class="detail">
    <div v-loading="formLoading" :class="['tab-panel', isFixHeight ? 'fixHeight' : '']">
      <div class="btn-box">
        <DxButton
          :disabled="savePermission"
          type="default"
          text="保存"
          @click="onSaveClickThrottleFn"
        />
      </div>
      <DetailForm
        :col-count="8"
        :read-only="false"
        :form-data="baseFormData"
        :form-list="baseInformation"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import type { IColumnItem } from '/@/model/types';
  import type { ISchemeItem } from '/@/components/QueryPopup/content/types';

  import { defineComponent, ref, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useThrottleFn } from '@vueuse/core';
  import { useViewStore } from '/@/store/modules/view';
  import { odsMessage } from '/@/components/Message';

  import { usePermissionStore } from '/@/store/modules/permission';
  import { shippingRuleType } from '/@/enums/actionPermission/shipping-rules';

  import { ShippingRulesApi } from '/@/api/policy-manage/shipping-rules';
  import { useDetailForm } from './index';
  import { DEFAULT_THROTTLE_TIME } from '/@/settings/encryptionSetting';

  import DxButton from 'devextreme-vue/button';

  import DetailForm from '/@/components/DetailForm/index.vue';

  export default defineComponent({
    name: 'PolicyManageShippingRulesDetail',
    components: {
      DxButton,
      DetailForm,
    },
    setup() {
      const permissionStore = usePermissionStore();
      const multiViewItems = ref([
        {
          title: '基本信息',
          key: 'base',
          rowCount: 0,
        },
      ]);

      const isFixHeight = ref<boolean>(true);

      const route = useRoute();
      const router = useRouter();
      const viewStore = useViewStore();

      const Id = route.query.Id as string | undefined;

      function detailFormCallBack() {
        if (formEditStatus.value === 'Add') {
          baseFormData.value['CreatedTime'] = Date.now();
          baseFormData.value['UpdatedTime'] = Date.now();
          baseFormData.value['IsEnabled'] = true;
          baseFormData.value['MinWeight'] = 0;
        }
      }

      const {
        formLoading,
        formEditStatus,
        baseFormData,
        baseInformation,
        refreshDetailForm,
        initFormDataHandle,
      } = useDetailForm(Id || '', multiViewItems, detailFormCallBack);

      const definiteScheme = ref<ISchemeItem>();
      const definiteAllColumns = ref<IColumnItem[]>([]);

      const onRefresh = () => {
        getDetail();
      };
      const savePermission = computed(() => {
        return formEditStatus.value === 'Add'
          ? !permissionStore.hasPermission(shippingRuleType.shippingRuleCreate)
          : !permissionStore.hasPermission(shippingRuleType.shippingRuleUpdate);
      });
      const onSaveClick = () => {
        const result = initFormDataHandle([
          {
            formData: baseFormData.value,
            information: baseInformation.value,
          },
        ]);

        if (formEditStatus.value === 'Add') {
          ShippingRulesApi.onShippingRulesCreate(result).then(() => {
            viewStore.closeViewByKey(route.fullPath, router);
            odsMessage({
              type: 'success',
              message: '保存成功',
            });
            // onRefresh();
          });
        } else {
          ShippingRulesApi.onShippingRulesUpdate(Object.assign(result, { Id })).then(() => {
            odsMessage({
              type: 'success',
              message: '保存成功',
            });
            onRefresh();
          });
        }
      };

      const getDetail = () => {
        if (baseInformation) {
          refreshDetailForm();
        }
      };

      // 所有操作设置为节流
      const getDataThrottleFn = useThrottleFn(onRefresh, DEFAULT_THROTTLE_TIME);

      const onSaveClickThrottleFn = useThrottleFn(onSaveClick, DEFAULT_THROTTLE_TIME);

      return {
        formLoading,
        definiteScheme,
        definiteAllColumns,

        baseInformation,
        baseFormData,

        multiViewItems,
        onSaveClickThrottleFn,
        getDataThrottleFn,
        savePermission,
        isFixHeight,
      };
    },
  });
</script>

<style lang="less">
  .first-dropButton {
    background-color: @color-primary;
    border-radius: 4px;
    .dx-buttongroup .dx-buttongroup-wrapper {
      border: none;
      .dx-buttongroup-item .dx-button-content .dx-button-text {
        color: #fff !important;
      }
      .dx-icon {
        color: #fff !important;
      }
    }
  }
  .detail {
    overflow: hidden;

    .btn-box {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      padding: 12px 8px 4px 8px;
      & > * {
        margin-left: 8px;
      }
    }
    .fixHeight {
      min-height: 155px;
    }

    .tab-panel {
      position: relative;
      display: flex;
      flex-direction: column;
      background-color: #fff;
      &:last-child {
        flex: 1;
        margin-top: 16px;
      }
      .tab {
        padding: 12px 16px;
        background-color: #fff;
        .tab-btn {
          padding-bottom: 12px;
          & > * {
            margin-right: 8px;
          }
        }
      }
    }
    .form-box {
      overflow: hidden;
    }
    .icon-box {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      padding-top: 12px;
      .icon {
        cursor: pointer;
        transform: rotate(0);
        &--translate {
          transform: rotate(-180deg);
        }
      }
    }

    .dx-layout-manager .dx-field-item:not(.dx-first-row) {
      padding-top: 12px;
    }

    .dx-texteditor-input {
      min-height: 0;
      padding: 4px 8px 4px;
    }
  }
</style>
