<template>
  <div  v-click-outside="closePopup" :class="prefixCls" @keyup.enter="onSearch">
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
        v-model:paramKey="queryList[0].requirement"
        v-model:operation="queryList[0].operator"
        v-model:paramDataType="queryList[0].type"
        v-model:paramOperations="queryList[0].operatorList"
        v-model:paramDatatypekeies="queryList[0].datatypekeies"
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
            v-model:paramKey="item.requirement"
            v-model:operation="item.operator"
            v-model:paramDataType="item.type"
            v-model:paramOperations="item.operatorList"
            v-model:paramDatatypekeies="item.datatypekeies"
            :param-list="columns"
          />
          <SvgIcon
            :class="`${prefixCls}__icon`"
            size="16"
            name="subtract"
            @click="onDelRequirement(index + 1)"
          ></SvgIcon>
        </div>
        <div :class="`${prefixCls}__box`">
          <div style="cursor: pointer" @click="onAddRequirement">
            <SvgIcon :class="`${prefixCls}__plus`" size="14" name="plus"></SvgIcon>
            <span>添加条件</span>
          </div>
          <DxButton
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
  import type { IQueryItem } from '../types';

  import { defineComponent, PropType, ref, watch } from 'vue';
  import { cloneDeep } from 'lodash-es';

  import { useDesign } from '/@/hooks/web/useDesign';

  import DxButton from 'devextreme-vue/button';
  import DynamicSelect from '/@/components/DynamicSelect/index.vue';

  export default defineComponent({
    components: {
      DxButton,
      DynamicSelect,
    },
    props: {
      columns: {
        type: Array as PropType<IColumnItem[]>,
        default: () => {
          return [];
        },
      },
      fast: {
        type: Array as PropType<IQueryItem[]>,
        default: () => {
          return [];
        },
      },
    },
    emits: ['on-save-fast', 'on-search'],
    setup(props, ctx) {
      const { prefixCls } = useDesign('query-form');
      const opened = ref<boolean>(false);
      const queryList = ref<IQueryItem[]>([
        {
          requirement: '',
          operator: '=',
          operatorList: [],
          value: undefined,
          type: '',
          datatypekeies: '',
        },
      ]);

      const onAddRequirement = () => {
        queryList.value.push({
          requirement: '',
          operator: '=',
          operatorList: [],
          value: '',
          type: '',
          datatypekeies: '',
        });
      };

      const onDelRequirement = (index: number) => {
        queryList.value.splice(index, 1);
      };

      const onSaveFast = () => {
        const temp: IQueryItem[] = [];
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
            value: '',
            type: '',
            datatypekeies: '',
          });
        }
        ctx.emit('on-save-fast', temp);
      };

      const closePopup = () => {
        opened.value = false;
      };

      const changeQueryList = (data: IQueryItem[]) => {
        queryList.value = cloneDeep(data);
      };

      const onSearch = () => {
        ctx.emit('on-search');
      };

      watch(
        () => props.fast,
        (val) => {
          if (val.length > 0) {
            queryList.value = cloneDeep(val);
          }
        },
        {
          immediate: true,
        }
      );

      return {
        prefixCls,
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
