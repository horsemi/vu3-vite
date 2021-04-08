<template>
  <RouterView>
    <template #default="{ Component, route }">
      <transition
        name="fade-slide"
        mode="out-in"
        appear
      >
        <keep-alive v-if="openCache" :include="getCaches">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
        <component v-else :is="Component" :key="route.fullPath" />
      </transition>
    </template>
  </RouterView>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { viewStore } from '/@/store/modules/view';

export default defineComponent({
  name: 'LayoutContent',
  setup() {
    const openCache = true;

    const getCaches = computed((): string[] => {
      if (!openCache) {
        return [];
      }

      const cacheTabs = viewStore.getCacheViewsState;
      return cacheTabs;
    });

    return {
      openCache,
      getCaches
    };
  },
})
</script>
