import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import shopComponent from './components/shop/shopComponent.vue';
import loginPage from './routes/login/loginPage.vue'
import './assets/main.css';

const routes = [
  { path: '/', component: shopComponent },
  { path: '/login', component: loginPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp(App);
app.use(router);
app.mount('#app');