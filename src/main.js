import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import shopComponent from './components/shop/shopComponent.vue';
import './assets/main.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: shopComponent },
  ]
});

const app = createApp(App);
app.use(router);
app.mount('#app');