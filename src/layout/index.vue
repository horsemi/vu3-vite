<template>
  <div>
    <div>
      <router-link class="tab" :to="'/home/1'"> Home1 </router-link>
      <router-link class="tab" :to="'/home/2'"> Home2 </router-link>
      <router-link class="tab" :to="'/home/3'"> Home3 </router-link>
      <router-link class="tab" :to="'/home/index?test=1'"> Home </router-link>
      <router-link class="tab" :to="'/home/index?test=2'"> Home </router-link>
      <router-link class="tab" :to="'/home/index?test=3'"> Home </router-link>
      <router-link class="tab" :to="'/home/index?test=4'"> Home </router-link>
      <router-link class="tab" :to="'/'"> Dashboard </router-link>
      <router-link class="tab" :to="'/frame/doc'"> IFrame </router-link>
      <router-link class="tab" :to="'/frame/baidu'"> Baidu </router-link>
      <button @click="logout">Logout</button>
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
  import { userStore } from '/@/store/modules/user';

  export default defineComponent({
    name: 'Layout',
    components: { LayoutContent },
    setup() {
      const viewState = computed(() => viewStore.getViewsState);

      return {
        viewState,
      };
    },
    methods: {
      logout() {
        userStore.logout(true);
      },
    },
  });
</script>

<style lang="less" scoped>
  .tab {
    margin-right: 5px;
  }
</style>
