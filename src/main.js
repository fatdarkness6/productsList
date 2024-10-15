import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import shopComponent from './components/shop/shopComponent.vue';
import './assets/main.css';
import ShoppingCart from './components/shoppingCart/shoppingCart.vue';
import { createPinia } from 'pinia';

const routes = [
  { path: '/', component: shopComponent },
  {path : "/shoppingCart" , component : ShoppingCart }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp(App);
app.use(router);
app.use(createPinia())
app.mount('#app');