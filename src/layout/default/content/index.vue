<template>
  <div>
    <PageLayout />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import PageLayout from './page.vue';
import { appStore } from '/@/store/modules/app';

export default defineComponent({
  name: 'LayoutContent',
  components: { PageLayout },
  setup() {
    const getPageLoading = computed(() => appStore.getPageLoading);
    let isLoading = ref(false);

    let timeId = setTimeout(() => {
      isLoading.value = !isLoading.value;
    }, 5000)

    return {
      getPageLoading,
      isLoading,
      timeId
    }
  },
})
</script>
