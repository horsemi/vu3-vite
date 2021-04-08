import '/@/styles/index.less';

import { createApp } from 'vue';
import App from './App.vue';
import { setupStore } from './store';
import { setupRouter } from './router';

// router-guard
import '/@/router/guard';

const app = createApp(App);

setupStore(app);

setupRouter(app);

app.mount('#app');