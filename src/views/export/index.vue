<template>
  <div v-loading="tableLoading" class="export-wrap">
    <div class="btn-box">
      <DxButton :width="76" text="查询" type="default" @click="onSearch" />
    </div>
    <OdsTable
      ref="dataGrid"
      height="calc(100vh - 196px)"
      :data-source="dataSource"
      :columns="columns"
      @optionChanged="onOptionChanged"
      @cellClick="onCellClick"
    ></OdsTable>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onActivated, ref } from 'vue';
  import { ExportApi } from '/@/api/export';
  import DxButton from 'devextreme-vue/button';
  import websocketService from '/@/utils/websocket/index';
  import { useRoute } from 'vue-router';
  import { useThrottleFn } from '@vueuse/core';

  export default defineComponent({
    name: 'Export',
    components: {
      DxButton,
    },
    setup() {
      const columns: Array<{
        key: string;
        caption: string;
        cssClass?: string;
        customizeText?: (cellInfo: any) => string;
      }> = [
        {
          key: 'reportName',
          caption: '名称',
        },
        {
          key: 'precent',
          caption: '导出进度',
        },
        {
          key: 'createdTime',
          caption: '创建时间',
        },
        {
          key: 'lastUpdatedTime',
          caption: '更新时间',
        },
        {
          key: 'userName',
          caption: '导出用户',
        },
        {
          key: 'status',
          caption: '状态',
        },
        {
          key: 'downloadUrl',
          caption: '下载',
          cssClass: 'export-download-highlighted',
          customizeText: function (cellInfo) {
            if (cellInfo.value) {
              return '下载';
            } else {
              return '';
            }
          },
        },
      ];

      let pageIndex = 1;
      let pageSize = 50;
      let activatedRefresh = false;
      const dataSource = ref();
      const tableLoading = ref(true);
      const route = useRoute();
      const throttleSearch = useThrottleFn(onSearch, 5000);

      function onSearch() {
        tableLoading.value = true;
        pageIndex = 1;
        ExportApi.exprotList({
          applications: ['OdsApi', 'ExpressesApi', 'PolicyManage'],
          pageIndex,
          pageSize,
        })
          .then((res) => {
            dataSource.value = res.records;
            tableLoading.value = false;
          })
          .catch(() => {
            tableLoading.value = false;
          });
      }

      function onOptionChanged(e) {
        const { fullName, value } = e;
        if (fullName === 'paging.pageSize') {
          pageIndex = 1;
          pageSize = value;
          onSearch();
        } else if (fullName === 'paging.pageIndex') {
          pageIndex = value + 1;
          onSearch();
        }
      }
      function onCellClick(e) {
        const { columnIndex, data } = e;
        if (columnIndex === 1 || columnIndex === 7) {
          if (data.downloadUrl) {
            let a = document.createElement('a');
            a.href = data.downloadUrl;
            a.click();
            data.downloadUrl = '';
          }
        }
      }

      function handleExporting() {
        websocketService.receiveMessages({
          success(res) {
            if (res && (res.event === 'Exporting' || res.event === 'ExportStatusUpdate')) {
              if (route.name === 'ExportList') {
                throttleSearch();
              } else {
                !activatedRefresh && (activatedRefresh = true);
              }
            }
          },
        });
      }

      onSearch();
      handleExporting();

      onActivated(() => {
        activatedRefresh && onSearch();
      });

      return {
        dataSource,
        columns,
        tableLoading,
        onSearch,
        onOptionChanged,
        onCellClick,
      };
    },
  });
</script>

<style lang="less">
  .export-wrap {
    padding: 16px;
    padding-bottom: 0;
    background-color: #fff;
    .btn-box {
      display: flex;
      justify-content: flex-end;
      width: 100%;
      margin-bottom: 16px;
    }
    .dx-data-row .export-download-highlighted {
      color: #3694fd !important;
      cursor: pointer;
    }
  }
</style>
