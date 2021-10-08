import '/@/styles/index.less';

import { createApp } from 'vue';
import App from './App.vue';
import { setupStore } from './store';
import { setupRouter } from './router';
import { setupGlobDirectives } from '/@/directives';
import SvgIcon from '/@/components/Icon/SvgIcon.vue';
import OdsTable from '/@/components/Table/OdsTable.vue';
// router-guard
import '/@/router/guard';

import 'vite-plugin-svg-icons/register';

import 'devextreme/dist/css/dx.light.css';

const app = createApp(App);

app.component('SvgIcon',SvgIcon);
app.component('OdsTable', OdsTable);

setupStore(app);

setupRouter(app);
// Register global directive
setupGlobDirectives(app);

app.mount('#app');
