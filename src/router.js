import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './views/Dashboard'
import About from './views/About'
import Signin from './views/Signin'
import Signup from './views/Signup'

import authGuard from './authGuard'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
      beforeEnter: authGuard
    },
    {
      path: '/about',
      name: 'About',
      component: About,
      beforeEnter: authGuard
    },
    {
      path: '/signin',
      name: 'signin',
      component: Signin
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
  ]
})
