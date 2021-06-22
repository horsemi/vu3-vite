<template>
  <div :class="prefixCls" @click.stop="">
    <div
      :class="`${prefixCls}__box`"
      :style="{
        height: '64px',
        paddingBottom: 0,
        boxShadow: opened ? '10px 0 12px 0 rgb(0 0 0 / 10%)' : '',
      }"
      @click.stop=""
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
            @click="onSaveRequirement"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import DxButton from 'devextreme-vue/button';

  import DynamicSelect from '/@/components/DynamicSelect/index.vue';
  import { getColumns } from '/@/model/shipping-orders';

  interface IQueryItem {
    requirement: string;
    operator: string;
    operatorList: string[];
    value: string;
    type: string;
    datatypekeies: string;
  }

  export default defineComponent({
    components: {
      DxButton,
      DynamicSelect,
    },
    // emits: ['on-add-requirement', 'on-del-requirement', 'on-save-requirement'],
    async setup() {
      const { prefixCls } = useDesign('query-form');
      const opened = ref<boolean>(false);
      const queryList = reactive<IQueryItem[]>([
        {
          requirement: '',
          operator: '=',
          operatorList: [],
          value: '',
          type: '',
          datatypekeies: '',
        },
      ]);

      const onAddRequirement = () => {
        queryList.push({
          requirement: '',
          operator: '=',
          operatorList: [],
          value: '',
          type: '',
          datatypekeies: '',
        });
      };
      const onDelRequirement = (index: number) => {
        queryList.splice(index, 1);
      };
      const onSaveRequirement = () => {
        console.log(queryList);
      };
      const onItemClick = (e) => {
        e.event.stopPropagation();
      };

      const columns = await getColumns();

      return {
        prefixCls,
        columns,
        opened,
        queryList,
        onAddRequirement,
        onDelRequirement,
        onSaveRequirement,
        onItemClick,
      };
    },
    methods: {
      getQueryList() {
        const result: any[] = [];
        if (this.queryList.length > 0 && this.queryList[0].requirement) {
          this.queryList.forEach((item) => {
            result.push([item.requirement, item.operator, item.value]);
            result.push('and');
          });
        }
        return result;
      },
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
