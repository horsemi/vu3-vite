<template>
  <div :class="prefixCls">
    <DxButton id="summary-button" :width="122" icon="paste" text="汇总信息" @click="onSummary" />
    <DxPopover
      v-model:visible="showSummary"
      :width="320"
      target="#summary-button"
      position="bottom"
    >
      <div>
        <div v-if="list.length > 0">
          <div v-for="(item, index) in list" :key="index" :class="`${prefixCls}-item`">
            <div :class="`${prefixCls}-item-name`"
              >{{ item.caption }}_{{ summaryTypeMap[item.summaryType] }}</div
            >
            <div :class="`${prefixCls}-item-value`">{{ item.value }}</div>
          </div>
        </div>
        <div v-else :class="`${prefixCls}-empty`"> 暂无汇总信息 </div>
      </div>
    </DxPopover>
  </div>
</template>

<script lang="ts">
  import type { PropType } from 'vue';
  import type { ISchemeItem, ISummaryItem } from '../QueryPopup/content/types';
  import type { IColumnItem, SummaryType } from '/@/model/types';
  import type { IOdataParams } from '../Table/types';

  import { defineComponent, ref } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { getOdataList } from '/@/api/ods/common';

  import DxButton from 'devextreme-vue/button';
  import { DxPopover } from 'devextreme-vue/popover';
  import { upperFirst } from 'lodash-es';

  export default defineComponent({
    name: 'SummaryButton',
    components: {
      DxButton,
      DxPopover,
    },
    props: {
      scheme: {
        type: Object as PropType<ISchemeItem>,
        default: () => {
          return {};
        },
      },
      orderCode: {
        type: String,
        default: '',
      },
      systemCode: {
        type: String,
        default: '',
      },
      odataParams: {
        type: Object as PropType<Partial<IOdataParams>>,
        default: () => {
          return {};
        },
      },
      allColumns: {
        type: Array as PropType<IColumnItem[]>,
        default: () => {
          return [];
        },
      },
    },
    setup(props) {
      const { prefixCls } = useDesign('summary-button');
      const showSummary = ref(false);

      const list = ref<{ caption: string | undefined; value: any; summaryType: SummaryType }[]>([]);

      const summaryTypeMap = {
        sum: '总和',
        min: '最小值',
        max: '最大值',
        avg: '平均值',
        count: '计数',
      };

      const serverSummary = async ({
        orderCode,
        systemCode,
        summary,
        odataParams,
        allColumns,
      }: {
        orderCode: string;
        systemCode?: string;
        summary: ISummaryItem[];
        odataParams: Partial<IOdataParams>;
        allColumns: IColumnItem[];
      }) => {
        const _aggregate = summary.map((item) => {
          return `${item.type}(${item.key.replaceAll('_', '.')})`;
        });
        const $aggregate = _aggregate.join(',');
        const params = {};
        odataParams.$filter && (params['$filter'] = odataParams.$filter);
        odataParams.$expand && (params['$expand'] = odataParams.$expand.replaceAll('_', '.'));
        $aggregate && (params['$aggregate'] = $aggregate);

        const data = await getOdataList(orderCode, params, systemCode ? systemCode : undefined);

        const res = data[0] || {};

        const list = summary.map((item) => {
          const col = allColumns.find((col) => col.key === item.key);
          return {
            caption: col?.caption,
            value: res[`${item.key.replaceAll('_', '')}${upperFirst(item.type)}`],
            summaryType: item.type,
          };
        });

        return list;
      };

      const onSummary = () => {
        showSummary.value = true;
        const serverSummaryScheme = props.scheme.summary.filter((item) => item.mode === 'all');
        if (serverSummaryScheme.length > 0) {
          serverSummary({
            orderCode: props.orderCode,
            systemCode: props.systemCode,
            summary: serverSummaryScheme,
            odataParams: props.odataParams,
            allColumns: props.allColumns,
          }).then((res) => {
            list.value = res;
          });
        } else {
          list.value = [];
        }
      };

      return {
        showSummary,
        prefixCls,
        list,
        summaryTypeMap,
        onSummary,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-summary-button';
  .@{prefix-cls} {
    display: inline-block;

    &-item {
      display: flex;
      margin-bottom: 10px;

      &:last-child {
        margin-bottom: 0;
      }

      &-name {
        width: 60%;
        margin-right: 14px;
        text-align: right;
      }
    }

    &-empty {
      color: #909193;
      text-align: center;
    }
  }
</style>
