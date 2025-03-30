import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import VueGoodTablePlugin from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import VueSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

const app = createApp(App);
app.use(router);
app.use(VueGoodTablePlugin);
app.use(VueSweetalert2);
app.component('v-select', VueSelect);
app.mount('#app');