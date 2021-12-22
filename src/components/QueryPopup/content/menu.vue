<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}__btn`">
      <span :class="{ notClick: !isDisabledComputed }" @click="onSubmitScheme">保存</span>
      <span @click="onSaveScheme">另存</span>
      <span @click="onResetScheme">重置</span>
      <span :class="{ notClick: !isDisabledComputed }" @click="onEditScheme">修改</span>
      <span :class="{ notClick: !isDisabledComputed }" @click="onDelScheme">删除</span>
    </div>
    <DxScrollView>
      <div>
        <div
          v-for="(item, index) in menuList"
          :key="index"
          :class="[
            `${prefixCls}__list__item`,
            checkedIndex === index && `${prefixCls}__list__item--active`,
          ]"
          @click="onChangeCheckedIndex(index)"
        >
          <input
            v-if="checkedIndex === index && edit"
            ref="textBox"
            :value="item"
            placeholder="请输入方案名称"
            @blur="onTextBlur"
          />
          <span v-else>{{ item }}</span>
        </div>
      </div>
    </DxScrollView>
  </div>
</template>

<script lang="ts">
  import type { ISchemeData } from '../../QueryPlan/types';
  import type { ISchemeItem } from './types';
  import type { Ref } from 'vue';

  import { defineComponent, ref, nextTick, inject, computed } from 'vue';
  import { cloneDeep } from 'lodash-es';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { useUserStore } from '/@/store/modules/user';
  import { DxScrollView } from 'devextreme-vue/scroll-view';
  import { saveSchemesData, deleteSchemes } from '/@/utils/scheme/index';

  export default defineComponent({
    components: {
      DxScrollView,
    },
    emits: [
      'on-submit-scheme',
      'on-save-scheme',
      'on-reset-scheme',
      'on-title-change',
      'on-del-scheme',
      'on-change-checked-index',
    ],
    setup() {
      const schemeData = inject('schemeData') as Ref<ISchemeData>;
      const schemeDataTemp = inject('schemeDataTemp') as Ref<ISchemeData>;
      const onChangeScheme = inject('onChangeScheme') as (data: ISchemeItem) => void;

      // 标题列表数据
      const menuList = computed(() => {
        const data = schemeData.value.scheme.map((item) => {
          return item.title;
        });
        return data;
      });

      const checkedIndex = computed(() => {
        return schemeData.value.checkedIndex;
      });

      const { prefixCls } = useDesign('content-menu');
      const userStore = useUserStore();
      // 是否是修改状态
      const edit = ref(false);
      // 输入框dom
      const textBox = ref();
      const isDisabledComputed = computed(() => {
        return (
          schemeData.value.scheme[checkedIndex.value]?.creatorId === userStore.getUserInfo.accountId
        );
      });
      // 点击标题触发
      function onChangeCheckedIndex(index: number) {
        // 标题不为空才切换下标
        if (menuList.value[checkedIndex.value]) {
          // ctx.emit('on-change-checked-index', index);
          schemeData.value.checkedIndex = index;
        }
      }
      // 点击保存触发
      function onSubmitScheme() {
        if (!edit.value) {
          if (checkedIndex.value === 0) {
            onSaveScheme();
          } else {
            saveSchemesData(schemeData.value.scheme[schemeData.value.checkedIndex]).then(() => {
              schemeDataTemp.value.scheme[schemeData.value.checkedIndex] = cloneDeep(
                schemeData.value.scheme[schemeData.value.checkedIndex]
              );
            });
          }
        }
      }
      // 点击另存触发
      function onSaveScheme() {
        if (!edit.value) {
          schemeData.value.scheme.push({
            ...cloneDeep(schemeData.value.scheme[checkedIndex.value]),
            title: '',
            id: '0',
            creatorId: userStore.getUserInfo.accountId,
          });
          schemeData.value.checkedIndex = schemeData.value.scheme.length - 1;
          edit.value = true;
        }
      }
      // 点击重置触发
      const onResetScheme = () => {
        if (!edit.value) {
          const popupUuid = schemeData.value.scheme[checkedIndex.value].id;
          const popupListTemp = schemeDataTemp.value.scheme.find((item) => item.id === popupUuid);

          if (popupListTemp) {
            schemeData.value.scheme[checkedIndex.value] = cloneDeep(popupListTemp);
            onChangeScheme(schemeData.value.scheme[checkedIndex.value]);
          }
        }
      };
      // 点击删除触发
      const onDelScheme = () => {
        if (checkedIndex.value !== 0) {
          const id = schemeData.value.scheme[checkedIndex.value].id;
          if (id !== '0') {
            deleteSchemes(id, userStore.getUserInfo.accountId);
          }

          // 两个数据都需要删除
          const index = checkedIndex.value;
          schemeData.value.scheme.splice(index, 1);
          schemeData.value.checkedIndex = index - 1;

          if (index < schemeDataTemp.value.scheme.length) {
            schemeDataTemp.value.scheme.splice(index, 1);
          }
          edit.value = false;
        }
      };
      // 输入框获取焦点
      const onTextFocusInput = () => {
        nextTick(() => {
          if (textBox.value) {
            textBox.value.focus();
          }
        });
      };
      // 点击修改触发
      const onEditScheme = () => {
        edit.value = true;
        onTextFocusInput();
      };
      // 处理标题修改
      const handleText = (title: string) => {
        if (title) {
          schemeData.value.scheme[checkedIndex.value].title = title;
          edit.value = false;
          onSubmitScheme();
        }
      };
      // 失去焦点触发
      const onTextBlur = (e) => {
        handleText(e.target.value as string);
      };

      return {
        prefixCls,
        menuList,
        checkedIndex,
        edit,
        textBox,
        onSubmitScheme,
        onSaveScheme,
        onResetScheme,
        onEditScheme,
        onTextBlur,
        onDelScheme,
        onChangeCheckedIndex,
        onTextFocusInput,
        isDisabledComputed,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-content-menu';

  .@{prefix-cls} {
    display: flex;
    flex-direction: column;
    height: 100%;
    border-right: 1px solid #e4e7ed;

    &__btn {
      display: flex;
      width: 100%;
      background-color: #fafafa;
      border-bottom: 1px solid @border-color-primary;
      span {
        flex: 1;
        height: 41px;
        line-height: 41px;
        text-align: center;
        cursor: pointer;
        &:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }
      }
      .notClick {
        color: #aca899;
        pointer-events: none;
        background-color: #f5f5f5;
      }
    }

    &__list__item {
      display: flex;
      align-items: center;
      height: 40px;
      cursor: pointer;
      &--active,
      &:hover {
        background-color: #e8f7ff;
      }
      &::before {
        display: inline-block;
        width: 4px;
        height: 4px;
        margin: 0 10px;
        background-color: #d8d8d8;
        border-radius: 100%;
        content: '';
      }
      input {
        width: 80%;
        padding: 3px 8px;
        border: 1px solid @border-color-primary;
        border-radius: 4px;
        outline: none;
        &:focus {
          border-color: #337ab7;
        }
      }
    }
  }
</style>
