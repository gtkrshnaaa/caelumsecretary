// Vue app bootstrap
// Comments in English
import { createApp } from 'vue';
import App from './App.vue';
import router from './router.js';
import './main.css';

const app = createApp(App);
app.use(router);
app.mount('#app');
