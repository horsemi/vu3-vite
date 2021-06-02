<template>
  <div>
    <DxMenu
      :data-source="menuData"
      orientation="vertical"
      display-expr="title"
      expand-event="click"
      @item-click="handleItemClick"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import DxMenu from 'devextreme-vue/menu';
  import { useGo } from '/@/hooks/web/usePage';

  export default defineComponent({
    name: 'LayoutMenu',
    components: {
      DxMenu,
    },
    setup() {
      const go = useGo();
      const menuData = [
        {
          id: '1',
          title: '根页面',
          name: 'Dashboard',
          items: [
            {
              id: '1_1',
              title: '仪表盘',
              name: 'Analysis',
              path: '/dashboard/analysis',
            },
          ],
        },
        {
          id: '2',
          title: '首页',
          name: 'Main',
          items: [
            {
              id: '2_1',
              name: 'Home',
              title: '主页',
              path: '/home/index',
            },
          ],
        },
        {
          id: '3',
          name: 'Frame',
          title: '外部链接',
          items: [
            {
              id: '3_1',
              name: 'Doc',
              title: '外链文档',
              path: '/frame/doc',
            },
            {
              id: '3_2',
              name: 'Baidu',
              title: '外链百度',
              path: '/frame/baidu',
            },
          ],
        },
      ];

      function handleItemClick(e) {
        if (!e.itemData.items) {
          go(e.itemData.path);
        }
      }

      return {
        menuData,
        handleItemClick,
      };
    },
  });
</script>
