import type { App } from 'vue';
import { createStore } from 'vuex';

const store = createStore({});

export function setupStore(app: App<Element>) {
  app.use(store);
}

export default store;
