<template>
  <RouterView>
    <template #default="{ Component, route }">
      <transition name="fade-slide" mode="out-in" appear>
        <keep-alive v-if="openCache" :include="getCaches">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
        <component :is="Component" v-else :key="route.fullPath" />
      </transition>
    </template>
  </RouterView>
  <FrameLayout />
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { useViewStore } from '/@/store/modules/view';

  import FrameLayout from '/@/layout/iframe/index.vue';

  export default defineComponent({
    name: 'LayoutContent',
    components: { FrameLayout },
    setup() {
      const openCache = true;
      const viewStore = useViewStore();
      const getCaches = computed((): string[] => {
        if (!openCache) {
          return [];
        }

        const cacheTabs = viewStore.getCacheList;
        return cacheTabs;
      });

      return {
        openCache,
        getCaches,
      };
    },
  });
</script>
