import Vue from 'vue';
import Router from 'vue-router';
import Menu from './components/AppMenu.vue';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      components: {
        default: Home,
        menu: Menu,
      },
    },
    {
      path: '/solars',
      name: 'Solars',
      components: {
        default: () => import('./views/SolarPanels.vue'),
        menu: Menu,
      },
    },
  ],
});

