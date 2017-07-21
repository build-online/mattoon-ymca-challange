import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Auth from '../Auth'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      beforeEnter: (to, from, next) => {

        // Check if user loggedin
        if(!Auth.userLoggedIn()){
          next('/');
        }else{
          next();
        }
      }
    }
  ]
})
