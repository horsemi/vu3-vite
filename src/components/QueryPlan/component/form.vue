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
      <DxSelectBox
        v-model:value="queryList[0].requirement"
        disabled
        width="200"
        :items="requirementList"
        @itemClick="onItemClick"
      />
      <DxSelectBox
        v-model:value="queryList[0].operator"
        disabled
        width="95"
        :items="queryList[0].operatorList"
        @itemClick="onItemClick"
      />
      <input v-model="queryList[0].value" />
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
          <DxSelectBox
            v-model:value="item.requirement"
            disabled
            width="200"
            :items="requirementList"
            @itemClick="onItemClick"
          />
          <DxSelectBox
            v-model:value="item.operator"
            disabled
            width="95"
            :items="item.operatorList"
            @itemClick="onItemClick"
          />
          <input v-model="item.value" />
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
import { defineComponent, onBeforeUnmount, reactive, ref } from 'vue';
import { useDesign } from '/@/hooks/web/useDesign';
import DxSelectBox from 'devextreme-vue/select-box';
import DxButton from 'devextreme-vue/button';

interface IQueryItem {
  requirement: string;
  operator: string;
  operatorList: string[];
  value: string;
}

export default defineComponent({
  components: {
    DxSelectBox,
    DxButton,
  },
  emits: ['on-add-requirement', 'on-del-requirement', 'on-save-requirement'],
  setup() {
    const { prefixCls } = useDesign('query-form');
    const opened = ref<boolean>(false);
    const requirementList: string[] = ['查询字段', '单据日期', '单据类型', '单据状态'];
    const queryList = reactive<IQueryItem[]>([
      {
        requirement: requirementList[0],
        operator: '等于',
        operatorList: ['等于', '大于', '小于'],
        value: '',
      },
      {
        requirement: requirementList[1],
        operator: '等于',
        operatorList: ['等于', '大于', '小于'],
        value: '',
      },
      {
        requirement: requirementList[2],
        operator: '等于',
        operatorList: ['等于', '大于', '小于'],
        value: '',
      },
      {
        requirement: requirementList[3],
        operator: '等于',
        operatorList: ['等于', '大于', '小于'],
        value: '',
      },
    ]);

    const onAddRequirement = () => {
      queryList.push({
        requirement: requirementList[0],
        operator: '等于',
        operatorList: ['等于', '大于', '小于'],
        value: '',
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

    function closePopup() {
      opened.value = false;
    }

    document.addEventListener('click', closePopup, false);

    onBeforeUnmount(() => {
      document.removeEventListener('click', closePopup);
    });

    return {
      prefixCls,
      opened,
      queryList,
      requirementList,
      onAddRequirement,
      onDelRequirement,
      onSaveRequirement,
      onItemClick,
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
