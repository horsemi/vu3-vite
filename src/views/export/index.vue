<template>
  <div class="export-wrap">
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
  import { defineComponent, onActivated, onBeforeUnmount, onDeactivated, ref } from 'vue';
  import { ExportApi } from '/@/api/export';
  import DxButton from 'devextreme-vue/button';

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

      let intervalId: any = null;
      let pageIndex = 1;
      let pageSize = 50;
      const dataSource = ref();

      function onSearch() {
        ExportApi.exprotList({
          Application: ['OrderServerApi', 'ExpressesApi', 'BmsApi'],
          pageIndex,
          pageSize,
        }).then((res) => {
          dataSource.value = res.records;
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
      function createInterval() {
        if (intervalId !== null) {
          clearInterval(intervalId);
          intervalId = null;
        }
        intervalId = setInterval(onSearch, 5000);
      }
      function removeInterval() {
        if (intervalId !== null) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }

      onSearch();
      createInterval();

      onActivated(() => {
        createInterval();
      });

      onDeactivated(() => {
        removeInterval();
      });

      onBeforeUnmount(() => {
        removeInterval();
      });

      return {
        dataSource,
        columns,
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
