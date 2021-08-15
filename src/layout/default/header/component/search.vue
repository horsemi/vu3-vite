<template>
  <div :class="[prefixCls]">
    <input
      :value="query"
      placeholder="请输入搜索关键字"
      :class="`${prefixCls}__input`"
      @input="changeQuery($event)"
    />
    <Teleport v-if="showList" to="body">
      <div
        v-if="options.length > 1"
        v-click-outside="closeList"
        :class="`${prefixCls}__input__content`"
      >
        <DxScrollView>
          <ul v-for="item of options" :key="item.item.path">
            <router-link :to="item.item.path">{{ item.item.title.join('>') }}</router-link>
          </ul>
        </DxScrollView>
      </div>
      <div
        v-else
        v-click-outside="closeList"
        :class="`${prefixCls}__input__content ${prefixCls}__input__nodata`"
        >暂无数据</div
      >
    </Teleport>
    <SvgIcon size="16" name="search"></SvgIcon>
  </div>
</template>

<script lang="ts">
  import type { AppRouteRecordRaw } from '/@/router/types';
  import { defineComponent, ref, watch, onMounted } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import Fuse from 'fuse.js';
  import { usePermissionStore } from '/@/store/modules/permission';
  import { useDebounceFn } from '@vueuse/core';

  import { DxScrollView } from 'devextreme-vue/scroll-view';

  export default defineComponent({
    components: {
      DxScrollView,
    },
    setup() {
      const { prefixCls } = useDesign('header-search');
      const fuse: any = ref();
      const query = ref('');
      const searchPool = ref<{ path: string; title: string[] }[]>([]);
      const PermissionStore = usePermissionStore();
      const options = ref([]);
      const showList = ref(false);

      onMounted(() => {
        searchPool.value = generateRoutes(PermissionStore.getMenuList);
      });

      function initFuse(list: { path: string; title: string[] }[]) {
        fuse.value = new Fuse(list, {
          shouldSort: true,
          threshold: 0.4,
          location: 0,
          distance: 100,
          minMatchCharLength: 1,
          keys: [
            {
              name: 'title',
              weight: 0.7,
            },
            {
              name: 'path',
              weight: 0.3,
            },
          ],
        });
      }
      function generateRoutes(
        routes: AppRouteRecordRaw[],
        basePath = '/',
        prefixTitle: string[] = []
      ) {
        let res: { path: string; title: string[] }[] = [];
        for (let i = 0; i < routes.length; i++) {
          const router = routes[i];
          // skip hidden router 去掉meta为空或为隐藏的路由
          if ((router as any).meta.hideMenu) {
            continue;
          }

          const data = {
            path: resolve(basePath, router.path),
            title: [...prefixTitle],
          };

          if (router.meta && router.meta.title) {
            data.title = [...data.title, router.meta.title];
          }

          if (router.redirect !== 'noRedirect') {
            // only push the routes with title 只显示在导航栏显示的路由
            // special case: need to exclude parent router without redirect
            res.push(data);
          }

          // recursive child routes 递归
          if (router.children) {
            const tempRoutes = generateRoutes(router.children, data.path, data.title);
            if (tempRoutes.length >= 1) {
              res = [...res, ...tempRoutes];
            }
          }
        }
        return res;
      }
      function resolve(base: string, path: string) {
        if (path.startsWith('/')) {
          return path;
        } else {
          return base + '/' + path;
        }
      }

      function querySearch() {
        if (query.value !== '') {
          if (fuse.value) {
            options.value = fuse.value.search(query.value);
          }
        } else {
          options.value = [];
        }
      }

      function changeQuery(e) {
        if (e.target.value) {
          showList.value = true;
        }
        query.value = e.target.value;
        options.value = [];
        DounceChangeQuery();
      }

      function closeList() {
        showList.value = false;
        query.value = '';
        options.value = [];
      }

      const DounceChangeQuery = useDebounceFn(querySearch, 1000);

      watch(
        () => PermissionStore.getMenuList,
        (val) => {
          searchPool.value = generateRoutes(val);
        }
      );

      watch(
        () => searchPool.value,
        (val) => {
          initFuse(val);
        }
      );
      return {
        prefixCls,
        initFuse,
        generateRoutes,
        options,
        resolve,
        query,
        querySearch,
        changeQuery,
        showList,
        closeList,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-header-search';

  .@{prefix-cls} {
    display: flex;
    width: 210px;
    height: 30px;
    padding: 0 20px;
    margin: 0 20px;
    font-size: 12px;
    background-color: #e2f1ff;
    border-radius: 20px;
    justify-content: space-between;
    align-items: center;
    &__input {
      width: 100%;
      background: none;
      border: none;
      outline: none;
      &__content {
        position: absolute;
        top: 50px;
        right: 130px;
        z-index: 200;
        width: 280px;
        height: 200px;
        padding-right: 10px;
        background-color: #fff;
        border-radius: 2px;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
      }
      &__nodata {
        font-size: 14px;
        line-height: 200px;
        color: #8d8d8d;
        text-align: center;
      }
    }

    & > .vue3-vite-svg-icon {
      cursor: pointer;
    }
  }
</style>
