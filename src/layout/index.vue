<template>
  <div style="height: 100%">
    <div style="display: inline-block; width: 60px; height: 100%; vertical-align: top">
      <router-link class="tab" :to="'/home/1'"> Home </router-link>
      <router-link class="tab" :to="'/dashboard'"> Dashboard </router-link>
      <router-link class="tab" :to="'/frame/doc'"> IFrame </router-link>
      <router-link class="tab" :to="'/frame/baidu'"> Baidu </router-link>
      <button @click="logout">Logout</button>
    </div>
    <div style="display: inline-block; width: calc(100% - 60px)">
      <div>
        <router-link
          v-for="(item, index) in viewState"
          :key="index"
          :to="item.fullPath"
          style="margin: 5px"
          >{{ item.name }}</router-link
        >
      </div>
      <LayoutContent />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import LayoutContent from './default/content/index.vue';
  import { useViewStore } from '/@/store/modules/view';
  import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    name: 'Layout',
    components: { LayoutContent },
    setup() {
      const userStore = useUserStore();
      const viewStore = useViewStore();
      const viewState = computed(() => viewStore.getViewList);

      return {
        userStore,
        viewState,
      };
    },
    methods: {
      logout() {
        this.userStore.logout(true);
      },
    },
  });
</script>

<style lang="less" scoped>
  .tab {
    margin-right: 5px;
  }
</style>
