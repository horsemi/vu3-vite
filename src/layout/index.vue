<template>
  <div>
    <div>
      <router-link :to="'/home'" >Home</router-link>
      <router-link :to="'/'">Dashboard</router-link>
    </div>
    <div>
      {{ viewState }}
    </div>
    <LayoutContent />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import LayoutContent from './default/content/index.vue';
import { viewStore } from '/@/store/modules/view';

export default defineComponent({
  name: 'Layout',
  components: { LayoutContent },
  setup() {
    const viewState = computed(() => viewStore.getCacheViewsState);

    return {
      viewState
    };
  },
})
</script>
