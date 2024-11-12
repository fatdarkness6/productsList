import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import './assets/main.css';
import { createPinia } from 'pinia';
import { routes } from './routes/routes';

const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp(App);
app.use(router);
app.use(createPinia())
app.mount('#app');