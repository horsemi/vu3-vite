<template>
  <div>
    <PageLayout />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import PageLayout from './page.vue';
import { appStore } from '/@/store/modules/app';

export default defineComponent({
  name: 'LayoutContent',
  components: { PageLayout },
  setup() {
    const getPageLoading = computed(() => appStore.getPageLoading);

    return {
      getPageLoading
    }
  },
})
</script>
