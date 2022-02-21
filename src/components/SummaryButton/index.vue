<template>
  <div :class="prefixCls">
    <DxButton id="summaryButton" :width="122" icon="datafield" text="汇总信息" @click="onSummary" />
    <DxPopover
      ref="summaryPopover"
      v-model:visible="showSummary"
      target="#summaryButton"
      position="bottom"
      min-width="240px"
      @hiding="list = []"
    >
      <div v-loading="loading">
        <div v-if="list.length > 0" :class="`${prefixCls}-list`">
          <div>
            <div
              v-for="(item, index) in list"
              :key="index"
              :class="`${prefixCls}-name`"
              :style="index % 2 === 0 ? '' : 'background: #FAFAFA;'"
            >
              <div style="display: inline-block; margin-right: 10px">{{ item.caption }}</div
              ><div style="display: inline-block; width: 25px; font-style: italic">
                {{ summaryTypeMap[item.summaryType] }}
              </div>
            </div>
          </div>
          <div>
            <div
              v-for="(item, index) in list"
              :key="index"
              :class="`${prefixCls}-value`"
              :style="index % 2 === 0 ? '' : 'background: #FAFAFA;'"
            >
              {{ getValue(item) }}
            </div>
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

  import { defineComponent, ref, nextTick } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { getOdataList } from '/@/api/ods/common';
  import { formatToDate, formatToDateTime } from '/@/utils/date';
  import { isNullOrUnDef } from '/@/utils/is';

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
      const loading = ref(false);
      const summaryPopover = ref();

      const list = ref<
        {
          caption: string | undefined;
          value: any;
          summaryType: SummaryType;
          fieldType: string | undefined;
        }[]
      >([]);

      const summaryTypeMap = {
        sum: 'Sum',
        min: 'Min',
        max: 'Max',
        avg: 'Avg',
        count: 'Cnt',
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
          return `${item.type}(${item.key.replace(/_/g, '.')})`;
        });
        const $aggregate = _aggregate.join(',');
        const params = {};
        odataParams.$filter && (params['$filter'] = odataParams.$filter);
        odataParams.$expand && (params['$expand'] = odataParams.$expand.replace(/_/g, '.'));
        $aggregate && (params['$aggregate'] = $aggregate);

        const data = await getOdataList(orderCode, params, systemCode ? systemCode : undefined);

        const res = data[0] || {};

        const list = summary.map((item) => {
          const col = allColumns.find((col) => col.key === item.key);

          return {
            caption: col?.caption.slice(col?.caption.indexOf('_') + 1),
            value: res[`${item.key.replace(/_/g, '')}${upperFirst(item.type)}`],
            summaryType: item.type,
            fieldType: col?.type,
          };
        });

        return list;
      };

      const onSummary = () => {
        list.value = [];
        showSummary.value = !showSummary.value;
        const serverSummaryScheme = props.scheme.summary?.filter((item) => item.mode === 'all');
        if (showSummary.value && serverSummaryScheme?.length > 0) {
          loading.value = true;
          serverSummary({
            orderCode: props.orderCode,
            systemCode: props.systemCode,
            summary: serverSummaryScheme,
            odataParams: props.odataParams,
            allColumns: props.allColumns,
          })
            .then((res) => {
              list.value = res;

              // 解决自动充满导致弹窗部分在视口外
              nextTick(() => {
                // 重新计算弹窗大小和位置
                summaryPopover.value.instance.repaint();
                loading.value = false;
              });
            })
            .catch(() => {
              loading.value = false;
            });
        }
      };

      const getValue = (item) => {
        if (isNullOrUnDef(item.value)) {
          return '无';
        } else if (item.fieldType === 'date') {
          return formatToDate(item.value);
        } else if (item.fieldType === 'datetime') {
          return formatToDateTime(item.value, 'YYYY/MM/DD Ah:mm');
        } else {
          return item.value;
        }
      };

      return {
        showSummary,
        summaryPopover,
        prefixCls,
        list,
        summaryTypeMap,
        loading,
        onSummary,
        getValue,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-summary-button';
  .@{prefix-cls} {
    display: inline-block;

    &-list {
      display: flex;
      justify-content: center;
    }

    &-name {
      padding: 5px 10px;
      font-size: 15px;
      color: #666;
      text-align: right;

      &:last-child {
        margin-bottom: 0;
      }
    }

    &-value {
      padding: 5px 10px 5px 0;
      font-size: 15px;
      font-weight: 700;
      color: #333;
      text-align: left;

      &:last-child {
        margin-bottom: 0;
      }
    }

    &-empty {
      padding: 10px 0;
      color: #909193;
      text-align: center;
    }
  }
</style>
