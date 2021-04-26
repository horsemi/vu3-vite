import '/@/styles/index.less';

import { createApp } from 'vue';
import App from './App.vue';
import { setupStore } from './store';
import { setupRouter } from './router';
import { setupGlobDirectives } from '/@/directives';
// router-guard
import '/@/router/guard';

const app = createApp(App);

setupStore(app);

setupRouter(app);
// Register global directive
setupGlobDirectives(app);

app.mount('#app');
