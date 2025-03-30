import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import VueGoodTablePlugin from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css';

const app = createApp(App);
app.use(router);
app.use(VueGoodTablePlugin);
app.mount('#app');