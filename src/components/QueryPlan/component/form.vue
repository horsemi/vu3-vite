<template>
  <div v-click-outside="closePopup" :class="prefixCls" @keyup.enter="onSearch">
    <div
      :class="`${prefixCls}__box`"
      :style="{
        height: '64px',
        paddingBottom: 0,
        boxShadow: opened ? '10px 0 12px 0 rgb(0 0 0 / 10%)' : '',
      }"
    >
      <DynamicSelect
        v-model:value="queryList[0].value"
        v-model:paramInfo="queryList[0].info"
        v-model:paramKey="queryList[0].requirement"
        v-model:operation="queryList[0].operator"
        v-model:paramDataType="queryList[0].type"
        v-model:paramOperations="queryList[0].operatorList"
        v-model:paramDatatypekeies="queryList[0].datatypekeies"
        v-model:paramRelationKey="queryList[0].relationKey"
        :param-list="columns"
      />
      <SvgIcon
        :class="[`${prefixCls}__icon`, opened && `${prefixCls}__icon--translate`]"
        size="16"
        name="multi-arrow"
        @click="opened = !opened"
      ></SvgIcon>
    </div>
    <transition name="zoom-in-top">
      <div v-show="opened" :class="`${prefixCls}__overflow`">
        <div v-for="(item, index) in queryList.slice(1)" :key="index" :class="`${prefixCls}__box`">
          <DynamicSelect
            v-model:value="item.value"
            v-model:paramInfo="item.info"
            v-model:paramKey="item.requirement"
            v-model:operation="item.operator"
            v-model:paramDataType="item.type"
            v-model:paramOperations="item.operatorList"
            v-model:paramDatatypekeies="item.datatypekeies"
            v-model:paramRelationKey="item.relationKey"
            :param-list="columns"
          />
          <SvgIcon
            :class="`${prefixCls}__icon`"
            size="16"
            name="subtract"
            @click.stop="onDelRequirement(index + 1)"
          ></SvgIcon>
        </div>
        <div :class="`${prefixCls}__box`">
          <div style="cursor: pointer" @click="onAddRequirement">
            <SvgIcon :class="`${prefixCls}__plus`" size="14" name="plus"></SvgIcon>
            <span>添加条件</span>
          </div>
          <DxButton
            v-if="showSaveFast"
            :class="`${prefixCls}__btn`"
            :width="100"
            type="default"
            text="保存设置"
            @click="onSaveFast"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
  import type { IColumnItem } from '/@/model/types';
  import type { IRequirementItem, ISchemeItem } from '../../QueryPopup/content/types';
  import type { ISchemeData } from '../types';
  import { computed, Ref } from 'vue';

  import { defineComponent, inject, ref } from 'vue';
  import { cloneDeep } from 'lodash-es';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { saveSchemesData } from '/@/utils/scheme/index';

  import DxButton from 'devextreme-vue/button';
  import DynamicSelect from '/@/components/DynamicSelect/index.vue';

  export default defineComponent({
    components: {
      DxButton,
      DynamicSelect,
    },
    props: {
      showSaveFast: {
        type: Boolean,
        default: true,
      },
    },
    setup() {
      const allColumns = inject('allColumns') as Ref<IColumnItem[]>;
      const schemeData = inject('schemeData') as Ref<ISchemeData>;
      const schemeDataTemp = inject('schemeDataTemp') as Ref<ISchemeData>;
      const onChangeScheme = inject('onChangeScheme') as (data: ISchemeItem) => void;

      const infoMap = {
        base: '基本',
        base_Items: '明细',
      };

      const columns = computed(() => {
        const _columns: IColumnItem[] = [];
        allColumns.value.forEach((item) => {
          _columns.push({
            ...item,
            caption: item.info ? `${infoMap[item.info]}.${item.caption}` : item.caption,
          });
        });
        return _columns;
      });

      const queryList = computed(() => {
        return (
          (schemeData.value.scheme[schemeData.value.checkedIndex] &&
            schemeData.value.scheme[schemeData.value.checkedIndex].fast) || [
            {
              requirement: '',
              operator: '=',
              operatorList: [],
              value: undefined,
              type: '',
              datatypekeies: '',
              relationKey: '',
              logic: 'and',
              info: '',
            },
          ]
        );
      });

      const { prefixCls } = useDesign('query-form');
      const opened = ref<boolean>(false);

      function onAddRequirement() {
        queryList.value.push({
          requirement: '',
          operator: '=',
          operatorList: [],
          value: undefined,
          type: '',
          datatypekeies: '',
          relationKey: '',
          logic: 'and',
          info: '',
        });
      }

      function onDelRequirement(index: number) {
        queryList.value.splice(index, 1);
      }

      function onSaveFast() {
        const temp: IRequirementItem[] = [];
        queryList.value.forEach((item) => {
          if (item.requirement) {
            temp.push(item);
          }
        });
        if (temp.length === 0) {
          temp.push({
            requirement: '',
            operator: '=',
            operatorList: [],
            value: undefined,
            type: '',
            datatypekeies: '',
            relationKey: '',
            logic: 'and',
            info: '',
          });
        }
        if (schemeData.value.checkedIndex === 0) {
          schemeData.value.scheme.push({
            ...cloneDeep(schemeData.value.scheme[schemeData.value.checkedIndex]),
            title: '缺省方案（个人）',
            id: '0',
            fast: temp,
          });
          schemeData.value.checkedIndex = schemeData.value.scheme.length - 1;
        }
        let scheme = cloneDeep(schemeData.value.scheme[schemeData.value.checkedIndex]);
        scheme.fast = temp;
        schemeDataTemp.value.scheme[schemeData.value.checkedIndex] = scheme;

        saveSchemesData(schemeDataTemp.value.scheme[schemeData.value.checkedIndex]).then(
          (resolve) => {
            if (resolve) {
              schemeDataTemp.value.scheme[schemeData.value.checkedIndex] = resolve;
            }
          }
        );
      }

      const closePopup = () => {
        opened.value = false;
      };

      const changeQueryList = (data: IRequirementItem[]) => {
        schemeData.value.scheme[schemeData.value.checkedIndex].fast = cloneDeep(data);
      };

      const onSearch = () => {
        const scheme = cloneDeep(schemeData.value.scheme[schemeData.value.checkedIndex]);
        queryList.value.forEach((item) => {
          if (item.requirement) {
            scheme.requirement.push(item);
          }
        });
        onChangeScheme(scheme);
      };

      return {
        prefixCls,
        columns,
        opened,
        queryList,
        onAddRequirement,
        onDelRequirement,
        onSaveFast,
        changeQueryList,
        closePopup,
        onSearch,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-query-form';

  .@{prefix-cls} {
    position: relative;
    .zoom-animation(top, scaleY(0), scaleY(1), center top);

    &__box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 16px;
      padding-left: 20px;

      & > * {
        margin-right: 10px;
      }

      input {
        width: 200px;
        height: 34px;
        padding: 0 10px;
        cursor: pointer;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 4px;
        outline: none;
        box-sizing: border-box;
      }
    }

    &__icon {
      margin-right: 20px;
      margin-left: 10px;
      cursor: pointer;
      transform: rotate(0);
      transition: transform 300ms;
    }

    &__icon--translate {
      transform: rotate(-180deg);
      transition: transform 300ms;
    }

    &__overflow {
      position: absolute;
      top: 64px;
      z-index: @page-popup-z-index;
      width: 100%;
      background-color: #fff;
      box-shadow: 10px 10px 12px 0 rgb(0 0 0 / 10%);
    }

    &__plus {
      margin: 0 6px;
    }

    &__btn {
      margin-right: 57px;
    }
  }
</style>
