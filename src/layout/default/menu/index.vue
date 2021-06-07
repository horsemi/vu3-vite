<template>
  <div :class="[prefixCls]">
    <div
      v-for="(item, index) in menuData"
      :key="index"
      :class="[`${prefixCls}__sub`, activeIndex === index && `${prefixCls}__sub--active`]"
      @click.stop="itemClick(item, index)"
    >
      <SvgIcon size="16" name="sun"></SvgIcon>
      <span v-show="openState" :class="`${prefixCls}__sub__title`">{{ item.title }}</span>
      <transition name="zoom-in-left">
        <div
          v-show="item.show"
          :class="`${prefixCls}__item`"
          :style="{ top: (index + 1) * 50 + 10 + 'px', left: openState ? menuSize.max +'px' : menuSize.min +'px' }"
        >
          <div :class="`${prefixCls}__titlewrap`">
            <div
              v-for="(itemSub, indxeSub) in item.children"
              :key="indxeSub"
              :class="`${prefixCls}__titlebox`"
            >
              <div :class="`${prefixCls}__titlebox__subTitle`">{{ itemSub.title }}</div>
              <div
                v-for="(subChild, indexChild) in itemSub.children"
                :key="indexChild"
                :class="`${prefixCls}__titlebox__childTitle`"
              >
                {{ subChild.title }}
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useGo } from '/@/hooks/web/usePage';
import { useDesign } from '/@/hooks/web/useDesign';

export default defineComponent({
  name: 'LayoutMenu',
  props: {
    openState: Boolean,
    menuSize: {
      type: Object,
      default: () =>{
        return {};
      }
    }
  },
  emits: ['toggle-menu'],
  setup() {
    const go = useGo();
    const activeIndex = ref(0);
    const menuData = ref([
      {
        title: '系统首页',
        show: false,
      },
      {
        title: '订单管理',
        show: false,
        children: [
          {
            title: '发货管理',
            children: [
              {
                title: '发货单',
              },
              {
                title: '发货通知单',
              },
            ],
          },
          {
            title: '出库管理',
            children: [
              {
                title: '出库单',
              },
              {
                title: '出库通知单',
              },
            ],
          },
          {
            title: '入库管理',
            children: [
              {
                title: '入库单',
              },
              {
                title: '入库通知单',
              },
            ],
          },
          {
            title: '库内管理',
            children: [
              {
                title: '直接调拨单',
              },
              {
                title: '组装拆卸单',
              },
            ],
          },
        ],
      },
      {
        title: '调度计划',
        show: false,
        children: [
          {
            title: '波次计划',
            children: [
              {
                title: '发货波次',
              },
              {
                title: '波次看板',
              },
            ],
          },
          {
            title: '排班计划',
            children: [
              {
                title: '排班记录',
              },
              {
                title: '排班看板',
              },
            ],
          },
          {
            title: '约车计划',
            children: [
              {
                title: '约车记录',
              },
              {
                title: '约车看板',
              },
            ],
          },
        ],
      },
      {
        title: '库存中心',
        show: false,
        children: [
          {
            title: '库存查询',
            children: [
              {
                title: '库存查询',
              },
              {
                title: '库存收发明细',
              },
            ],
          },
          {
            title: '库存占用',
            children: [
              {
                title: '占用日志查询',
              },
            ],
          },
          {
            title: '其他配置',
            children: [
              {
                title: '仓库分配优先级',
              },
            ],
          },
        ],
      },
      {
        title: '基础管理',
        show: false,
        children: [
          {
            title: '基础数据',
            children: [
              {
                title: '物料',
              },
              {
                title: '物料清单',
              },
              {
                title: '锁单路线',
              },
            ],
          },
          {
            title: '系统配置',
            children: [
              {
                title: '清除缓存',
              },
            ],
          },
        ],
      },
    ]);

    function handleItemClick(e) {
      if (!e.itemData.items) {
        go(e.itemData.path);
      }
    }

    function itemClick(item, index) {
      menuData.value[activeIndex.value].show = false;
      activeIndex.value = index;
      if (item.children) {
        item.show = true;
      }
    }

    document.body.addEventListener(
      'click',
      () => {
        menuData.value[activeIndex.value].show = false;
      },
      false
    );

    const { prefixCls } = useDesign('layout-menu');

    return {
      menuData,
      handleItemClick,
      prefixCls,
      itemClick,
      activeIndex,
    };
  },
});
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-layout-menu';

.@{prefix-cls} {
  width: 200px;
  height: 100%;
  padding-top: 10px;

  &__sub {
    display: flex;
    width: 100%;
    height: 50px;
    padding: 0 20px;
    font-size: 16px;
    color: #000;
    box-sizing: border-box;
    align-items: center;
    .zoom-animation(left, scale(0.45, 0.45), scale(1, 1), top left);
  }

  &__sub__title {
    margin-left: 10px;
    letter-spacing: 1px;
  }

  &__sub--active {
    color: @color-primary;
    background: rgb(230, 247, 255);
    &::before {
      position: absolute;
      left: 0;
      display: inline-block;
      width: 6px;
      height: 50px;
      background-color: @color-primary;
      content: '';
    }
  }

  &__item {
    position: fixed;
    top: 50px;
    left: 203px;
    z-index: @page-layout-menu-z-index;
    width: 500px;
    padding: 10px 15px;
    color: #fff;
    background: @color-primary;
    border-radius: 4px;
  }

  &__titlewrap {
    display: flex;
    flex-wrap: wrap;
  }

  &__titlebox {
    width: 33.33%;
    padding: 10px 15px;
    overflow: hidden;
    white-space: nowrap;
    box-sizing: border-box;

    &__subTitle {
      width: 100%;
      margin-bottom: 10px;
      color: rgb(198, 224, 209);
    }

    &__childTitle {
      width: 100%;
      margin-bottom: 5px;
    }
  }
}
</style>
